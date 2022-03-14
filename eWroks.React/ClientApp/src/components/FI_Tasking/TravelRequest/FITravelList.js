import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';
import FITravelDetail from './FITravelDetail';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class FITravelList extends Component {
    getDetailPage(data) {
        return (
            <FITravelDetail fiTravelGroupDto={data} saveCallback={this.saveCallback.bind(this)} />
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
        sStatusCd: "",
        reportUrl: '',
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Type', field: 'travelGbNm', minWidth: 100 },
                    { headerName: 'Destination', field: 'destination', minWidth: 100 },
                    { headerName: 'Customer', field: 'customer', minWidth: 100 },
                    { headerName: 'Purpose', field: 'purpose', minWidth: 100 },
                    { headerName: 'Estimated revenue', field: 'estRevAmtNm', minWidth: 100, cellStyle: { textAlign: 'right' } },
                    { headerName: 'Estimated cost', field: 'estCostAmtNm', minWidth: 100, cellStyle: { textAlign: 'right' } },
                    {
                        headerName: 'Print', field: 'btnPrint', minWidth: 100,
                        cellRendererFramework: (params) => {
                            var travelId = params.data.travelId;
                            return (
                                <Button variant="info" onClick={function (e) {
                                    var userId = this.props.storeState.userInfo.userId;
                                    var page = "TravelReport";
                                    var key = travelId;
                                    var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                    window.open(this.props.storeState.reportUrl + url, '_blank');
                                }.bind(this)}>Print</Button>
                            )
                        }

                    },
                    { headerName: 'Request Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Request Dt', field: 'regDtNm', minWidth: 100 },
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
        this.getResponseTravelList();
    }
    
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getResponseTravelList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiTravelService/GetResponseTravelList", {
            params: {
                sStartDt: this.props.storeState.getParsedDate(this.state.sStartDt),
                sEndDt: this.props.storeState.getParsedDate(this.state.sEndDt),
                sStatusCd: this.state.sStatusCd === '' ? '' : this.state.sStatusCd,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data }
            })
        })
            .catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* 상세조회    */
    /*==========================================================*/
    getResponseTravelDetail(id) {
        axios.get(this.props.storeState.serviceUrl + "/FiTravelService/GetTravelDetail", {
            params: {
                travelId: id
            }
        }).then(r => {
            var data = r.data;
            this.setState({ activeKey: 'detail', detailPage: null }, () => {
                this.setState({ activeKey: 'detail', detailPage: this.getDetailPage(data) })
            })

        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 저장 후 실행    */
    /*==========================================================*/
    saveCallback() {
        this.setState({ activeKey: "list", listPage: null, detailPage: null }, () => {
            this.setState({ activeKey: "list", detailPage: this.getDetailPage("") })
        });
        this.getResponseTravelList();
    }
     /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].travelId;

        this.getResponseTravelDetail(id);
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
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="sStatusCd"
                                                    value={this.state.sStatusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0034" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Button variant="primary" onClick={this.getResponseTravelList.bind(this)}>Search</Button>
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
                                        rowHeight={50}
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
)(FITravelList)
