import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

class TaskingLeaveHoliday extends Component {
    state = {
        activeKey: "list",
        boolButton: false,
        leaveHoliId: 0,
        apprId: 0,
        remark: '',
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Reason', field: 'reason', minWidth: 400 },
                    { headerName: 'Reg Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Reg Dt ', field: 'regDtNm', minWidth: 100 },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                // filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                // floatingFilter: true, // 멀티서치 기능
            }
        },
        dateGrid: {
            columnDefs:
                [
                    { headerName: 'Leave Type', field: 'leaveTypeCdNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Leave Detail', field: 'leaveTypeDetailCdNm', minWidth: 100 },
                    { headerName: 'Start Dt', field: 'startDt', minWidth: 100 },
                    { headerName: 'Start Time', field: 'startTime', minWidth: 100 },
                    { headerName: 'End Dt', field: 'endDt', minWidth: 100 },
                    { headerName: 'End Time', field: 'endTime', minWidth: 100 },
                    { headerName: 'Request Days', field: 'recogDay', minWidth: 100 },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                // floatingFilter: true, // 멀티서치 기능
            },
            isLoding: false,
        },
        hrLeaveHolidayGroupDto: {
            hrLeaveHolidayDto: {
                leaveHoliId: 0
                , reason: ''
                , statusCd: '01'
                , remark: ''
                , fileNm: ''
                , fileUrl: ''
                , regId: ''
                , updId: ''

                , statusCdNm: ''
                , regIdNm: ''
                , regIdDeptFullNm: ''

                , certiTitleGb: ''
            },
            hrLeaveHolidayDateDtos: [],
            hrLeaveHolidayApprovalDtos: {
                a1: '',
                a2: '',
                a3: '',
                a4: '',
                a5: '',
                a6: '',
                z9: '',
            },
        }
    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getTaskingLeaveHolidayList();
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getTaskingLeaveHolidayList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrLeaveHolidayService/GetTaskingLeaveHolidayList", {
            params: {
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
    /* 상세보기    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var leaveHoliId = e.data.leaveHoliId;
        var apprId = e.data.apprId;
        this.setState({
            leaveHoliId: leaveHoliId,
            apprId: apprId,
            remark: '',
            boolButton: true,
        })
        this.getTaskingLeaveHolidayDetail(leaveHoliId);
    }

    /*==========================================================*/
    /* 상세조회    */
    /*==========================================================*/
    getTaskingLeaveHolidayDetail(leaveHoliId) {
        axios.get(this.props.storeState.serviceUrl + "/HrLeaveHolidayService/GetLeaveHolidayDetail", {
            params: {
                leaveHoliId: leaveHoliId
            }
        }).then(r => {
            var data = r.data;

            var strA1 = '';
            var strA2 = '';
            var strA3 = '';
            var strA4 = '';
            var strA5 = '';
            var strA6 = '';
            var strz9 = '';

            data.hrLeaveHolidayApprovalDtos.map((row, i) => {
                if (row.apprCd === 'A1') {
                    strA1 += row.taskingUserNm
                }
                if (row.apprCd === 'A2') {
                    strA2 += row.taskingUserNm
                }
                if (row.apprCd === 'A3') {
                    strA3 += row.taskingUserNm
                }
                if (row.apprCd === 'A4') {
                    strA4 += row.taskingUserNm
                }
                if (row.apprCd === 'A5') {
                    strA5 += row.taskingUserNm
                }
                if (row.apprCd === 'A6') {
                    strA6 += row.taskingUserNm
                }
                if (row.apprCd === 'Z9') {
                    strz9 += row.taskingUserNm
                }
            })

            this.setState({
                activeKey: 'detail',
                hrLeaveHolidayGroupDto: {
                    ...this.state.hrLeaveHolidayGroupDto,
                    hrLeaveHolidayDto: data.hrLeaveHolidayDto,
                    // hrLeaveHolidayDateDtos: data.hrLeaveHolidayDateDtos,
                    hrLeaveHolidayApprovalDtos: {
                        a1: strA1,
                        a2: strA2,
                        a3: strA3,
                        a4: strA4,
                        a5: strA5,
                        a6: strA6,
                        z9: strz9,
                    }
                },
                dateGrid: { ...this.state.dateGrid, rowData: data.hrLeaveHolidayDateDtos }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 승인 리젝 저장    */
    /*==========================================================*/
    saveTaskingLeaveHolidayApproval(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/HrLeaveHolidayService/SaveTaskingLeaveHolidayApproval", {}, {
            params: {
                leaveHoliId: this.state.leaveHoliId,
                apprId: this.state.apprId,
                remark: this.state.remark,
                statusCd: btnId === 'btnApproval' ? '10' : '99',
                updId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                activeKey: 'list',
                boolButton: false,
            })
            this.getTaskingLeaveHolidayList();
        }).catch(function (error) {
            alert(error);
        });
    }

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
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
                                        <div className="col-md-12 text-right">
                                            <Button variant="primary" onClick={this.getTaskingLeaveHolidayList.bind(this)} >Search</Button>
                                        </div>
                                    </Form.Row>
                                </Form>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                <div className="ag-theme-material"
                                    style={{ height: 300, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.masterGrid.columnDefs}
                                        defaultColDef={this.state.masterGrid.defaultColDef}
                                        rowData={this.state.masterGrid.rowData}
                                        // rowSelection="multiple" // single
                                        // rowHeight={40}
                                        // onGridReady={params => this.gridApi = params.api}
                                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </Card.Body>
                            {/* <Card.Footer>
                                <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                            </Card.Footer> */}
                        </Card>
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail" >
                    <Form style={{ marginTop: 15 }}>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                {
                                    this.state.boolButton === true
                                        ? <><Button variant="success" id="btnApproval" onClick={this.saveTaskingLeaveHolidayApproval.bind(this)}>Approval</Button>{' '}
                                            <Button variant="danger" id="btnReject"
                                                style={{ display: this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '02' ? 'none' : 'inline' }}
                                                onClick={this.saveTaskingLeaveHolidayApproval.bind(this)}>Reject</Button></>
                                        : <></>
                                }
                            </div>
                        </Form.Row>
                    </Form>
                    <div className="table-responsive">
                        <Table bordered style={{ marginTop: 15, tableLayout: 'fixed' }} >
                            <colgroup>
                                <col style={{ width: '150px' }} />
                                <col style={{ width: '300px' }} />
                                <col style={{ width: '150px' }} />
                                <col style={{ width: '300px' }} />
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
                                        {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.regIdNm}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Department</th>
                                    <td>
                                        {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.regIdDeptFullNm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Request Dt</th>
                                    <td>
                                        {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.regDtNm}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Status</th>
                                    <td>
                                        {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCdNm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Reason</th>
                                    <td colSpan={3}>
                                        {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.reason}
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
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ File Attached</th>
                                    <td colSpan={3}>
                                        <a href={this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.fileUrl} target={'_blank'}>
                                            {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.fileNm}
                                        </a>
                                    </td>
                                </tr>
                              
                                {
                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
                                        ? <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Second Manager</th>
                                            <td colSpan={3}>
                                                {
                                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a2.split('<br/>').map((line, i) => {
                                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                                    })
                                                }
                                            </td>
                                        </tr>
                                        : <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Carbon Copy</th>
                                            <td colSpan={3}>
                                                {
                                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a1.split('<br/>').map((line, i) => {
                                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                                    })
                                                }
                                            </td>
                                        </tr>
                                }
                                
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>
                                        ■ {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03' ? "Branch Manager" : "Part Leader"}</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a3.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Team Manager</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a4.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                                {
                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
                                        ? <></>
                                        : <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ CS / Lab Manager</th>
                                            <td colSpan={3}>
                                                {
                                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a5.split('<br/>').map((line, i) => {
                                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                                    })
                                                }
                                            </td>
                                        </tr>
                                }
                                
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ General Manager</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a6.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ CMD</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.z9.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>


                            </tbody>
                        </Table>
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
)(TaskingLeaveHoliday)
