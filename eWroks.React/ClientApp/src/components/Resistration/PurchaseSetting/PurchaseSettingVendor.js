import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import readXlsxFile from 'read-excel-file';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class PurchaseSettingVendor extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),

        entityCd: '',

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Vendor Id', field: 'fI_VendorId', minWidth: 150 },
                    { headerName: 'Vendor Nm', field: 'vendorNm', minWidth: 150 },
                    { headerName: 'Vendor Enm', field: 'vendorEnm', minWidth: 150 },
                    { headerName: 'Business No', field: 'businessNo', minWidth: 150 },
                    { headerName: 'Payment Term', field: 'cdRef1', minWidth: 150 },
                    { headerName: 'Bank Nm', field: 'fI_BankNm', minWidth: 150 },
                    { headerName: 'Bank Cd', field: 'fI_BankCd', minWidth: 150 },
                    { headerName: 'Bank Acc No', field: 'fI_BankAccNo', minWidth: 150 },
                    { headerName: 'Address', field: 'addrKr', minWidth: 150 },
                    { headerName: 'File', field: 'fI_FileNm', minWidth: 150 },
                    { headerName: 'Contact Nm', field: 'contactNm', minWidth: 150 },
                    { headerName: 'Contact Email', field: 'contactEmail', minWidth: 150 },
                    { headerName: 'Entity Nm', field: 'entityNm', minWidth: 150 },
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
        modalVendor: false,
        cmVendorDto: {
            vendorId: 0,
            vendorGb: '02',
            vendorNm: '',
            vendorEnm: '',
            zipCode: '',
            addrKr: '',
            addrEn: '',
            country: '',
            tel: '',
            fax: '',
            cdRef1: '0',
            cdRef2: '01',
            cdRef3: '',
            useYn: 'Y',
            businessNo: '',
            remark: '',
            regId: '',
            updId: '',

            fI_BankAccNo: '',
            fI_VendorId: '',
            fI_BankNm: '',
            fI_BankCd: '',
            fI_FileNm: '',
            fI_FileUrl: ''

        },
        modalContact: false,
        contactGrid: {
            columnDefs:
                [
                    { headerName: 'Name', field: 'contactNm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Phone', field: 'contactPhone', minWidth: 150 },
                    { headerName: 'Email', field: 'contactEmail', minWidth: 150 },
                    { headerName: 'Mail Yn', field: 'mailSendYn', minWidth: 150 },
                    { headerName: 'Use Yn', field: 'useYn', minWidth: 150 },
                    { headerName: 'Remark', field: 'remark', minWidth: 150 }
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
            }
        },
        cmVendorContactDto: {
            vendorId: 0,
            contactId: 0,
            contactNm: '',
            contactPhone: '',
            contactEmail: '',
            mailSendYn: 'Y',
            useYn: 'Y',
            remark: '',
            regId: '',
            updId: '',
        }
    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        // 마스터 조회
        this.getVendorList();
    }

    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({
            modalVendor: true,
            cmVendorDto: {
                vendorId: 0,
                vendorGb: '02',
                vendorNm: '',
                vendorEnm: '',
                zipCode: '',
                addrKr: '',
                addrEn: '',
                country: '',
                tel: '',
                fax: '',
                cdRef1: '0',
                cdRef2: '01',
                cdRef3: '',
                useYn: 'Y',
                businessNo: '',
                remark: '',
                regId: '',
                updId: '',

                fI_BankAccNo: '',
                fI_VendorId: '',
                fI_BankNm: '',
                fI_BankCd: '',
                fI_FileNm: '',
                fI_FileUrl: ''
            },
            contactGrid: {
                ...this.state.contactGrid,
                rowData: []
            }
        })
    }
    onClickNewContact() {
        this.setState({
            modalContact: true,
            cmVendorContactDto: {
                vendorId: 0,
                contactId: 0,
                contactNm: '',
                contactPhone: '',
                contactEmail: '',
                mailSendYn: 'Y',
                useYn: 'Y',
                remark: '',
                regId: '',
                updId: '',
            }
        })
    }

    /*==========================================================*/
	/* Contact 삭제    */
	/*==========================================================*/
    onClickNewContactDelete() {
        var deleteRows = this.gridApiContact.getSelectedRows();
        if (deleteRows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var rows = [];
        this.state.contactGrid.rowData.map((row, i) => {
            var boolCheck = false;
            deleteRows.map((sRow, j) => {
                if (sRow.contactId === row.contactId) {
                    boolCheck = true;
                }
            })
            if (!boolCheck) {
                rows.push(row);
            }
        })

        this.setState({
            contactGrid: { ...this.state.contactGrid, rowData: [], rowCount: 0 }
        }, () => {
            this.setState({
                contactGrid: { ...this.state.contactGrid, rowData: rows, rowCount: rows.length }
            })
        })
    }
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getVendorList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetVendorList", {
            params: {
                entityCd: this.state.entityCd
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
                alert(res.oV_RTN_MSG);
                return;
            }
        }
        this.setState({
            modalFileUpload: false
        })
        this.getVendorList();
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
    saveVendorData() {
        var gParam = {
            ...this.state.cmVendorDto,
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        };

        var gParamContact = [];
        this.state.contactGrid.rowData.map((row) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamContact.push(row)
        })

        if (gParam.vendorId === '') {
            alert('[ Vendor Id ] 값을 입력해 주세요.');
            return;
        }
        if (gParam.businessNo === '') {
            alert('[ Reg. No ] 값을 입력해 주세요.');
            return;
        }
        if (gParam.vendorNm === '') {
            alert('[ Vendor Nm ] 값을 입력해 주세요.');
            return;
        }
        if (gParam.fI_BankAccNo === '') {
            alert('[ Bank Acc No ] 값을 입력해 주세요.');
            return;
        }
        if (gParam.cdRef1 === '') {
            alert('[ Payment Term ] 값을 입력해 주세요.');
            return;
        }

        var gParamGroup = {
            cmVendorDto: gParam,
            cmVendorContactDtos: gParamContact
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SaveVendorData",
            gParamGroup)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalVendor: false
                })
                this.getVendorList();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    async onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();

        // GetContact
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetVendorContactList", {
            params: {
                vendorId: data[0].vendorId
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                contactGrid: {
                    ...this.state.contactGrid,
                    rowData: []
                }
            }, () => {
                this.setState({
                    contactGrid: {
                        ...this.state.contactGrid,
                        rowData: data
                    }
                })
            })
        }).catch(function (error) {
            alert(error);
        });

        this.setState({
            modalVendor: true,
            cmVendorDto: {
                vendorId: 0,
                vendorGb: '02',
                vendorNm: '',
                vendorEnm: '',
                zipCode: '',
                addrKr: '',
                addrEn: '',
                country: '',
                tel: '',
                fax: '',
                cdRef1: '0',
                cdRef2: '01',
                cdRef3: '',
                useYn: 'Y',
                businessNo: '',
                remark: '',
                regId: '',
                updId: '',

                fI_BankAccNo: '',
                fI_VendorId: '',
                fI_BankNm: '',
                fI_BankCd: '',
                fI_FileNm: '',
                fI_FileUrl: ''
            }
        }, () => {
            setTimeout(() => {
                this.setState({
                    cmVendorDto: {
                        vendorId: data[0].vendorId,
                        vendorGb: data[0].vendorGb,
                        vendorNm: data[0].vendorNm,
                        vendorEnm: data[0].vendorEnm,
                        zipCode: data[0].zipCode,
                        addrKr: data[0].addrKr,
                        addrEn: data[0].addrEn,
                        country: data[0].country,
                        tel: data[0].tel,
                        fax: data[0].fax,
                        cdRef1: data[0].cdRef1,
                        cdRef2: data[0].cdRef2,
                        cdRef3: data[0].cdRef3,
                        useYn: data[0].useYn,
                        businessNo: data[0].businessNo,
                        remark: data[0].remark,
                        regId: data[0].regId,
                        updId: data[0].updId,

                        fI_BankAccNo: data[0].fI_BankAccNo,
                        fI_VendorId: data[0].fI_VendorId,
                        fI_BankNm: data[0].fI_BankNm,
                        fI_BankCd: data[0].fI_BankCd,
                        fI_FileNm: data[0].fI_FileNm,
                        fI_FileUrl: data[0].fI_FileUrl,
                    }
                })
            }, 200);
        })
    }

    /*==========================================================*/
    /* Contact Data    */
    /*==========================================================*/
    saveContactDaata() {
        var rows = [...this.state.contactGrid.rowData];
        var row = { ...this.state.cmVendorContactDto };
        
        if (row.contactId === 0) { row.contactId = rows.length + 1 }

        rows.push(row);

        this.setState({
            modalContact: false,
            contactGrid: {
                ...this.state.contactGrid,
                rowData: rows
            }
        })
    }

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            cmVendorDto: {
                ...this.state.cmVendorDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeHandler2(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }

    onChangeHandlerContact(e) {
        this.setState({
            cmVendorContactDto: {
                ...this.state.cmVendorContactDto,
                [e.target.name]: e.target.value
            }
        });
    }

    /*==========================================================*/
    /* 파일 업로드    */
    /*==========================================================*/
    onfileUploadClick(e) {
        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'PurchaseSetting')
        frmFiles.append('userId', this.props.storeState.userInfo.userId)

        this.props.onIsLoadingTrue();
        axios.post(this.props.storeState.serviceUrl + "/CommonService/UploadFiels", frmFiles, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(r => {
            var data = r.data;
            this.props.onIsLoadingFalse();
            this.setState({
                cmVendorDto: {
                    ...this.state.cmVendorDto,
                    fI_FileNm: data[0].fileNm,
                    fI_FileUrl: data[0].fileUrl,
                }
            })
        }).catch(function (error) {
            alert(error);
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
                                    <Form.Label>■ Entity Name</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="entityCd"
                                        value={this.state.entityCd} onChange={this.onChangeHandler2.bind(this)}
                                    >
                                        <option value="">ALL</option>
                                        <option value="01">ETL SEMKO (Co.99)</option>
                                        <option value="02">KIMSCO (Co.62C)</option>
                                        <option value="03">TESTING (Co.62Q)</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                {/* <Button variant="warning" onClick={() => {
                                    this.setState({
                                        modalFileUpload: true,
                                        fileUploadGrid: { ...this.state.fileUploadGrid, rowData: [], rowCount: 0 }

                                    })
                                }} >Excel Upload</Button>{' '} */}
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="primary" onClick={this.getVendorList.bind(this)}>Search</Button>
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
                            headerHeight={45}
                            rowHeight={45}
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
            <Modal show={this.state.modalVendor} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveVendorData.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalVendor: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Currency</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="cdRef2"
                                        value={this.state.cmVendorDto.cdRef2} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="01">ETL SEMKO (Co.99)</option>
                                        <option value="02">KIMSCO (Co.62C)</option>
                                        <option value="03">TESTING (Co.62Q)</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-8"></div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='validateText'>■ Vendor Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="fI_VendorId"
                                        value={this.state.cmVendorDto.fI_VendorId} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='validateText'>■ Reg. No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="businessNo"
                                        value={this.state.cmVendorDto.businessNo} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='validateText'>■ Vendor Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="vendorNm"
                                        value={this.state.cmVendorDto.vendorNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Vendor Enm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="vendorEnm"
                                        value={this.state.cmVendorDto.vendorEnm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Bank Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="fI_BankNm"
                                        value={this.state.cmVendorDto.fI_BankNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Bank Cd</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="fI_BankCd"
                                        value={this.state.cmVendorDto.fI_BankCd} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='validateText'>■ Bank Acc No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="fI_BankAccNo"
                                        value={this.state.cmVendorDto.fI_BankAccNo} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Payment Term</Form.Label>
                                    <Form.Control type="number" size="sm"
                                        name="cdRef1"
                                        value={this.state.cmVendorDto.cdRef1} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Use Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.cmVendorDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>

                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Addr Kr</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="addrKr"
                                        value={this.state.cmVendorDto.addrKr} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        value={this.state.cmVendorDto.remark} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-8">
                                <Form.Group>
                                    <Form.Label>■ File Attached</Form.Label>
                                    <Form.File
                                        label="file upload click !!"
                                        custom
                                        multiple={false}
                                        onChange={this.onfileUploadClick.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group style={{ marginBottom: 10, fontWeight: 'bold' }}>
                                    <Form.Label>{' '}</Form.Label>
                                    <Form.Row style={{ paddingLeft: 15 }}>
                                        <a href={this.state.cmVendorDto.fI_FileUrl} target={'_blank'}>
                                            {this.state.cmVendorDto.fI_FileNm}
                                        </a>
                                        {
                                            this.state.cmVendorDto.fI_FileNm !== ''
                                                ? <><>&nbsp;&nbsp;&nbsp;</>
                                                    <a href={'#'} style={{ color: 'black', fontSize: 15 }} onClick={(e) => {
                                                        e.preventDefault();
                                                        this.setState({
                                                            cmVendorDto: {
                                                                ...this.state.cmVendorDto,
                                                                fI_FileNm: '',
                                                                fI_FileUrl: ''
                                                            }
                                                        })
                                                    }}>ⓧ</a>
                                                </>
                                                : <></>
                                        }
                                    </Form.Row>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Card>
                                    <Card.Header>
                                        <Form>
                                            <Form.Row>
                                                <div className="col-md-12 text-right">
                                                    <Button variant="secondary" onClick={this.onClickNewContact.bind(this)}>Contact Add</Button>{' '}
                                                    <Button variant="danger" onClick={this.onClickNewContactDelete.bind(this)} >Delete</Button>
                                                </div>
                                            </Form.Row>
                                        </Form>
                                    </Card.Header>
                                    <Card.Body style={{ padding: 0 }}>
                                        <div className="ag-theme-material"
                                            style={{ height: 200, borderTop: '2px solid #695405' }}
                                        >
                                            <AgGridReact headerHeight={45} rowHeight={45}
                                                columnDefs={this.state.contactGrid.columnDefs}
                                                defaultColDef={this.state.contactGrid.defaultColDef}
                                                rowData={this.state.contactGrid.rowData}
                                                rowSelection="multiple" // single
                                                headerHeight={45} rowHeight={45}
                                                onGridReady={params => this.gridApiContact = params.api}
                                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
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
                            headerHeight={45} rowHeight={45}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-md-12" style={{ textAlign: 'left' }}>
                        <Form.Label>Total : {this.state.fileUploadGrid.rowCount}</Form.Label>
                    </div>
                </Modal.Footer>
            </Modal>


            {/* Role Program Modal */}
            <Modal show={this.state.modalContact} backdrop="static" size="md" >
                <div style={{ border: '2px solid #6c757d' }}>
                    <Modal.Header className="text-right">
                        <div className="col-md-12 text-rigth">
                            <Button variant="success" onClick={this.saveContactDaata.bind(this)} >Save</Button>{' '}
                            <Button variant="secondary" onClick={function () {
                                this.setState({ modalContact: false })
                            }.bind(this)}>Close</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Row>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Name</Form.Label>
                                        <Form.Control type="text" size="sm"
                                            name="contactNm"
                                            value={this.state.cmVendorContactDto.contactNm} onChange={this.onChangeHandlerContact.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Phone</Form.Label>
                                        <Form.Control type="text" size="sm"
                                            name="contactPhone"
                                            value={this.state.cmVendorContactDto.contactPhone} onChange={this.onChangeHandlerContact.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Email</Form.Label>
                                        <Form.Control type="text" size="sm"
                                            name="contactEmail"
                                            value={this.state.cmVendorContactDto.contactEmail} onChange={this.onChangeHandlerContact.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Remark</Form.Label>
                                        <Form.Control type="text" size="sm"
                                            name="remark"
                                            value={this.state.cmVendorContactDto.remark} onChange={this.onChangeHandlerContact.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Mail Yn</Form.Label>
                                        <Form.Control as="select" size="sm"
                                            name="mailSendYn"
                                            value={this.state.cmVendorContactDto.mailSendYn} onChange={this.onChangeHandlerContact.bind(this)}
                                        >
                                            <option value="Y">Y</option>
                                            <option value="N">N</option>
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Use Yn</Form.Label>
                                        <Form.Control as="select" size="sm"
                                            name="useYn"
                                            value={this.state.cmVendorContactDto.useYn} onChange={this.onChangeHandlerContact.bind(this)}
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
                </div>
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
)(PurchaseSettingVendor)
