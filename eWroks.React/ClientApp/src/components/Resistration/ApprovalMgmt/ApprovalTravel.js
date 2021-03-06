import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { ProgressBar, Modal, Form, Col, Card, Button, Breadcrumb, DropdownButton, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import GDHDatepicker from '../../common/controls/GDHDatepicker'
import GDHSelectOption from '../../common/controls/GDHSelectOption';


class ApprovalTravel extends Component {
    state = {
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Dept 1', field: 'deptCd1Nm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'Dept 2',
                        field: 'deptCd2Nm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Dept 3',
                        field: 'deptCd3Nm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Approval Cd',
                        field: 'approvalCdNm',
                        minWidth: 200
                    },
                    {
                        headerName: 'User Nm',
                        field: 'userNm',
                        minWidth: 100
                    },
                    {
                        headerName: 'User Enm',
                        field: 'userEnm',
                        minWidth: 100
                    },
                    {
                        headerName: 'User Dept',
                        field: 'userDeptFullNm',
                        minWidth: 200
                    },
                    {
                        headerName: 'Position',
                        field: 'dutyCdKorNm',
                        minWidth: 100
                    },
                    {
                        headerName: 'HR Status',
                        field: 'hR_StatusCdNm',
                        minWidth: 100
                    },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: true, // ???????????? ??????
            }
        },
        approvalPopupGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'User Enm',
                        field: 'userEnm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Dept 1',
                        field: 'deptCd1Nm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Dept 2',
                        field: 'deptCd2Nm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Dept 3',
                        field: 'deptCd3Nm',
                        minWidth: 100
                    },
                    {
                        headerName: 'Position',
                        field: 'DutyCdKorNm',
                        minWidth: 100
                    }
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: true, // ???????????? ??????
            }
        },
        searchGroup: {
            deptCd1: 0,
            deptCd2: 0,
            deptCd3: 0,
            deptList1: [],
            deptList2: [],
            deptList3: [],
            approvalGb: '03',
            approvalCd: '',
        },
        popupSearchGroup: {
            deptCd1: 0,
            deptCd2: 0,
            deptCd3: 0,
            deptList1: [],
            deptList2: [],
            deptList3: [],
            approvalGb: '03',
            approvalCd: ''
        },
        modalItemShow: false
        
    }
    componentDidMount() {
        // ?????? ??????
        this.getApprovalList();
        // Dept 1
        this.getDeptListOptions('deptCd1', 0, 'search');
        this.getDeptListOptions('deptCd1', 0, 'popup');
    }

    /*==========================================================*/
    /* ??????    */
    /*==========================================================*/
    async onClickAdd() {
        // ?????? ???????????? ????????? ????????? ?????? ??????.
        if(this.state.searchGroup.deptCd1 === 0 || this.state.searchGroup.deptCd2 === 0) 
        {
            alert('?????? ?????? ?????? ??? ??????????????????.');
            return;
        }
        else {
            if (this.state.searchGroup.deptList3.length > 0)
            {
                if (this.state.searchGroup.deptCd3 === 0) {
                    alert('?????? ?????? ?????? ??? ??????????????????.');
                    return; 
                }
            }
        }

        // ????????????
        this.setState({
            popupSearchGroup: this.state.searchGroup,
            modalItemShow: true
        })

        setTimeout(function () { //Start the timer
            // ?????? ???????????? ??????
            this.setState({
                popupSearchGroup: {
                    ...this.state.popupSearchGroup,
                    deptCd1: this.state.searchGroup.deptCd1,
                    deptCd2: this.state.searchGroup.deptCd2,
                    deptCd3: this.state.searchGroup.deptCd3
                }
            }, () => {
                // ?????? ?????? ??????
                this.getModalUserList();
            });
        }.bind(this), 500)
    }

    /*==========================================================*/
    /* ?????? ?????? ??????    */
    /*==========================================================*/
    saveModalUserList() {
        var rows = this.gridApiPopup.getSelectedRows();

        if (this.state.popupSearchGroup.approvalCd === '')
        {
            alert('Approval Cd??? ????????? ?????????.');
            return;
        }
        if (rows.length === 0)
        {
            alert('????????? ???????????? ????????????.');
            return;
        }
        rows.map((row, i) => {
            row.saveDeptCd1 = Number(this.state.searchGroup.deptCd1);
            row.saveDeptCd2 = Number(this.state.searchGroup.deptCd2);
            row.saveDeptCd3 = Number(this.state.searchGroup.deptCd3);
            row.saveApprovalCd = this.state.popupSearchGroup.approvalCd;
            row.saveApprovalGb = this.state.popupSearchGroup.approvalGb;
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });
        axios.post(this.props.storeState.serviceUrl + "/CmApprovalService/SaveModalUserList", 
            rows
        )
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalItemShow: false
                });
                this.getApprovalList();

            }).catch(function (error) {
                alert(error);
            });
    }

     /*==========================================================*/
    /* ?????? ??????    */
    /*==========================================================*/
    deleteUserList() {
        var rows = this.gridApi.getSelectedRows();

        if (rows.length === 0)
        {
            alert('????????? ???????????? ????????????.');
            return;
        }
        rows.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });
        axios.post(this.props.storeState.serviceUrl + "/CmApprovalService/DeleteUserList", 
            rows
        )
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalItemShow: false
                });
                this.getApprovalList();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* ?????? ?????? ?????? (????????? ?????????)    */
    /*==========================================================*/
    getApprovalList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmApprovalService/GetApprovalList", {
            params: {
                deptCd1: this.state.searchGroup.deptCd1,
                deptCd2: this.state.searchGroup.deptCd2,
                deptCd3: this.state.searchGroup.deptCd3,
                approvalGb: this.state.searchGroup.approvalGb,
                approvalCd: this.state.searchGroup.approvalCd,
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            }, () => {
                this.props.onIsLoadingFalse();
            });
        }).catch(function (error) { 
            alert(error); 
        });
    }

    /*==========================================================*/
    /* ?????? ?????? ??????    */
    /*==========================================================*/
    getModalUserList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmApprovalService/GetModalApprovalUserList", {
            params: {
                deptCd1: this.state.popupSearchGroup.deptCd1,
                deptCd2: this.state.popupSearchGroup.deptCd2,
                deptCd3: this.state.popupSearchGroup.deptCd3
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
                approvalPopupGrid: { ...this.state.approvalPopupGrid, rowData: data, rowCount: data.length }
            }, () => {
                this.props.onIsLoadingFalse();
            });
        }).catch(function (error) { 
            alert(error); 
        });
    }

    // ????????? ??????
    onChangeHandler(e) {
        this.setState({
            searchGroup: {
                ...this.state.searchGroup,
                [e.target.name]: e.target.value
            }
        });
    }
    // ????????? ??????
    onChangeHandlerPopup(e) {
        this.setState({
            popupSearchGroup: {
                ...this.state.popupSearchGroup,
                [e.target.name]: e.target.value
            }
        });
    }
    onDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            searchGroup: {
                ...this.state.searchGroup,
                [e.target.name]: eValue
            }
        });
        this.getDeptListOptions(e.target.name, eValue, 'search');
    }
    onDeptChangeHandlerPopup(e) {
        var eValue = Number(e.target.value);
        this.setState({
            popupSearchGroup: {
                ...this.state.popupSearchGroup,
                [e.target.name]: eValue
            }
        });
        this.getDeptListOptions(e.target.name, eValue, 'popup');
    }
    /*==========================================================*/
    /* Dept 1 List    */
    /*==========================================================*/
    getDeptListOptions(name, deptId, gb) {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
            params: {
                deptId : Number(deptId)
            }
        }).then(r => {
            var data = r.data;
            if (name === 'deptCd1') {
                if (deptId === 0) {
                    // Dept 1
                    if (gb === 'search') {
                        this.setState({
                            searchGroup: {
                                ...this.state.searchGroup,
                                deptList1: data, deptList2: [], deptList3: []
                            }
                        });
                    }
                    else {
                        this.setState({
                            popupSearchGroup: {
                                ...this.state.popupSearchGroup,
                                deptList1: data, deptList2: [], deptList3: []
                            }
                        }, () => {
                            // ?????? ?????? ??????
                            this.getModalUserList();
                        });
                    }
                } else {
                    if (gb === 'search') {
                        this.setState({
                            searchGroup: {
                                ...this.state.searchGroup,
                                deptList2: data, deptList3: []
                            }
                        });
                    }
                    else {
                        this.setState({
                            popupSearchGroup: {
                                ...this.state.popupSearchGroup,
                                deptList2: data, deptList3: []
                            }
                        }, () => {
                            // ?????? ?????? ??????
                            this.getModalUserList();
                        });
                    }
                }
            }
            if (name === 'deptCd2') {
                if (gb === 'search') {
                    this.setState({
                        searchGroup: {
                            ...this.state.searchGroup,
                            deptList3: data
                        }
                    });
                }
                else {
                    this.setState({
                        popupSearchGroup: {
                            ...this.state.popupSearchGroup,
                            deptList3: data
                        }
                    }, () => {
                        // ?????? ?????? ??????
                        this.getModalUserList();
                    });
                }
            }
            if (name === 'deptCd3') {
                if (gb === 'popup') {
                    this.getModalUserList();
                }
            }
        }).catch(function (error) {
            alert(error);
        });
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>??? Dept Cd1</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd1"
                                        value={this.state.searchGroup.deptCd1} onChange={this.onDeptChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"=== Select ==="}</option>
                                        {
                                            this.state.searchGroup.deptList1.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>??? Dept Cd2</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd2"
                                        value={this.state.searchGroup.deptCd2} onChange={this.onDeptChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"=== Select ==="}</option>
                                        {
                                            this.state.searchGroup.deptList2.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>??? Dept Cd3</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd3"
                                        value={this.state.searchGroup.deptCd3} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"=== Select ==="}</option>
                                        {
                                            this.state.searchGroup.deptList3.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>??? Approval Cd</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="approvalCd"
                                        value={this.state.searchGroup.approvalCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0024" frCdMinor="03" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getApprovalList.bind(this)} >Search</Button>{' '}
                                <Button variant="secondary" onClick={this.onClickAdd.bind(this)} >Add</Button>{' '}
                                <Button variant="danger" onClick={this.deleteUserList.bind(this)} >Delete</Button>
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
                            onGridReady={params => this.gridApi = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>

            {/* Modal */}
            <Modal show={this.state.modalItemShow} backdrop="static" size="lg">
                {/* <Modal.Header>
                    <Modal.Title>User List</Modal.Title>
                </Modal.Header> */}
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveModalUserList.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            setTimeout(function () { //Start the timer
                                this.setState({ modalItemShow: false })
                            }.bind(this), 300)
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form.Row>
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>??? Dept Cd1</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="deptCd1"
                                    value={this.state.popupSearchGroup.deptCd1} onChange={this.onDeptChangeHandlerPopup.bind(this)}
                                >
                                    <option key={-1} value={0}>{"=== Select ==="}</option>
                                    {
                                        this.state.popupSearchGroup.deptList1.map((item, i) => {
                                            return (
                                                <option key={i} value={item.deptId}>{item.deptNm}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>??? Dept Cd2</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="deptCd2"
                                    value={this.state.popupSearchGroup.deptCd2} onChange={this.onDeptChangeHandlerPopup.bind(this)}
                                >
                                    <option key={-1} value={0}>{"=== Select ==="}</option>
                                    {
                                        this.state.popupSearchGroup.deptList2.map((item, i) => {
                                            return (
                                                <option key={i} value={item.deptId}>{item.deptNm}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>??? Dept Cd3</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="deptCd3"
                                    value={this.state.popupSearchGroup.deptCd3} onChange={this.onDeptChangeHandlerPopup.bind(this)}
                                >
                                    <option key={-1} value={0}>{"=== Select ==="}</option>
                                    {
                                        this.state.popupSearchGroup.deptList3.map((item, i) => {
                                            return (
                                                <option key={i} value={item.deptId}>{item.deptNm}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-3" style={{ backgroundColor: '#eee' }}>
                            <Form.Group>
                                <Form.Label>??? Approval Cd(?????????)</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="approvalCd"
                                    value={this.state.popupSearchGroup.approvalCd} onChange={this.onChangeHandlerPopup.bind(this)}
                                >
                                    <GDHSelectOption cdMajor="0024" frCdMinor="03" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </Form.Row>
                </Modal.Body>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 400, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.approvalPopupGrid.columnDefs}
                            defaultColDef={this.state.approvalPopupGrid.defaultColDef}
                            rowData={this.state.approvalPopupGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiPopup = params.api}
                        // onRowClicked={this.onRowClicked_Master.bind(this)}
                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
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
)(ApprovalTravel)