import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';
import GDHDatepicker from '../../common/controls/GDHDatepicker'
import GDHSelectOption from '../../common/controls/GDHSelectOption';

class AcountAssetsExcel extends Component {

    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        typeGb: "A",
        itStatusCd: "",
        deptCd1: 0,
        deptCd2: 0,
        deptCd3: 0,
        deptList1: [],
        deptList2: [],
        deptList3: [],

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Login Id', field: 'loginId', minWidth: 100 },
                    { headerName: 'Email', field: 'email', minWidth: 100 },
                    { headerName: 'Host Nm', field: 'hostNm', minWidth: 100 },
                    { headerName: 'Ctrl No', field: 'controlNm', minWidth: 100 },
                    { headerName: 'Office Cd', field: 'officeId', minWidth: 100 },
                    { headerName: 'Tel', field: 'tel', minWidth: 100 },
                    { headerName: 'Dept1', field: 'deptCd1', minWidth: 100 },
                    { headerName: 'Dept2', field: 'deptCd2', minWidth: 100 },
                    { headerName: 'Dept3', field: 'deptCd3', minWidth: 100 },
                    { headerName: 'Dept4', field: 'deptCd4', minWidth: 100 },
                    { headerName: 'User Gb', field: 'userGb', minWidth: 100 },
                    { headerName: 'Position Kr', field: 'dutyCdKor', minWidth: 100 },
                    { headerName: 'IT Status', field: 'iT_StatusCd', minWidth: 100 },
                    { headerName: 'HR Status', field: 'hR_StatusCd', minWidth: 100 },
                    { headerName: 'Role', field: 'roleId', minWidth: 100 },
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
        applicationExcelGrid: {
            columnDefs:
                [
                    { headerName: 'Position', field: 'position', minWidth: 100 },
                    { headerName: 'UserNm', field: 'userNm', minWidth: 100 },
                    { headerName: 'UserEnm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Dept1', field: 'dept1', minWidth: 100 },
                    { headerName: 'Dept2', field: 'dept2', minWidth: 100 },
                    { headerName: 'Dept3', field: 'dept3', minWidth: 100 },
                    { headerName: 'Dept4', field: 'dept4', minWidth: 100 },
                    { headerName: 'ITStatus', field: 'iTStatus', minWidth: 100 },
                    { headerName: 'AD', field: 'aD', minWidth: 100 },			
                    { headerName: 'EmailE3', field: 'emailE3', minWidth: 100 },
                    { headerName: 'EmailF3', field: 'emailF3', minWidth: 100 },
                    { headerName: 'ASTRA', field: 'aSTRA', minWidth: 100 },
                    { headerName: 'AuditTool', field: 'auditTool', minWidth: 100 },
                    { headerName: 'Cognos', field: 'cognos', minWidth: 100 },
                    { headerName: 'Datalink', field: 'datalink', minWidth: 100 },
                    { headerName: 'Evolution', field: 'evolution', minWidth: 100 },
                    { headerName: 'GSCC', field: 'gSCC', minWidth: 100 },
                    { headerName: 'iConnect', field: 'iConnect', minWidth: 100 },
                    { headerName: 'InfoLink', field: 'infoLink', minWidth: 100 },
                    { headerName: 'PeopleSoft', field: 'peopleSoft', minWidth: 100 },
                    { headerName: 'Phoenix', field: 'phoenix', minWidth: 100 },
                    { headerName: 'TIPS', field: 'tIPS', minWidth: 100 },
                    { headerName: 'Getinfo', field: 'getinfo', minWidth: 100 },
                    { headerName: 'Homepage', field: 'homepage', minWidth: 100 },
                    { headerName: 'IntertekeWorks', field: 'intertekeWorks', minWidth: 100 },
                    { headerName: 'KDTS', field: 'kDTS', minWidth: 100 },
                    { headerName: 'QRCode', field: 'qRCode', minWidth: 100 },
                    { headerName: 'SolidWorks', field: 'solidWorks', minWidth: 100 },
                    { headerName: 'SUN_CE', field: 'sUN_CE', minWidth: 100 },
                    { headerName: 'Vision_CE', field: 'vision_CE', minWidth: 100 },
                    { headerName: 'Worldquest', field: 'worldquest', minWidth: 100 },
                    { headerName: 'SUN_CG', field: 'sUN_CG', minWidth: 100 },
                    { headerName: 'Vision_CG', field: 'vision_CG', minWidth: 100 },
                    { headerName: 'Autobill', field: 'autobill', minWidth: 100 },
                    { headerName: 'NewAutobill', field: 'newAutobill', minWidth: 100 },
                    { headerName: 'TwoDbarcode', field: 'ywoDbarcode', minWidth: 100 },
                    { headerName: 'SUN_Web', field: 'sUN_Web', minWidth: 100 },
                    { headerName: 'Douzone_iCube', field: 'douzone_iCube', minWidth: 100 },

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
        softwareExcelGrid: {
            columnDefs:
                [
                    { headerName: 'Position', field: 'position', minWidth: 100 },
                    { headerName: 'UserNm', field: 'userNm', minWidth: 100 },
                    { headerName: 'UserEnm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Dept1', field: 'dept1', minWidth: 100 },
                    { headerName: 'Dept2', field: 'dept2', minWidth: 100 },
                    { headerName: 'Dept3', field: 'dept3', minWidth: 100 },
                    { headerName: 'Dept4', field: 'dept4', minWidth: 100 },
                    { headerName: 'ITStatus', field: 'iTStatus', minWidth: 100 },
                    { headerName: 'Office', field: 'office', minWidth: 100 },          
                    { headerName: 'Visio', field: 'visio', minWidth: 100 },
                    { headerName: 'Acrobat', field: 'acrobat', minWidth: 100 },
                    { headerName: 'Photoshop', field: 'photoshop', minWidth: 100 },
                    { headerName: 'Illustrator', field: 'illustrator', minWidth: 100 },
                    { headerName: 'PDFPro', field: 'pDFPro', minWidth: 100 },
                    { headerName: 'PhantomPDF', field: 'phantomPDF', minWidth: 100 },
                    { headerName: 'Hangul', field: 'hangul', minWidth: 100 },
                    { headerName: 'Cylance', field: 'cylance', minWidth: 100 },
                    { headerName: 'Optics', field: 'optics', minWidth: 100 },
                    { headerName: 'Zscaler', field: 'zscaler', minWidth: 100 },
                    { headerName: 'Sophos', field: 'sophos', minWidth: 100 },
                    { headerName: 'SCCM', field: 'sCCM', minWidth: 100 },
                    { headerName: 'Bandizip', field: 'bandizip', minWidth: 100 },
                    { headerName: 'WinZip', field: 'winZip', minWidth: 100 },
                    { headerName: 'Pkzip', field: 'pkzip', minWidth: 100 },
                    { headerName: 'NewAutobill', field: 'newAutobill', minWidth: 100 },
                    { headerName: 'Autobill', field: 'autobill', minWidth: 100 },
                    { headerName: 'SolidWorks', field: 'solidWorks', minWidth: 100 },
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
        hardwareExcelGrid: {
            columnDefs:
                [
                    { headerName: 'Position', field: 'position', minWidth: 100 },
                    { headerName: 'UserNm', field: 'userNm', minWidth: 100 },
                    { headerName: 'UserEnm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Dept1', field: 'dept1', minWidth: 100 },
                    { headerName: 'Dept2', field: 'dept2', minWidth: 100 },
                    { headerName: 'Dept3', field: 'dept3', minWidth: 100 },
                    { headerName: 'Dept4', field: 'dept4', minWidth: 100 },
                    { headerName: 'ITStatus', field: 'iTStatus', minWidth: 100 },
                    { headerName: 'Type', field: 'type', minWidth: 100 },
                    { headerName: 'ControlNo', field: 'controlNo', minWidth: 100 },
                    { headerName: 'HostName', field: 'hostName', minWidth: 100 },
                    { headerName: 'Manufacture', field: 'manufacture', minWidth: 100 },
                    { headerName: 'Model', field: 'model', minWidth: 100 },
                    { headerName: 'Cpu', field: 'cpu', minWidth: 100 },
                    { headerName: 'Ram', field: 'ram', minWidth: 100 },
                    { headerName: 'HDD', field: 'hDD', minWidth: 100 },
                    { headerName: 'SerialNo', field: 'serialNo', minWidth: 100 },
                    { headerName: 'PurchaseDate', field: 'purchaseDate', minWidth: 100 },
                    { headerName: 'ReplaceDate', field: 'replaceDate', minWidth: 100 },
                    { headerName: 'StockYn', field: 'stockYn', minWidth: 100 },
                    { headerName: 'UseCnt', field: 'useCnt', minWidth: 100 },
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
        networkExcelGrid: {
            columnDefs:
                [
                    { headerName: 'Position', field: 'position', minWidth: 100 },
                    { headerName: 'UserNm', field: 'userNm', minWidth: 100 },
                    { headerName: 'UserEnm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Dept1', field: 'dept1', minWidth: 100 },
                    { headerName: 'Dept2', field: 'dept2', minWidth: 100 },
                    { headerName: 'Dept3', field: 'dept3', minWidth: 100 },
                    { headerName: 'Dept4', field: 'dept4', minWidth: 100 },
                    { headerName: 'ITStatus', field: 'iTStatus', minWidth: 100 },
                    { headerName: 'ADEmail', field: 'aDEmail', minWidth: 100 },
                    { headerName: 'NetworkType', field: 'networkType', minWidth: 100 },
                    { headerName: 'NetworkName', field: 'networkName', minWidth: 100 },
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
        }
    }
    /*==========================================================*/
	/* PageLoad    */
	/*==========================================================*/
    componentDidMount() {
        this.getAcountExcelUserList();

        this.getDeptListOptions('deptCd1', 0);
    }
    /*==========================================================*/
	/* 마스터 리스트 조회    */
	/*==========================================================*/
    getAcountExcelUserList() {
        var searchGroup = { ...this.state };
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/GetAcountExcelUserList", {
            params: {
                typeGb: searchGroup.typeGb,
                itStatusCd: searchGroup.itStatusCd,
                deptCd1: searchGroup.deptCd1,
                deptCd2: searchGroup.deptCd2,
                deptCd3: searchGroup.deptCd3,
            }
        })
        .then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            })
        })
        .catch(function (error) { 
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
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            [e.target.name]: eValue
        });
        this.getDeptListOptions(e.target.name, eValue);
    }

    // 엑셀 다운로드
    async fn_getAcountExcelDownload(_typeGb, _strUserId) {
        const r = await axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/getAcountExcelDownload", {
            params: {
                typeGb: _typeGb,
                strUserId: _strUserId
            },
        }).then(r => {
            var data = r.data;
            if(_typeGb === 'A')
            {
                return data.applicationExcelDtos;
            }
            if(_typeGb === 'S')
            {
                return data.softwareExcelDtos;
            }
            if(_typeGb === 'H')
            {
                return data.hardwareExcelDtos;
            }
            if(_typeGb === 'N')
            {
                return data.networkExcelDtos;
            }
        }).catch(function (error) {
            alert(error);
        });

        return r;
    }
    async getAcountExcelDownload() {
        var rows = this.gridApi.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        
        var _typeGb = this.state.typeGb;
        var _strUserId = '';
        var _rowData = [];


        this.props.onIsLoadingTrue();
        for (const row of rows) {
            _strUserId = row.userId;
            var res = await this.fn_getAcountExcelDownload(_typeGb, _strUserId);
            _rowData.push(res);
        }
        this.props.onIsLoadingFalse();
        if (_typeGb === 'A') {
            this.setState({
                applicationExcelGrid: { ...this.state.applicationExcelGrid, rowData: _rowData }
            }, () => {
                this.gridApiApplication.exportDataAsCsv({
                    fileName: 'gridApiApplication'
                });
            })
        }
        if (_typeGb === 'S') {
            this.setState({
                softwareExcelGrid: { ...this.state.softwareExcelGrid, rowData: _rowData }
            }, () => {
                this.gridApiSoftware.exportDataAsCsv({
                    fileName: 'gridApiSoftware'
                });
            })
        }
        if (_typeGb === 'H') {
            this.setState({
                hardwareExcelGrid: { ...this.state.hardwareExcelGrid, rowData: _rowData }
            }, () => {
                this.gridApiHardware.exportDataAsCsv({
                    fileName: 'gridApiHardware'
                });
            })
        }
        if (_typeGb === 'N') {
            this.setState({
                networkExcelGrid: { ...this.state.networkExcelGrid, rowData: _rowData }
            }, () => {
                this.gridApiNetwork.exportDataAsCsv({
                    fileName: 'gridApiNetwork'
                });
            })
        }
    }

    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Type</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="typeGb"
                                        value={this.state.typeGb} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="A">Application</option>
                                        <option value="S">Software</option>
                                        <option value="H">Hardware</option>
                                        <option value="N">Network</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-9"></div>
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
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ IT Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="itStatusCd"
                                        value={this.state.itStatusCd}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0006" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getAcountExcelUserList.bind(this)}>Search</Button>{' '}
                                <Button variant="info" onClick={ this.getAcountExcelDownload.bind(this)}>Excel Download</Button>
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
                    </div>
                </Card.Body>
                <Card.Body style={{ padding: 3, display: 'none' }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.applicationExcelGrid.columnDefs}
                            defaultColDef={this.state.applicationExcelGrid.defaultColDef}
                            rowData={this.state.applicationExcelGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiApplication = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Body style={{ padding: 3, display: 'none' }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.softwareExcelGrid.columnDefs}
                            defaultColDef={this.state.softwareExcelGrid.defaultColDef}
                            rowData={this.state.softwareExcelGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiSoftware = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Body style={{ padding: 3, display: 'none' }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.hardwareExcelGrid.columnDefs}
                            defaultColDef={this.state.hardwareExcelGrid.defaultColDef}
                            rowData={this.state.hardwareExcelGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiHardware = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Body style={{ padding: 3, display: 'none' }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.networkExcelGrid.columnDefs}
                            defaultColDef={this.state.networkExcelGrid.defaultColDef}
                            rowData={this.state.networkExcelGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiNetwork = params.api}
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
)(AcountAssetsExcel)
