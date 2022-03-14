import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';



import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import OvertimeWorkDetail from './OvertimeWorkDetail';


class OvertimeWorkStatistics extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),
        hrStatusCd: "",
        useOvertimeYn: "",
        deptCd1: 0,
        deptCd2: 0,
        deptCd3: 0,
        deptList1: [],
        deptList2: [],
        deptList3: [],

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100 },
                    { headerName: 'Position', field: 'deptCdKorNm', minWidth: 100 },
                    { headerName: 'HR Status', field: 'hR_StatusCdNm', minWidth: 100 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 200 },
                    { headerName: 'Total Cnt', field: 'totalCnt', minWidth: 100 },
                    { headerName: 'Total Time', field: 'totalTime', minWidth: 100 },
                    { headerName: 'Reject Cnt', field: 'rejectCnt', minWidth: 100 },
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

    }
     /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    async componentDidMount() {
        await this.getDeptListOptions('deptCd1', 0);
        await this.getDeptListOptions('deptCd1', this.props.storeState.userInfo.deptCd1);
        await this.getDeptListOptions('deptCd2', this.props.storeState.userInfo.deptCd2);
        
        this.setState({
            deptCd1: this.props.storeState.userInfo.deptCd1,
            deptCd2: this.props.storeState.userInfo.deptCd2,
            deptCd3: this.props.storeState.userInfo.deptCd3,
        }, () => {
            this.getTaskingOvertimeWorkStatistics();
        })

        
    }
    /*==========================================================*/
    /* Dept 1 List    */
    /*==========================================================*/
    async getDeptListOptions(name, deptId, gb) {
       await axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
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
    /* 마스터 리스트    */
    /*==========================================================*/
    getTaskingOvertimeWorkStatistics() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetTaskingOvertimeWorkStatistics", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                endDt: this.props.storeState.getParsedDate(this.state.endDt),
                useOvertimeYn: this.state.useOvertimeYn,
                hrStatusCd: this.state.hrStatusCd,
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
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].otId;

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
            <Card style={{ marginTop: 15 }}>
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
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Used Overtime Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useOvertimeYn"
                                        value={this.state.useOvertimeYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={""}>{"ALL"}</option>
                                        <option key={0} value={"Y"}>{"Y"}</option>
                                        <option key={1} value={"N"}>{"N"}</option>

                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ HR_Status Cd</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="hrStatusCd"
                                        value={this.state.hrStatusCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0032" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
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
                                        disabled={true}
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
                                        disabled={true}
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
                                        disabled={true}
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
                                <Button variant="primary" onClick={this.getTaskingOvertimeWorkStatistics.bind(this)}>Search</Button>
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
)(OvertimeWorkStatistics)
