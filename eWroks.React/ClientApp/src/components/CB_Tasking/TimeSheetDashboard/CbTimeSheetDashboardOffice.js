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

class CbTimeSheetDashboardOffice extends Component {
    state = {
        deptCd3: 0,
        deptList3: [],
        overtimeYn: '',
        
        officeYear: new Date().getFullYear(),

        officeWeek: '',
        officeWeekList: [],
        
        masterGrid: {
            columnDefs:
                [
                    { headerName: '이름', field: 'userNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: '직급', field: 'dutyCdKorNm', minWidth: 100 },
                    { headerName: '부서', field: 'deptFullNm', minWidth: 150 },
                    { headerName: '지난주', field: 'agoWeekDt', minWidth: 160 },
                    { headerName: '근로시간', field: 'agoWeekWorkTimeNm', minWidth: 100 },
                    { headerName: '이번주', field: 'thisWeekDt', minWidth: 160 },
                    { headerName: '최종작성일', field: 'thisLastDt', minWidth: 100 },
                    { headerName: '근로시간', field: 'thisWeekWorksTimeNm', minWidth: 100 },
                    { headerName: '실근무시간', field: 'fnMonthWorkTime', minWidth: 100 },
                    { headerName: '연장근무시간', field: 'fnMonthOverTime', minWidth: 100 },
                    { headerName: '야간근무시간', field: 'fnMonthNightTime', minWidth: 100 },
                    { headerName: '약정휴일시간', field: 'fnMonthVacationTime', minWidth: 100 },
                    { headerName: '임금산출시간', field: 'fnMonthTotalTime', minWidth: 100 },
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

        excelGrid: {
            columnDefs:
                [
                    { headerName: '유저명', field: 'userNm', minWidth: 100 },
                    { headerName: '주간근로시간', field: 'thisWeekWorksTimeNm', minWidth: 100 },
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
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getDeptListOptions("deptCd2", 1001);
        this.getOfficeWeekList();
        // this.getDashboardOfficeList();
    }

    /*==========================================================*/
    /* 리스트 조회    */
    /*==========================================================*/
    getDashboardOfficeList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetDashboardOfficeList", {
            params: {
                deptCd3: this.state.deptCd3,
                overtimeYn: this.state.overtimeYn,
                officeYear: this.state.officeYear,
                officeWeek: this.state.officeWeek,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length },
                excelGrid: { ...this.state.excelGrid, rowData: [] }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* OfficeWeekList    */
    /*==========================================================*/
    getOfficeWeekList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetOfficeWeekList", {
            params: {
                year: this.state.officeYear
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                officeWeekList: data
            }, () => {
                this.setState({
                    officeWeek: data[0].strText.split('|')[1]
                })
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

    
    /*==========================================================*/
    /* Excel    */
    /*==========================================================*/
    async getExcelDownload() {
        var rows = this.gridApi.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var _rowData = [];

        this.props.onIsLoadingTrue();
        for (const row of rows) {
            _rowData.push(row);
        }
        this.props.onIsLoadingFalse();

        this.setState({
            excelGrid: { ...this.state.excelGrid, rowData: [] }
        }, () => {
            this.setState({
                excelGrid: { ...this.state.excelGrid, rowData: _rowData }
            }, () => {
                this.gridApiExcel.exportDataAsCsv({
                    fileName: 'UserListHr'
                });
            })
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
                                    <Form.Label>■ 사무소</Form.Label>
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
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 52시간초과</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="overtimeYn"
                                        value={this.state.overtimeYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="">ALL</option>
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ 주차</Form.Label>
                                    <table style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Form.Control as="select" size="sm"
                                                        name="overtimeYn"
                                                        value={this.state.officeYear} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <option value="2021">2021</option>
                                                        <option value="2022">2022</option>
                                                        <option value="2023">2023</option>
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                    </Form.Control>
                                                </td>
                                                <td>{'~'}</td>
                                                <td>
                                                    <Form.Control as="select" size="sm"
                                                        name="officeWeek"
                                                        value={this.state.officeWeek} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        {
                                                            this.state.officeWeekList.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.strValue}>{item.strText.split('|')[0]}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getDashboardOfficeList.bind(this)} >Search</Button>{' '}
                                <Button variant="info" onClick={ this.getExcelDownload.bind(this)}>Excel Download</Button>
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

                        <AgGridReact headerHeight={45} rowHeight={45} className='hidden'
                            columnDefs={this.state.excelGrid.columnDefs}
                            defaultColDef={this.state.excelGrid.defaultColDef}
                            rowData={this.state.excelGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiExcel = params.api}
                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
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
)(CbTimeSheetDashboardOffice)
