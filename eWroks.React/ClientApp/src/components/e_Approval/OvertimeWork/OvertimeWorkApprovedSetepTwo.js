import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';


class OvertimeWorkApprovedSetepTwo extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),
        statusCd: "",
        remark: "",
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Req Nm', field: 'regIdNm', minWidth: 100 },
                    {
                        headerName: '2단계 요청시간', field: 'twoStepDateNm', minWidth: 500,
                        cellRendererFramework: (params) => {
                            return (
                                <span style={{ fontWeight: 'bold', fontSize: 15 }}>
                                    {params.data.twoStepDateNm}
                                </span>
                            )
                        }
                    },
                    { headerName: 'Reason', field: 'reason', minWidth: 300 },
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

        modalApprovalShow: false,
        weeklyTimeTotal: '',
        hrOvertimeWorkDto: {
            otId: 0
            , reason: ''
            , statusCd: '01'
            , remark: ''
            , fileNm: ''
            , fileUrl: ''
            , regId: ''
            , updId: ''
        },
        hrOvertimeWorkDateDto: {
            otId: 0
            , statusCd: '01'
            , startDt: new Date()
            , startTime: new Date('9999', '12', '31', '18', '00')
            , endDt: new Date()
            , endTime: new Date('9999', '12', '31', '18', '00')
            , recogTime: '00:00'
            , dinnerTime: '0'
            , regId: ''
            , updId: ''
        },
        hrOvertimeWorkApprovalDtos: {
            approvalUser1: '',
            approvalUser1Nm: '',
            approvalUser2: '',
            approvalUser2Nm: '',
            approvalUser3: '',
            approvalUser3Nm: '',
        },
        dateGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Start Dt', field: 'startDtFullNm', minWidth: 100 },
                    { headerName: 'End Dt', field: 'endDtFullNm', minWidth: 100 },
                    { headerName: 'Dinner', field: 'dinnerTime', minWidth: 50 },
                    { headerName: 'Reqest Time', field: 'recogTimeNm', minWidth: 100 },
                ],
            rowData: [],
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
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getTaskingOvertimeWorkTwoList();
    }

    /*==========================================================*/
    /* Two List    */
    /*==========================================================*/
    getTaskingOvertimeWorkTwoList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetTaskingOvertimeWorkTwoList", {
            params: {
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
    /* 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].otId;

        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetOvertimeWorkDetail", {
            params: {
                otId: id
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;

            var _master = data.hrOvertimeWorkDto;
            var _date = data.hrOvertimeWorkDateDto;
            var _dates = data.hrOvertimeWorkDateDtos;
            var _approvals = data.hrOvertimeWorkApprovalDtos;

            _date.startDt = new Date(_date.startDt);
            _date.startTime = new Date('9999', '12', '31', _date.startTime.substr(0, 2), _date.startTime.substr(2, 2));
            _date.endDt = new Date(_date.endDt);
            _date.endTime = new Date('9999', '12', '31', _date.endTime.substr(0, 2), _date.endTime.substr(2, 2));
            _date.recogTime = _date.recogTimeNm;

            var _approvalsObj = {
                approvalUser1: '',
                approvalUser1Nm: '',
                approvalUser2: '',
                approvalUser2Nm: '',
                approvalUser3: '',
                approvalUser3Nm: ''
            }

            _approvals.map((row, i) => {
                if (row.apprCd === 'A3') {
                    _approvalsObj.approvalUser1Nm = row.taskingUserNm;
                }
                else if (row.apprCd === 'A4') {
                    _approvalsObj.approvalUser2Nm = row.taskingUserNm;
                }
                else if (row.apprCd === 'A5') {
                    _approvalsObj.approvalUser3Nm = row.taskingUserNm;
                }
            });

            this.setState({
                hrOvertimeWorkDto: _master,
                hrOvertimeWorkDateDto: _date,
                dateGrid: { ...this.state.dateGrid, rowData: _dates, rowCount: _dates.length },
                hrOvertimeWorkApprovalDtos: _approvalsObj
            }, () => {
                this.getWeeklyTimeTotal(_date.startDt, _date.regId);

                this.setState({
                    modalApprovalShow: true
                })
            })


        }).catch(function (error) {
            alert(error);
        });

    }

      /*==========================================================*/
    /* 해당유저의 주 토탈 시간   */
    /*==========================================================*/
    getWeeklyTimeTotal(startDt, userId) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetWeeklyTimeTotal", {
            params: {
                startDt: this.props.storeState.getParsedDate(startDt),
                userId: userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                weeklyTimeTotal: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }


    /*==========================================================*/
    /* 승인    */
    /*==========================================================*/
    saveTaskingOvertimeWorkList(e) {
        var rows = this.gridApi.getSelectedRows();

        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        for (var i = 0; i < rows.length; i++) {
            var gParam = {
                otId: rows[i].otId,
                apprId: rows[i].apprId,
                remark: "",
                statusCd: e.target.id === 'btnApprovalList' ? '10' : '99',
                updId: this.props.storeState.userInfo.userId
            }
            this.saveTaskingOvertimeWork(gParam);
        }

    }
    saveTaskingOvertimeWorkModal(e) {
        var rows = this.gridApi.getSelectedRows();

        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var gParam = {
            otId: rows[0].otId,
            apprId: rows[0].apprId,
            remark: this.state.remark,
            statusCd: e.target.id === 'btnApprovalModal' ? '10' : '99',
            updId: this.props.storeState.userInfo.userId
        }
        this.saveTaskingOvertimeWork(gParam);
    }
    saveTaskingOvertimeWork(obj) {
        axios.post(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/SaveTaskingOvertimeWorkTwo", {}, {
            params: {
                otId: obj.otId,
                apprId: obj.apprId,
                remark: obj.remark,
                statusCd: obj.statusCd,
                updId: obj.updId
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalApprovalShow: false
            })
            this.getTaskingOvertimeWorkTwoList();

        }).catch(function (error) {
            alert(error);
        });
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
            <Card style={{ marginTop: 15 }}>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="success" id="btnApprovalList" onClick={this.saveTaskingOvertimeWorkList.bind(this)} >Approval</Button>{' '}
                                <Button variant="danger" id="btnRejectList" onClick={this.saveTaskingOvertimeWorkList.bind(this)} >Reject</Button>{' '}
                                <Button variant="primary" onClick={this.getTaskingOvertimeWorkTwoList.bind(this)} >Search</Button>
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
                            rowHeight={30}
                            onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>

            {/* Modal */}
            <Modal show={this.state.modalApprovalShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" id="btnApprovalModal" onClick={this.saveTaskingOvertimeWorkModal.bind(this)} >Approval</Button>{' '}
                        <Button variant="danger" id="btnRejectModal" onClick={this.saveTaskingOvertimeWorkModal.bind(this)} >Reject</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalApprovalShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <Table bordered style={{ marginTop: 15, tableLayout: 'fixed' }} >
                            <colgroup>
                                <col style={{ width: '100px' }} />
                                <col style={{ width: '200px' }} />
                                <col style={{ width: '100px' }} />
                                <col style={{ width: '200px' }} />
                            </colgroup>
                            <tbody>
                                <tr style={{ borderTop: '5px solid #e9ecef' }}>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Comment</th>
                                    <td colSpan={3}>
                                        <Form.Control type="text" size="sm"
                                            name="remark"
                                            className="responseRemarkBackcolor"
                                            value={this.state.remark} onChange={this.onChangeHandler.bind(this)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Request Nm</th>
                                    <td>
                                        {this.state.hrOvertimeWorkDto.regIdNm}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Department</th>
                                    <td>
                                        {this.state.hrOvertimeWorkDto.regIdDeptFullNm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Request Dt</th>
                                    <td>
                                        {this.state.hrOvertimeWorkDto.regDtNm}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Status</th>
                                    <td>
                                        {this.state.hrOvertimeWorkDto.statusCdNm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Weekly Total</th>
                                    <td colSpan={3} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        {this.state.weeklyTimeTotal}
                                    </td>
                                </tr>
                                <tr style={{ borderTop: '5px solid #e9ecef', borderBottom: '5px solid #e9ecef' }}>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Date</th>
                                    <td colSpan={3} style={{ padding: 3 }}>
                                        <div className="ag-theme-material"
                                            style={{ height: 150, borderTop: '2px solid #695405' }}
                                        >
                                            <AgGridReact headerHeight={45} rowHeight={45}
                                                columnDefs={this.state.dateGrid.columnDefs}
                                                defaultColDef={this.state.dateGrid.defaultColDef}
                                                rowData={this.state.dateGrid.rowData}
                                                singleClickEdit={true}
                                            // rowSelection="multiple" // single
                                            // onGridReady={params => this.gridDateApi = params.api}
                                            // onRowDoubleClicked={this.onApprovalRowDoubleClicked.bind(this)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Reason</th>
                                    <td colSpan={3}>
                                        {this.state.hrOvertimeWorkDto.reason}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ File Attached</th>
                                    <td colSpan={3}>
                                        <a href={this.state.hrOvertimeWorkDto.fileUrl} target={'_blank'}>
                                            {this.state.hrOvertimeWorkDto.fileNm}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Part Leader</th>
                                    <td colSpan={3}>
                                        {this.state.hrOvertimeWorkApprovalDtos.approvalUser1Nm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Team Manager</th>
                                    <td colSpan={3}>
                                        {this.state.hrOvertimeWorkApprovalDtos.approvalUser2Nm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ CS / Lab Manager</th>
                                    <td colSpan={3}>
                                        {this.state.hrOvertimeWorkApprovalDtos.approvalUser3Nm}
                                    </td>
                                </tr>

                            </tbody>
                        </Table>
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
)(OvertimeWorkApprovedSetepTwo)
