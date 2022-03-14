import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, InputGroup } from 'react-bootstrap';

class FiPurchaseRequestDetail extends Component {
    state = {
        remark: '',
        assetNo: '',
        purchaseId: 0,
        apprId: 0,
        

        arrApprovalObj: [],
        fiPurchaseDto: {
            purchaseId: 0,
            statusCd: '01',
            entityCd: '01',
            branchCd: '',
            purchaseReqDt: '',
            purchaseRefNo: '',
            assetNo: '',
            categoryCd: '',
            categoryDtlCd: '',
            categoryDtlReason: '',
            growthYn: 'N',
            maintenanceYn: 'N',
            maintenanceAssetNo: '',
            maintenanceEqId: '',
            budgetYn: '',
            productNm: '',
            productQty: 0,
            vendorId: 0,
            manufaturer: '',
            evidenceCd: '',
            evidenceReason: '',
            currencyCd: '',

            currencyAmt: '0',
            currencyVatAmt: '0',
            exchangeRate: '0',
            exchangeKRW: '0',
            carRate: '0',
            carGBP: '0',

            docQtyCd: '01',
            docQtyReason: '',
            termsDays: 0,
            termsChangeYn: 'N',
            termsReason: '',
            reason: '',
            remark: '',
            dEBIT: '',
            cREDIT: '',
            productRefNo: '',
            voucherRefNo: '',
            fixCurrencyAmt: 0,
            fixCurrencyVatAmt: 0,
            partialCnt: 0,
            regId: '',
            updId: '',

            vendorNm: '',

            regIdNm: '',
            regIdDeptFullNm: '',
            statusCdNm: '',
            entityCdNm: '',
            branchCdNm: '',
            currencyCdNm: '',
            categoryCdNm: '',
            categoryDtlCdNm: '',
            docQtyCdNm: '',
            evidenceCdNm: '',

            apprId: 0,

        },
        fiPurchaseDivisionDtos: '',
        fiPurchaseFileDtos: {
            fileNmMain: '',
            fileUrlMain: '',
            fileNm1: '',
            fileUrl1: '',
            fileNm2: '',
            fileUrl2: '',
            fileNm3: '',
            fileUrl3: '',
            fileNm4: '',
            fileUrl4: '',
            regId: '',
            updId: '',
        },
        fiPurchaseApprovalDtos: [],
    }
    /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        if (this.props.row !== '') {
            var _fiPurchaseDto = this.props.row;

            this.setState({
                purchaseId: _fiPurchaseDto.purchaseId,
                assetNo: _fiPurchaseDto.assetNo,
                remark: _fiPurchaseDto.remark,

                fiPurchaseDto: {
                    purchaseId: _fiPurchaseDto.purchaseId,
                    statusCd: _fiPurchaseDto.statusCd,
                    entityCd: _fiPurchaseDto.entityCd,
                    branchCd: _fiPurchaseDto.branchCd,
                    purchaseReqDt: _fiPurchaseDto.purchaseReqDt,
                    purchaseRefNo: _fiPurchaseDto.purchaseRefNo,
                    assetNo: _fiPurchaseDto.assetNo,
                    categoryCd: _fiPurchaseDto.categoryCd,
                    categoryDtlCd: _fiPurchaseDto.categoryDtlCd,
                    categoryDtlReason: _fiPurchaseDto.categoryDtlReason,
                    growthYn: _fiPurchaseDto.growthYn,
                    maintenanceYn: _fiPurchaseDto.maintenanceYn,
                    maintenanceAssetNo: _fiPurchaseDto.maintenanceAssetNo,
                    maintenanceEqId: _fiPurchaseDto.maintenanceEqId,
                    budgetYn: _fiPurchaseDto.budgetYn,
                    productNm: _fiPurchaseDto.productNm,
                    productQty: _fiPurchaseDto.productQty,
                    vendorId: _fiPurchaseDto.vendorId,
                    manufaturer: _fiPurchaseDto.manufaturer,
                    evidenceCd: _fiPurchaseDto.evidenceCd,
                    evidenceReason: _fiPurchaseDto.evidenceReason,
                    currencyCd: _fiPurchaseDto.currencyCd,

                    currencyAmt: Number(_fiPurchaseDto.currencyAmt).toLocaleString(),
                    currencyVatAmt: Number(_fiPurchaseDto.currencyVatAmt).toLocaleString(),
                    exchangeRate: _fiPurchaseDto.exchangeRate,
                    exchangeKRW: Number(_fiPurchaseDto.exchangeKRW).toLocaleString(),
                    carRate: _fiPurchaseDto.carRate,
                    carGBP: Number(_fiPurchaseDto.carGBP).toLocaleString(),

                    docQtyCd: _fiPurchaseDto.docQtyCd,
                    docQtyReason: _fiPurchaseDto.docQtyReason,
                    termsDays: _fiPurchaseDto.termsDays,
                    termsChangeYn: _fiPurchaseDto.termsChangeYn,
                    termsReason: _fiPurchaseDto.termsReason,
                    reason: _fiPurchaseDto.reason,
                    remark: _fiPurchaseDto.remark,
                    dEBIT: _fiPurchaseDto.dEBIT,
                    cREDIT: _fiPurchaseDto.cREDIT,
                    productRefNo: _fiPurchaseDto.productRefNo,
                    voucherRefNo: _fiPurchaseDto.voucherRefNo,
                    fixCurrencyAmt: _fiPurchaseDto.fixCurrencyAmt,
                    fixCurrencyVatAmt: _fiPurchaseDto.fixCurrencyVatAmt,
                    partialCnt: _fiPurchaseDto.partialCnt,
                    regId: _fiPurchaseDto.regId,
                    updId: _fiPurchaseDto.updId,
                    vendorNm: _fiPurchaseDto.vendorNm,

                    regIdNm: _fiPurchaseDto.regIdNm,
                    regIdDeptFullNm: _fiPurchaseDto.regIdDeptFullNm,
                    statusCdNm: _fiPurchaseDto.statusCdNm,
                    entityCdNm: _fiPurchaseDto.entityCdNm,
                    branchCdNm: _fiPurchaseDto.branchCdNm,
                    currencyCdNm: _fiPurchaseDto.currencyCdNm,
                    categoryCdNm: _fiPurchaseDto.categoryCdNm,
                    categoryDtlCdNm: _fiPurchaseDto.categoryDtlCdNm,
                    docQtyCdNm: _fiPurchaseDto.docQtyCdNm,
                    evidenceCdNm: _fiPurchaseDto.evidenceCdNm,

                    apprId: _fiPurchaseDto.apprId,
                }
            })

            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetPurchaseDetailData", {
                params: {
                    purchaseId: _fiPurchaseDto.purchaseId,
                    userId: this.props.storeState.userInfo.userId
                }
            }).then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;

                // Division
                var strDivision = '';
                data.fiPurchaseDivisionDtos.map((row) => {
                    strDivision += row.divisionCdNm + ', ';
                })
                // File
                var fileNm_M, fileNm_1, fileNm_2, fileNm_3, fileNm_4 = '';
                var fileUrl_M, fileUrl_1, fileUrl_2, fileUrl_3, fileUrl_4 = '';

                data.fiPurchaseFileDtos.map((row, i) => {
                    if (row.fileSeq === 100) {
                        fileNm_M = row.fileNm;
                        fileUrl_M = row.fileUrl;
                    }
                    if (row.fileSeq === 101) {
                        fileNm_1 = row.fileNm;
                        fileUrl_1 = row.fileUrl;
                    }
                    if (row.fileSeq === 102) {
                        fileNm_2 = row.fileNm;
                        fileUrl_2 = row.fileUrl;
                    }
                    if (row.fileSeq === 103) {
                        fileNm_3 = row.fileNm;
                        fileUrl_3 = row.fileUrl;
                    }
                    if (row.fileSeq === 104) {
                        fileNm_4 = row.fileNm;
                        fileUrl_4 = row.fileUrl;
                    }
                })

                var arrApprovalObj = [];
                data.fiPurchaseApprovalDtos.map((row) => {
                    arrApprovalObj.push(row)
                })
                this.setState({
                    fiPurchaseFileDtos: {
                        fileNmMain: fileNm_M,
                        fileUrlMain: fileUrl_M,
                        fileNm1: fileNm_1,
                        fileUrl1: fileUrl_1,
                        fileNm2: fileNm_2,
                        fileUrl2: fileUrl_2,
                        fileNm3: fileNm_3,
                        fileUrl3: fileUrl_3,
                        fileNm4: fileNm_4,
                        fileUrl4: fileUrl_4,
                    },
                    fiPurchaseDivisionDtos: strDivision,
                    arrApprovalObj: arrApprovalObj
                })
            }).catch(function (error) {
                alert(error);
            });
        }
    }

    /*==========================================================*/
    /* Close    */
    /*==========================================================*/
    saveResponsePurchaseClose(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveResponsePurchaseClose", {}, {
            params: {
                purchaseId: this.state.purchaseId,
                updId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Update    */
    /*==========================================================*/
    updateResponsePurchase() {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/UpdateResponsePurchase", {}, {
            params: {
                purchaseId: this.state.purchaseId,
                assetNo: this.state.assetNo,
                remark: this.state.remark,
                fileNm4: this.state.fiPurchaseFileDtos.fileNm4,
                fileUrl4: this.state.fiPurchaseFileDtos.fileUrl4,
                updId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Paid    */
    /*==========================================================*/
    saveResponsePurchasePaid() {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveResponsePurchasePaid", {}, {
            params: {
                purchaseId: this.state.purchaseId,
                updId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 파일 업로드    */
    /*==========================================================*/
    onfileUploadClick(e) {
        var id = e.target.id;

        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'Purchase')
        frmFiles.append('userId', this.props.storeState.userInfo.userId)
        frmFiles.append('file', e.target.files[0])

        this.props.onIsLoadingTrue();
        axios.post(this.props.storeState.serviceUrl + "/CommonService/UploadFiels", frmFiles, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(r => {
            var data = r.data;
            this.props.onIsLoadingFalse();

            this.setState({
                fiPurchaseFileDtos: {
                    ...this.state.fiPurchaseFileDtos,
                    fileNm4: data[0].fileNm,
                    fileUrl4: data[0].fileUrl,
                }
            })

        }).catch(function (error) {
            alert(error);
        });
    }

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }
    render() {
        return (<>
            <Form style={{ marginTop: 15 }}>
                <Form.Row>
                    <div className="col-md-12 text-right">
                        <Button variant="secondary" onClick={this.updateResponsePurchase.bind(this)} >Update</Button> {' '}
                        {
                            this.state.fiPurchaseDto.statusCd === '10'
                            ? <Button variant="danger" id="btnClose" onClick={this.saveResponsePurchaseClose.bind(this)} >Close</Button>
                            : <></>
                        }
                        {
                            this.state.fiPurchaseDto.statusCd === '25'
                            ? <Button variant="success" id="btnPaid" onClick={this.saveResponsePurchasePaid.bind(this)} >Paid</Button>
                            : <></>
                        }

                    </div>
                </Form.Row>
            </Form>
            <div className="table-responsive">
                <Table bordered style={{ marginTop: 15, tableLayout: 'fixed' }} >
                    <colgroup>
                        <col style={{ width: '150px' }} />
                        <col style={{ width: '300px' }} />
                        <col style={{ width: '150px' }} />
                        <col style={{ width: '300px' }} />
                    </colgroup>
                    <tbody>
                        <tr style={{ borderTop: '5px solid #e9ecef' }}>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Asset No</th>
                            <td>
                                <Form.Control type="text" size="sm"
                                    name="assetNo"
                                    className="responseRemarkBackcolor"
                                    value={this.state.assetNo} onChange={this.onChangeHandler.bind(this)}
                                />
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Remark</th>
                            <td>
                                <Form.Control type="text" size="sm"
                                    name="remark"
                                    className="responseRemarkBackcolor"
                                    value={this.state.remark} onChange={this.onChangeHandler.bind(this)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Registor</th>
                            <td>
                                {this.state.fiPurchaseDto.regIdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Department</th>
                            <td>
                                {this.state.fiPurchaseDto.regIdDeptFullNm}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Status</th>
                            <td>
                                {this.state.fiPurchaseDto.statusCdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Purchasing Date</th>
                            <td>
                                {this.state.fiPurchaseDto.purchaseReqDt}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Entity Name</th>
                            <td>
                                {this.state.fiPurchaseDto.entityCdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Branch</th>
                            <td>
                                {this.state.fiPurchaseDto.branchCdNm}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ PR No</th>
                            <td>
                                {this.state.fiPurchaseDto.productRefNo}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Asset No</th>
                            <td>
                                {this.state.fiPurchaseDto.assetNo}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Division</th>
                            <td colSpan={3}>
                                {this.state.fiPurchaseDivisionDtos}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ PR Category</th>
                            <td colSpan={3}>
                                {this.state.fiPurchaseDto.categoryCdNm} - {this.state.fiPurchaseDto.categoryDtlCdNm}
                                {
                                    this.state.fiPurchaseDto.categoryDtlReason === '' ? '' : ' : ' + this.state.fiPurchaseDto.categoryDtlReason
                                }
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Included CAPEX Budget?</th>
                            <td colSpan={3}>
                                {this.state.fiPurchaseDto.budgetYn}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Product Name</th>
                            <td>
                                {this.state.fiPurchaseDto.productNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Product Qty</th>
                            <td>
                                {this.state.fiPurchaseDto.productQty}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Vendor</th>
                            <td>
                                {this.state.fiPurchaseDto.vendorNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Manufaturer</th>
                            <td>
                                {this.state.fiPurchaseDto.manufaturer}
                            </td>
                        </tr>
                        <tr>
                       
                            <td colSpan={2} style={{ backgroundColor: '#ccc' }}>
                                <table style={{ width: '100%' }}>
                                    <colgroup>
                                        <col style={{ width: '150px' }} />
                                        <col style={{ width: '300px' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Evidence Docs</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                {this.state.fiPurchaseDto.evidenceCdNm}
                                                {this.state.fiPurchaseDto.evidenceReason === '' ? '' : ' - ' + this.state.fiPurchaseDto.evidenceReason}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ SubTOTAL In</th>
                                            <td style={{ backgroundColor: '#fafafa', textAlign: 'right', fontWeight: 'bold' }}>
                                                {this.state.fiPurchaseDto.currencyCdNm}
                                                {' - '}
                                                <span style={{ color: 'red', fontSize: '1.2em' }}>
                                                    {this.state.fiPurchaseDto.currencyAmt}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ VAT (10%)</th>
                                            <td style={{ backgroundColor: '#fafafa', textAlign: 'right', fontWeight: 'bold' }}>
                                                <span style={{ color: 'red', fontSize: '1.2em' }}>
                                                    {this.state.fiPurchaseDto.currencyVatAmt}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Exchange Rate</th>
                                            <td style={{ backgroundColor: '#fafafa', textAlign: 'right', fontWeight: 'bold' }}>
                                                {this.state.fiPurchaseDto.exchangeRate}
                                                {' - '}
                                                <span style={{ color: 'red', fontSize: '1.2em' }}>
                                                    {this.state.fiPurchaseDto.exchangeKRW}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ CAR Rate</th>
                                            <td style={{ backgroundColor: '#fafafa', textAlign: 'right', fontWeight: 'bold' }}>
                                                {this.state.fiPurchaseDto.carRate}
                                                {' - '}
                                                <span style={{ color: 'red', fontSize: '1.2em' }}>
                                                    {this.state.fiPurchaseDto.carGBP}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef', height: 40 }}>{' '}</th>
                                            <td style={{ backgroundColor: '#fafafa', textAlign: 'right', fontWeight: 'bold' }}>
                                                {' '}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td colSpan={2} style={{ backgroundColor: '#ccc' }}>
                                <table style={{ width: '100%' }}>
                                    <colgroup>
                                        <col style={{ width: '150px' }} />
                                        <col style={{ width: '300px' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Quotations</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                {this.state.fiPurchaseDto.docQtyCdNm}
                                                {this.state.fiPurchaseDto.docQtyReason === '' ? '' : ' - ' + this.state.fiPurchaseDto.docQtyReason}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ File Main</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                <a href={this.state.fiPurchaseFileDtos.fileUrlMain} target={"_blank"}>
                                                    {this.state.fiPurchaseFileDtos.fileNmMain}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ File 1</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                <a href={this.state.fiPurchaseFileDtos.fileUrl1} target={"_blank"}>
                                                    {this.state.fiPurchaseFileDtos.fileNm1}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ File 2</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                {
                                                    this.state.fiPurchaseFileDtos.fileUrl2 === ''
                                                        ? <></>
                                                        : <a href={this.state.fiPurchaseFileDtos.fileUrl2} target={"_blank"}>
                                                            {this.state.fiPurchaseFileDtos.fileNm2}
                                                        </a>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ File 3</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                {
                                                    this.state.fiPurchaseFileDtos.fileUrl3 === ''
                                                        ? <></>
                                                        : <a href={this.state.fiPurchaseFileDtos.fileUrl3} target={"_blank"}>
                                                            {this.state.fiPurchaseFileDtos.fileNm3}
                                                        </a>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ File 4</th>
                                            <td style={{ backgroundColor: '#fafafa' }}>
                                                <InputGroup style={{ marginBottom: 0, paddingBottom: 0 }}>
                                                    <Form.Control type="text" size="sm"
                                                        name="fileNm4"
                                                        value={this.state.fiPurchaseFileDtos.fileNm4}
                                                        readOnly
                                                    />
                                                    <Form.File
                                                        ref={(ref) => this.file4upload = ref}
                                                        label="file upload click !!"
                                                        custom
                                                        multiple={false}
                                                        onChange={this.onfileUploadClick.bind(this)}
                                                        id='file4'
                                                        style={{ display: 'none' }}
                                                    />
                                                    <InputGroup.Append>
                                                        <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                            onClick={() => { this.file4upload.click() }}
                                                        >
                                                            <i className='fa fa-search' />
                                                        </Button>
                                                        <Button variant="danger" size="sm" style={{ height: 31 }}
                                                            onClick={() => this.setState({
                                                                fiPurchaseFileDtos: {
                                                                    ...this.state.fiPurchaseFileDtos,
                                                                    fileNm4: '',
                                                                    fileUrl4: '',
                                                                }
                                                            })}
                                                        >
                                                            <i className='fa fa-trash-alt' />
                                                        </Button>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Payment terms</th>
                            <td colSpan={3}>
                                <span style={{ color: this.state.fiPurchaseDto.termsChangeYn === 'Y' ? 'red' : '#555' }}>
                                    {this.state.fiPurchaseDto.termsDays}
                                </span>
                                {this.state.fiPurchaseDto.termsReason === '' ? '' : ' - ' + this.state.fiPurchaseDto.termsReason}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Reason</th>
                            <td colSpan={3} style={{ height: 100 }}>
                                {this.state.fiPurchaseDto.reason}
                            </td>
                        </tr>
                        {
                            this.state.arrApprovalObj.map((row) => {
                                return <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>{row.apprCdNm}</th>
                                    <td colSpan={3}>
                                        {row.taskingUserNm}
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
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
)(FiPurchaseRequestDetail)
