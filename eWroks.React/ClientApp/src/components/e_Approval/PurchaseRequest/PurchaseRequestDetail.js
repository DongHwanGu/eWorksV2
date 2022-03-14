import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import {InputGroup, Alert, ButtonGroup, ToggleButton, Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, ListGroup } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import GDHApprovalSelectOption from '../../common/approval/GDHApprovalSelectOption';
import PurchaseRequestDetailApproval from './PurchaseRequestDetailApproval';

class PurchaseRequestDetail extends Component {
    state = {
        _termsDays: 0,

        arrApprovalObj: [],

        branchCdList: [],
        categoryDtlCdList: [],
        currencyCdList: [],
        // branchCdObj: <GDHSelectOption cdMajor="0036" frCdMinor={'01'} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />,
        // categoryDtlCdObj: <GDHSelectOption cdMajor="0037" level={'21'} frCdMinor={''} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />,
        // currencyCdObj: <GDHSelectOption cdMajor="0100" deleteMinor={'99'} isEmpty={true} isEmptyText="=== Select ===" />,

        fiPurchaseDto: {
            id: 0,
            purchaseId: 0,
            statusCd: '01',
            entityCd: '01',
            branchCd: '',
            purchaseReqDt: new Date(),
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

            statusCdNm: '',
            entityCdNm: '',
            branchCdNm: '',
            vendorNm: '',
            vendorTermsDaysOld: '',
            regIdNm: '',
            regDtNm: '',
            updIdNm: '',
            updDtNm: '',
            regIdDeptFullNm: '',
            subOpenYn: '',
            currencyCdNm: '',
            categoryCdNm: '',
            categoryDtlCdNm: '',
            docQtyCdNm: '',
            evidenceCdNm: '',
            partialTotalAmount: 0,
            apprId: 0,
        },
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

        modalDivisionShow: false,
        modalDivisionGrid: {
            columnDefs:
                [
                    { headerName: 'Division Nm', field: 'divisionCdNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: false,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: false, // 멀티서치 기능
            }
        },
        divisionGrid: {
            columnDefs:
                [
                    { headerName: 'Division Nm', field: 'divisionCdNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: false,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: false, // 멀티서치 기능
            }
        },
        modalVendorShow: false,
        modalVendorGrid: {
            columnDefs:
                [
                    { headerName: 'Vendor Nm', field: 'vendorNm', minWidth: 150 },
                    { headerName: 'Vendor Enm', field: 'vendorEnm', minWidth: 150 },
                    { headerName: 'Business No', field: 'businessNo', minWidth: 150 },
                    { headerName: 'Payment Term', field: 'cdRef1', minWidth: 150 },
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
        exChangeList: []
    }

    /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        // 최초 환율 정보 가져오기
        this.getExchangeList();

        // Branch
        this.getBranchCdList('01');

        if (this.props.row !== '') {
            var deleteStr = '';
            var currencyCdStr = '';
            var defaultAmt = 0;
            var _fiPurchaseDto = this.props.row;

            // 세금계산서
            if (_fiPurchaseDto.evidenceCd === '01') { deleteStr = '01,02,03,04,05,06,07,08,09,10,11,12,99'; currencyCdStr = "90"; defaultAmt = parseFloat(0).toFixed(0); }
            // 계산서
            if (_fiPurchaseDto.evidenceCd === '02') { deleteStr = '01,02,03,04,05,06,07,08,09,10,11,12,99'; currencyCdStr = "90"; defaultAmt = parseFloat(0).toFixed(0); }
            // 해외인보이스
            if (_fiPurchaseDto.evidenceCd === '03') { deleteStr = '90,99'; currencyCdStr = "01"; defaultAmt = parseFloat(0).toFixed(2); }
            // Other
            if (_fiPurchaseDto.evidenceCd === '99') { deleteStr = '99'; currencyCdStr = "90"; defaultAmt = parseFloat(0).toFixed(0); }

            this.setState({
                _termsDays: _fiPurchaseDto.vendorTermsDaysOld,
                fiPurchaseDto: {
                    purchaseId: _fiPurchaseDto.purchaseId,
                    statusCd: _fiPurchaseDto.statusCd,
                    entityCd: _fiPurchaseDto.entityCd,
                    branchCd: '',
                    purchaseReqDt: new Date(_fiPurchaseDto.purchaseReqDt),
                    purchaseRefNo: _fiPurchaseDto.purchaseRefNo,
                    assetNo: _fiPurchaseDto.assetNo,
                    categoryCd: _fiPurchaseDto.categoryCd,
                    categoryDtlCd: '',
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
                    currencyCd: '',

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
                    regId: '',
                    updId: '',
                    vendorNm: _fiPurchaseDto.vendorNm,
                }
            }, async () => {
                await this.getBranchCdList(_fiPurchaseDto.entityCd);
                await this.getCategoryDtlCdList(_fiPurchaseDto.categoryCd);
                await this.getCurrencyCdList(deleteStr);

                this.setState({
                    fiPurchaseDto: {
                        ...this.state.fiPurchaseDto,
                        branchCd: _fiPurchaseDto.branchCd,
                        categoryDtlCd: _fiPurchaseDto.categoryDtlCd,
                        currencyCd: _fiPurchaseDto.currencyCd,
                    },
                })
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
                    divisionGrid: { ...this.state.divisionGrid, rowData: data.fiPurchaseDivisionDtos },
                    arrApprovalObj: arrApprovalObj
                }, () => {
                    if (_fiPurchaseDto.statusCd === '01') {
                        var exchangeKRW = Number(_fiPurchaseDto.exchangeKRW.toString().replaceAll(',', '')) 
                            - Number(_fiPurchaseDto.currencyVatAmt.toString().replaceAll(',', ''));

                        this.getApprovalList(
                              _fiPurchaseDto.entityCd
                            , _fiPurchaseDto.branchCd
                            , _fiPurchaseDto.categoryCd
                            , exchangeKRW
                            , this.props.storeState.userInfo.userId);
                    }
                })
            }).catch(function (error) {
                alert(error);
            });
        }
    }

    /*==========================================================*/
    /* currency List    */
    /*==========================================================*/
    async getCurrencyCdList(deleteMinor) {
        var gParams = {
            cdMajor: '0100',
            userId: this.props.storeState.userInfo.userId
        }
        this.props.onIsLoadingTrue();
        var data = await this.props.storeState.axiosGet("/CommonService/GetCodeOpions", gParams);
        this.props.onIsLoadingFalse();
        var newList = [];

        data.forEach(row => {
            if (deleteMinor.indexOf(row.cdMinor) === -1) {
                newList.push(row);
            }
        })
        this.setState({
            ...this.state, currencyCdList: []
        }, () => {
            this.setState({
                ...this.state, currencyCdList: newList
            })
        });
    }


    /*==========================================================*/
    /* Branch List    */
    /*==========================================================*/
    async getBranchCdList(frCdMinor) {
        var gParams = {
            cdMajor: '0036',
            userId: this.props.storeState.userInfo.userId
        }
        this.props.onIsLoadingTrue();
        var data = await this.props.storeState.axiosGet("/CommonService/GetCodeOpions", gParams);
        this.props.onIsLoadingFalse();
        var newList = [];

        data.forEach(row => {
            if (frCdMinor === row.frCdMinor) {
                newList.push(row);
            }
        })
        this.setState({
            ...this.state, branchCdList: []
        }, () => {
            this.setState({
                ...this.state, branchCdList: newList
            })
        });
    }

    /*==========================================================*/
    /* Branch List    */
    /*==========================================================*/
    async getCategoryDtlCdList(frCdMinor) {
        var gParams = {
            cdMajor: '0037',
            userId: this.props.storeState.userInfo.userId
        }
        this.props.onIsLoadingTrue();
        var data = await this.props.storeState.axiosGet("/CommonService/GetCodeOpions", gParams);
        this.props.onIsLoadingFalse();
        var newList = [];

        data.forEach(row => {
            if (frCdMinor === row.frCdMinor) {
                newList.push(row);
            }
        })
        this.setState({
            ...this.state, categoryDtlCdList: []
        }, () => {
            this.setState({
                ...this.state, categoryDtlCdList: newList
            })
        });
    }

    /*==========================================================*/
    /* Exchange List    */
    /*==========================================================*/
    getExchangeList() {
        var strYear = this.props.storeState.getParsedDate(this.state.fiPurchaseDto.purchaseReqDt);
        var strMonth = this.props.storeState.getParsedDate(this.state.fiPurchaseDto.purchaseReqDt);

        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetCurrencyList", {
            params: {
                currencyYear: strYear.substr(0, 4),
                currencyMonth: strMonth.substr(4, 2)
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                exChangeList: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Division Add    */
    /*==========================================================*/
    async getDivisionList() {
        var rows = [];
        this.props.onIsLoadingTrue();
        var gParams = {
            cdMajor: '0035',
            userId: this.props.storeState.userInfo.userId
        }
        var data = await this.props.storeState.axiosGet("/CommonService/GetCodeOpions", gParams);
        this.props.onIsLoadingFalse();

        var deleteMinor = '';
        this.state.divisionGrid.rowData.map((row) => {
            deleteMinor += row.divisionCd + ','
        });

        data.map((row) => {
            if (deleteMinor.indexOf(row.cdMinor) > -1) {
                
            } else if (row.frCdMinor !== this.state.fiPurchaseDto.entityCd) {

            }
            else {
                rows.push({
                    divisionCd: row.cdMinor,
                    divisionCdNm: row.fullName
                });
            }
        })

        this.setState({
            modalDivisionShow: true,
            modalDivisionGrid: { ...this.state.modalDivisionGrid, rowData: rows }
        })
    }

    /*==========================================================*/
    /* 삭제 Division list    */
    /*==========================================================*/
    deleteDivisionList() {
        var deleteRows = this.gridApiDivision.getSelectedRows();
        if (deleteRows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var rows = [];
        this.state.divisionGrid.rowData.map((row, i) => {
            var boolCheck = false;
            deleteRows.map((sRow, j) => {
                if (sRow.divisionCd === row.divisionCd) {
                    boolCheck = true;
                }
            })
            if (!boolCheck) {
                rows.push(row);
            }
        })

        this.setState({
            divisionGrid: { ...this.state.divisionGrid, rowData: [], rowCount: 0 }
        }, () => {
            this.setState({
                divisionGrid: { ...this.state.divisionGrid, rowData: rows, rowCount: rows.length }
            })
        })
    }

    /*==========================================================*/
    /* 모달 Division Save    */
    /*==========================================================*/
    saveModalDivisionList(e) {
        var rows = this.gridApiModalDivision.getSelectedRows();
        var data = [...this.state.divisionGrid.rowData];
        // var arrSeq = [];
        // data.forEach(row => {
        //     arrSeq.push(row.levelSeq);
        // })
        // var maxSeq = Math.max.apply(null, arrSeq);

        rows.map((row, i) => {
            // maxSeq += 1;
            data.push({
                policyId: 0,
                divisionCd: row.divisionCd,
                divisionCdNm: row.divisionCdNm,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        });

        this.setState({
            modalDivisionShow: false,
            divisionGrid: {
                ...this.state.divisionGrid,
                rowData: data
            }
        });
    }

    /*==========================================================*/
    /* Vendor Get    */
    /*==========================================================*/
    getVendorList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetVendorList", {
            params: {
                entityCd: this.state.fiPurchaseDto.entityCd
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalVendorShow: true,
                modalVendorGrid: { ...this.state.modalVendorGrid, rowData: data, rowCount: data.length }
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 모달 Vendor 더블클릭    */
    /*==========================================================*/
    onRowDoubleClickedModalVendor(e) {
        this.setState({
            _termsDays: e.data.cdRef1,

            modalVendorShow: false,
            fiPurchaseDto: {
                ...this.state.fiPurchaseDto,
                vendorId: e.data.vendorId,
                vendorNm: e.data.vendorNm,
                termsDays: e.data.cdRef1,
                termsChangeYn: 'N',
                termsReason: '',
            }
        })
    }

    /*==========================================================*/
    /* 승인자 리스트 가져오기    */
    /*==========================================================*/
    getApprovalList(entityCd, branchCd, categoryCd, exchangeKRW, userId) {

        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetApprovalList", {
            params: {
                entityCd, branchCd, categoryCd, exchangeKRW, userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                arrApprovalObj: [],
                fiPurchaseApprovalDtos: [],
            }, () => {
                this.setState({
                    arrApprovalObj: data
                })
            })

            data.forEach(row => {
                this.state.fiPurchaseApprovalDtos.push({
                    levelSeq: row.levelSeq,
                    apprCd: row.apprCd,
                    apprUserId: ''
                })
            });
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 전체 저장    */
    /*==========================================================*/
    saveFiPurchase(e) {
        // 마스터 설정
        var gParam = {
            ...this.state.fiPurchaseDto,
            purchaseReqDt: this.props.storeState.getParsedDate(this.state.fiPurchaseDto.purchaseReqDt, ""),

            productQty: Number(this.state.fiPurchaseDto.productQty),
            vendorId: Number(this.state.fiPurchaseDto.vendorId),

            currencyAmt: Number(this.state.fiPurchaseDto.currencyAmt.toString().replaceAll(',', '')),
            currencyVatAmt: Number(this.state.fiPurchaseDto.currencyVatAmt.toString().replaceAll(',', '')),
            exchangeRate: Number(this.state.fiPurchaseDto.exchangeRate.toString().replaceAll(',', '')),
            exchangeKRW: Number(this.state.fiPurchaseDto.exchangeKRW.toString().replaceAll(',', '')),
            carRate: Number(this.state.fiPurchaseDto.carRate.toString().replaceAll(',', '')),
            carGBP: Number(this.state.fiPurchaseDto.carGBP.toString().replaceAll(',', '')),

            termsDays: Number(this.state.fiPurchaseDto.termsDays),

            statusCd: e.target.id === 'btnDraft' ? '01' : '02',
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }

        // Division
        var gParamDivision = [];
        this.state.divisionGrid.rowData.map((row) => {
            gParamDivision.push({
                purchaseId: 0,
                divisionCd: row.divisionCd,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId    
            })
        })
        if (gParamDivision.length === 0) {
            alert('Division이 설정되지 않았습니다.');
            return;
        }

        // File
        var gParamFile = [];
        if (this.state.fiPurchaseFileDtos.fileNmMain !== '') {
            gParamFile.push({
                purchaseId: 0,
                fileSeq: 100,
                fileNm: this.state.fiPurchaseFileDtos.fileNmMain,
                fileUrl: this.state.fiPurchaseFileDtos.fileUrlMain,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        } else {
            alert('Main File이 등록되지 않았습니다.')
            return;
        }
        if (this.state.fiPurchaseFileDtos.fileNm1 !== '') {
            gParamFile.push({
                purchaseId: 0,
                fileSeq: 101,
                fileNm: this.state.fiPurchaseFileDtos.fileNm1,
                fileUrl: this.state.fiPurchaseFileDtos.fileUrl1,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        } else {
            alert('File 1이 등록되지 않았습니다.')
            return;
        }
        if (this.state.fiPurchaseFileDtos.fileNm2 !== '') {
            gParamFile.push({
                purchaseId: 0,
                fileSeq: 102,
                fileNm: this.state.fiPurchaseFileDtos.fileNm2,
                fileUrl: this.state.fiPurchaseFileDtos.fileUrl2,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        }
        if (this.state.fiPurchaseFileDtos.fileNm3 !== '') {
            gParamFile.push({
                purchaseId: 0,
                fileSeq: 102,
                fileNm: this.state.fiPurchaseFileDtos.fileNm3,
                fileUrl: this.state.fiPurchaseFileDtos.fileUrl3,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        }

        // 승인자 설정
        var gParamApproval = [];
        var boolAppr = false;

        if (gParam.statusCd !== '01') {
            this.state.fiPurchaseApprovalDtos.map((row, i) => {
                if (row.apprUserId === '') { boolAppr = true; }

                gParamApproval.push({
                    purchaseId: 0,
                    apprId: 0,
                    levelSeq: (i + 1),
                    apprCd: row.apprCd,
                    apprUserId: row.apprUserId,
                    statusCd: '01',
                    mailYn: 'N',
                    deleApprUserId: '',
                    deleReason: '',
                    remark: '',
                    regId: this.props.storeState.userInfo.userId,
                    updId: this.props.storeState.userInfo.userId
                })
            })
            if (boolAppr) {
                alert('설정되지 않은 승인자가 존재합니다.');
                return;
            }
        }
        
        var gParamGroup = {
            fiPurchaseDto: gParam,
            fiPurchaseDivisionDtos: gParamDivision,
            fiPurchaseFileDtos: gParamFile,
            fiPurchaseApprovalDtos: gParamApproval
        }
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseService/SaveFiPurchase",
            gParamGroup)
            .then(r => {
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
    /* 신규생성    */
    /*==========================================================*/
    onClickNew() {
        this.props.onClickNew();
    }

    // 체인지 공통
    onChangeHandler(e) {
        var name = e.target.name;
        var value = e.target.value;
        var entityCd = this.state.fiPurchaseDto.entityCd;
        var branchCd = this.state.fiPurchaseDto.branchCd;
        var categoryCd = this.state.fiPurchaseDto.categoryCd;
        var exchangeKRW = Number(this.state.fiPurchaseDto.exchangeKRW.toString().replaceAll(',', '')) 
                            - Number(this.state.fiPurchaseDto.currencyVatAmt.toString().replaceAll(',', ''));;
        var userId = this.props.storeState.userInfo.userId;

        this.setState({
            fiPurchaseDto: {
                ...this.state.fiPurchaseDto,
                [e.target.name]: e.target.value,
                
            }
        }, () => {
            if(name === 'branchCd') {
                branchCd = value;
                this.getApprovalList(entityCd, branchCd, categoryCd, exchangeKRW, userId);
            }
            if(name === 'categoryCd') {
                this.setState({
                    fiPurchaseDto: {
                        ...this.state.fiPurchaseDto,
                        categoryDtlCd: '',
                        categoryDtlReason: ''
                    }       
                }, () => {
                    this.getCategoryDtlCdList(value);

                    categoryCd = value;
                    this.getApprovalList(entityCd, branchCd, categoryCd, exchangeKRW, userId);
                })
            }
            if (name === 'docQtyCd') {
                
                this.setState({
                    fiPurchaseDto: {
                        ...this.state.fiPurchaseDto,
                        docQtyReason: ''
                    }       
                })
                if (value === '04') { alert('몇프로 네고?') }
            }
            if (name === 'evidenceCd') {
                var deleteStr = '';
                var currencyCdStr = '';
                var defaultAmt = 0;
                var valueExchangeRate = 0;
                var valueCarRate = 0;

                // 세금계산서
                if (value === '01') { deleteStr = '01,02,03,04,05,06,07,08,09,10,11,12,99'; currencyCdStr = "90"; defaultAmt = parseFloat(0).toFixed(0); }
                // 계산서
                if (value === '02') { deleteStr = '01,02,03,04,05,06,07,08,09,10,11,12,99'; currencyCdStr = "90"; defaultAmt = parseFloat(0).toFixed(0); }
                // 해외인보이스
                if (value === '03') { deleteStr = '90,99'; currencyCdStr = "01"; defaultAmt = parseFloat(0).toFixed(2); }
                // Other
                if (value === '99') { deleteStr = '99'; currencyCdStr = "90"; defaultAmt = parseFloat(0).toFixed(0); }

                this.state.exChangeList.map((row) => {
                    if (row.currencyCd === currencyCdStr) {
                        valueExchangeRate = row.currencyAmt
                    }
                    if (row.currencyCd === '99') {
                        valueCarRate = row.currencyAmt
                    }
                })

                this.setState({
                    fiPurchaseDto: {
                        ...this.state.fiPurchaseDto,
                        evidenceReason: '',
                        currencyCd: currencyCdStr,
                        currencyAmt: defaultAmt,
                        currencyVatAmt: 0,
                        exchangeRate: valueExchangeRate,
                        carRate: valueCarRate,
                        exchangeKRW: 0,
                        carGBP: 0
                    }       
                }, () => {
                    this.getCurrencyCdList(deleteStr);
                })
            }
            if (name === 'currencyCd') {
                var valueExchangeRate = 0;

                this.state.exChangeList.map((row) => {
                    if (row.currencyCd === value) {
                        valueExchangeRate = row.currencyAmt
                    }
                })

                this.setState({
                    fiPurchaseDto: {
                        ...this.state.fiPurchaseDto,
                        currencyAmt: value === '90' ? parseFloat(0).toFixed(0) : parseFloat(0).toFixed(2),
                        exchangeRate: valueExchangeRate,
                    }
                })
            }
            
        });
    }
    onDateChangeHandler(name, date) {
        this.setState({
            fiPurchaseDto: {
                ...this.state.fiPurchaseDto,
                [name]: date,
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
        var _exchangeKRW = '';
        var _carGBP = '';

        if(name === 'currencyAmt') {
            // KRW
            if (this.state.fiPurchaseDto.currencyCd === '90') {
                _currencyAmt = Number(value).toLocaleString();
                // 세금계산서
                if (this.state.fiPurchaseDto.evidenceCd === '01')
                {
                    _currencyVatAmt =  Number((parseInt(Number(value) * 10) / 100).toFixed(0)).toLocaleString();
                    _exchangeKRW = Number(Number(Number(value) + Number((parseInt(Number(value) * 10) / 100))).toFixed(0)).toLocaleString();
                } else {
                    _currencyVatAmt = 0;
                    _exchangeKRW = Number(Number(Number(value) + Number((parseInt(Number(this.state.fiPurchaseDto.currencyVatAmt.toString().replaceAll(',', '')) * 10) / 100))).toFixed(0)).toLocaleString();
                }
                _carGBP = ((Number(value) / Number(this.state.fiPurchaseDto.carRate)).toFixed(2)).toLocaleString();
            }
            // 해외
            else {
                _currencyAmt = Number(Number(value).toFixed(2)).toLocaleString();
                _currencyVatAmt= '0';
                _exchangeKRW = Number((Number(value) * Number(this.state.fiPurchaseDto.exchangeRate)).toFixed(0)).toLocaleString();
                _carGBP = Number(((Number(value) * Number(this.state.fiPurchaseDto.exchangeRate)) / Number(this.state.fiPurchaseDto.carRate)).toFixed(2)).toLocaleString();
            }

            var exchangeKRW = Number(_exchangeKRW.toString().replaceAll(',', '')) 
                            - Number(_currencyVatAmt.toString().replaceAll(',', ''));
            var entityCd = this.state.fiPurchaseDto.entityCd;
            var branchCd = this.state.fiPurchaseDto.branchCd;
            var categoryCd = this.state.fiPurchaseDto.categoryCd;
            var userId = this.props.storeState.userInfo.userId;

            this.setState({
                fiPurchaseDto: {
                    ...this.state.fiPurchaseDto,
                    currencyAmt:  _currencyAmt,
                    currencyVatAmt: _currencyVatAmt,
                    exchangeKRW: _exchangeKRW,
                    carGBP: _carGBP
                }
            }, () => {
                this.getApprovalList(entityCd, branchCd, categoryCd, exchangeKRW, userId);
            })
        }

        if (name === 'currencyVatAmt') {
            if (this.state.fiPurchaseDto.currencyCd === '90') {
                this.setState({
                    fiPurchaseDto: {
                        ...this.state.fiPurchaseDto,
                        currencyVatAmt: Number(value).toLocaleString(),
                        exchangeKRW: (Number(this.state.fiPurchaseDto.currencyAmt.toString().replaceAll(',', '')) + Number(value)).toLocaleString()
                    }
                })
            }
        }
    }
    onChageApprovalUser(levelSeq, apprCd, apprUserId) {
        this.state.fiPurchaseApprovalDtos.map((row) => {
            if(row.levelSeq === levelSeq && row.apprCd === apprCd) {
                row.apprUserId = apprUserId;
            }
        })
    }
    onApprovalPlus(levelSeq, apprCd, userId) {
        this.state.fiPurchaseApprovalDtos.push({
            levelSeq: levelSeq,
            apprCd: apprCd,
            apprUserId: ''
        })

        this.state.fiPurchaseApprovalDtos.sort(function (a, b) {
            return a.levelSeq - b.levelSeq;
        });
    }
    onApprovalMinus(levelSeq, apprCd, userId) {
        var arr = [...this.state.fiPurchaseApprovalDtos];
        var newArr = [];

        arr.map((row) => {
            if (row.levelSeq === levelSeq && row.apprCd === apprCd) {

            } else {
                newArr.push(row);
            }
        })

        this.setState({
            fiPurchaseApprovalDtos: []
        }, () => {
            this.setState({
                fiPurchaseApprovalDtos: newArr
            })
        })
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

            if (id === 'fileMain') {
                this.setState({
                    fiPurchaseFileDtos: {
                        ...this.state.fiPurchaseFileDtos,
                        fileNmMain: data[0].fileNm,
                        fileUrlMain: data[0].fileUrl,
                    }
                })
            }
            if (id === 'file1') {
                this.setState({
                    fiPurchaseFileDtos: {
                        ...this.state.fiPurchaseFileDtos,
                        fileNm1: data[0].fileNm,
                        fileUrl1: data[0].fileUrl,
                    }
                })
            }
            if (id === 'file2') {
                this.setState({
                    fiPurchaseFileDtos: {
                        ...this.state.fiPurchaseFileDtos,
                        fileNm2: data[0].fileNm,
                        fileUrl2: data[0].fileUrl,
                    }
                })
            }
            if (id === 'file3') {
                this.setState({
                    fiPurchaseFileDtos: {
                        ...this.state.fiPurchaseFileDtos,
                        fileNm3: data[0].fileNm,
                        fileUrl3: data[0].fileUrl,
                    }
                })
            }
            
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
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                {
                                    this.state.fiPurchaseDto.statusCd === '01' || this.state.fiPurchaseDto.statusCd === '99'
                                        ? <>
                                            <Button variant="warning" id="btnDraft"
                                                onClick={this.saveFiPurchase.bind(this)}
                                            // disabled={this.state.hrExternalTrainingDto.statusCd !== '01' ? true : false}
                                            >Draft</Button>{' '}
                                            <Button variant="success" id="btnSave"
                                                onClick={this.saveFiPurchase.bind(this)}
                                            >Save</Button>
                                        </>
                                        : <></>
                                }
                                
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className='col-md-12' style={{ marginBottom: 15 }}>
                                <Form.Label>■ Entity Name</Form.Label>
                                <table style={{ width: '100%' }}>
                                    <colgroup>
                                        <col style={{ width: '33%' }} />
                                        <col style={{ width: '33%' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: 'center' }}>
                                                <ToggleButton style={{ width: '100%', height: 65, lineHeight: 3, fontWeight: 'bold' }}
                                                    className='toggleRadio'
                                                    type="radio"
                                                    variant="outline-warning"
                                                    checked={this.state.fiPurchaseDto.entityCd === '01'}
                                                    value={'01'}
                                                    onChange={(e) => 
                                                        this.setState({
                                                            fiPurchaseDto: {
                                                                ...this.state.fiPurchaseDto,
                                                                entityCd: e.currentTarget.value,
                                                                vendorId: 0, vendorNm: '', termsDays: 0
                                                            }
                                                        }, () => { 
                                                            this.getBranchCdList('01');
                                                        })
                                                    }
                                                >
                                                    ETL-SEMKO-(Co.99)
                                                </ToggleButton>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <ToggleButton style={{ width: '100%', height: 65, lineHeight: 3, fontWeight: 'bold' }}
                                                    className='toggleRadio'
                                                    type="radio"
                                                    variant="outline-warning"
                                                    checked={this.state.fiPurchaseDto.entityCd === '02'}
                                                    value={'02'}
                                                    onChange={(e) =>
                                                        this.setState({
                                                            fiPurchaseDto: {
                                                                ...this.state.fiPurchaseDto,
                                                                entityCd: e.currentTarget.value,
                                                                vendorId: 0, vendorNm: '', termsDays: 0
                                                            }
                                                        }, () => { 
                                                            this.getBranchCdList('02');
                                                        })
                                                    }
                                                >
                                                    KIMSCO-(Co.62C)
                                                </ToggleButton>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <ToggleButton style={{ width: '100%', height: 65, lineHeight: 3, fontWeight: 'bold' }}  
                                                    className='toggleRadio'
                                                    type="radio"
                                                    variant="outline-warning"
                                                    checked={this.state.fiPurchaseDto.entityCd === '03'}
                                                    value={'03'}
                                                    onChange={(e) =>
                                                        this.setState({
                                                            fiPurchaseDto: {
                                                                ...this.state.fiPurchaseDto,
                                                                entityCd: e.currentTarget.value,
                                                                vendorId: 0, vendorNm: '', termsDays: 0
                                                            }
                                                        }, () => { 
                                                            this.getBranchCdList('03');
                                                        })
                                                    }
                                                >
                                                    TESTING-(Co.62Q)
                                                </ToggleButton>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="purchaseId"
                                        value={this.state.fiPurchaseDto.purchaseId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.fiPurchaseDto.statusCd} onChange={this.onChangeHandler.bind(this)}
                                        disabled
                                    >
                                        <GDHSelectOption cdMajor="0208" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Purchasing Date</Form.Label>
                                    <GDHDatepicker
                                        name='purchaseReqDt'
                                        value={this.state.fiPurchaseDto.purchaseReqDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                           <div className='col-md-3'>

                           </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Branch</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="branchCd"
                                        value={this.state.fiPurchaseDto.branchCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={""}>{"=== Select ==="}</option>
                                        {
                                            this.state.branchCdList.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.cdMinor}>{item.fullName}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ PR No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="purchaseRefNo"
                                        value={this.state.fiPurchaseDto.purchaseRefNo} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ Asset No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="assetNo"
                                        value={this.state.fiPurchaseDto.assetNo} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <hr />
                                <Form.Label>■ Division</Form.Label>
                                <div className="text-right" style={{ marginTop: 15, marginBottom: 5 }}>
                                    <Button variant="secondary" onClick={this.getDivisionList.bind(this)}>Add</Button> {' '}
                                    <Button variant="danger" onClick={this.deleteDivisionList.bind(this)}>Delete</Button>
                                </div>
                                <div className="ag-theme-material"
                                    style={{ height: 200, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.divisionGrid.columnDefs}
                                        defaultColDef={this.state.divisionGrid.defaultColDef}
                                        rowData={this.state.divisionGrid.rowData}
                                        enableCellTextSelection={true}
                                        rowSelection="multiple" // single
                                         onGridReady={params => this.gridApiDivision = params.api}
                                    // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                                <hr />
                            </div>
                            
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ PR Category</Form.Label>
                                    <table style={{ width: '100%' }}>
                                        <colgroup>
                                            <col style={{ width: '25%' }} />
                                            <col style={{ width: '25%' }} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Form.Control as="select" size="sm" style={{ width: '97%' }}
                                                        name="categoryCd"
                                                        value={this.state.fiPurchaseDto.categoryCd} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0037" level={'11'} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Form.Control as="select" size="sm" style={{ width: '97%' }}
                                                        name="categoryDtlCd"
                                                        value={this.state.fiPurchaseDto.categoryDtlCd}
                                                        onChange={(e) => {
                                                            this.onChangeHandler(e)
                                                        }}
                                                    >
                                                        <option key={-1} value={""}>{"=== Select ==="}</option>
                                                        {
                                                            this.state.categoryDtlCdList.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.cdMinor}>{item.fullName}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </td>
                                                <td>
                                                    <Form.Control type="text" size="sm"
                                                        name="categoryDtlReason"
                                                        value={this.state.fiPurchaseDto.categoryDtlReason} onChange={this.onChangeHandler.bind(this)}
                                                        placeholder='(Other -> 그외기타) Reason...'
                                                        readOnly={this.state.fiPurchaseDto.categoryDtlCd === 'C9' ? false : true}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <table style={{ width: '100%' }}>
                                        <colgroup>
                                            <col style={{ width: '25%' }} />
                                            <col style={{ width: '25%' }} />
                                            <col style={{ width: '25%' }} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <ToggleButton style={{ width: '70%' }}
                                                        className='toggleCheck'
                                                        type="checkbox"
                                                        variant="outline-primary"
                                                        checked={this.state.fiPurchaseDto.growthYn === 'Y' ? true : false}
                                                        value="1"
                                                        onChange={(e) => this.setState({
                                                            fiPurchaseDto: {
                                                                ...this.state.fiPurchaseDto,
                                                                growthYn: e.currentTarget.checked ? 'Y' : 'N'
                                                            }
                                                        })}
                                                    >
                                                        Growth
                                                    </ToggleButton>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <ToggleButton style={{ width: '70%' }}
                                                        className='toggleCheck'
                                                        type="checkbox"
                                                        variant="outline-primary"
                                                        checked={this.state.fiPurchaseDto.maintenanceYn === 'Y' ? true : false}
                                                        value="1"
                                                        onChange={(e) => this.setState({
                                                            fiPurchaseDto: {
                                                                ...this.state.fiPurchaseDto,
                                                                maintenanceYn: e.currentTarget.checked ? 'Y' : 'N',
                                                                maintenanceAssetNo: e.currentTarget.checked ? this.state.fiPurchaseDto.maintenanceAssetNo: '',
                                                                maintenanceEqId: e.currentTarget.checked ? this.state.fiPurchaseDto.maintenanceEqId: ''
                                                            }
                                                        })}
                                                    >
                                                        Maintenance
                                                    </ToggleButton>
                                                </td>
                                                <td>
                                                    <Form.Control type="text" size="sm" style={{ width: '97%' }}
                                                        name="maintenanceAssetNo"  
                                                        placeholder='(Maintenance) Asset No...'
                                                        value={this.state.fiPurchaseDto.maintenanceAssetNo} onChange={this.onChangeHandler.bind(this)}
                                                        readOnly={this.state.fiPurchaseDto.maintenanceYn === 'Y' ? false : true}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control type="text" size="sm"
                                                        name="maintenanceEqId" 
                                                        placeholder='(Maintenance) EQ ID...'
                                                        value={this.state.fiPurchaseDto.maintenanceEqId} onChange={this.onChangeHandler.bind(this)}
                                                        readOnly={this.state.fiPurchaseDto.maintenanceYn === 'Y' ? false : true}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Included CAPEX Budget?</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="budgetYn"
                                        value={this.state.fiPurchaseDto.budgetYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value={""}>{"=== Select ==="}</option>
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-9">
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Product Name</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="productNm"
                                        value={this.state.fiPurchaseDto.productNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Product Qty</Form.Label>
                                    <Form.Control type="number" size="sm"
                                        name="productQty"
                                        value={this.state.fiPurchaseDto.productQty} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Vendor</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control type="text" size="sm"
                                            name="vendorNm"
                                            value={this.state.fiPurchaseDto.vendorNm}
                                            readOnly
                                        />
                                        <InputGroup.Append>
                                            <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                onClick={this.getVendorList.bind(this)}
                                            >
                                                <i className='fa fa-search' />
                                            </Button>
                                            <Button variant="danger" size="sm" style={{ height: 31 }}
                                                onClick={() => this.setState({
                                                    fiPurchaseDto: {
                                                        ...this.state.fiPurchaseDto,
                                                        vendorId: 0,
                                                        vendorNm: '',
                                                    }
                                                })}
                                            >
                                                <i className='fa fa-trash-alt' />
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Manufaturer</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="manufaturer"
                                        value={this.state.fiPurchaseDto.manufaturer} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                           
                            <div className="col-md-6" style={{ backgroundColor: '#ddd', paddingTop: 15, paddingBottom: 15 }}>
                                <div className='col-md-12' >
                                    <Form.Group>
                                        <Form.Label>■ Evidence Docs</Form.Label>
                                        <table style={{ width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: '50%' }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Form.Control as="select" size="sm" style={{ width: '97%' }}
                                                            name="evidenceCd"
                                                            value={this.state.fiPurchaseDto.evidenceCd} onChange={this.onChangeHandler.bind(this)}
                                                        >
                                                            <GDHSelectOption cdMajor="0038" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                        </Form.Control>
                                                    </td>
                                                    <td>
                                                        <Form.Control type="text" size="sm"
                                                            name="evidenceReason"
                                                            placeholder='(Other) Reason...'
                                                            value={this.state.fiPurchaseDto.evidenceReason} onChange={this.onChangeHandler.bind(this)}
                                                            readOnly={this.state.fiPurchaseDto.evidenceCd === '99' ? false : true}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form.Group>
                                </div>
                                <div className='col-md-12' >
                                    <Form.Group>
                                        <Form.Label>■ SubTOTAL In</Form.Label>
                                        <table style={{ width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: '50%' }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Form.Control as="select" size="sm" style={{ width: '97%' }}
                                                            name="currencyCd"
                                                            value={this.state.fiPurchaseDto.currencyCd} onChange={this.onChangeHandler.bind(this)}
                                                        >
                                                            <option key={-1} value={""}>{"=== Select ==="}</option>
                                                            {
                                                                this.state.currencyCdList.map((item, i) => {
                                                                    return (
                                                                        <option key={i} value={item.cdMinor}>{item.fullName}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Form.Control>
                                                    </td>
                                                    <td>
                                                        <Form.Control type="text" size="sm"
                                                            name="currencyAmt"
                                                            value={this.state.fiPurchaseDto.currencyAmt} 
                                                            onChange={this.onChangeHandler.bind(this)}
                                                            onBlur={this.onBlurHandler.bind(this)}
                                                            style={{ textAlign: 'right' }}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form.Group>
                                </div>
                                <div className='col-md-12' >
                                    <Form.Group>
                                        <Form.Label>■ VAT (10%)</Form.Label>
                                        <table style={{ width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: '50%' }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        {' '}
                                                    </td>
                                                    <td>
                                                        <Form.Control type="text" size="sm"
                                                            name="currencyVatAmt"
                                                            value={this.state.fiPurchaseDto.currencyVatAmt} 
                                                            onChange={this.onChangeHandler.bind(this)}
                                                            onBlur={this.onBlurHandler.bind(this)}
                                                            style={{ textAlign: 'right' }}
                                                            readOnly={this.state.fiPurchaseDto.currencyCd === '90' ? false : true}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form.Group>
                                </div>
                                <div className='col-md-12' >
                                    <Form.Group>
                                        <Form.Label>■ Exchange Rate</Form.Label>
                                        <table style={{ width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: '20%' }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#c82333' }}>
                                                        {this.state.fiPurchaseDto.exchangeRate}
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                        {'Total In KRW : '}
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#c82333', fontSize: 17 }}>
                                                        {this.state.fiPurchaseDto.exchangeKRW}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form.Group>
                                </div>
                                <div className='col-md-12' >
                                    <Form.Group>
                                        <Form.Label>■ CAR Rate</Form.Label>
                                        <table style={{ width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: '20%' }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#c82333' }}>
                                                        {this.state.fiPurchaseDto.carRate}
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                        {'Total In GBP : '}
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#c82333', fontSize: 17 }}>
                                                        {this.state.fiPurchaseDto.carGBP}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="col-md-6" style={{ backgroundColor: '#eee', paddingTop: 15, paddingBottom: 15 }}>
                                <div className='col-md-12' >
                                    <Form.Group>
                                        <Form.Label>■ Quotations</Form.Label>
                                        <table style={{ width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: '50%' }} />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Form.Control as="select" size="sm" style={{ width:'97%'}}
                                                            name="docQtyCd"
                                                            value={this.state.fiPurchaseDto.docQtyCd} onChange={this.onChangeHandler.bind(this)}
                                                        >
                                                            <GDHSelectOption cdMajor="0039" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                                        </Form.Control>
                                                    </td>
                                                    <td>
                                                        <Form.Control type="text" size="sm"
                                                            name="docQtyReason"
                                                            placeholder='(Sole Vendor) Reason...'
                                                            value={this.state.fiPurchaseDto.docQtyReason} onChange={this.onChangeHandler.bind(this)}
                                                            readOnly={this.state.fiPurchaseDto.docQtyCd === '04' ? false : true}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ File Main</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control type="text" size="sm"
                                                name="fileNmMain"
                                                value={this.state.fiPurchaseFileDtos.fileNmMain}
                                                readOnly
                                            />
                                            <Form.File
                                                ref={(ref) => this.fileMainupload = ref}
                                                label="file upload click !!"
                                                custom
                                                multiple={false}
                                                onChange={this.onfileUploadClick.bind(this)}
                                                id='fileMain'
                                                style={{ display: 'none' }}
                                            />
                                            <InputGroup.Append>
                                                <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                    onClick={() => { this.fileMainupload.click() }}
                                                >
                                                    <i className='fa fa-search' />
                                                </Button>
                                                <Button variant="danger" size="sm" style={{ height: 31 }}
                                                    onClick={() => this.setState({
                                                        fiPurchaseFileDtos: {
                                                            ...this.state.fiPurchaseFileDtos,
                                                            fileNmMain: '',
                                                            fileUrlMain: '',
                                                        }
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
                                        <Form.Label>■ File etc 1</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control type="text" size="sm"
                                                name="fileNm1"
                                                value={this.state.fiPurchaseFileDtos.fileNm1}
                                                readOnly
                                            />
                                             <Form.File
                                                ref={(ref) => this.file1upload = ref}
                                                label="file upload click !!"
                                                custom
                                                multiple={false}
                                                onChange={this.onfileUploadClick.bind(this)}
                                                id='file1'
                                                style={{ display: 'none' }}
                                            />
                                            <InputGroup.Append>
                                                <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                    onClick={() => { this.file1upload.click() }}
                                                >
                                                    <i className='fa fa-search' />
                                                </Button>
                                                <Button variant="danger" size="sm" style={{ height: 31 }}
                                                    onClick={() => this.setState({
                                                        fiPurchaseFileDtos: {
                                                            ...this.state.fiPurchaseFileDtos,
                                                            fileNm1: '',
                                                            fileUrl1: '',
                                                        }
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
                                        <Form.Label>■ File etc 2</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control type="text" size="sm"
                                                name="fileNm2"
                                                value={this.state.fiPurchaseFileDtos.fileNm2}
                                                readOnly
                                            />
                                             <Form.File
                                                ref={(ref) => this.file2upload = ref}
                                                label="file upload click !!"
                                                custom
                                                multiple={false}
                                                onChange={this.onfileUploadClick.bind(this)}
                                                id='file2'
                                                style={{ display: 'none' }}
                                            />
                                            <InputGroup.Append>
                                                {
                                                    this.state.fiPurchaseDto.docQtyCd === '02' || this.state.fiPurchaseDto.docQtyCd === '03' 
                                                        ? <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                            onClick={() => { this.file2upload.click() }}
                                                        >
                                                            <i className='fa fa-search' />
                                                        </Button>
                                                        : <></>
                                                }
                                                
                                                <Button variant="danger" size="sm" style={{ height: 31 }}
                                                    onClick={() => this.setState({
                                                        fiPurchaseFileDtos: {
                                                            ...this.state.fiPurchaseFileDtos,
                                                            fileNm2: '',
                                                            fileUrl2: '',
                                                        }
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
                                        <Form.Label>■ File etc 3</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control type="text" size="sm"
                                                name="fileNm3"
                                                value={this.state.fiPurchaseFileDtos.fileNm3}
                                                readOnly
                                            />
                                             <Form.File
                                                ref={(ref) => this.file3upload = ref}
                                                label="file upload click !!"
                                                custom
                                                multiple={false}
                                                onChange={this.onfileUploadClick.bind(this)}
                                                id='file3'
                                                style={{ display: 'none' }}
                                            />
                                            <InputGroup.Append>
                                                {
                                                    this.state.fiPurchaseDto.docQtyCd === '03'
                                                        ? <Button variant="secondary" size="sm" style={{ height: 31, width: 60 }}
                                                            onClick={() => { this.file3upload.click() }}
                                                        >
                                                            <i className='fa fa-search' />
                                                        </Button>
                                                        : <></>
                                                }
                                                <Button variant="danger" size="sm" style={{ height: 31 }}
                                                    onClick={() => this.setState({
                                                        fiPurchaseFileDtos: {
                                                            ...this.state.fiPurchaseFileDtos,
                                                            fileNm3: '',
                                                            fileUrl3: '',
                                                        }
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
                                        <Form.Label>■ File etc 4</Form.Label>
                                        <Form.Control type="text" size="sm"
                                            name="fileNm4"
                                            value={this.state.fiPurchaseFileDtos.fileNm4}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="col-md-12" style={{ marginTop: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ Payment terms</Form.Label>
                                    <table style={{ width: '100%' }}>
                                        <colgroup>
                                            <col style={{ width: '25%' }} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <InputGroup className="mb-3" style={{ width: '97%', top: 8 }}>
                                                        {
                                                            this.state.fiPurchaseDto.termsChangeYn === 'Y'
                                                                ? <Form.Control as="select" size="sm"
                                                                    name="termsDays"
                                                                    value={this.state.fiPurchaseDto.termsDays} onChange={this.onChangeHandler.bind(this)}
                                                                >
                                                                    <option value={0}>0</option>
                                                                    <option value={10}>10</option>
                                                                    <option value={15}>15</option>
                                                                    <option value={30}>30</option>
                                                                    <option value={45}>45</option>
                                                                    <option value={46}>46</option>
                                                                    <option value={50}>50</option>
                                                                </Form.Control>
                                                                : <Form.Control type="text" size="sm"
                                                                    name="termsDays"
                                                                    value={this.state.fiPurchaseDto.termsDays} onChange={this.onChangeHandler.bind(this)}
                                                                    readOnly
                                                                />
                                                        }
                                                        <InputGroup.Append>
                                                            <Button variant="info" size="sm" style={{ height: 31 }}
                                                                onClick={(e) => {
                                                                    this.setState({
                                                                        fiPurchaseDto: {
                                                                            ...this.state.fiPurchaseDto,
                                                                            termsChangeYn: 'Y'
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                Other term
                                                            </Button>
                                                            <Button variant="light" size="sm" style={{ height: 31, border: '1px solid #ccc' }}
                                                                onClick={(e) => {
                                                                    this.setState({
                                                                        fiPurchaseDto: {
                                                                            ...this.state.fiPurchaseDto,
                                                                            termsDays: this.state._termsDays,
                                                                            termsChangeYn: 'N',
                                                                            termsReason: ''
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <i className='fa fa-sync-alt' />
                                                            </Button>
                                                        </InputGroup.Append>
                                                    </InputGroup>
                                                </td>
                                                <td>
                                                    <InputGroup className="mb-3" style={{ width: '97%', top: 8 }}>
                                                        <Form.Control type="text" size="sm"
                                                            name="termsReason"
                                                            placeholder='변경사유 입력 (100자 이내)'
                                                            value={this.state.fiPurchaseDto.termsReason} onChange={this.onChangeHandler.bind(this)}
                                                            readOnly={this.state.fiPurchaseDto.termsChangeYn === 'Y' ? false : true}
                                                        />
                                                        <InputGroup.Append>
                                                            <Button variant="light" size="sm" style={{ height: 31, border: '1px solid #ccc' }}
                                                                onClick={() => this.setState({
                                                                    fiPurchaseFileDtos: {
                                                                        ...this.state.fiPurchaseFileDtos,
                                                                        fileNm1: '',
                                                                        fileUrl1: '',
                                                                    }
                                                                })}
                                                            >
                                                                <i className='fa fa-download' />
                                                            </Button>
                                                        </InputGroup.Append>
                                                    </InputGroup>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Reason</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        name="reason"
                                        value={this.state.fiPurchaseDto.reason} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <hr />
                            </div>

                            {/*********************** 승인자 설정 ***********************/}
                            {
                                this.state.fiPurchaseDto.statusCd === '01'
                                    ? this.state.arrApprovalObj.map((row) => {
                                        return <PurchaseRequestDetailApproval
                                            row={row}
                                            onChageApprovalUser={this.onChageApprovalUser.bind(this)}
                                            onApprovalPlus={this.onApprovalPlus.bind(this)}
                                            onApprovalMinus={this.onApprovalMinus.bind(this)}
                                        />;
                                    })
                                    : this.state.arrApprovalObj.map((row) => {
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
                            {/*********************** 승인자 설정 ***********************/}

                        </Form.Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Modal */}
            <Modal show={this.state.modalDivisionShow} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveModalDivisionList.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalDivisionShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405', marginTop: 15 }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.modalDivisionGrid.columnDefs}
                            defaultColDef={this.state.modalDivisionGrid.defaultColDef}
                            rowData={this.state.modalDivisionGrid.rowData}
                            onGridReady={params => this.modalDivisionGrid = params.api}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiModalDivision = params.api}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* Modal */}
            <Modal show={this.state.modalVendorShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveModalDivisionList.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalVendorShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 350, borderTop: '2px solid #695405', marginTop: 15 }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.modalVendorGrid.columnDefs}
                            defaultColDef={this.state.modalVendorGrid.defaultColDef}
                            rowData={this.state.modalVendorGrid.rowData}
                            onGridReady={params => this.gridApiModalVendor = params.api}
                            onRowDoubleClicked={this.onRowDoubleClickedModalVendor.bind(this)}
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
)(PurchaseRequestDetail)
