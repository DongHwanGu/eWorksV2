import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, ListGroup, InputGroup, Spinner } from 'react-bootstrap';

import GDHQuillEditor from '../../common/Editor/GDHQuillEditor';
import Parser from 'html-react-parser';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class PurchaseRequestListSub extends Component {
    state = {
        pageGb: this.props.pageGb,
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
            subOpenYn: 'N',

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

            partialTotalAmount: 0

        },
        modalEmailShow: false,
        fiPurchaseProductOrderEmail: {
            purchaseId: 0,
            fromEmail: '',
            toEmail: '',
            ccEmail: '',
            mailSubject: '',
            mailBody: '',
        },
        emailFileGrid: {
            columnDefs:
                [
                    { headerName: 'fileNm', field: 'fileNm', minWidth: 300 },
                    {
                        headerName: 'Delete', field: 'Delete', minWidth: 100,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            var fileSeq = params.data.fileSeq;
                            return (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }} onClick={() => { 
                                    this.deleteEmailfile(policyId, fileSeq);
                                 }}>삭제</span>
                            )
                        }
                    },
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
        modalPartialShow: false,
        patialCnt: 1,
        partialGrid: {
            columnDefs:
                [
                    {
                        headerName: 'Status', field: 'statusCdNm', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var partialId = params.data.partialId; 
                            var statusCdNm = params.data.statusCdNm;
                            if (statusCdNm.indexOf('승인요청항목') > -1  && this.state.pageGb === 'Approved') {
                                return (<><Spinner animation="grow" variant="danger" size="sm" /></>)
                            }
                            else {
                                if(statusCdNm.indexOf('승인요청항목') > -1)
                                    return (<>{statusCdNm.split('|')[1]}</>)
                                if (this.state.pageGb === 'Request' && statusCdNm === '대기중' && this.state.fiPurchaseDto.partialCnt > 1 && this.state.partialGrid.rowData.length > 1)
                                    return (<>
                                        <span style={{ color: '#dc3545', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => {
                                            this.deleteVoucherPartial(partialId);
                                        }}>삭제</span>
                                    </>)
                                else
                                    return (<>{statusCdNm}</>)
                            }
                            
                        }
                    },
                    {
                        headerName: 'OP Verification', field: 'verificationDt', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var partialId = params.data.partialId; 
                            var statusCd = params.data.statusCd;
                            var verificationDt = params.data.verificationDt;
                            var entityCd = this.state.fiPurchaseDto.entityCd;
                            if (statusCd === '01' && this.state.pageGb === 'Request') {
                                return (<span style={{ color: '#5cb85c', fontWeight: 'bold', cursor: 'pointer' }} 
                                    onClick={() => {
                                        this.setState({
                                            partialId: partialId,
                                            modalOPVerificationShow: true,
                                            verificationDt: new Date(),
                                        })
                                    }}
                                >OP Verification</span>)
                            }
                            else {
                                return ( <spna style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => {
                                        var userId = this.props.storeState.userInfo.userId;
                                        var page = entityCd === '01' 
                                                        ? "Purchase_OP_ETL_Report"
                                                        : entityCd === '02'
                                                            ?  "Purchase_OP_Kimsco_Report" : "Purchase_OP_Testing_Report";
                                        var key = this.state.fiPurchaseDto.purchaseId.toString() + "," + partialId.toString();
                                        var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                        window.open(this.props.storeState.reportUrl + url, '_blank');
                                }}>{verificationDt}</spna> )
                            }
                            
                        }
                    },
                    {
                        headerName: 'Issue a tax invoice', field: 'invoiceDt', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var partialId = params.data.partialId; 
                            var statusCd = params.data.statusCd;
                            var invoiceDt = params.data.invoiceDt;
                            var invoiceUrl = params.data.fileUrl;
                            if (statusCd === '02' && this.state.pageGb === 'Request') {
                                return ( <span style={{ color: '#5cb85c', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => {
                                    this.setState({
                                        partialId: partialId,
                                        modalInvoiceShow: true,
                                        invoiceDt: new Date(),
                                        invoiceFileNm: '',
                                        invoiceFileUrl: ''
                                    })
                                }} >tax a invoice</span> )
                            }
                            else {
                                if (invoiceDt === '') { return (<spna>{'-'}</spna>) }
                                return (<spna style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => {
                                        window.open(invoiceUrl, '_blank');
                                    }}>{invoiceDt}</spna> )
                            }
                            
                        }
                    },
                    {
                        headerName: 'Voucher No', field: 'partialVoucherRefNo', minWidth: 200,
                        cellRendererFramework: (params) => {
                            var partialId = params.data.partialId; 
                            var statusCd = params.data.statusCd;
                            var partialReqDt = params.data.partialReqDt;
                            var partialVoucherRefNo = params.data.partialVoucherRefNo;
                            if (statusCd === '03' && this.state.pageGb === 'Request') {
                                return ( <span style={{ color: '#5cb85c', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => {
                                    this.setState({
                                        partialStatusCd: statusCd,
                                        partialId: partialId,
                                        modalVoucherShow: true,
                                        termsDays: this.state.fiPurchaseDto.termsDays,
                                        partialAmt: this.state.fiPurchaseDto.partialCnt === 1 ? this.state.fiPurchaseDto.currencyAmt : '0',
                                        partialVatAmt: this.state.fiPurchaseDto.partialCnt === 1 ? this.state.fiPurchaseDto.currencyVatAmt : '0',
                                        partialVoucherRefNo: '',
                                        partialReqDt:  this.props.storeState.getParsedDate(new Date(), '-'),
                                        bankNm:'',
                                        bankAccNo: '',
                                        reason: '',
                                        apprId: 0,
                                        arrApprovalObj: []
                                    })
                                }} >Request</span>)
                            }
                            else {
                                if (partialReqDt === '') { return (<spna>{'-'}</spna>) }
                                return (
                                    <spna style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => {
                                            var userId = this.props.storeState.userInfo.userId;
                                            var page = "Purchase_VC_Report";
                                            var key = this.state.fiPurchaseDto.purchaseId.toString() + "," + partialId.toString();
                                            var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                            window.open(this.props.storeState.reportUrl + url, '_blank');
                                        }}>{partialVoucherRefNo}</spna>
                                )
                            }
                        }
                    },
                    { headerName: 'Amount', field: 'partialAmt', minWidth: 150 },
                    { headerName: 'Vat', field: 'partialVatAmt', minWidth: 150 },

                    { headerName: 'Bank', field: 'bankNm', minWidth: 150 },
                    { headerName: 'BankAccNo', field: 'bankAccNo', minWidth: 150 },
                    { headerName: 'Req Dt', field: 'partialReqDt', minWidth: 150 },
                    { headerName: 'TermsDays', field: 'termsDays', minWidth: 150 },
                    { headerName: 'Scheduled Dt', field: 'termsScheduledDt', minWidth: 150 },
                    
                    { headerName: 'AssetNo', field: 'assetNo', minWidth: 150 },
                    { headerName: 'Remark', field: 'remark', minWidth: 150 },

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
        partialId: 0,
        modalOPVerificationShow: false,
        verificationDt: new Date(),

        modalInvoiceShow: false,
        invoiceDt: new Date(),
        invoiceFileNm: '',
        invoiceFileUrl: '',

        partialStatusCd: '',
        partialVoucherRefNo: '',
        partialReqDt: '',
        modalVoucherShow: false,
        bankNm:'',
        bankAccNo: '',
        termsDays: '',
        partialAmt: '0',
        partialVatAmt: '0',
        reason: '',

        apprId: 0,
        apprRemark: '',
        arrApprovalObj: [],

        partialAssetNo: '',
        partialRemark: '',
    }

    /*==========================================================*/
    /* 페이지 로드    */
    /*==========================================================*/
    componentDidMount() {
        if (this.props.row !== '') {
            var _fiPurchaseDto = this.props.row;
            this.setState({
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

                    subOpenYn: _fiPurchaseDto.subOpenYn,
                    partialTotalAmount: Number(_fiPurchaseDto.partialTotalAmount).toLocaleString(),
                }
            }, () => {
                this.getPurchaseVoucherList(_fiPurchaseDto.purchaseId);
            })
        }
    }

    /*==========================================================*/
    /* Level 삭제  */
    /*==========================================================*/
    deleteEmailfile(policyId, fileSeq) {
        var rows = [...this.state.emailFileGrid.rowData];
        var newRows = [];

        rows.map((row) => {
            if(row.policyId === policyId && row.fileSeq === fileSeq) {

            } else {
                newRows.push(row)
            }
        });

        this.setState({
            emailFileGrid: {
                ...this.state.emailFileGrid,
                rowData: newRows
            }
        })
    }

    /*==========================================================*/
    /* 이메일 전송   */
    /*==========================================================*/
    mailSendProductOrder() {
         // 마스터 설정
         var gParam = {
            ...this.state.fiPurchaseProductOrderEmail,
            updId: this.props.storeState.userInfo.userId,
        }
        var gParamFile = [];
        this.state.emailFileGrid.rowData.map((row) => {
            gParamFile.push({
                fileNm: row.fileNm,
                fileUrl: row.fileUrl,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId    
            })
        })

        var gParamGroup = {
            fiPurchaseProductOrderEmail: gParam,
            fiPurchaseProductOrderEmailFileDtos: gParamFile,
        }
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/MailSendProductOrder",
            gParamGroup)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalEmailShow: false
                })
                this.props.saveCallback();
            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 이메일 오픈   */
    /*==========================================================*/
    getPurchaseProductOrderEmail() {
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetPurchaseProductOrderEmail", {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            var arrFileMain = [];
            arrFileMain.push(data.fiPurchaseProductOrderEmailFileDtos[0]);

            this.setState({
                modalEmailShow: true,
                fiPurchaseProductOrderEmail: {
                    ...this.state.fiPurchaseProductOrderEmail,
                    purchaseId: data.fiPurchaseProductOrderEmail.purchaseId,
                    fromEmail: data.fiPurchaseProductOrderEmail.fromEmail,
                    toEmail: data.fiPurchaseProductOrderEmail.toEmail,
                    ccEmail: data.fiPurchaseProductOrderEmail.ccEmail,
                    mailSubject: data.fiPurchaseProductOrderEmail.mailSubject,
                    mailBody: data.fiPurchaseProductOrderEmail.mailBody,
                },
                emailFileGrid: {
                    ...this.state.emailFileGrid,
                    rowData: arrFileMain
                }
            })
            
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Voucher Patial 가져오기  */
    /*==========================================================*/
    getPurchaseVoucherList(id) {
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetPurchaseVoucherList", {
            params: {
                purchaseId: id,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;

            data.forEach(row => {
                row.partialAmt = Number(row.partialAmt).toLocaleString();
                row.partialVatAmt = Number(row.partialVatAmt).toLocaleString();
            })
            this.setState({
                partialGrid: {
                    ...this.state.partialGrid,
                    rowData: data
                }
            });
        }).catch(function (error) {
            alert(error);
        });
    }


    /*==========================================================*/
    /* Voucher Patial 나누기   */
    /*==========================================================*/
    saveVoucherPartialCnt() {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveVoucherPartialCnt",
            {}, {
                params: {
                    purchaseId: this.state.fiPurchaseDto.purchaseId,
                    patialCnt: this.state.patialCnt,
                    userId: this.props.storeState.userInfo.userId
                }
            })
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalPartialShow: false
                })
                this.props.saveCallback();
            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* OP Veri Data 저장   */
    /*==========================================================*/
    saveOPVerificationData() {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveOPVerificationData",
        {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: this.state.partialId,
                verificationDt: this.props.storeState.getParsedDate(this.state.verificationDt),
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalOPVerificationShow: false
            })
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Tax Invoice 저장   */
    /*==========================================================*/
    saveTaxInvoiceData() {
        if(this.state.invoiceFileNm === '') {
            alert('Invoice 등록 후 진행해 주세요.')
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveTaxInvoiceData",
        {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: this.state.partialId,
                invoiceDt: this.props.storeState.getParsedDate(this.state.invoiceDt),
                fileNm: this.state.invoiceFileNm,
                fileUrl: this.state.invoiceFileUrl,
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalInvoiceShow: false
            })
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Tax Invoice 저장   */
    /*==========================================================*/
    saveTaxInvoiceData() {
        if(this.state.invoiceFileNm === '') {
            alert('Invoice 등록 후 진행해 주세요.')
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveTaxInvoiceData",
        {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: this.state.partialId,
                invoiceDt: this.props.storeState.getParsedDate(this.state.invoiceDt),
                fileNm: this.state.invoiceFileNm,
                fileUrl: this.state.invoiceFileUrl,
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalInvoiceShow: false
            })
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Partial 저장   */
    /*==========================================================*/
    saveVoucherPartialData() {
        if(this.state.bankNm === '') {
            alert('Bank 등록 후 진행해 주세요.')
            return;
        }
        if(this.state.bankAccNo === '') {
            alert('Bank account No 등록 후 진행해 주세요.')
            return;
        }
        if(this.state.partialAmt === '0') {
            alert('Amount 등록 후 진행해 주세요.')
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveVoucherPartialData",
        {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: this.state.partialId,
                bankNm: this.state.bankNm,
                bankAccNo: this.state.bankAccNo,
                termsDays: Number(this.state.termsDays),
                partialAmt: Number(this.state.partialAmt.toString().replaceAll(',', '')),
                partialVatAmt: Number(this.state.partialVatAmt.toString().replaceAll(',', '')),
                reason: this.state.reason,
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalInvoiceShow: false
            })
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Partial Approval 저장   */
    /*==========================================================*/
    saveTaskingPurchasePartialApproval(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveTaskingPurchasePartialApproval", {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: this.state.partialId,
                apprId: this.state.apprId,
                remark: this.state.apprRemark,
                statusCd: btnId === 'btnApproval' ? '10' : '99',
                updId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalVoucherShow: false,
            })
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Partial Add End 저장   */
    /*==========================================================*/
    saveVoucherPartialAddEnd(e) {
        var btnId = e.target.id;

        if (window.confirm(btnId === 'btnVoucherAdd' ? "Voucher를 추가 하시겠습니까?" : "Voucher를 종료 하시겠습니까? ")) {
            axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveVoucherPartialAddEnd", {}, {
                params: {
                    purchaseId: this.state.fiPurchaseDto.purchaseId,
                    btnGb: btnId === 'btnVoucherAdd' ? '01' : '25',
                    userId: this.props.storeState.userInfo.userId
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
    }

    /*==========================================================*/
    /* Partial 삭제   */
    /*==========================================================*/
    deleteVoucherPartial(partialId) {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/DeleteVoucherPartial", {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: partialId,
                userId: this.props.storeState.userInfo.userId
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
    /* Partial Update  */
    /*==========================================================*/
    updateResponsePurchasePartial() {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/UpdateResponsePurchasePartial", {}, {
            params: {
                purchaseId: this.state.fiPurchaseDto.purchaseId,
                partialId: this.state.partialId,
                assetNo: this.state.partialAssetNo,
                remark: this.state.partialRemark,
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
    /* Partial Double Click   */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var purchaseId = data[0].purchaseId;
        var partialId = data[0].partialId;
        var termsDays = data[0].termsDays;
        var partialAmt = data[0].partialAmt;
        var partialVatAmt = data[0].partialVatAmt;
        var partialStatusCd = data[0].statusCd;
        var partialVoucherRefNo = data[0].partialVoucherRefNo;
        var partialReqDt = data[0].partialReqDt;
        var bankNm = data[0].bankNm;
        var bankAccNo = data[0].bankAccNo;
        var reason = data[0].reason;
        var partialAssetNo = data[0].assetNo;
        var partialRemark = data[0].remark;
        var userId = this.props.storeState.userInfo.userId;

        var statusCdNm = data[0].statusCdNm;
        var apprId = 0;

        if (statusCdNm.indexOf('승인요청항목') > -1  && this.state.pageGb === 'Approved') {
            apprId = Number(statusCdNm.split('|')[2])
        }

        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetPurchaseVoucherApprovalList", {
            params: {
                purchaseId, partialId, userId
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                partialStatusCd: partialStatusCd,
                partialId: partialId,
                modalVoucherShow: true,
                termsDays: termsDays,
                partialAmt: partialAmt,
                partialVatAmt: partialVatAmt,
                partialVoucherRefNo: partialVoucherRefNo,
                partialReqDt: partialReqDt,
                bankNm: bankNm,
                bankAccNo: bankAccNo,
                reason: reason,
                apprId: apprId,
                partialAssetNo: partialAssetNo,
                partialRemark: partialRemark,
                arrApprovalObj: [],
            }, () => {
                this.setState({
                    arrApprovalObj: data
                })
            })
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
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }

    onChangeHandlerEmail(e) {
        this.setState({
            fiPurchaseProductOrderEmail: {
                ...this.state.fiPurchaseProductOrderEmail,
                [e.target.name]: e.target.value
            }
        });
    }
    onQuillChangeHandlerEmail(name, desc) {
        this.setState({
            fiPurchaseProductOrderEmail: {
                ...this.state.fiPurchaseProductOrderEmail,
                [name]: desc
            }
        });
    }
    // Blur
    onBlurHandler(e) {
        var name = e.target.name;
        var value = e.target.value.replaceAll(',', '');
        if (Number(value) === 'NaN') {
            value = 0;
        }
        var _currencyAmt = '';
        var _currencyVatAmt = '';

        if (name === 'partialAmt') {
            // KRW
            if (this.state.fiPurchaseDto.currencyCd === '90') {
                _currencyAmt = Number(value).toLocaleString();
                // 세금계산서
                if (this.state.fiPurchaseDto.evidenceCd === '01') {
                    _currencyVatAmt = Number((parseInt(Number(value) * 10) / 100).toFixed(0)).toLocaleString();
                } else {
                    _currencyVatAmt = 0;
                }
            }
            // 해외
            else {
                _currencyAmt = Number(Number(value).toFixed(2)).toLocaleString();
                _currencyVatAmt = '0';
            }

            this.setState({
                partialAmt: _currencyAmt,
                partialVatAmt: _currencyVatAmt,
            })
        }

        if (name === 'partialVatAmt') {
            if (this.state.fiPurchaseDto.currencyCd === '90') {
                this.setState({
                    partialVatAmt: Number(value).toLocaleString(),
                })
            }
        }
    }

    /*==========================================================*/
    /* email 파일 업로드    */
    /*==========================================================*/
    onfileUploadClick(e) {
        var id = e.target.id;

        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'Purchase')
        frmFiles.append('userId', this.props.storeState.userInfo.userId)

        axios.post(this.props.storeState.serviceUrl + "/CommonService/UploadFiels", frmFiles, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(r => {
            var data = r.data;

            if(id === 'fileInvoice') {
                this.setState({
                    invoiceFileNm: data[0].fileNm,
                    invoiceFileUrl: data[0].fileUrl
                })

            }
            if (id === 'fileMail') {
                
                var grid = [...this.state.emailFileGrid.rowData];

                var arrSeq = [];
                grid.forEach(row => {
                    arrSeq.push(row.fileSeq);
                })
                var maxSeq = Math.max.apply(null, arrSeq);
                data.forEach(row => {
                    maxSeq = maxSeq + 1;
                    grid.push({
                        purchaseId: this.state.fiPurchaseDto.purchaseId,
                        fileSeq: maxSeq,
                        fileNm: row.fileNm,
                        fileUrl: row.fileUrl
                    });
                });

                this.setState({
                    emailFileGrid: {
                        ...this.state.emailFileGrid,
                        rowData: []
                    }
                }, () => {
                    this.setState({
                        emailFileGrid: {
                            ...this.state.emailFileGrid,
                            rowData: grid
                        }
                    })
                })
            }
        }).catch(function (error) {
            alert(error);
        });
    }
    render() {
        const arrMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        return (<>
            <ListGroup style={{ fontWeight: 'normal' }}>
                {
                    this.state.pageGb === 'Request'
                        ? <ListGroup.Item>
                            <span style={{ fontWeight: 'bold' }}>■ Product Order : </span>
                            <Button variant="outline-success" style={{ width: 100, marginLeft: 15 }}
                                onClick={this.getPurchaseProductOrderEmail.bind(this)}
                            >Email</Button>
                        </ListGroup.Item>
                        : <></>
                }
                <ListGroup.Item>
                    {
                        this.state.fiPurchaseDto.statusCd === '10' && this.state.fiPurchaseDto.partialCnt === 0 && this.state.pageGb === 'Request'
                            ? <>
                                <span style={{ fontWeight: 'bold' }}>■ Voucher : </span>
                                <Button variant="outline-success" style={{ width: 100, marginLeft: 15 }}
                                    onClick={() => {
                                        this.setState({
                                            modalPartialShow: true
                                        })
                                    }}
                                >Partial</Button>
                            </>
                            : <>
                                <table>
                                    <colgroup>
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col style={{ width: '100%' }} />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#fff', border: 'none', padding: 0, paddingRight: 15 }}>■ PR Amt : </td>
                                            <td style={{ backgroundColor: '#fff', border: 'none', padding: 0, paddingRight: 15 }}>
                                                <span style={{ color: 'rgb(200, 35, 51)', fontSize: '1.2em', fontWeight: 'bold' }}>{this.state.fiPurchaseDto.currencyAmt} </span>
                                            </td>
                                            <td style={{ backgroundColor: '#fff', border: 'none', padding: 0, paddingRight: 15 }}>■ VAT Amt : </td>
                                            <td style={{ backgroundColor: '#fff', border: 'none', padding: 0 }}>
                                                <span style={{ color: 'rgb(200, 35, 51)', fontSize: '1.2em', fontWeight: 'bold' }}>{this.state.fiPurchaseDto.currencyVatAmt}</span>
                                            </td>
                                            <td style={{ backgroundColor: '#fff', border: 'none', padding: 0 }}></td>
                                            {
                                                this.state.pageGb === 'Request' && this.state.fiPurchaseDto.partialCnt > 1 && this.state.fiPurchaseDto.statusCd === '24'
                                                    ? <td style={{ backgroundColor: '#fff', border: 'none', padding: 0 }}>
                                                        <Button variant="outline-secondary" id='btnVoucherAdd' onClick={this.saveVoucherPartialAddEnd.bind(this)}>Voucher Add</Button>{' '}
                                                        <Button variant="outline-success" id='btnVoucherEnd' onClick={this.saveVoucherPartialAddEnd.bind(this)}>Voucher End</Button>
                                                    </td>
                                                    : <></>
                                            }

                                        </tr>
                                    </tbody>
                                </table>
                            </>
                    }
                    
                </ListGroup.Item>
                {
                    this.state.fiPurchaseDto.partialCnt > 0
                        ? <ListGroup.Item style={{ padding: 0 }}>
                            <div className="ag-theme-material"
                                style={{ height: 200 }}
                            >
                                <AgGridReact headerHeight={40} rowHeight={40}
                                    columnDefs={this.state.partialGrid.columnDefs}
                                    defaultColDef={this.state.partialGrid.defaultColDef}
                                    rowData={this.state.partialGrid.rowData}
                                    rowSelection="single" // single
                                // onGridReady={params => this.gridApi = params.api}
                                    onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                />
                            </div>
                        </ListGroup.Item> : <></>

                }
               
            </ListGroup>


            {/* Modal */}
            <Modal show={this.state.modalEmailShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalEmailShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ To.</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="toEmail"
                                        value={this.state.fiPurchaseProductOrderEmail.toEmail} onChange={this.onChangeHandlerEmail.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ CC.</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="ccEmail"
                                        value={this.state.fiPurchaseProductOrderEmail.ccEmail} onChange={this.onChangeHandlerEmail.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Subject</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="mailSubject"
                                        value={this.state.fiPurchaseProductOrderEmail.mailSubject} onChange={this.onChangeHandlerEmail.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group style={{ marginBottom: 0 }}>
                                    <Form.Label>■ File Attached</Form.Label>
                                    <Form.File
                                        label="file upload click !!"
                                        custom
                                        multiple={true}
                                        id="fileMail"
                                        onChange={this.onfileUploadClick.bind(this)}
                                    />
                                </Form.Group>
                                <div className="ag-theme-material"
                                    style={{ height: 150, marginTop: 0 }}
                                >
                                    <AgGridReact headerHeight={40} rowHeight={40}
                                        columnDefs={this.state.emailFileGrid.columnDefs}
                                        defaultColDef={this.state.emailFileGrid.defaultColDef}
                                        rowData={this.state.emailFileGrid.rowData}
                                        rowSelection="multiple" // single
                                         onGridReady={params => this.gridApiemail = params.api}
                                    // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <Form.Group style={{ height: 400, paddingBottom: 75 }}>
                                    <Form.Label>■ Desc</Form.Label>
                                    <GDHQuillEditor
                                        name="content"
                                        value={this.state.fiPurchaseProductOrderEmail.mailBody} onChange={this.onQuillChangeHandlerEmail.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Button variant="success"
                                    style={{ width: '100%' }}
                                    onClick={this.mailSendProductOrder.bind(this)}
                                >Mail Send</Button>
                            </div>
                            
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* Modal */}
            <Modal show={this.state.modalPartialShow} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveVoucherPartialCnt.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalPartialShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ PR Amt</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="toEmail"
                                        value={this.state.fiPurchaseDto.currencyAmt}
                                        style={{ textAlign: 'right' }} readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ VAT</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="ccEmail"
                                        value={this.state.fiPurchaseDto.currencyVatAmt}
                                        style={{ textAlign: 'right' }} readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Partial</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="patialCnt"
                                        value={this.state.patialCnt} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        {
                                            arrMonth.map((row, i) => {
                                                return <option ket={i} value={row}>{row}</option>;
                                            })
                                        }
                                        
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
            <Modal show={this.state.modalOPVerificationShow} backdrop="static" size="sm">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveOPVerificationData.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalOPVerificationShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ OP Verification</Form.Label>
                                    <GDHDatepicker
                                        name='verificationDt'
                                        value={this.state.verificationDt} onDateChange={this.onDateChange.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* Modal */}
            <Modal show={this.state.modalInvoiceShow} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveTaxInvoiceData.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalInvoiceShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Invoice</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control type="text" size="sm"
                                            name="invoiceFileNm"
                                            value={this.state.invoiceFileNm}
                                            readOnly
                                        />
                                        <Form.File
                                            ref={(ref) => this.fileupload = ref}
                                            label="file upload click !!"
                                            custom
                                            multiple={false}
                                            onChange={this.onfileUploadClick.bind(this)}
                                            id='fileInvoice'
                                            style={{ display: 'none' }}
                                        />
                                        <InputGroup.Append>
                                            <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                onClick={() => { this.fileupload.click() }}
                                            >
                                                <i className='fa fa-search' />
                                            </Button>
                                            <Button variant="danger" size="sm" style={{ height: 31 }}
                                                onClick={() => this.setState({
                                                    invoiceFileNm: '',
                                                    invoiceFileUrl: '',
                                                })}
                                            >
                                                <i className='fa fa-trash-alt' />
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Invoice Dt</Form.Label>
                                    <GDHDatepicker
                                        name='invoiceDt'
                                        value={this.state.invoiceDt} onDateChange={this.onDateChange.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

             {/* Modal */}
             <Modal show={this.state.modalVoucherShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        {
                            this.state.pageGb === 'Response' 
                            ? <><Button variant="secondary" onClick={this.updateResponsePurchasePartial.bind(this)} >Update</Button> {' '}</>
                            : <></>
                        }
                        {
                            this.state.apprId > 0 
                            ? <>
                                <Button variant="success" id="btnApproval" onClick={this.saveTaskingPurchasePartialApproval.bind(this)} >Approval</Button>{' '}
                                <Button variant="danger" id="btnReject" onClick={this.saveTaskingPurchasePartialApproval.bind(this)} >Reject</Button>{' '}
                            </>
                            : <></>
                        }
                        {
                            this.state.partialStatusCd === '03'
                                ? <><Button variant="success" onClick={this.saveVoucherPartialData.bind(this)} >Save</Button>{' '}</>
                                : <></>
                        }
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalVoucherShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            {
                                this.state.pageGb === 'Response'
                                    ? <>
                                        <div className="col-md-12">
                                            <Form.Group>
                                                <Form.Label>■ Asset No</Form.Label>
                                                <Form.Control type="text" size="sm"
                                                    name="partialAssetNo"
                                                    className="responseRemarkBackcolor"
                                                    value={this.state.partialAssetNo} onChange={this.onChangeHandler.bind(this)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-12">
                                            <Form.Group>
                                                <Form.Label>■ Remark</Form.Label>
                                                <Form.Control type="text" size="sm"
                                                    name="partialRemark"
                                                    className="responseRemarkBackcolor"
                                                    value={this.state.partialRemark} onChange={this.onChangeHandler.bind(this)}
                                                />
                                            </Form.Group>
                                        </div>
                                    </>
                                    : <></>
                            }


                            {
                                this.state.apprId > 0
                                    ? <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Comment</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="apprRemark"
                                                className="responseRemarkBackcolor"
                                                value={this.state.apprRemark} onChange={this.onChangeHandler.bind(this)}
                                            />
                                        </Form.Group>
                                    </div> : <></>
                            }
                            
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Requestor</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.fiPurchaseDto.regIdNm}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Voucher No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.partialVoucherRefNo}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Division</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.fiPurchaseDto.regIdDeptFullNm}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Request Date</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.partialReqDt}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Branch</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.fiPurchaseDto.branchCdNm}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ PR amount</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={
                                            Number(
                                                Number(Number(this.state.fiPurchaseDto.currencyAmt.toString().replaceAll(',', '')) + Number(this.state.fiPurchaseDto.currencyVatAmt.toString().replaceAll(',', '')))
                                                    .toFixed(this.state.fiPurchaseDto.currencyCd === '90' ? 0 : 2)
                                            ).toLocaleString()
                                        }
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Beneficiary</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.fiPurchaseDto.vendorNm}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Bank</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name='bankNm'
                                        value={this.state.bankNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Bank account No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name='bankAccNo'
                                        value={this.state.bankAccNo} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Total Amount</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.fiPurchaseDto.partialTotalAmount}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Payment terms</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name='termsDays'
                                        value={this.state.termsDays} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Amount</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name='partialAmt'
                                        value={this.state.partialAmt} 
                                        onChange={this.onChangeHandler.bind(this)}
                                        onBlur={this.onBlurHandler.bind(this)}
                                        style={{ textAlign: 'right' }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Vat</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name='partialVatAmt'
                                        value={this.state.partialVatAmt} 
                                        onChange={this.onChangeHandler.bind(this)}
                                        onBlur={this.onBlurHandler.bind(this)}
                                        style={{ textAlign: 'right' }}
                                        readOnly={this.state.fiPurchaseDto.currencyCd === '90' ? false : true}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Note</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name='reason'
                                        value={this.state.reason} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            {
                                this.state.arrApprovalObj.map((row) => {
                                    return <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>{row.apprCdNm}</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                value={row.taskingUserNm}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>;
                                })
                            }
                        </Form.Row>
                    </Form>
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
)(PurchaseRequestListSub)
