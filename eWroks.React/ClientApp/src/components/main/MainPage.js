import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Spinner, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import TaskingTravel from './Tasking/TaskingTravel';
import TaskingExternalTraining from './Tasking/TaskingExternalTraining';
import TaskingLeaveHoliday from './Tasking/TaskingLeaveHoliday';

import './MainPageStyle.css';

// import Marquee from "marquee-react-dwyer";
import Marquee from 'react-double-marquee';
class MainPage extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        allNoticeGrid: {
            columnDefs:
                [
                    { headerName: 'Gb', field: 'alertGbNm', minWidth: 100 },
                    { headerName: 'Title', field: 'noticeTitle', minWidth: 150 },
                    { headerName: 'Reg Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Reg Dt', field: 'regDtNm', minWidth: 100 },
                    { headerName: 'Cnt', field: 'clickCnt', minWidth: 100 },
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
        deptNoticeGrid: {
            columnDefs:
                [
                    { headerName: 'Gb', field: 'alertGbNm', minWidth: 100 },
                    { headerName: 'Dept', field: 'deptList', minWidth: 100 },
                    { headerName: 'Title', field: 'noticeTitle', minWidth: 150 },
                    { headerName: 'Reg Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Reg Dt', field: 'regDtNm', minWidth: 100 },
                    { headerName: 'Cnt', field: 'clickCnt', minWidth: 100 },
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
        taskingList: {
            modalShow: false,
            modalComponent: null,
            travelCnt: 0,
            externalTrainingCnt: 0,
            leaveHolidayCnt: 0,
            overtimeWorkOne: 0,
            overtimeWorkTwo: 0,
            purchaseCnt: 0,

        },
        scheduleGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Type', field: 'travelGbNm', minWidth: 100 },
                    { headerName: 'Destination', field: 'destination', minWidth: 100 },
                    { headerName: 'Purpose', field: 'purpose', minWidth: 100 },
                    { headerName: 'Estimated revenue', field: 'estRevAmt', minWidth: 100 },
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
        boolIsMobile1: false,
        boolIsMobile2: false,

        programList: []
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        // 메인 공지사항 보기
        this.getMainNoticeList();

        // 메인 승인요청 데이터
        this.getMainApprovalData();

        if (this.isMobile()) {
            this.setState({
                boolIsMobile1: true,
                boolIsMobile2: true
            })
        }

        this.getProgramList();
    }

    /*==========================================================*/
    /* 프로그램 리스트 조회    */
    /*==========================================================*/
    getProgramList() {
        axios.get(this.props.storeState.serviceUrl + "/CommonService/GetProgramList", {
            params: {
                roleId: this.props.storeState.userInfo.roleId
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                programList: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }


    /*==========================================================*/
    /* Approval Tasking    */
    /*==========================================================*/
    onClickTaskingList(btnId) {
        var com = null;
        if (btnId === "Travel") { com = <TaskingTravel /> }
        if (btnId === "ExternalTraining") { com = <TaskingExternalTraining /> }
        if (btnId === "LeaveHoliday") { com = <TaskingLeaveHoliday /> }

        this.setState({
            taskingList: {
                ...this.state.taskingList,
                modalComponent: com,
                modalShow: true
            }
        })
    }

    /*==========================================================*/
    /* 메인 승인요청    */
    /*==========================================================*/
    getMainApprovalData() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmMainService/GetMainApprovalData", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                taskingList: {
                    ...this.state.taskingList,
                    travelCnt: data.travelCnt,
                    externalTrainingCnt: data.externalTrainingCnt,
                    leaveHolidayCnt: data.leaveHolidayCnt,
                    overtimeWorkOne: data.overtimeWorkOne,
                    overtimeWorkTwo: data.overtimeWorkTwo,
                    purchaseCnt: data.purchaseCnt,
                }
            })

        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 메인 공지사항    */
    /*==========================================================*/
    getMainNoticeList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmMainService/GetMainNoticeList", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            var allList = [];
            var deptList = [];

            data.map((row, i) => {
                if (row.gridGb === '01') {
                    allList.push(row);
                }
                else {
                    deptList.push(row);
                }
            })

            this.setState({
                allNoticeGrid: { ...this.state.allNoticeGrid, rowData: allList },
                deptNoticeGrid: { ...this.state.deptNoticeGrid, rowData: deptList }
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    viewMobile1() {
        this.setState({
            boolIsMobile1: this.isMobile() ? !this.state.boolIsMobile1 : false
        })
    }
    viewMobile2() {
        this.setState({
            boolIsMobile2: this.isMobile() ? !this.state.boolIsMobile2 : false
        })
    }

    render() {
        return (<>
            <div className='col-md-12'>
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="card shadow mb-6">
                            <div className="card-body" style={{ padding: 0, borderBottom: '3px solid #ffc700' }}>
                                <Table style={{ padding: 0, margin: 0, tableLayout: 'fixed' }}>
                                    <colgroup>
                                        <col style={{ width: 50 }} />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: 'center', border: 'none', borderRight: '1px solid #ddd' }}>
                                                <i className="fas fa-bullhorn fa-2x" style={{ color: '#f6c23e' }}></i>
                                            </td>
                                            <td style={{ border: 'none' }}>
                                                <div style={{
                                                        whiteSpace: 'nowrap',
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    <Marquee direction="left">

                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 요기에 중요한 파일 링크나...
                                                        </a>
                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 알려야 할 공지사항이 있다면.
                                                        </a>
                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 활용하면 좋을거 같군요...
                                                        </a>
                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 테스트 중..........
                                                        </a>
                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 테스트 중..........
                                                        </a>
                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 테스트 중..........
                                                        </a>
                                                        <a href={'https://www.naver.com'} target={'_blank'} style={{ textDecoration: 'none', color: 'black', marginRight: 100 }}>
                                                            <span style={{ color: 'red' }}>[중요]</span> 테스트 중..........
                                                        </a>
                                                    </Marquee>
                                                </div>
                                                {/* <Marquee
                                                    Size={"h6"}
                                                    NumberOfOptions={'1'}
                                                    Index0={"eWorks v2.0 오픈오픈오픈 ㅋㅋㅋㅋㅋㅋㅋ"}
                                                    Index1={'I was ...'}
                                                    Index2={'looking for a marquee ...'}
                                                    Index3={'to use in a ...'}
                                                    Index4={'react application.'}
                                                    Index5={'I never ...'}
                                                    Index6={'found one.'}
                                                    Index7={'So I made one for all to use.'}
                                                    Index8={'Your contributions are encouraged!'}
                                                    TimeToCross={'13000'}
                                                    // TimeToChange={'5000'}
                                                    Color={'black'}
                                                /> */}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card shadow mb-6">
                            <div className="card-header py-3 announce01" onClick={this.viewMobile1.bind(this)}>
                                <h6 className="m-0 font-weight-bold text-light">■ Intertek Announcement</h6>
                            </div>
                            <div className="card-body" style={{ padding: 0, display: this.state.boolIsMobile1 ? 'none' : 'inline' }}

                            >
                                <Card>
                                    <Card.Body style={{ padding: 0 }}>
                                        <div className="ag-theme-material"
                                            style={{ height: 250 }}
                                        >
                                            <AgGridReact headerHeight={45} rowHeight={45}
                                                columnDefs={this.state.allNoticeGrid.columnDefs}
                                                defaultColDef={this.state.allNoticeGrid.defaultColDef}
                                                rowData={this.state.allNoticeGrid.rowData}
                                            // rowSelection="multiple" // single
                                            // onGridReady={params => this.gridApi = params.api}
                                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card shadow mb-6">
                            <div className="card-header py-3 announce02" onClick={this.viewMobile2.bind(this)}>
                                <h6 className="m-0 font-weight-bold text-light">■ Division Announcement</h6>
                            </div>
                            <div className="card-body" style={{ padding: 0, display: this.state.boolIsMobile2 ? 'none' : 'inline' }}

                            >
                                <Card>
                                    <Card.Body style={{ padding: 0 }}>
                                        <div className="ag-theme-material"
                                            style={{ height: 250 }}
                                        >
                                            <AgGridReact headerHeight={45} rowHeight={45}
                                                columnDefs={this.state.deptNoticeGrid.columnDefs}
                                                defaultColDef={this.state.deptNoticeGrid.defaultColDef}
                                                rowData={this.state.deptNoticeGrid.rowData}
                                            // rowSelection="multiple" // single
                                            // onGridReady={params => this.gridApi = params.api}
                                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 mb-4">
                        <div className="card shadow mb-6">
                            <div className="card-header py-3 requestApprovalCard">
                                <h6 className="m-0 font-weight-bold text-light">■ Request Approval</h6>
                            </div>
                            <div className="card-body" style={{ padding: 15 }}>
                                <Row>
                                    {
                                        this.state.programList.map((row) => {
                                            if (row.programNm.indexOf('Overtime (Approved)') > -1) {
                                                return (
                                                    <div className="col-xl-2 col-md-6 mb-4">
                                                        <Link key={1} to={'/OvertimeWorkApproved?clickGb=one'} style={{ color: '#212529', textDecoration: 'none' }}>
                                                            <div className="card border-left-warning shadow h-100 py-4 mainPointer"  >
                                                                <div className="card-body mainPointer">
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col mr-2">
                                                                            <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                                                Overtime (1단계) </div>
                                                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                                {this.state.taskingList.overtimeWorkOne}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            {
                                                                                this.state.taskingList.overtimeWorkOne > 0
                                                                                    ? <Spinner animation="grow" variant="danger" style={{ width: 15, height: 15 }} />
                                                                                    : <i className="fas fa-file fa-2x text-gray-300"></i>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                    
                                    {
                                        this.state.programList.map((row) => {
                                            if (row.programNm.indexOf('Overtime (Approved)') > -1) {
                                                return (
                                                    <div className="col-xl-2 col-md-6 mb-4">
                                                        <Link key={1} to={'/OvertimeWorkApproved?clickGb=two'} style={{ color: '#212529', textDecoration: 'none' }}>
                                                            <div className="card border-left-warning shadow h-100 py-4 mainPointer"  >
                                                                <div className="card-body mainPointer">
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col mr-2">
                                                                            <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                                                Overtime (2단계) </div>
                                                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                                {this.state.taskingList.overtimeWorkTwo}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            {
                                                                                this.state.taskingList.overtimeWorkTwo > 0
                                                                                    ? <Spinner animation="grow" variant="danger" style={{ width: 15, height: 15 }} />
                                                                                    : <i className="fas fa-file fa-2x text-gray-300"></i>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                    <div className="col-xl-2 col-md-6 mb-4">
                                        <div className="card border-left-warning shadow h-100 py-4 mainPointer" onClick={() => {
                                            this.onClickTaskingList("LeaveHoliday")
                                        }}>
                                            <div className="card-body mainPointer">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                            Vacation</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            {this.state.taskingList.leaveHolidayCnt}
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        {
                                                            this.state.taskingList.leaveHolidayCnt > 0
                                                                ? <Spinner animation="grow" variant="danger" style={{ width: 15, height: 15 }} />
                                                                : <i className="fas fa-file fa-2x text-gray-300"></i>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        this.state.programList.map((row) => {
                                            if (row.programNm.indexOf('Purchase (Approved)') > -1) {
                                                return (
                                                    <div className="col-xl-2 col-md-6 mb-4">
                                                        <Link key={1} to={'/PurchaseApproved'} style={{ color: '#212529', textDecoration: 'none' }}>
                                                            <div className="card border-left-warning shadow h-100 py-4 mainPointer"  >
                                                                <div className="card-body mainPointer">
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col mr-2">
                                                                            <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                                                Purchase </div>
                                                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                                {this.state.taskingList.purchaseCnt}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            {
                                                                                this.state.taskingList.purchaseCnt > 0
                                                                                    ? <Spinner animation="grow" variant="danger" style={{ width: 15, height: 15 }} />
                                                                                    : <i className="fas fa-file fa-2x text-gray-300"></i>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                    <div className="col-xl-2 col-md-6 mb-4">
                                        <div className="card border-left-warning shadow h-100 py-4 mainPointer" onClick={() => {
                                            this.onClickTaskingList("ExternalTraining")
                                        }}>
                                            <div className="card-body mainPointer">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                            External Training</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            {this.state.taskingList.externalTrainingCnt}
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        {
                                                            this.state.taskingList.externalTrainingCnt > 0
                                                                ? <Spinner animation="grow" variant="danger" style={{ width: 15, height: 15 }} />
                                                                : <i className="fas fa-file fa-2x text-gray-300"></i>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-2 col-md-6 mb-4">
                                        <div className="card border-left-warning shadow h-100 py-4 mainPointer" onClick={() => {
                                            this.onClickTaskingList("Travel")
                                        }}>
                                            <div className="card-body mainPointer">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                            Travel Request</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            {this.state.taskingList.travelCnt}
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        {
                                                            this.state.taskingList.travelCnt > 0
                                                                ? <Spinner animation="grow" variant="danger" style={{ width: 15, height: 15 }} />
                                                                : <i className="fas fa-file fa-2x text-gray-300"></i>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </Row>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-12 mb-4">
                        <div className="card shadow mb-6">
                            <div className="card-header py-3 announce03" onClick={this.viewMobile2.bind(this)}>
                                <h6 className="m-0 font-weight-bold text-light">■ Schedule</h6>
                            </div>
                            <div className="card-body" style={{ padding: 0 }}

                            >
                                <Card>
                                    <Card.Body style={{ padding: 0 }}>
                                        <div className="ag-theme-material"
                                            style={{ height: 350 }}
                                        >
                                            <AgGridReact headerHeight={45} rowHeight={45}
                                                columnDefs={this.state.scheduleGrid.columnDefs}
                                                defaultColDef={this.state.scheduleGrid.defaultColDef}
                                                rowData={this.state.scheduleGrid.rowData}
                                            // rowSelection="multiple" // single
                                            // onGridReady={params => this.gridApi = params.api}
                                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Role Program Modal */}
            <Modal show={this.state.taskingList.modalShow} backdrop="static" size="xl">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        {/* <Button variant="success" onClick={this.saveDate.bind(this)} >Save</Button>{' '} */}
                        <Button variant="secondary" onClick={function () {
                            this.setState({
                                taskingList: {
                                    ...this.state.taskingList,
                                    modalComponent: null,
                                    modalShow: false
                                }
                            })
                            this.getMainApprovalData();
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {this.state.taskingList.modalComponent}
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
)(MainPage)
