import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import OvertimeWorkDetail from './OvertimeWorkDetail';


class OvertimeWorkList extends Component {
    getDetailPage(data) {
        return (
            <OvertimeWorkDetail id={data} onClickNew={this.onClickNew.bind(this)} saveCallback={this.saveCallback.bind(this)} />
        )
    }
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),
        statusCd: "",
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 150 },
                    { headerName: 'Reason', field: 'reason', minWidth: 300 },
                    { headerName: '1단계 요청시간', field: 'oneStepDateNm', minWidth: 300 },
                    { headerName: '2단계 요청시간', field: 'twoStepDateNm', minWidth: 300 },
                    { headerName: 'HR Reviewed', field: 'hrStepDateNm', minWidth: 300 },
                    { headerName: 'HR Comment', field: 'remark', minWidth: 100 },
                ],
            rowData: [],
            rowCount: 0,
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
        // 마스터 조회
        this.getOvertimeWorkList();
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

        this.getOvertimeWorkList();
    }

     /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getOvertimeWorkList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetOvertimeWorkList", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                endDt: this.props.storeState.getParsedDate(this.state.endDt),
                statusCd: this.state.statusCd,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].otId;

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
                                                                    name='startDt'
                                                                    value={this.state.startDt} onDateChange={this.onDateChange.bind(this)}
                                                                />
                                                            </td>
                                                            <td>{'~'}</td>
                                                            <td>
                                                                <GDHDatepicker
                                                                    name='endDt'
                                                                    value={this.state.endDt} onDateChange={this.onDateChange.bind(this)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="statusCd"
                                                    value={this.state.statusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0203" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                            <Button variant="primary" onClick={this.getOvertimeWorkList.bind(this)}>Search</Button>
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
)(OvertimeWorkList)
