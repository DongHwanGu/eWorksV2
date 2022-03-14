import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';
import readXlsxFile from 'read-excel-file';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import HrOvertimeWorkDetail from './HrOvertimeWorkDetail';
import HrOvertimeWorkOnBehalf from './HrOvertimeWorkOnBehalf';


class HrOvertimeWorkList extends Component {
    getDetailPage(data) {
        return (
            <HrOvertimeWorkDetail id={data} onClickNew={this.onClickNew.bind(this)} saveCallback={this.saveCallback.bind(this)} />
        )
    }
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),
        statusCd: "09",

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Req Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Reason', field: 'reason', minWidth: 300 },
                    { headerName: '1단계 요청시간', field: 'oneStepDateNm', minWidth: 300 },
                    { headerName: '2단계 요청시간', field: 'twoStepDateNm', minWidth: 300 },
                    { headerName: 'HR Reviewed', field: 'hrStepDateNm', minWidth: 300 },
                    { headerName: 'HR Comment', field: 'remark', minWidth: 100 },
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
        excelGrid: {
            columnDefs:
                [

                    { headerName: 'ID', field: 'otId', minWidth: 100 },
                    { headerName: '상태', field: 'statusCdNm', minWidth: 100 },
                    { headerName: '근무일자', field: 'startDt', minWidth: 100 },
                    { headerName: '이름', field: 'userNm', minWidth: 100 },
                    { headerName: '한글직급', field: 'dutyCdKorNm', minWidth: 100 },
                    { headerName: '직급', field: 'dutyCdEngNm', minWidth: 100 },
                    { headerName: '부서', field: 'deptFullNm', minWidth: 100 },
                    { headerName: '저녁식사시간', field: 'dinnerTime', minWidth: 100 },
                    { headerName: '야근요청시간', field: 'requestDate', minWidth: 100 },
                    { headerName: '연장근무시간', field: 'requestTime', minWidth: 100 },
                    { headerName: '분', field: 'requestMinutes', minWidth: 100 },
                    { headerName: '야간근무시간', field: 'requestNightTime', minWidth: 100 },
                    { headerName: '분1', field: 'requestNighttMinutes', minWidth: 100 },
                    { headerName: '총시간', field: 'requestTotalTime', minWidth: 100 },
                    { headerName: '분2', field: 'requestTotalMinutes', minWidth: 100 },
                    { headerName: '비고', field: 'remark', minWidth: 100 },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                flex: 1,
                // editable: true,
                resizable: true,
            }
        },
        modalFileUpload: false,
        fileUploadGrid: {
            columnDefs:
                [
                    { headerName: 'ID', field: 'otId', minWidth: 80 },
                    { headerName: 'Error', field: 'errorRemark', minWidth: 100 },
                    { headerName: '이름', field: 'userNm', minWidth: 100 },
                    { headerName: '부서', field: 'deptFullNm', minWidth: 100 },
                    { headerName: '저녁식사시간', field: 'dinnerTime', minWidth: 100 },
                    { headerName: '요청시간', field: 'requestDate', minWidth: 200 },
                    { headerName: '비고', field: 'remark', minWidth: 100 },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: false,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: false, // 멀티서치 기능
            }
        },

    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        // 마스터 조회
        this.getResponseOvertimeWorkList();
    }

    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({ activeKey: 'detail', detailPage: null }, () => {
            this.setState({ activeKey: 'detail', detailPage: this.getDetailPage("") })
        })
    }

    /*==========================================================*/
    /* 저장 후 실행    */
    /*==========================================================*/
    saveCallback() {
        this.setState({ activeKey: "list", listPage: null, detailPage: null }, () => {
            this.setState({ activeKey: "list", detailPage: this.getDetailPage("") })
        });

        this.getResponseOvertimeWorkList();
    }

     /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getResponseOvertimeWorkList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetResponseOvertimeWorkList", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                endDt: this.props.storeState.getParsedDate(this.state.endDt),
                statusCd: this.state.statusCd,
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
    /* Save Data   */
    /*==========================================================*/
    saveResponseOvertimeWorkList(e) {
        var rows = this.gridApi.getSelectedRows();

        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var arrGparam = [];

        for (var i = 0; i < rows.length; i++) {
            if (rows[i].statusCd === '05' || rows[i].statusCd === '09') {
                arrGparam.push({
                    otId: rows[i].otId,
                    remark: "",
                    statusCd: e.target.id === 'btnApprovalList' ? '10' : '99',
                    updId: this.props.storeState.userInfo.userId
                });    
            }
        }

        if (arrGparam.length === 0) {
            alert('1단계, 2단계 - 승인완료 상태만 승인및 반려 가능합니다.');
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/SaveResponseOvertimeWorkList", 
            arrGparam
        ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getResponseOvertimeWorkList();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Excel    */
    /*==========================================================*/
    async getResponseOvertimeWorkExcelList() {
        var rows = this.gridApi.getSelectedRows();
        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        
        var _otId = '';
        var _rowData = [];

        this.props.onIsLoadingTrue();
        for (const row of rows) {
            _otId = row.otId;
            var res = await this.fn_getResponseOvertimeWorkExcelList(_otId);
            _rowData.push(res);
        }
        this.props.onIsLoadingFalse();

        this.setState({
            excelGrid: { ...this.state.excelGrid, rowData: _rowData }
        }, () => {
            this.gridApiExcel.exportDataAsCsv({
                fileName: 'OvertimeList'
            });
        })
    }
    // 엑셀 다운로드
    async fn_getResponseOvertimeWorkExcelList(_otId) {
        const r = await axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetResponseOvertimeWorkExcelList", {
            params: {
                otId: _otId
            },
        }).then(r => {
            var data = r.data;
            return data;
        }).catch(function (error) {
            alert(error);
        });

        return r;
    }

    /*==========================================================*/
    /* Excel Upload    */
    /*==========================================================*/
    saveResponseOvertimeWorkExcelUpload() {
        var rows = [ ...this.state.fileUploadGrid.rowData ];

        if (rows.length === 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }
        axios.post(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/SaveResponseOvertimeWorkExcelUpload", 
            rows
        ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            } else if (data.oV_RTN_CODE === -99) {
                var arrMsg = data.oV_RTN_MSG.split('|')
                var errorRows = [];
                
                for (var i = 0; i < arrMsg.length; i++) {
                    if (arrMsg[i] !== "") {
                        var strCode = arrMsg[i].split(',')[0];
                        var strMsg = arrMsg[i].split(',')[1];

                        errorRows.push({
                            otId: strCode,
                            errorRemark: strMsg
                        });
                    }
                }

                this.setState({
                    fileUploadGrid: { ...this.state.fileUploadGrid, rowData: [], rowCount: 0 }
                }, () => {
                    this.setState({
                        fileUploadGrid: { ...this.state.fileUploadGrid, rowData: errorRows, rowCount: errorRows.length }
                    })
                })

            } else {
                this.setState({
                    modalFileUpload: false
                });
                this.getResponseOvertimeWorkList();
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
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="statusCd"
                                                    value={this.state.statusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0203" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Button variant="success" id="btnApprovalList"
                                                onClick={this.saveResponseOvertimeWorkList.bind(this)} >Approval</Button>{' '}
                                            <Button variant="danger" id="btnRejectList"
                                                onClick={this.saveResponseOvertimeWorkList.bind(this)} >Reject</Button>{' '}

                                            <Button variant="info" onClick={this.getResponseOvertimeWorkExcelList.bind(this)} >Excel Download</Button>{' '}

                                            <Button variant="warning" onClick={() => {
                                                this.setState({
                                                    modalFileUpload: true,
                                                    fileUploadGrid: { ...this.state.fileUploadGrid, rowData: [], rowCount: 0 }

                                                })
                                            }} >Excel Upload</Button>{' '}
                                            <Button variant="primary" onClick={this.getResponseOvertimeWorkList.bind(this)}>Search</Button>
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
                                        rowSelection="multiple" // single
                                        onGridReady={params => this.gridApiExcel = params.api}
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
                <Tab eventKey="onbehalf" title="On Behalf">
                    <div style={{ marginTop: 15 }}>
                        <HrOvertimeWorkOnBehalf saveCallback={this.saveCallback.bind(this)} />
                    </div>
                </Tab>
            </Tabs>



            {/* Modal */}
            <Modal show={this.state.modalFileUpload} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveResponseOvertimeWorkExcelUpload.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalFileUpload: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form.File
                        label="file upload click !!"
                        custom
                        multiple={false}
                        onChange={(e) => {
                            readXlsxFile(e.target.files[0]).then((rows) => {
                                var data = [];
                                rows.splice(rows[0], 1);
                                rows.forEach(row => {
                                    data.push({
                                        otId: row[0],
                                        userNm: row[3],
                                        deptFullNm: row[6],
                                        dinnerTime: row[7].toString(),
                                        requestDate: row[8],
                                        remark: row[15],
                                        errorRemark: "",
                                        updId: this.props.storeState.userInfo.userId
                                    })
                                });
                                this.setState({
                                    fileUploadGrid: { ...this.state.fileUploadGrid, rowData: data, rowCount: data.length }
                                })
                            })
                        }}
                    />
                    <div className="ag-theme-material"
                        style={{ height: 500, borderTop: '2px solid #695405', marginTop: 15 }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.fileUploadGrid.columnDefs}
                            defaultColDef={this.state.fileUploadGrid.defaultColDef}
                            rowData={this.state.fileUploadGrid.rowData}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-md-12" style={{ textAlign: 'left' }}>
                        <Form.Label>Total : {this.state.fileUploadGrid.rowCount}</Form.Label>
                    </div>
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
)(HrOvertimeWorkList)
