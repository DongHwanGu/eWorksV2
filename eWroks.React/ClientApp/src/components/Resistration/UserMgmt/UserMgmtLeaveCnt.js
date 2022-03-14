import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

class UserMgmtLeaveCnt extends Component {
    state = {
        selectUserId: this.props.selectUserId,
        cmUserLeaveCnt: {
            userId: ''
            , leaveYear: ''
            , orgLeaveCnt: 0.0
            , preLeaveCnt: 0.0
            , orgCompLeaveCnt: 0.0
            , preCompLeaveCnt: 0.0
            , remark: ''
            , regId: ''
            , updId: ''
        },
        modalLeveCnt: false,
        leaveGrid: {
            columnDefs:
                [
                    {
                        headerName: 'Year', field: 'btnModify', minWidth: 100,
                        cellRendererFramework: (params) => {
                            var data = params.data;
                            return (
                                <Button variant="outline-secondary" style={{ width: '100%', textAlign: 'center' }} onClick={function (e) {
                                    this.setState({
                                        cmUserLeaveCnt: {
                                            userId: data.userId
                                            , leaveYear: data.leaveYear
                                            , orgLeaveCnt: data.orgLeaveCnt
                                            , preLeaveCnt: data.preLeaveCnt
                                            , orgCompLeaveCnt: data.orgCompLeaveCnt
                                            , preCompLeaveCnt: data.preCompLeaveCnt
                                            , remark: ''
                                            , regId: data.regId
                                            , updId: data.updId
                                        },
                                        modalLeveCnt: true,
                                    })
                                }.bind(this)}>{data.leaveYear}</Button >
                            )
                        }

                    },
                    {
                        headerName: 'Org Leave Cnt',
                        field: 'orgLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'Leave Cnt',
                        field: 'preLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'Org CompLeaveCnt',
                        field: 'orgCompLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'CompLeaveCnt',
                        field: 'preCompLeaveCnt',
                        minWidth: 100
                    },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: false,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: false, // 멀티서치 기능
            }
        },
        cmUserLeaveCntItem: {
            userId: ''
            , leaveYear: ''
            , itemId: 0
            , issueGb: ''
            , issueCnt: 0.0
            , orgLeaveCnt: 0.0
            , preLeaveCnt: 0.0
            , orgCompLeaveCnt: 0.0
            , preCompLeaveCnt: 0.0
            , remark: ''
            , leaveHoliId: 0
            , regId: ''
            , updId: ''
        },
        modalLeveCntItem: false,
        leaveItemGrid: {
            columnDefs:
                [
                    { headerName: 'Year', field: 'leaveYear', minWidth: 100 },
                    {
                        headerName: 'Issue Gb',
                        field: 'issueGbNm',
                        minWidth: 100
                    },
                    {
                        headerName: 'IssueCnt',
                        field: 'issueCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'Org LeaveCnt',
                        field: 'orgLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'LeaveCnt',
                        field: 'preLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'Org CompLeaveCnt',
                        field: 'orgCompLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'CompLeaveCnt',
                        field: 'preCompLeaveCnt',
                        minWidth: 100
                    },
                    {
                        headerName: 'Remark',
                        field: 'remark',
                        minWidth: 100
                    },
                    {
                        headerName: 'Upd Id',
                        field: 'regIdNm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Upd Dt',
                        field: 'regDtNm',
                        minWidth: 100
                    }
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: false,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: false, // 멀티서치 기능
            }
        },
    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getLeaveCntList();
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getLeaveCntList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetLeaveCntList", {
            params: {
                userId: this.state.selectUserId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalLeveCnt: false,
                leaveGrid: { ...this.state.leaveGrid, rowData: data },
                leaveItemGrid: { ...this.state.leaveItemGrid, rowData: [] },
            })
        })
            .catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* 휴가 마스터 Add    */
    /*==========================================================*/
    modalLeveCntAdd() {
        this.setState({
            cmUserLeaveCnt: {
                userId: this.state.selectUserId
                , leaveYear: new Date().getFullYear().toString()
                , orgLeaveCnt: 0.0
                , preLeaveCnt: 0.0
                , orgCompLeaveCnt: 0.0
                , preCompLeaveCnt: 0.0
                , remark: ''
                , regId: ''
                , updId: ''
            },
            modalLeveCnt: true,
        })
    }
    /*==========================================================*/
    /* 휴가일수 리스트 더블 클릭 이벤트    */
    /*==========================================================*/
    onRowDblClickedLeaveCnt(e) {
        this.setState({
            cmUserLeaveCnt: {
                userId: e.data.userId
                , leaveYear: e.data.leaveYear
                , orgLeaveCnt: e.data.orgLeaveCnt
                , preLeaveCnt: e.data.preLeaveCnt
                , orgCompLeaveCnt: e.data.orgCompLeaveCnt
                , preCompLeaveCnt: e.data.preCompLeaveCnt
                , remark: ''
                , regId: e.data.regId
                , updId: e.data.updId
            },
            modalLeveCnt: true,
        })
    }
    /*==========================================================*/
    /* 휴가일수 리스트 클릭 이벤트    */
    /*==========================================================*/
    onRowClickedLeaveCnt(e) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetLeaveCntItemList", {
            params: {
                userId: e.data.userId,
                leaveYear: e.data.leaveYear
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                leaveItemGrid: { ...this.state.leaveItemGrid, rowData: data },
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 휴가일수 마스터 저장    */
    /*==========================================================*/
    saveModalLeaveCnt() {
        var gParam = {
            ...this.state.cmUserLeaveCnt,
            orgLeaveCnt: Number(this.state.cmUserLeaveCnt.orgLeaveCnt),
            preLeaveCnt: Number(this.state.cmUserLeaveCnt.preLeaveCnt),
            orgCompLeaveCnt: Number(this.state.cmUserLeaveCnt.orgCompLeaveCnt),
            preCompLeaveCnt: Number(this.state.cmUserLeaveCnt.preCompLeaveCnt),
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }
        axios.post(this.props.storeState.serviceUrl + "/CmUserService/SaveModalLeaveCnt",
            gParam)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.getLeaveCntList();
            }).catch(function (error) {
                alert(error);
            });
    }
    // 체인지 공통
    onChangeHandler(e) {
        var tValue = e.target.value;
        var tName = e.target.name;
        var tLeaveCnt = this.state.cmUserLeaveCnt.preLeaveCnt;

        this.setState({
            cmUserLeaveCnt: {
                ...this.state.cmUserLeaveCnt,
                [e.target.name]: e.target.value
            }
        }, () => {
            if (tName === 'preCompLeaveCnt')
            {
                this.setState({
                    cmUserLeaveCnt: {
                        ...this.state.cmUserLeaveCnt,
                        preLeaveCnt: (tLeaveCnt - tValue),
                        remark: '보상 연차 차감'
                    }
                })
            }
        });
    }
    render() {
        var arrYear = [];
        for (var i = 0; i < 11; i++) {
            arrYear.push(2021 + i)
        }
        return (<>
            <div className="col-md-12" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-sm font-weight-bold text-success text-uppercase mb-4">
                                    LeaveCnt Mgmt</div>
                                <Form.Row>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <div className="col-md-12 text-right" style={{ marginBottom: 5 }}>
                                                <Button variant="secondary" onClick={this.modalLeveCntAdd.bind(this)} >Add</Button>
                                            </div>
                                            <div className="ag-theme-material"
                                                style={{ height: 200, borderTop: '2px solid #695405' }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.leaveGrid.columnDefs}
                                                    defaultColDef={this.state.leaveGrid.defaultColDef}
                                                    rowData={this.state.leaveGrid.rowData}
                                                    // singleClickEdit={true}
                                                    // rowSelection="multiple" // single
                                                    // onGridReady={params => this.gridMoveApi = params.api}
                                                    rowHeight={45}
                                                    onRowDoubleClicked={this.onRowDblClickedLeaveCnt.bind(this)}
                                                    onRowClicked={this.onRowClickedLeaveCnt.bind(this)}
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ 이력</Form.Label>
                                            <div className="ag-theme-material"
                                                style={{ height: 200, borderTop: '2px solid #695405', marginTop: 17 }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.leaveItemGrid.columnDefs}
                                                    defaultColDef={this.state.leaveItemGrid.defaultColDef}
                                                    rowData={this.state.leaveItemGrid.rowData}
                                                // singleClickEdit={true}
                                                // rowSelection="multiple" // single
                                                // onGridReady={params => this.gridMoveApi = params.api}
                                                // onRowDoubleClicked={this.onMoveRowDoubleClicked.bind(this)}
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </Form.Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <Modal show={this.state.modalLeveCnt} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveModalLeaveCnt.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalLeveCnt: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Year</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="leaveYear"
                                        value={this.state.cmUserLeaveCnt.leaveYear} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        {
                                            arrYear.map((year) => {
                                                return <option key={year} value={year.toString()}>{year.toString()}</option>;
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">

                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Org LeaveCnt</Form.Label>
                                    <Form.Control type="number" size="sm" style={{ textAlign: 'right' }}
                                        name="orgLeaveCnt"
                                        value={this.state.cmUserLeaveCnt.orgLeaveCnt} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ LeaveCnt</Form.Label>
                                    <Form.Control type="number" size="sm" style={{ textAlign: 'right' }}
                                        name="preLeaveCnt"
                                        value={this.state.cmUserLeaveCnt.preLeaveCnt} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Org CompLeaveCnt</Form.Label>
                                    <Form.Control type="number" size="sm" style={{ textAlign: 'right' }}
                                        name="orgCompLeaveCnt"
                                        value={this.state.cmUserLeaveCnt.orgCompLeaveCnt} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ CompLeaveCnt</Form.Label>
                                    <Form.Control type="number" size="sm" style={{ textAlign: 'right' }}
                                        name="preCompLeaveCnt"
                                        value={this.state.cmUserLeaveCnt.preCompLeaveCnt} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control as="textarea" rows={3} size="sm"
                                        name="remark"
                                        value={this.state.cmUserLeaveCnt.remark} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>

                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
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
)(UserMgmtLeaveCnt)
