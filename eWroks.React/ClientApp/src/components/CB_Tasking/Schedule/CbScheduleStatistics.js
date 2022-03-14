import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';
import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class CbScheduleStatistics extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        sStartDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        sEndDt: new Date(),
        sTeamCd: "",
        sStatusCd: "",
        deptCd3: 0,
        inCludeYn: true,

        deptList3: [],
        masterGrid: {
            columnDefs:
                [
                    { headerName: '작업일', field: 'workingDt', minWidth: 130, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Dept3', field: 'deptCd3Nm', minWidth: 100 },
                    {
                        headerName: 'Status', field: 'statusCdNm', minWidth: 100,
                        cellRendererFramework: (params) => {
                            var statusCdNm = params.data.statusCdNm;
                            return (
                                <div style={{
                                    border: '1px solid #ddd',
                                    textAlign: 'center',
                                    backgroundColor: statusCdNm === '확정' ? '#fffb4c'
                                        : statusCdNm === '작업중' ? '#ffb44c'
                                            : statusCdNm === '작업완료' ? '#4cc3ff'
                                                : statusCdNm === '협정' ? '#5dea5b'
                                                    : statusCdNm === 'Cancel' || statusCdNm === 'Close' ? '#ccc'
                                                        : ''
                                }}>{statusCdNm}</div>
                            )
                        }
                    },
                    { headerName: 'Terminal', field: 'terminal', minWidth: 100 },
                    { headerName: 'Vessel', field: 'vessel', minWidth: 100 },
                    { headerName: 'Customer', field: 'customer', minWidth: 100 },
                    { headerName: 'Product', field: 'product', minWidth: 100 },
                    { headerName: 'ETA', field: 'etaFullDtNm', minWidth: 120 },
                    { headerName: 'ETB', field: 'etbFullDtNm', minWidth: 120 },
                    { headerName: 'ETC', field: 'etcFullDtNm', minWidth: 120 },
                    { headerName: 'PIC', field: 'picNm', minWidth: 100 },
                    { headerName: 'PIC2', field: 'piC2', minWidth: 100 },
                    { headerName: 'OPS', field: 'ops', minWidth: 100 },
                    { headerName: 'Agent', field: 'agent', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
                    { headerName: '작업일', field: 'workingDt', minWidth: 100 },
                    { headerName: 'Dept3', field: 'deptCd3Nm', minWidth: 100 },
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Terminal', field: 'terminal', minWidth: 100 },
                    { headerName: 'Vessel', field: 'vessel', minWidth: 100 },
                    { headerName: 'Customer', field: 'customer', minWidth: 100 },
                    { headerName: 'Product', field: 'product', minWidth: 100 },
                    { headerName: 'ETA', field: 'etaFullDtNm', minWidth: 120 },
                    { headerName: 'ETB', field: 'etbFullDtNm', minWidth: 120 },
                    { headerName: 'ETC', field: 'etcFullDtNm', minWidth: 120 },
                    { headerName: 'PIC', field: 'picNm', minWidth: 100 },
                    { headerName: 'PIC2', field: 'piC2', minWidth: 100 },
                    { headerName: 'OPS', field: 'ops', minWidth: 100 },
                    { headerName: 'Agent', field: 'agent', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
        this.getScheduleStatisticsList();
        this.getDept3List();
    }

    /*==========================================================*/
    /* CB dept3    */
    /*==========================================================*/
    getDept3List() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbScheduleService/GetDept3List", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                deptList3: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getScheduleStatisticsList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbScheduleService/GetScheduleStatisticsList", {
            params: {
                sStartDt: this.props.storeState.getParsedDate(this.state.sStartDt),
                sEndDt: this.props.storeState.getParsedDate(this.state.sEndDt),
                sTeamCd: this.state.sTeamCd === '' ? '' : this.state.sTeamCd,
                sStatusCd: this.state.sStatusCd === '' ? '' : this.state.sStatusCd,
                inCludeYn: this.state.inCludeYn === true ? "Y" : "N",
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
    getExcelDownload() {
        var rows = this.gridApiMaster.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        this.setState({
            excelGrid: { ...this.state.excelGrid, rowData: [] }
        }, () => {
            this.setState({
                excelGrid: { ...this.state.excelGrid, rowData: rows }
            }, () => {
                this.gridApiExcel.exportDataAsCsv({
                    fileName: 'CalebSchedulesStatistics'
                });
            });
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
        // set background colour on every row, this is probably bad, should be using CSS classes
        const rowStyle = { background: 'black' };

        // set background colour on even rows again, this looks bad, should be using CSS classes
        const getRowStyle = params => {
            if (params.node.rowIndex % 2 !== 0) {
                return { background: '#ddd' };
            }
        };
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
                                                        name='sStartDt'
                                                        value={this.state.sStartDt} onDateChange={this.onDateChange.bind(this)}
                                                    />
                                                </td>
                                                <td>{'~'}</td>
                                                <td>
                                                    <GDHDatepicker
                                                        name='sEndDt'
                                                        value={this.state.sEndDt} onDateChange={this.onDateChange.bind(this)}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Dept Cd3</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="deptCd3"
                                        value={this.state.deptCd3} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={0}>{"=== Select ==="}</option>
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
                                    <Form.Label>■ Team</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="sTeamCd"
                                        value={this.state.sTeamCd}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0064" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="sStatusCd"
                                        value={this.state.sStatusCd}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0063" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Form.Group controlId="group12" style={{ marginBottom: 0 }}>
                                    <Form.Check
                                        inline
                                        label="Including out of date"
                                        name="group12"
                                        type="checkbox"
                                        checked={this.state.inCludeYn}
                                        onChange={(e) => {
                                            this.setState({
                                                inCludeYn: e.target.checked
                                            }, () => {
                                                this.getScheduleStatisticsList();
                                            });
                                        }}
                                    />
                                    <Button variant="primary" onClick={this.getScheduleStatisticsList.bind(this)}>Search</Button>{' '}
                                    <Button variant="info" onClick={ this.getExcelDownload.bind(this)}>Excel Download</Button>
                                </Form.Group>
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
                            onGridReady={params => this.gridApiMaster = params.api}
                            getRowStyle={getRowStyle}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />

                        <AgGridReact headerHeight={45} rowHeight={45}
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
)(CbScheduleStatistics)
