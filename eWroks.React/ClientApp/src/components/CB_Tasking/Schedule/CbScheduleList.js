import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import CbScheduleDetaill from './CbScheduleDetaill';
import CbScheduleStatistics from './CbScheduleStatistics';

class CbScheduleList extends Component {
    getDetailPage(id) {
        return (
            <CbScheduleDetaill onClickNew={this.onClickNew.bind(this)} id={id} saveCallback={this.saveCallback.bind(this)} />
        )
    }
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        sStartDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        sEndDt: new Date(),
        sTeamCd: "",
        sStatusCd: "",
        inCludeYn: true,

        masterGrid: {
            columnDefs:
                [
                    { headerName: '작업일', field: 'workingDt', minWidth: 100 },
                    {
                        headerName: 'Status', field: 'statusCdNm', minWidth: 100,
                        cellRendererFramework: (params) => {
                            var statusCdNm = params.data.statusCdNm;
                            return (
                                <div style={{ 
                                    border: '1px solid #ddd',
                                    textAlign: 'center',
                                    backgroundColor: statusCdNm === '확정' ? '#fffb4c' 
                                    : statusCdNm === '작업중' ? '#ffb44c' 
                                    : statusCdNm === '작업완료' ? '#4cc3ff' 
                                    : statusCdNm === '협정' ? '#5dea5b' 
                                    : statusCdNm === 'Cancel' || statusCdNm === 'Close' ? '#ccc' 
                                    : ''
                                }}>{statusCdNm}</div>
                            )
                        }
                    },
                    { headerName: 'Terminal', field: 'terminal', minWidth: 100 },
                    { headerName: 'Vessel', field: 'vessel', minWidth: 100 },
                    { headerName: 'Customer', field: 'customer', minWidth: 100 },
                    { headerName: 'Product', field: 'product', minWidth: 100 },
                    { headerName: 'ETA', field: 'etaFullDtNm', minWidth: 120 },
                    { headerName: 'ETB', field: 'etbFullDtNm', minWidth: 120 },
                    { headerName: 'ETC', field: 'etcFullDtNm', minWidth: 120 },
                    { headerName: 'PIC', field: 'picNm', minWidth: 100 },
                    { headerName: 'PIC2', field: 'piC2', minWidth: 100 },
                    { headerName: 'OPS', field: 'ops', minWidth: 100 },
                    { headerName: 'Agent', field: 'agent', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: true, // 멀티서치 기능
            }
        },

    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getScheduleList();
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getScheduleList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbScheduleService/GetScheduleList", {
            params: {
                sStartDt: this.props.storeState.getParsedDate(this.state.sStartDt),
                sEndDt: this.props.storeState.getParsedDate(this.state.sEndDt),
                sTeamCd: this.state.sTeamCd === '' ? '' : this.state.sTeamCd,
                sStatusCd: this.state.sStatusCd === '' ? '' : this.state.sStatusCd,
                inCludeYn: this.state.inCludeYn === true ? "Y" : "N",
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data }
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({ activeKey: 'detail', detailPage: null }, () => {
            this.setState({ activeKey: 'detail', detailPage: this.getDetailPage("") })
        })
    }
    /*==========================================================*/
    /* 저장 후 실행    */
    /*==========================================================*/
    saveCallback() {
        this.setState({ activeKey: "list", listPage: null, detailPage: null }, () => {
            this.setState({ activeKey: "list", detailPage: this.getDetailPage("") })
        });
        this.getScheduleList();
    }
    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].schId;

        this.setState({ activeKey: 'detail', detailPage: null }, () => {
            this.setState({ activeKey: 'detail', detailPage: this.getDetailPage(id) })
        })
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="list" title="List" >
                    <div style={{ marginTop: 15 }}>
                        <Card>
                            <Card.Header>
                                <Form>
                                    <Form.Row>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Start Dt</Form.Label>
                                                <table>
                                                    <tbody>

                                                        <tr>
                                                            <td>
                                                                <GDHDatepicker
                                                                    name='sStartDt'
                                                                    value={this.state.sStartDt} onDateChange={this.onDateChange.bind(this)}
                                                                />
                                                            </td>
                                                            <td>{'~'}</td>
                                                            <td>
                                                                <GDHDatepicker
                                                                    name='sEndDt'
                                                                    value={this.state.sEndDt} onDateChange={this.onDateChange.bind(this)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Team</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="sTeamCd"
                                                    value={this.state.sTeamCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0064" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="sStatusCd"
                                                    value={this.state.sStatusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0063" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Form.Group controlId="group1" style={{ marginBottom: 0 }}>
                                                <Form.Check
                                                    inline
                                                    label="Including out of date"
                                                    name="group1"
                                                    type="checkbox"
                                                    checked={this.state.inCludeYn}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            inCludeYn: e.target.checked
                                                        }, () => {
                                                            this.getScheduleList();
                                                        });
                                                    }}
                                                />
                                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                                <Button variant="primary" onClick={this.getScheduleList.bind(this)}>Search</Button>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                </Form>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                <div className="ag-theme-material"
                                    style={{ height: 600, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.masterGrid.columnDefs}
                                        defaultColDef={this.state.masterGrid.defaultColDef}
                                        rowData={this.state.masterGrid.rowData}
                                        rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                            </Card.Footer>
                        </Card>
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail">
                    <div style={{ marginTop: 15 }}>
                        {this.state.detailPage}
                    </div>
                </Tab>
                <Tab eventKey="statistics" title="Statistics">
                    <div style={{ marginTop: 15 }}>
                        <CbScheduleStatistics />
                    </div>
                </Tab>
            </Tabs>
        </>);
    }
}
export default connect(
    function (state) {
        return { storeState: state }
    },
    function (dispatch) {
        return {
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(CbScheduleList)
