import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import HrHealthCheckDetail from './HrHealthCheckDetail';
import HrHealthCheckDashboard from './HrHealthCheckDashboard';

class HrHealthCheckList extends Component {
    getDetailPage(data) {
        return (
            <HrHealthCheckDetail id={data}  />
        )
    }
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(),
        endDt: new Date(),
        deptCd1: 0,
        deptCd2: 0,
        deptCd3: 0,
        deptList1: [],
        deptList2: [],
        deptList3: [],
        surveyYn: '',

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Dept1', field: 'deptCd1Nm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Dept2', field: 'deptCd2Nm', minWidth: 150 },
                    { headerName: 'Dept3', field: 'deptCd3Nm', minWidth: 150 },
                    { headerName: 'Dept4', field: 'deptCd4Nm', minWidth: 150 },
                    { headerName: 'User', field: 'regIdNm', minWidth: 150 },
                    { headerName: 'Temperature', field: 'temperatureVal', minWidth: 150 },
                    { headerName: 'Symptoms', field: 'symptomCdNm', minWidth: 1000 },
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
                    { headerName: '이름', field: 'regIdNm', minWidth: 100 },
                    { headerName: '부서1', field: 'deptCd1Nm', minWidth: 100 },
                    { headerName: '부서2', field: 'deptCd2Nm', minWidth: 100 },
                    { headerName: '부서3', field: 'deptCd3Nm', minWidth: 100 },
                    { headerName: '부서4', field: 'deptCd4Nm', minWidth: 100 },
                    { headerName: '체온', field: 'temperatureVal', minWidth: 100 },
                    { headerName: '증상', field: 'symptomCdNm', minWidth: 100 },
                    { headerName: '확진자와 접촉한 적', field: 'confirmerContactCdNm', minWidth: 100 },
                    { headerName: '확진자와 접촉한 적 - 지역', field: 'confirmerContactReason', minWidth: 100 },
                    { headerName: '본인 또는 동거인 자가격리여부', field: 'infectedCdNm', minWidth: 100 },
                    { headerName: '기타', field: 'etcReason', minWidth: 100 },
                    
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
        this.getResponseHrHealCheckList();
        this.getDeptListOptions('deptCd1', 0);
    }
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getResponseHrHealCheckList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrHealthCheckService/GetResponseHrHealCheckList", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                surveyYn: this.state.surveyYn,
                deptCd1: this.state.deptCd1,                
                deptCd2: this.state.deptCd2,                
                deptCd3: this.state.deptCd3,                
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
    /* 엑셀 다운    */
    /*==========================================================*/
     async getResponseHrHealCheckExcelList(_strUserId) {
        const r = await axios.get(this.props.storeState.serviceUrl + "/HrHealthCheckService/GetResponseHrHealCheckExcelList", {
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
    async getExcelDownload() {
        var rows = this.gridApi.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        var _strUserId = '';
        var _rowData = [];

        this.props.onIsLoadingTrue();
        for (const row of rows) {
            _strUserId = row.regId;
            var res = await this.getResponseHrHealCheckExcelList(_strUserId);
            _rowData.push(res);
        }
        this.props.onIsLoadingFalse();

        this.setState({
            excelGrid: { ...this.state.excelGrid, rowData: _rowData }
        }, () => {
            this.gridExcelApi.exportDataAsCsv({
                fileName: 'UserHealCheck'
            });
        })
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
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].healthId;

        if (id === 0) return;

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
    onDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            [e.target.name]: eValue
        });
        this.getDeptListOptions(e.target.name, eValue);
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
                                                <GDHDatepicker
                                                    name='startDt'
                                                    value={this.state.startDt} onDateChange={this.onDateChange.bind(this)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Survey Yn</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="surveyYn"
                                                    value={this.state.surveyYn} onChange={this.onChangeHandler.bind(this)}
                                                >
                                                    <option key={-1} value={""}>{"ALL"}</option>
                                                    <option key={0} value={"Y"}>{"Y"}</option>
                                                    <option key={1} value={"N"}>{"N"}</option>
                                                    
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
                                            <Button variant="primary" onClick={this.getResponseHrHealCheckList.bind(this)}>Search</Button>{' '}
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
                                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />


                                    <AgGridReact headerHeight={45} rowHeight={45} className="hidden"
                                        columnDefs={this.state.excelGrid.columnDefs}
                                        defaultColDef={this.state.excelGrid.defaultColDef}
                                        rowData={this.state.excelGrid.rowData}
                                    // rowSelection="multiple" // single
                                    onGridReady={params => this.gridExcelApi = params.api}
                                    // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
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
                <Tab eventKey="dashboard" title="Dashboard">
                    <div style={{ marginTop: 15 }}>
                        <HrHealthCheckDashboard />
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
)(HrHealthCheckList)
