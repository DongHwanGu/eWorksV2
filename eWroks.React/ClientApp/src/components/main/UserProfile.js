import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Image } from 'react-bootstrap';
import GDHDatepicker from '../common/controls/GDHDatepicker';


class UserProfile extends Component {
    state = {
        modalDelegate: false,
        cmUserDelegateApprovalDto: {
            deleId: 0,
            userId: '',
            deleApprUserId: '',
            deleReason: '',
            startDt: new Date(),
            endDt: new Date(),
            useYn: 'Y',
            regId: '',
            updId: '',

            deleApprUserIdNm: '',
        },
        deleGrid: {
            columnDefs:
                [
                    { headerName: 'Name', field: 'deleApprUserIdNm', minWidth: 100 },
                    { headerName: 'Start Dt', field: 'startDtNm', minWidth: 100 },
                    { headerName: 'End Dt', field: 'endDtNm', minWidth: 100 },
                    { headerName: 'Reason', field: 'deleReason', minWidth: 200 },
                    {
                        headerName: 'Delete', field: 'btnDelete', minWidth: 100,
                        cellRendererFramework: (params) => 
                        {
                            var deleId = params.data.deleId;
                            return (
                                <button style={{ width: 50, border: 'none' }} onClick={function (e) {
                                    this.deleteDelegateData(deleId);
                                }.bind(this)}>X</button>
                            )
                        }
                            
                    },
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
        modalDeleGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100 },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 100 },
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
        itAcountQnA: {
              qnAId: 0
            , qnADesc: ''
            , statusCd: '01'
            , remark: ''
            , regId: ''
            , updId: ''

            , updDtNm: ''
        },
        applicationGrid: {
            columnDefs:
                [
                    { headerName: 'App Type', field: 'assetsNm', minWidth: 100 },
                    { headerName: 'App Nm', field: 'itemNm', minWidth: 100 },
                    { headerName: 'Stock Yn', field: 'stockYn', minWidth: 100 },
                    { headerName: 'Use Cnt', field: 'useItemCnt', minWidth: 100 },
                    { headerName: 'Reg Cnt', field: 'itemCnt', minWidth: 100 },
                    { headerName: 'Remainder Cnt', field: 'reCnt', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
        softwareGrid: {
            columnDefs:
                [
                    { headerName: 'HW Host Nm', field: 'pHostNm', minWidth: 100 },
                    { headerName: 'SW Type', field: 'cAssetsNm', minWidth: 100 },
                    { headerName: 'SW Nm', field: 'cItemNm', minWidth: 100 },
                    { headerName: 'Stock Yn', field: 'cStockYn', minWidth: 100 },
                    { headerName: 'Use Cnt', field: 'cUseItemCnt', minWidth: 100 },
                    { headerName: 'Reg Cnt', field: 'cItemCnt', minWidth: 100 },
                    { headerName: 'Re Cnt', field: 'cReCnt', minWidth: 100 },
                    { headerName: 'Remark', field: 'cRemark', minWidth: 100 },
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
        hardwareGrid: {
            columnDefs:
                [
                    { headerName: 'HW Type', field: 'assetsNm', minWidth: 100 },
                    { headerName: 'Host Nm', field: 'hostNm', minWidth: 100 },
                    { headerName: 'Control No', field: 'controlNo', minWidth: 100 },
                    { headerName: 'Model', field: 'itemNm', minWidth: 100 },
                    { headerName: 'Serial No', field: 'serialNo', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
        networkGrid: {
            columnDefs:
                [
                    { headerName: 'Net Type', field: 'assetsNm', minWidth: 100 },
                    { headerName: 'Net Nm', field: 'itemNm', minWidth: 100 },
                    {
                        headerName: 'Status', field: 'itemStatus', minWidth: 100,
                        cellRendererFramework: (params) => {
                            var index = params.rowIndex;
                            return (
                                <select value={this.state.networkGrid.rowData[index].itemStatus} disabled>
                                    <option value="01">Full Ctrl</option>
                                    <option value="02">Read Only</option>
                                </select>
                            )
                        }
                    },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
    }

    /*==========================================================*/
    /* 페이지 로드    */
    /*==========================================================*/
    componentDidMount() {
        this.getDelegateList();
        this.getAssetsList();

        // QnA
        this.getQnAData();
    }

    /*==========================================================*/
    /* QnA 정보    */
    /*==========================================================*/
    getQnAData() {
         axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + "GetQnAData", {
            params: {
                userId: this.props.storeState.userInfo.userId, 
            }
        }).then(r => {
            var data = r.data;
            if(data === '') return;
            this.setState({ 
                itAcountQnA: {
                    ...this.state.itAcountQnA,
                    qnAId: data.qnAId,
                    qnADesc: data.qnADesc,
                    statusCd: data.statusCd,
                    updDtNm: data.updDtNm,
                }
            });
        }).catch(function (error) {
            alert(error);
        });
    }
      /*==========================================================*/
    /* QnA 저장    */
    /*==========================================================*/
    saveQnAData() {
        var gParam = { ...this.state.itAcountQnA };
        gParam.qnAId= Number(this.state.itAcountQnA.qnAId);
        gParam.regId= this.props.storeState.userInfo.userId;
        gParam.updId= this.props.storeState.userInfo.userId;

        axios.post(this.props.storeState.serviceUrl + "/ItAcountAssetsService/SaveQnAData", 
            gParam
        ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getQnAData();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Assets 정보    */
    /*==========================================================*/
    getAssetsList() {
        // Application
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + "GetAcountAssetsList", {
            params: {
                userId: this.props.storeState.userInfo.userId, 
                assetsGb: "01"
            }
        }).then(r => {
            var data = r.data;
            this.setState({ 
                applicationGrid: { 
                    ...this.state.applicationGrid, 
                    rowData: data,
                }
            });
        }).catch(function (error) {
            alert(error);
        });
        // Hardware
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + "GetAcountAssetsList", {
            params: {
                userId: this.props.storeState.userInfo.userId, 
                assetsGb: "03"
            }
        }).then(r => {
            var data = r.data;
            this.setState({ 
                hardwareGrid: { 
                    ...this.state.hardwareGrid, 
                    rowData: data,
                }
            });
        }).catch(function (error) {
            alert(error);
        });
        // Network
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + "GetAcountAssetsList", {
            params: {
                userId: this.props.storeState.userInfo.userId, 
                assetsGb: "04"
            }
        }).then(r => {
            var data = r.data;
            this.setState({ 
                networkGrid: { 
                    ...this.state.networkGrid, 
                    rowData: data,
                }
            });
        }).catch(function (error) {
            alert(error);
        });
        // Software
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + "GetAcountAssetsToAssetsList", {
            params: {
                userId: this.props.storeState.userInfo.userId, 
                assetsGb: "02"
            }
        }).then(r => {
            var data = r.data;
            this.setState({ 
                softwareGrid: { 
                    ...this.state.softwareGrid, 
                    rowData: data,
                }
            });
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 대리자 삭제    */
    /*==========================================================*/
    deleteDelegateData(id) {
        axios.post(this.props.storeState.serviceUrl + "/CommonService/DeleteDelegateData", {},
        {
            params: {
                deleId: id
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getDelegateList();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 대리자 그리드 클릭    */
    /*==========================================================*/
    onRowClickedDele(e) {
        var selectUserId = e.data.userId;
        var selectUserNm = e.data.userNm;

        this.setState({
            cmUserDelegateApprovalDto : {
                ...this.state.cmUserDelegateApprovalDto,
                userId: this.props.storeState.userInfo.userId,
                deleApprUserId : selectUserId,
                deleApprUserIdNm : selectUserNm,
            }
        })
    }
    /*==========================================================*/
    /* 대리자 저장    */
    /*==========================================================*/
    saveDelegateData() {
        // 저장전 날짜 확인
        var tStartDt = this.props.storeState.getParsedDate(this.state.cmUserDelegateApprovalDto.startDt, "");
        var tEndDt = this.props.storeState.getParsedDate(this.state.cmUserDelegateApprovalDto.endDt, "");
        
        if (tStartDt > tEndDt)
        {
            alert('종료일은 시작일보다 작을 수 없습니다.');
            return;
        }

        if (this.state.cmUserDelegateApprovalDto.deleApprUserId === '')
        {
            alert('대리자를 선택해 주세요.');
            return;
        }
        if (this.state.cmUserDelegateApprovalDto.deleReason === '')
        {
            alert('사유를 작성해 주세요.');
            return;
        }
         // 마스터 설정
         var gParam = {
            ...this.state.cmUserDelegateApprovalDto,
            startDt: tStartDt,
            endDt: tEndDt,
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }
        axios.post(this.props.storeState.serviceUrl + "/CommonService/SaveDelegateData",
        gParam)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalDelegate: false
                })
                this.getDelegateList();
            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* 대리자 조회    */
    /*==========================================================*/
    getDelegateList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CommonService/GetDelegateList", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                deleGrid: { ...this.state.deleGrid, rowData: data, rowCount: data.length }
            }, () => {
                this.props.onIsLoadingFalse();
            });
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
    /* 대리자 추가    */
    /*==========================================================*/
    onDelegateAdd() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserList", {
            params: {
                it_status_cd: "",
                hr_status_cd: "01"
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                modalDelegate: true,
                cmUserDelegateApprovalDto: {
                    ...this.state.cmUserDelegateApprovalDto,
                    deleId: 0,
                    userId: '',
                    deleApprUserId: '',
                    deleReason: '',
                    startDt: new Date(),
                    endDt: new Date(),
                    useYn: 'Y',
                    regId: '',
                    updId: '',
        
                    deleApprUserIdNm: '',
                },
                modalDeleGrid: { ...this.state.modalDeleGrid, rowData: data, rowCount: data.length }
            }, () => {
                this.props.onIsLoadingFalse();
            });
        }).catch(function (error) { 
            alert(error); 
        });

    }
     // 체인지 공통
     onChangeHandler(e) {
         this.setState({
             cmUserDelegateApprovalDto: {
                 ...this.state.cmUserDelegateApprovalDto,
                 [e.target.name]: e.target.value
             }
        });
    }
    onDateChangeHandler(name, date) {
        this.setState({
            cmUserDelegateApprovalDto: {
                ...this.state.cmUserDelegateApprovalDto,
                [name]: date
            }
        });
        if (name === 'startDt')
        {
            this.setState({
                cmUserDelegateApprovalDto: {
                    ...this.state.cmUserDelegateApprovalDto,
                    endDt: date
                }
            });
        }
    }
    // QnA
    onChangeQnAHandler(e) {
        this.setState({
            itAcountQnA: {
                ...this.state.itAcountQnA,
                [e.target.name]: e.target.value
            }
        });
    }
    render() {
        return (<>
            <div className="col-md-12" style={{ margin: 0, padding: 0 }}>
                <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-base font-weight-bold text-warning text-uppercase mb-4">
                                    My Info</div>
                                <div  className="table-responsive">
                                    <Table bordered style={{ tableLayout: 'fixed' }}>
                                        <colgroup>
                                            <col style={{ width: 150 }} />
                                            <col style={{ width: 100 }} />
                                            <col style={{ width: 150 }} />
                                            <col style={{ width: 100 }} />
                                            <col style={{ width: 150 }} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td rowSpan={10} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <Image src={ this.props.storeState.userInfo.userPic } rounded style={{ height: 160 }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>User Nm</td>
                                                <td>{this.props.storeState.userInfo.userNm}</td>
                                                <td style={{ backgroundColor: '#eee' }}>User ENm</td>
                                                <td>{this.props.storeState.userInfo.userEnm}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Login Id</td>
                                                <td>{this.props.storeState.userInfo.loginId}</td>
                                                <td style={{ backgroundColor: '#eee' }}>Password</td>
                                                <td>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>AD/Email</td>
                                                <td>{this.props.storeState.userInfo.email}</td>
                                                <td style={{ backgroundColor: '#eee' }}>Office Code</td>
                                                <td>{this.props.storeState.userInfo.officeId}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Tel</td>
                                                <td>{this.props.storeState.userInfo.tel}</td>
                                                <td style={{ backgroundColor: '#eee' }}>Mobile</td>
                                                <td>{this.props.storeState.userInfo.mobileTel}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Employee No.</td>
                                                <td>{this.props.storeState.userInfo.workerId}</td>
                                                <td style={{ backgroundColor: '#eee' }}>Birth Dt</td>
                                                <td>{this.props.storeState.userInfo.birthDay}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Total Annual Leave</td>
                                                <td>{this.props.storeState.userInfo.orgLeaveCnt}</td>
                                                <td style={{ backgroundColor: '#eee' }}>Leave Cnt</td>
                                                <td>{this.props.storeState.userInfo.preLeaveCnt}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Position En</td>
                                                <td>{this.props.storeState.userInfo.dutyCdKorNm}</td>
                                                <td style={{ backgroundColor: '#eee' }}>Position Kr</td>
                                                <td>{this.props.storeState.userInfo.dutyCdKorNm}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Division</td>
                                                <td colSpan={3}>{this.props.storeState.userInfo.deptFullNm}</td>
                                                {/* <td style={{ backgroundColor: '#eee' }}>Date of entrance</td>
                                                <td>{this.props.storeState.userInfo.enterDt}</td> */}
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#eee' }}>Addr</td>
                                                <td colSpan={3}>{this.props.storeState.userInfo.addressKor}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="col-md-12" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-sm font-weight-bold text-success text-uppercase mb-4">
                                    Delegate approver</div>

                                <div className="col-md-12 text-right" style={{ marginBottom: 5 }}>
                                    <Button variant="outline-info" id="btnDelegate" onClick={this.onDelegateAdd.bind(this)}>Add</Button>
                                </div>
                                <div className="ag-theme-material"
                                    style={{ height: 200, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.deleGrid.columnDefs}
                                        defaultColDef={this.state.deleGrid.defaultColDef}
                                        rowData={this.state.deleGrid.rowData}
                                        // rowSelection="multiple" // single
                                        rowHeight={35}
                                        // onGridReady={params => this.gridApi = params.api}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                <div className="card border-left-danger shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-sm font-weight-bold text-danger text-uppercase mb-4">
                                    Allocation Info</div>
                                <Table bordered>
                                    <colgroup>
                                        <col style={{width: '70%'}} />
                                        <col style={{width: '10%'}} />
                                        <col style={{width: '20%'}} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Control type="text" size="sm"
                                                    name="qnADesc"
                                                    value={this.state.itAcountQnA.qnADesc} onChange={this.onChangeQnAHandler.bind(this)}
                                                    style={{ border: 0, borderBottom: '2px solid #ddd' }}
                                                />
                                            </td>
                                            <td>
                                                <Button variant="outline-success" onClick={this.saveQnAData.bind(this)}>Request</Button>
                                            </td>
                                            <td>
                                                <Form.Label style={{ fontSize: 14, marginTop: 7 }}>
                                                    {this.state.itAcountQnA.updDtNm}
                                                </Form.Label>
                                                
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <div className="text-sm font-weight-bold text-danger text-uppercase mb-4">
                                    Application</div>

                                <div className="ag-theme-material"
                                    style={{ height: 200, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.applicationGrid.columnDefs}
                                        defaultColDef={this.state.applicationGrid.defaultColDef}
                                        rowData={this.state.applicationGrid.rowData}
                                        // rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>

                                <div className="text-sm font-weight-bold text-danger text-uppercase mb-4" style={{ marginTop: 15 }}>
                                    HardWare</div>

                                <div className="ag-theme-material"
                                    style={{ height: 200, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.hardwareGrid.columnDefs}
                                        defaultColDef={this.state.hardwareGrid.defaultColDef}
                                        rowData={this.state.hardwareGrid.rowData}
                                        // rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>

                                <div className="text-sm font-weight-bold text-danger text-uppercase mb-4" style={{ marginTop: 15 }}>
                                    SoftWare</div>

                                <div className="ag-theme-material"
                                    style={{ height: 200, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.softwareGrid.columnDefs}
                                        defaultColDef={this.state.softwareGrid.defaultColDef}
                                        rowData={this.state.softwareGrid.rowData}
                                        // rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>

                                <div className="text-sm font-weight-bold text-danger text-uppercase mb-4" style={{ marginTop: 15 }}>
                                    Network</div>

                                <div className="ag-theme-material"
                                    style={{ height: 200, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.networkGrid.columnDefs}
                                        defaultColDef={this.state.networkGrid.defaultColDef}
                                        rowData={this.state.networkGrid.rowData}
                                        // rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Role Program Modal */}
            <Modal show={this.state.modalDelegate} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveDelegateData.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            setTimeout(function () { //Start the timer
                                this.setState({ modalDelegate: false })
                            }.bind(this), 300)
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="ag-theme-material"
                            style={{ height: 200, borderTop: '2px solid #695405' }}
                        >
                            <AgGridReact headerHeight={45} rowHeight={45}
                                columnDefs={this.state.modalDeleGrid.columnDefs}
                                defaultColDef={this.state.modalDeleGrid.defaultColDef}
                                rowData={this.state.modalDeleGrid.rowData}
                            // rowSelection="multiple" // single
                            // rowHeight={35}
                            onGridReady={params => this.gridApiModalDele = params.api}
                            onRowClicked={this.onRowClickedDele.bind(this)}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                            />
                        </div>
                        <Form.Row style={{ marginTop: 15 }}>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Select User</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="deleApprUserIdNm"
                                        value={this.state.cmUserDelegateApprovalDto.deleApprUserIdNm} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Start Dt</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.cmUserDelegateApprovalDto.startDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ End Dt</Form.Label>
                                    <GDHDatepicker
                                        name='endDt'
                                        value={this.state.cmUserDelegateApprovalDto.endDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Reason</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="deleReason"
                                        value={this.state.cmUserDelegateApprovalDto.deleReason} onChange={this.onChangeHandler.bind(this)}
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
)(UserProfile)
