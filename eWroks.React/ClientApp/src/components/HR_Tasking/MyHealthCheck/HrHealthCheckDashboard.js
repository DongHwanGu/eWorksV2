import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class HrHealthCheckDashboard extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setHours(new Date().getHours() - 336)),
        endDt: new Date(),
        deptCd1: 0,
        deptCd2: 0,
        deptCd3: 0,
        deptList1: [],
        deptList2: [],
        deptList3: [],
        surveyYn: '',

        modalUserShow: false,

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Date', field: 'toDate', minWidth: 100 },
                    { 
                        headerName: '35 °C', field: 'col35', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 35) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col35}
                                    </span>
                                </div>
                            )
                        }
                    },
                    { 
                        headerName: '35.5 °C', field: 'col35Dot', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 35.5) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col35Dot}
                                    </span>
                                </div>
                            )
                        }
                    },
                    { 
                        headerName: '36 °C', field: 'col36', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 36) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col36}
                                    </span>
                                </div>
                            )
                        } 
                    },
                    { 
                        headerName: '36.5 °C', field: 'col36Dot', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 36.5) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col36Dot}
                                    </span>
                                </div>
                            )
                        }
                    },
                    { 
                        headerName: '37 °C', field: 'col37', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 37) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col37}
                                    </span>
                                </div>
                            )
                        } 
                    },
                    { 
                        headerName: '37.5 °C', field: 'col37Dot', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 37.5) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col37Dot}
                                    </span>
                                </div>
                            )
                        } 
                    },
                    { 
                        headerName: '38 °C', field: 'col38', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 38) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col38}
                                    </span>
                                </div>
                            )
                        }
                    },
                    { 
                        headerName: '38.5 °C', field: 'col38Dot', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 38.5) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col38Dot}
                                    </span>
                                </div>
                            )
                        } 
                    },
                    { 
                        headerName: '39 °C', field: 'col39', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 39) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.col39}
                                    </span>
                                </div>
                            )
                        } 
                    },
                    { 
                        headerName: 'Total', field: 'userTotal', minWidth: 100,
                        cellRendererFramework: (params) => {
                            return (
                                <div style={{ width: '100%', textAlign: 'center' }} onClick={(e) => { this.getModalUserList(params.data.toDate, 0) }}>
                                    <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                        {params.data.userTotal}
                                    </span>
                                </div>
                            )
                        } 
                    },
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


        modalGrid: {
            columnDefs:
                [
                    { headerName: 'DeptFullNm', field: 'deptFullNm', minWidth: 100 },
                    { headerName: 'User Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Temperature', field: 'temperatureVal', minWidth: 100 },
                    { headerName: 'Symptoms', field: 'symptomCdNm', minWidth: 300 },
                    
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
        this.getResponseHrHealCheckDashboardList();
        this.getDeptListOptions('deptCd1', 0);
    }
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getResponseHrHealCheckDashboardList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrHealthCheckService/GetResponseHrHealCheckDashboardList", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                endDt: this.props.storeState.getParsedDate(this.state.endDt),
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
    /* Modal UserList    */
    /*==========================================================*/
    getModalUserList(date, val) {
        this.getResponseHrHealCheckDashboardList();
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrHealthCheckService/GetModalUserList", {
            params: {
                clickDt: this.props.storeState.getParsedDate(date),
                clickVal: val,
                deptCd1: this.state.deptCd1,                
                deptCd2: this.state.deptCd2,                
                deptCd3: this.state.deptCd3,                
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalUserShow: true,
                modalGrid: { ...this.state.modalGrid, rowData: data }
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
                                                        name='startDt'
                                                        value={this.state.startDt} onDateChange={this.onDateChange.bind(this)}
                                                    />
                                                </td>
                                                <td>{'~'}</td>
                                                <td>
                                                    <GDHDatepicker
                                                        name='endDt'
                                                        value={this.state.endDt} onDateChange={this.onDateChange.bind(this)}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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
                                <Button variant="primary" onClick={this.getResponseHrHealCheckDashboardList.bind(this)}>Search</Button>
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
                            // onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>

            {/* Modal */}
            <Modal show={this.state.modalUserShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalUserShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 400, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.modalGrid.columnDefs}
                            defaultColDef={this.state.modalGrid.defaultColDef}
                            rowData={this.state.modalGrid.rowData}
                            rowSelection="multiple" // single
                            // onGridReady={params => this.gridApi = params.api}
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
)(HrHealthCheckDashboard)
