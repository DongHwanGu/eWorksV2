import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import GDHApprovalSelectOption from '../../common/approval/GDHApprovalSelectOption';

class CbTimeSheetDepartment extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,
        startDt: new Date(),
        endDt: new Date(),
        statusCd: "01",
        retirementYn: "N",

        deptCd1: 0,
        deptCd2: 0,
        deptCd3: 0,
        deptList1: [],
        deptList2: [],
        deptList3: [],

        masterGrid: {
            columnDefs:
                [
                    { headerName: '유저명', field: 'userNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: '직급', field: 'dutyCdKorNm', minWidth: 100 },
                    { headerName: '부서', field: 'deptFullNm', minWidth: 150 },
                    { headerName: '출근', field: 'comStartDtNm', minWidth: 150 },
                    { headerName: '퇴근', field: 'comEndDtNm', minWidth: 150 },
                    { headerName: '휴가', field: 'leaveTypeCdNm', minWidth: 100 },
                    { headerName: '주당근로시간', field: 'weeklyWorkTime', minWidth: 130 },
                    { headerName: '실근무시간', field: 'monthWorkTime', minWidth: 130 },
                    { headerName: '연장근무시간', field: 'fnMonthOverTime', minWidth: 130 },
                    { headerName: '야간근무시간', field: 'fnMonthNightTime', minWidth: 130 },
                    { headerName: '약정휴일시간', field: 'fnMonthVacationTime', minWidth: 130 },
                    { headerName: '임금산출시간', field: 'fnMonthTotalTime', minWidth: 130 },
                    { headerName: '휴일특근시간', field: 'monthHolidayWrokTime', minWidth: 130 },
                    { headerName: '초과근무시간', field: 'fnMonthExcessOverTime', minWidth: 130 },
                    { headerName: 'Off Time', field: 'fnMonthOffTime', minWidth: 100 },
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
        hrExcelGrid: {
            columnDefs:
                [
                    { headerName: '유저명', field: 'userNm', minWidth: 100 },
                    { headerName: '부서', field: 'deptCd3Nm', minWidth: 100 },
                    { headerName: 'HI', field: 'hiTime', minWidth: 100 },
                    { headerName: 'MS/Tank', field: 'msTankTime', minWidth: 100 },
                    { headerName: 'IRT', field: 'irtTime', minWidth: 100 },
                    { headerName: 'AA', field: 'aaTime', minWidth: 100 },
                    { headerName: 'Agri', field: 'agriTime', minWidth: 100 },
                    { headerName: 'Min', field: 'minTim', minWidth: 100 },
                    { headerName: 'RoHs', field: 'rohsTime', minWidth: 100 },
                    { headerName: '실근로시간', field: 'fnMonthWorkTime', minWidth: 100 },
                    { headerName: '야간근무시간', field: 'fnMonthNightTime', minWidth: 100 },
                    { headerName: '임금산출시간', field: 'fnMonthTotalTime', minWidth: 100 },
                    { headerName: '초과근무시간', field: 'fnMonthExcessOverTime', minWidth: 100 },
                    { headerName: '휴일근무시간', field: 'monthHolidayWrokTime', minWidth: 100 },
                    
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
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
            params: {
                deptId: 0
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                deptList1: data, deptList2: [], deptList3: []
            }, () => {
                this.setState({
                    deptCd1: this.props.storeState.userInfo.deptCd1
                })
            });
        }).then(r => {
            ///////////////////////////////////////////////////////////////////////////////
            axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                params: {
                    deptId: this.props.storeState.userInfo.deptCd1
                }
            }).then(r => {
                var data = r.data;
                this.setState({
                    deptList2: data, deptList3: []
                }, () => {
                    this.setState({
                        deptCd2: this.props.storeState.userInfo.deptCd2
                    })
                });
            }).then(r => {
                /////////////////////////////////////////////////////////////////////////////
                axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                    params: {
                        deptId: this.props.storeState.userInfo.deptCd2
                    }
                }).then(r => {
                    var data = r.data;
                    this.setState({
                        deptList3: data
                    }, () => {
                        this.setState({
                            deptCd3: this.props.storeState.userInfo.deptCd3
                        })
                    });
                }).then(r => {
                    // 초반조회
                    this.getCbTimeSheetDepartmentList();
                }).catch(function (error) {
                    alert(error);
                });
            }).catch(function (error) {
                alert(error);
            });
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 엑셀 다운    */
    /*==========================================================*/
    getResponseExcelDownload() {
        var rows = this.gridApi.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        var _strUserId = '';

        for (const row of rows) {
            _strUserId += row.userId + ',';
        }

        this.props.onIsLoadingTrue();
        axios({
            method: 'GET',
            url: this.props.storeState.serviceUrl + "/CbTimeSheetService/GetResponseExcelDownload",                 
            responseType: 'blob', // 가장 중요함,
            params: {
                clickDt: this.props.storeState.getParsedDate(this.state.startDt),
                strUserId: _strUserId
            }
        })    
        .then(response =>{        
            this.props.onIsLoadingFalse();
            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'TimeSheetExcel.xlsx');
            document.body.appendChild(link);
            link.click();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* HR 엑셀 다운    */
    /*==========================================================*/
    async getResponseHRExcelDownload(_strUserId) {
        const r = await axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetResponseHRExcelDownload", {
            params: {
                clickDt: this.props.storeState.getParsedDate(this.state.startDt),
                userId: _strUserId
            },
        }).then(r => {
            var data = r.data;
            return data;
        }).catch(function (error) {
            alert(error);
        });

        return r;
    }
    async getHRExcelDownload() {
        var rows = this.gridApi.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        var _strUserId = '';
        var _rowData = [];

        this.props.onIsLoadingTrue();
        for (const row of rows) {
            _strUserId = row.userId;
            var res = await this.getResponseHRExcelDownload(_strUserId);
            _rowData.push(res);
        }
        this.props.onIsLoadingFalse();

        this.setState({
            hrExcelGrid: { ...this.state.hrExcelGrid, rowData: _rowData }
        }, () => {
            this.gridHrExcelApi.exportDataAsCsv({
                fileName: 'TimeSheetHrExcel'
            });
        })
    }

    /*==========================================================*/
    /* List    */
    /*==========================================================*/
    getCbTimeSheetDepartmentList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetCbTimeSheetDepartmentList", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                retirementYn: this.state.retirementYn,
                deptCd1: this.state.deptCd1,                
                deptCd2: this.state.deptCd2,                
                deptCd3: this.state.deptCd3,                
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
    /* Dept 1 List    */
    /*==========================================================*/
    getDeptListOptions(name, deptId, gb) {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
            params: {
                deptId: Number(deptId)
            }
        }).then(r => {
            var data = r.data;
            if (name === 'deptCd1') {
                if (deptId === 0) {
                    this.setState({
                        deptList1: data, deptList2: [], deptList3: []
                    });
                } else {
                    this.setState({
                        deptList2: data, deptList3: []
                    });
                }
            }
            if (name === 'deptCd2') {
                this.setState({
                    deptList3: data
                });
            }
        }).catch(function (error) {
            alert(error);
        });
    }

    // 그리드 더블클릭
    onRowDoubleClicked(e) {
        this.props.deptGridDoubleClicked(e.data);
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
    onDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            [e.target.name]: eValue
        });
        this.getDeptListOptions(e.target.name, eValue);
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Date</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.startDt} onDateChange={this.onDateChange.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Retirement Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="retirementYn"
                                        value={this.state.retirementYn}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <option value="N">N</option>
                                        <option value="Y">Y</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Dept Cd1</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd1"
                                        value={this.state.deptCd1} onChange={this.onDeptChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"ALL"}</option>
                                        {
                                            this.state.deptList1.map((item, i) => {
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
                                    <Form.Label>■ Dept Cd2</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd2"
                                        value={this.state.deptCd2} onChange={this.onDeptChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"ALL"}</option>
                                        {
                                            this.state.deptList2.map((item, i) => {
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
                                    <Form.Label>■ Dept Cd3</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd3"
                                        value={this.state.deptCd3} onChange={this.onDeptChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"ALL"}</option>
                                        {
                                            this.state.deptList3.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="info" onClick={this.getHRExcelDownload.bind(this)} >HR Download</Button>{' '}
                                <Button variant="info" onClick={this.getResponseExcelDownload.bind(this)} >Excel Download</Button>{' '}
                                <Button variant="primary" onClick={this.getCbTimeSheetDepartmentList.bind(this)}>Search</Button>
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
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />

                        <AgGridReact headerHeight={45} rowHeight={45} className="hidden"
                            columnDefs={this.state.hrExcelGrid.columnDefs}
                            defaultColDef={this.state.hrExcelGrid.defaultColDef}
                            rowData={this.state.hrExcelGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridHrExcelApi = params.api}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>
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
)(CbTimeSheetDepartment)
