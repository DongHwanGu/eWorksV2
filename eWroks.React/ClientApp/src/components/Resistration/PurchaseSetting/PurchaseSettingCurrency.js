import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import readXlsxFile from 'read-excel-file';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class PurchaseSettingCurrency extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Code', field: 'currencyCd', minWidth: 150 },
                    { headerName: 'Use Yn', field: 'useYn', minWidth: 150 },
                    { headerName: 'Currency Nm', field: 'currencyNm', minWidth: 150 },
                    { headerName: 'Currency Amt', field: 'currencyAmt', minWidth: 150 },
                    { headerName: 'Remark', field: 'remark', minWidth: 150 },
                    { headerName: 'Upd Nm', field: 'updIdNm', minWidth: 150 },
                    { headerName: 'Upd Dt', field: 'updDtNm', minWidth: 150 },
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
        modalFileUpload: false,
        fileUploadGrid: {
            columnDefs:
                [
                    { headerName: 'Code', field: 'currencyCd', minWidth: 80 },
                    { headerName: 'Currency Nm', field: 'currencyNm', minWidth: 100 },
                    { headerName: 'Currency Amt', field: 'currencyAmt', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
        modalCurrency: false,
        fiCurrencyDto: {
            currencyYear: new Date().getFullYear().toString(),
            currencyMonth: String("00" + (new Date().getMonth() + 1)).slice(-2),
            currencyCd: '01',
            currencyAmt: 0.0,
            remark: '',
            useYn: 'Y',
            regId: '',
            updId: '',

            currencyNm: '',
            updIdNm: '',
            updDtNm: '',
        }



    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        // 마스터 조회
        this.getCurrencyList();
    }

    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({
            modalCurrency: true,
            fiCurrencyDto: {
                ...this.state.fiCurrencyDto,
                currencyCd: '01',
                currencyAmt: 0.0,
                remark: '',
                useYn: 'Y',
                regId: '',
                updId: '',
            }
        })
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getCurrencyList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetCurrencyList", {
            params: {
                currencyYear: this.state.fiCurrencyDto.currencyYear,
                currencyMonth: this.state.fiCurrencyDto.currencyMonth
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
    /* 파일업로드    */
    /*==========================================================*/
    async saveCurrencyDataUpload() {
        var rows = [...this.state.fileUploadGrid.rowData];

        this.props.onIsLoadingTrue();
        for (const row of rows) {
            var gParam = { 
                currencyYear: this.state.fiCurrencyDto.currencyYear,
                currencyMonth: this.state.fiCurrencyDto.currencyMonth,
                currencyCd: row.currencyCd,
                currencyAmt: parseFloat(row.currencyAmt),
                remark: row.remark,
                useYn: 'Y',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
            };
            var res = await this.saveCurrencyDataUploadAsync(gParam);

            if (res.oV_RTN_CODE === -1) {
                this.props.onIsLoadingFalse();
                alert(res.oV_RTN_MSG);
                return;
            }
        }
        this.setState({
            modalFileUpload: false
        })
        this.getCurrencyList();
    }
    async saveCurrencyDataUploadAsync(gParam) {
        var res = await axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SaveCurrencyData",
        gParam)
        .then(r => {
            var data = r.data;
            return data;
        }).catch(function (error) {
            alert(error);
        });

        return res;
    }

    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    saveCurrencyData() {
        var gParam = { 
            ...this.state.fiCurrencyDto,
            currencyAmt: parseFloat(this.state.fiCurrencyDto.currencyAmt),
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        };
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SaveCurrencyData",
        gParam)
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalCurrency: false
            })
            this.getCurrencyList();

        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        this.setState({ 
            modalCurrency: true,
            fiCurrencyDto: {
                ...this.state.fiCurrencyDto,
                currencyCd: '01',
                currencyAmt: 0.0,
                remark: '',
                useYn: 'Y'
            }
        }, () => {
            setTimeout(() => {
                this.setState({
                    fiCurrencyDto: {
                        ...this.state.fiCurrencyDto,
                        currencyCd: data[0].currencyCd,
                        currencyAmt: data[0].currencyAmt,
                        remark: data[0].remark,
                        useYn: data[0].useYn
                    }
                })    
            }, 200);
        })
    }
    // 체인지 공통
    onChangeHandler(e) {
        var eName = e.target.name;
        this.setState({
            fiCurrencyDto: {
                ...this.state.fiCurrencyDto,
                [e.target.name]: e.target.value
            }
        }, () => {
            if (eName === 'currencyYear' || eName === 'currencyMonth') {
                this.getCurrencyList();
            }
        });
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }


    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Year</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="currencyYear"
                                        value={this.state.fiCurrencyDto.currencyYear} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="2021">2021 년</option>
                                        <option value="2022">2022 년</option>
                                        <option value="2023">2023 년</option>
                                        <option value="2024">2024 년</option>
                                        <option value="2025">2025 년</option>
                                        <option value="2026">2026 년</option>
                                        <option value="2027">2027 년</option>
                                        <option value="2028">2028 년</option>
                                        <option value="2029">2029 년</option>
                                        <option value="2030">2030 년</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                <Form.Label>■ Month</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="currencyMonth"
                                        value={this.state.fiCurrencyDto.currencyMonth} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="01">1 월</option>
                                        <option value="02">2 월</option>
                                        <option value="03">3 월</option>
                                        <option value="04">4 월</option>
                                        <option value="05">5 월</option>
                                        <option value="06">6 월</option>
                                        <option value="07">7 월</option>
                                        <option value="08">8 월</option>
                                        <option value="09">9 월</option>
                                        <option value="10">10 월</option>
                                        <option value="11">11 월</option>
                                        <option value="12">12 월</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="warning" onClick={() => {
                                    this.setState({
                                        modalFileUpload: true,
                                        fileUploadGrid: { ...this.state.fileUploadGrid, rowData: [], rowCount: 0 }

                                    })
                                }} >Excel Upload</Button>{' '}
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="primary" onClick={this.getCurrencyList.bind(this)}>Search</Button>
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

            {/* Role Program Modal */}
            <Modal show={this.state.modalCurrency} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveCurrencyData.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalCurrency: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Currency</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="currencyCd"
                                        value={this.state.fiCurrencyDto.currencyCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0100" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Currency Amt</Form.Label>
                                    <Form.Control type="number" size="sm"
                                        name="currencyAmt"
                                        value={this.state.fiCurrencyDto.currencyAmt} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        value={this.state.fiCurrencyDto.remark} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Use Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.fiCurrencyDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>
             
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* Modal */}
            <Modal show={this.state.modalFileUpload} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveCurrencyDataUpload.bind(this)} >Save</Button>{' '}
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
                                        currencyCd: row[0],
                                        currencyNm: row[1],
                                        currencyAmt: row[2].toFixed(2),
                                        remark: row[3],
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
                            onGridReady={params => this.gridApiFileUplaod = params.api}
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
)(PurchaseSettingCurrency)
