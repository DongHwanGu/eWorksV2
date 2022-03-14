import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';


class FiApprovalPolicyPurchase extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        // 마스터
        policyId: 0,
        // 정책
        itemId: 0,
        // 유저
        apprCd: '',
        userId: '',

        /////////////////////////////////////////
        modalBranchShow: false,
        branchGrid: {
            columnDefs:
                [
                    { headerName: 'Policy', field: 'policyNm', minWidth: 200 },
                    { headerName: 'Entity', field: 'entityCdNm', minWidth: 200 },
                    { headerName: 'Branch', field: 'branchCdNm', minWidth: 200 },
                    {
                        headerName: 'Delete', field: 'Delete', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            var branchCd = params.data.branchCd;
                            return (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }} onClick={() => { 
                                    this.deleteApprovalPolicyBranchData(policyId, branchCd);
                                 }}>삭제</span>
                            )
                        }
                    },
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
        branchCdObj: <GDHSelectOption cdMajor="0036" frCdMinor={'01'} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />,
        fiApprovalPolicyBranchDto: {
            policyId: 0,
            branchCd: '',
            entityCd: '01',
            regId: '',
            updId: '',
        },
        /////////////////////////////////////////
        modalPurchase: false,
        purchaseGrid: {
            columnDefs:
                [
                    { headerName: 'Policy', field: 'policyNm', minWidth: 120 },
                    { headerName: 'Category', field: 'categoryCdNm', minWidth: 150 },
                    { headerName: 'Amount', field: 'amountNm', minWidth: 230 },
                    { headerName: 'Qty', field: 'docQty', minWidth: 120 },
                    {
                        headerName: 'Update', field: 'Delete', minWidth: 150,
                        cellRendererFramework: (params) => {
                            return (
                                <span style={{ color: '#28a745', fontWeight: 'bold' }} onClick={() => { 
                                    this.updatePurchaseGrid(params.data);
                                 }}>수정</span>
                            )
                        }
                    },
                    {
                        headerName: 'Delete', field: 'Delete', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            var itemId = params.data.itemId;
                            var userId = params.data.userId;

                            return (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }} onClick={() => { 
                                    this.deleteApprovalPurchaseData(policyId, itemId, userId);
                                 }}>삭제</span>
                            )
                        }
                    },
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
        fiApprovalPolicyPurchaseDto: {
            policyId: 0,
            itemId: 0,
            categoryCd: '01',
            minAmount: 0,
            maxAmount: 0,
            docQty: 0,
            remark: '',
            regId: '',
            updId: ''
        },
        /////////////////////////////////////////
        modalPurchaseLevel: false,
        modalPurchaseLevelGrid: {
            columnDefs:
                [
                    { headerName: 'Title', field: 'apprCdNm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
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
        purchaseLevelGrid: {
            columnDefs:
                [
                    { headerName: 'Title', field: 'apprCdNm', minWidth: 150, rowDrag: true },
                    { headerName: 'Level', field: 'levelSeq', minWidth: 120 },
                    {
                        headerName: 'Delete', field: 'Delete', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            var itemId = params.data.itemId;
                            var levelSeq = params.data.levelSeq;
                            return (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }} onClick={() => { 
                                    this.deleteApprovalPurchaseLevelData(policyId, itemId, levelSeq);
                                 }}>삭제</span>
                            )
                        }
                    },
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
        /////////////////////////////////////////
        modalUser: false,
        modalUserApprCd: '01',
        modalUserGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 150 },
                    { headerName: 'Position', field: 'dutyCdKorNm', minWidth: 150 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 200 },
                    { headerName: 'HR Status', field: 'hR_StatusCdNm', minWidth: 150 }
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
        userGrid: {
            columnDefs:
                [
                    { headerName: 'Title', field: 'apprCdNm', minWidth: 150 },
                    { headerName: 'User Nm', field: 'userNm', minWidth: 150 },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 150 },
                    { headerName: 'Position', field: 'dutyCdKorNm', minWidth: 150 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 200 },
                    { headerName: 'HR Status', field: 'hR_StatusCdNm', minWidth: 150 },
                    {
                        headerName: 'Delete', field: 'Delete', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            var apprCd = params.data.apprCd;
                            var userId = params.data.userId;

                            return (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }} onClick={() => { 
                                    this.deleteApprovalPolicyUserData(policyId, apprCd, userId);
                                 }}>삭제</span>
                            )
                        }
                    },
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
        modalUserCC: false,
        modalUserCCGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 150 },
                    { headerName: 'Position', field: 'dutyCdKorNm', minWidth: 150 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 200 },
                    { headerName: 'HR Status', field: 'hR_StatusCdNm', minWidth: 150 },
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
        userCCGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 150 },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 150 },
                    { headerName: 'Position', field: 'dutyCdKorNm', minWidth: 150 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 200 },
                    { headerName: 'HR Status', field: 'hR_StatusCdNm', minWidth: 150 },
                    {
                        headerName: 'Delete', field: 'Delete', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            var apprCd = params.data.apprCd;
                            var userId = params.data.userId;
                            var ccUserId = params.data.ccUserId;

                            return (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }} onClick={() => { 
                                    this.deleteApprovalPolicyUserCCData(policyId, apprCd, userId, ccUserId);
                                 }}>삭제</span>
                            )
                        }
                    },
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
    }

    
    /*==========================================================*/
    /* Page Load   */
    /*==========================================================*/
    componentDidMount() {
        if (this.props.id !== '' || this.props.id > 0) {
            this.setState({
                policyId: this.props.id,
                itemId: 0,
                userId: ''
            },() => {
                // Branch List
                this.getApprovalPolicyBranchList();

                // Approval Policy 
                this.getApprovalPurchaseList();

                // User List
                this.getApprovalPolicyUserList();
            })
        }
    }

    /*==========================================================*/
    /* Policy Branch List   */
    /*==========================================================*/
    getApprovalPolicyBranchList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetApprovalPolicyBranchList", {
            params: {
                policyId: this.state.policyId,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                branchGrid: { ...this.state.branchGrid, rowData: data },
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Purchase User Get   */
    /*==========================================================*/
    getApprovalPolicyUserList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetApprovalPolicyUserList", {
            params: {
                policyId: this.state.policyId,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                apprCd: '',
                userId: '',
                userGrid: { ...this.state.userGrid, rowData: data },
                userCCGrid: { ...this.state.userCCGrid, rowData: [] },
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Purchase Policy Get   */
    /*==========================================================*/
    getApprovalPurchaseList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetApprovalPurchaseList", {
            params: {
                policyId: this.state.policyId,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                itemId: 0,
                purchaseGrid: { ...this.state.purchaseGrid, rowData: data },
                purchaseLevelGrid: { ...this.state.purchaseLevelGrid, rowData: [] },

            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Purchase Policy Add   */
    /*==========================================================*/
    onClickNewPurchase() {
        this.setState({
            modalPurchase: true,
            fiApprovalPolicyPurchaseDto: {
                policyId: 0,
                itemId: 0,
                categoryCd: '01',
                minAmount: 0,
                maxAmount: 0,
                docQty: 1,
                remark: '',
                regId: '',
                updId: ''
            },
        })
    }

    /*==========================================================*/
    /* User Add   */
    /*==========================================================*/
    onClickNewUser() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserList", {
            params: {
                it_status_cd: '',
                hr_status_cd: '01'
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalUser: true,
                modalUserGrid: { ...this.state.modalUserGrid, rowData: data }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Level Add   */
    /*==========================================================*/
    async onClickNewPurchaseLevel() {
        if (this.state.itemId === 0) {
            alert('적용할 데이터를 선택해 주세요.');
            return;
        }
        var rows = [];
        this.props.onIsLoadingTrue();
        var gParams = {
            cdMajor: '0207',
            userId: this.props.storeState.userInfo.userId
        }
        var data = await this.props.storeState.axiosGet("/CommonService/GetCodeOpions", gParams);
        this.props.onIsLoadingFalse();

        var deleteMinor = '';
        this.state.purchaseLevelGrid.rowData.map((row) => {
            deleteMinor += row.apprCd + ','
        });

        data.map((row) => {
            if (deleteMinor.indexOf(row.cdMinor) > -1) {
                
            } else {
                rows.push({
                    apprCd: row.cdMinor,
                    apprCdNm: row.fullName
                });
            }
        })

        this.setState({
            modalPurchaseLevel: true,
            modalPurchaseLevelGrid: { ...this.state.modalPurchaseLevelGrid, rowData: rows }
        })
    }

    /*==========================================================*/
    /* User CC Add   */
    /*==========================================================*/
    onClickNewUserCC() {
        if (this.state.userId === '') {
            alert('적용할 데이터를 선택해 주세요.');
            return;
        }
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserList", {
            params: {
                it_status_cd: '',
                hr_status_cd: '01'
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalUserCC: true,
                modalUserCCGrid: { ...this.state.modalUserCCGrid, rowData: data }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Branch Add   */
    /*==========================================================*/
    onClickNewBranch() {
        this.setState({
            modalBranchShow: true,
            branchCdObj: <GDHSelectOption cdMajor="0036" frCdMinor={'01'} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />,
            fiApprovalPolicyBranchDto: {
                policyId: 0,
                branchCd: '',
                entityCd: '01',
                regId: '',
                updId: '',
            }
        })
    }

    /*==========================================================*/
    /* Purchase Policy Add   */
    /*==========================================================*/
    saveApprovalPurchaseData() {
        var gParam = {
            ...this.state.fiApprovalPolicyPurchaseDto,
            policyId: this.state.policyId,
            minAmount: Number(this.state.fiApprovalPolicyPurchaseDto.minAmount),
            maxAmount: Number(this.state.fiApprovalPolicyPurchaseDto.maxAmount),
            docQty: Number(this.state.fiApprovalPolicyPurchaseDto.docQty),
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        };

        if (gParam.minAmount >= gParam.maxAmount) {
            alert('최소금액은 최대금액과 같거나 높을 수 없습니다.');
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/saveApprovalPurchaseData",
            gParam)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
          
                this.getApprovalPurchaseList();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* [ Modal ] User List Save  */
    /*==========================================================*/
    saveApprovalPolicyUserData() {
        var rows = this.gridApiModalUser.getSelectedRows();
        var gParamRows = [];

        rows.map((row, i) => {
            gParamRows.push({
                policyId: this.state.policyId,
                apprCd: this.state.modalUserApprCd,
                userId: row.userId,
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        });

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SaveApprovalPolicyUserData",
        gParamRows
        )
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                
                this.getApprovalPolicyUserList();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* [ Modal ] Purchase Level Save  */
    /*==========================================================*/
    saveApprovalPurchaseLevelDataModal() {
        var rows = this.gridApiModalLevel.getSelectedRows();
        var data = [...this.state.purchaseLevelGrid.rowData];
        var arrSeq = [];
        data.forEach(row => {
            arrSeq.push(row.levelSeq);
        })
        var maxSeq = arrSeq.length === 0 ? 0 : Math.max.apply(null, arrSeq);

        rows.map((row, i) => {
            maxSeq += 1;

            data.push({
                policyId: this.state.policyId,
                itemId: this.state.itemId,
                levelSeq: maxSeq,
                apprCd: row.apprCd,
                apprCdNm: row.apprCdNm,
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        });

        this.setState({
            purchaseLevelGrid: {
                ...this.state.purchaseLevelGrid,
                rowData: data
            }
        });
    }
    // 순서 설정 후 다시 저장
    saveApprovalPurchaseLevelData() {
        var gParamRows = [];
        this.gridApiLevel.forEachNode(node => gParamRows.push(node.data));

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SaveApprovalPurchaseLevelData",
        gParamRows
        )
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                
                this.getApprovalPurchaseLevelList(this.state.itemId);

            }).catch(function (error) {
                alert(error);
            });

    }

    /*==========================================================*/
    /* [ Modal ] User CC Save  */
    /*==========================================================*/
    saveApprovalPolicyUserCCData() {
        var rows = this.gridApiModalUserCC.getSelectedRows();
        var gParamRows = [];

        rows.map((row, i) => {
            gParamRows.push({
                policyId: this.state.policyId,
                apprCd: this.state.apprCd,
                userId: this.state.userId,
                ccUserId: row.userId,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        });

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/saveApprovalPolicyUserCCData",
            gParamRows
        )
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
               
                this.getApprovalPolicyUserCCList(this.state.apprCd, this.state.userId);

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* [ Modal ] Branch Save  */
    /*==========================================================*/
    saveApprovalPolicyBranchData() {
        var gParam = { ...this.state.fiApprovalPolicyBranchDto };
        gParam.policyId = this.state.policyId;
        gParam.regId = this.props.storeState.userInfo.userId;
        gParam.updId = this.props.storeState.userInfo.userId;

        if(gParam.branchCd === '') {
            alert('Branch가 선택되지 않았습니다.')
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SaveApprovalPolicyBranchData",
            gParam
        ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getApprovalPolicyBranchList();

        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* purchase policy 그리드 클릭조회  */
    /*==========================================================*/
    onRowClickedPurchaseGrid(e) {
        var data = e.api.getSelectedRows();
        var itemId = data[0].itemId;

        this.getApprovalPurchaseLevelList(itemId);    
    }
    getApprovalPurchaseLevelList(itemId) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetApprovalPurchaseLevelList", {
            params: {
                policyId: this.state.policyId,
                itemId: itemId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                itemId: itemId,
                purchaseLevelGrid: { ...this.state.purchaseLevelGrid, rowData: data }
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    updatePurchaseGrid(data) {
        this.setState({
            modalPurchase: true,
            fiApprovalPolicyPurchaseDto: {
                policyId: data.policyId,
                itemId: data.itemId,
                categoryCd: data.categoryCd,
                minAmount: data.minAmount,
                maxAmount: data.maxAmount,
                docQty: data.docQty,
                remark: data.remark,
                regId: '',
                updId: ''
            },
        })
    }

    /*==========================================================*/
    /* Policy 삭제  */
    /*==========================================================*/
    deleteApprovalPurchaseData(policyId, itemId, userId) {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/DeleteApprovalPurchaseData", {},
        {
            params: {
                policyId, itemId, userId
            }
        }
    ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getApprovalPurchaseList();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Level 삭제  */
    /*==========================================================*/
    deleteApprovalPurchaseLevelData(policyId, itemId, levelSeq) {
        var rows = [...this.state.purchaseLevelGrid.rowData];
        var newRows = [];

        rows.map((row) => {
            if(row.policyId === policyId && row.itemId === itemId && row.levelSeq === levelSeq) {

            } else {
                newRows.push(row)
            }
        });

        this.setState({
            purchaseLevelGrid: {
                ...this.state.purchaseLevelGrid,
                rowData: newRows
            }
        })
    }
    /*==========================================================*/
    /* User 삭제  */
    /*==========================================================*/
    deleteApprovalPolicyUserData(policyId, apprCd, userId) {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/DeleteApprovalPolicyUserData", {},
            {
                params: {
                    policyId, apprCd, userId
                }
            }
        ).then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.getApprovalPolicyUserList();
            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* User CC 삭제  */
    /*==========================================================*/
    deleteApprovalPolicyUserCCData(policyId, apprCd, userId, ccUserId) {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/DeleteApprovalPolicyUserCCData", {},
            {
                params: {
                    policyId, apprCd, userId, ccUserId
                }
            }
        ).then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.getApprovalPolicyUserCCList(apprCd, userId);
            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* Branch 삭제  */
    /*==========================================================*/
    deleteApprovalPolicyBranchData(policyId, branchCd) {
        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/DeleteApprovalPolicyBranchData", {},
        {
            params: {
                policyId, branchCd
            }
        }
    ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getApprovalPolicyBranchList();
            
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* User 그리드 클릭조회  */
    /*==========================================================*/
    onRowClickedUserGrid(e) {
        var data = e.api.getSelectedRows();
        var apprCd = data[0].apprCd;
        var userId = data[0].userId;

        this.getApprovalPolicyUserCCList(apprCd, userId);    
    }
    getApprovalPolicyUserCCList(apprCd, userId) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetApprovalPolicyUserCCList", {
            params: {
                policyId: this.state.policyId,
                apprCd: apprCd,
                userId: userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                apprCd: apprCd,
                userId: userId,
                userCCGrid: { ...this.state.userCCGrid, rowData: data }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

     // 체인지 공통
     onChangeHandler(e) {
        this.setState({
            fiApprovalPolicyPurchaseDto: {
                ...this.state.fiApprovalPolicyPurchaseDto,
                [e.target.name]: e.target.value
            }
        });
    }
    // 체인지 공통
    onChangeHandlerUser(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onChangeHandlerBranch(e) {
        var name = e.target.name;
        var val = e.target.value;
        this.setState({
            fiApprovalPolicyBranchDto: {
                ...this.state.fiApprovalPolicyBranchDto,
                [e.target.name]: e.target.value
            }
        });

        if (name === 'entityCd') {
            this.setState({
                branchCdObj: null,
            }, () => {
                this.setState({
                    branchCdObj: <GDHSelectOption cdMajor="0036" frCdMinor={val} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                })
                
            })
        }
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }

    render() {
        return (<>
            <Modal.Header className="text-right">
                <div className="col-md-12 text-rigth">
                    {/* <Button variant="success" onClick={this.saveVendorData.bind(this)} >Save</Button>{' '} */}
                    <Button variant="secondary" onClick={function () {
                        this.props.onClickModalClose();
                    }.bind(this)}>Close</Button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Row>
                        <div className="col-md-12">
                            <Card>
                                <Card.Header>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>■ Branch Mapping</Form.Label>
                                        </Form.Row>
                                    </Form>
                                </Card.Header>
                                <Card.Body style={{ padding: 0 }}>
                                    <Form.Row>
                                        <div className='col-md-12'>
                                            <div className="text-right" style={{ marginTop: 15, marginBottom: 5 }}>
                                                <Button variant="secondary" onClick={this.onClickNewBranch.bind(this)}>Add</Button>
                                            </div>
                                            <div className="ag-theme-material"
                                                style={{ height: 200, borderTop: '2px solid #695405' }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.branchGrid.columnDefs}
                                                    defaultColDef={this.state.branchGrid.defaultColDef}
                                                    rowData={this.state.branchGrid.rowData}
                                                    rowSelection="multiple" // single
                                                    // onGridReady={params => this.gridApiContact = params.api}
                                                    // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                                    // onRowClicked={this.onRowClickedPurchaseGrid.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </Form.Row>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-12">
                            <hr />
                            <Card>
                                <Card.Header>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>■ Amount Policy</Form.Label>
                                        </Form.Row>
                                    </Form>
                                </Card.Header>
                                <Card.Body style={{ padding: 0 }}>
                                    <Form.Row>
                                        <div className='col-md-8'>
                                            <div className="text-right" style={{ marginTop: 15, marginBottom: 5 }}>
                                                <Button variant="secondary" onClick={this.onClickNewPurchase.bind(this)}>Add</Button>
                                            </div>
                                            <div className="ag-theme-material"
                                                style={{ height: 300, borderTop: '2px solid #695405' }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.purchaseGrid.columnDefs}
                                                    defaultColDef={this.state.purchaseGrid.defaultColDef}
                                                    rowData={this.state.purchaseGrid.rowData}
                                                    rowSelection="multiple" // single
                                                // onGridReady={params => this.gridApiContact = params.api}
                                                    //onRowDoubleClicked={this.onRowDoubleClickedPurchaseGrid.bind(this)}
                                                    onRowClicked={this.onRowClickedPurchaseGrid.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="text-right" style={{ marginTop: 15, marginBottom: 5 }}>
                                                <Button variant="secondary" onClick={this.onClickNewPurchaseLevel.bind(this)}>Add</Button>{' '}
                                                <Button variant="success" onClick={this.saveApprovalPurchaseLevelData.bind(this)}>Save</Button>
                                            </div>
                                            <div className="ag-theme-material"
                                                style={{ height: 300, borderTop: '2px solid #695405' }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.purchaseLevelGrid.columnDefs}
                                                    defaultColDef={this.state.purchaseLevelGrid.defaultColDef}
                                                    rowData={this.state.purchaseLevelGrid.rowData}
                                                    rowSelection="multiple" // single
                                                    rowDragManaged={true}
                                                    animateRows={true}
                                                    onGridReady={params => this.gridApiLevel = params.api}
                                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </Form.Row>
                                </Card.Body>
                            </Card>
                            <hr />
                        </div>
                        <div className="col-md-12" style={{ marginTop: 15 }}>
                            <Card>
                                <Card.Header>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>■ User Setting</Form.Label>
                                        </Form.Row>
                                    </Form>
                                </Card.Header>
                                <Card.Body style={{ padding: 0 }}>
                                    <Form.Row>
                                        <div className='col-md-8'>
                                            <div className="text-right" style={{ marginTop: 15, marginBottom: 5 }}>
                                                <Button variant="secondary" onClick={this.onClickNewUser.bind(this)}>Add</Button>
                                            </div>
                                            <div className="ag-theme-material"
                                                style={{ height: 300, borderTop: '2px solid #695405' }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.userGrid.columnDefs}
                                                    defaultColDef={this.state.userGrid.defaultColDef}
                                                    rowData={this.state.userGrid.rowData}
                                                    rowSelection="multiple" // single
                                                // onGridReady={params => this.gridApiContact = params.api}
                                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                                    onRowClicked={this.onRowClickedUserGrid.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="text-right" style={{ marginTop: 15, marginBottom: 5 }}>
                                                <Button variant="secondary" onClick={this.onClickNewUserCC.bind(this)}>Add</Button>
                                            </div>
                                            <div className="ag-theme-material"
                                                style={{ height: 300, borderTop: '2px solid #695405' }}
                                            >
                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                    columnDefs={this.state.userCCGrid.columnDefs}
                                                    defaultColDef={this.state.userCCGrid.defaultColDef}
                                                    rowData={this.state.userCCGrid.rowData}
                                                    rowSelection="multiple" // single
                                                // onGridReady={params => this.gridApiContact = params.api}
                                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </Form.Row>
                                </Card.Body>
                            </Card>
                        </div>
                    </Form.Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
            </Modal.Footer>


            {/* purchase Modal */}
            <Modal show={this.state.modalPurchase} backdrop="static" size="md" >
                <div style={{ border: '2px solid #6c757d' }}>
                    <Modal.Header className="text-right">
                        <div className="col-md-12 text-rigth">
                            <Button variant="success" onClick={this.saveApprovalPurchaseData.bind(this)} >Save</Button>{' '}
                            <Button variant="secondary" onClick={function () {
                                this.setState({ modalPurchase: false })
                            }.bind(this)}>Close</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Row>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Category</Form.Label>
                                        <Form.Control as="select" size="sm"
                                            name="categoryCd"
                                            value={this.state.fiApprovalPolicyPurchaseDto.categoryCd} onChange={this.onChangeHandler.bind(this)}
                                        >
                                            <GDHSelectOption cdMajor="0206" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Min Amt</Form.Label>
                                        <Form.Control type="number" size="sm"
                                            name="minAmount"
                                            style={{ textAlign: 'right' }}
                                            value={this.state.fiApprovalPolicyPurchaseDto.minAmount} onChange={this.onChangeHandler.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Max Amt</Form.Label>
                                        <Form.Control type="number" size="sm"
                                            name="maxAmount"
                                            style={{ textAlign: 'right' }}
                                            value={this.state.fiApprovalPolicyPurchaseDto.maxAmount} onChange={this.onChangeHandler.bind(this)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Upload Qty</Form.Label>
                                        <Form.Control as="select" size="sm"
                                            name="docQty"
                                            value={this.state.fiApprovalPolicyPurchaseDto.docQty} onChange={this.onChangeHandler.bind(this)}
                                        >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
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

              {/* Level Modal */}
              <Modal show={this.state.modalPurchaseLevel} backdrop="static" size="md" >
                <div style={{ border: '2px solid #6c757d' }}>
                    <Modal.Header className="text-right">
                        <div className="col-md-12 text-rigth">
                            <Button variant="success" onClick={this.saveApprovalPurchaseLevelDataModal.bind(this)} >Save</Button>{' '}
                            <Button variant="secondary" onClick={function () {
                                this.setState({ modalPurchaseLevel: false })
                            }.bind(this)}>Close</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="ag-theme-material"
                            style={{ height: 300, borderTop: '2px solid #695405' }}
                        >
                            <AgGridReact headerHeight={45} rowHeight={45}
                                columnDefs={this.state.modalPurchaseLevelGrid.columnDefs}
                                defaultColDef={this.state.modalPurchaseLevelGrid.defaultColDef}
                                rowData={this.state.modalPurchaseLevelGrid.rowData}
                                rowSelection="multiple" // single
                                onGridReady={params => this.gridApiModalLevel = params.api}
                            // onRowClicked={this.onRowClicked_Master.bind(this)}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                            />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal>

              {/* User Modal */}
              <Modal show={this.state.modalUser} backdrop="static" size="md" >
                <div style={{ border: '2px solid #6c757d' }}>
                    <Modal.Header className="text-right">
                        <div className="col-md-12 text-rigth">
                            <Button variant="success" onClick={this.saveApprovalPolicyUserData.bind(this)} >Save</Button>{' '}
                            <Button variant="secondary" onClick={function () {
                                this.setState({ modalUser: false })
                            }.bind(this)}>Close</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-md-12">
                            <Form.Group>
                                <Form.Label>■ Title</Form.Label>
                                <Form.Control as="select" size="md"
                                    name="modalUserApprCd"
                                    value={this.state.modalUserApprCd} onChange={this.onChangeHandlerUser.bind(this)}
                                >
                                    <GDHSelectOption cdMajor="0207" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="ag-theme-material"
                            style={{ height: 500, borderTop: '2px solid #695405' }}
                        >
                            <AgGridReact headerHeight={45} rowHeight={45}
                                columnDefs={this.state.modalUserGrid.columnDefs}
                                defaultColDef={this.state.modalUserGrid.defaultColDef}
                                rowData={this.state.modalUserGrid.rowData}
                                rowSelection="multiple" // single
                                onGridReady={params => this.gridApiModalUser = params.api}
                            // onRowClicked={this.onRowClicked_Master.bind(this)}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                            />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal>

             {/* User CC Modal */}
             <Modal show={this.state.modalUserCC} backdrop="static" size="md" >
                <div style={{ border: '2px solid #6c757d' }}>
                    <Modal.Header className="text-right">
                        <div className="col-md-12 text-rigth">
                            <Button variant="success" onClick={this.saveApprovalPolicyUserCCData.bind(this)} >Save</Button>{' '}
                            <Button variant="secondary" onClick={function () {
                                this.setState({ modalUserCC: false })
                            }.bind(this)}>Close</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="ag-theme-material"
                            style={{ height: 500, borderTop: '2px solid #695405' }}
                        >
                            <AgGridReact headerHeight={45} rowHeight={45}
                                columnDefs={this.state.modalUserCCGrid.columnDefs}
                                defaultColDef={this.state.modalUserCCGrid.defaultColDef}
                                rowData={this.state.modalUserCCGrid.rowData}
                                rowSelection="multiple" // single
                                onGridReady={params => this.gridApiModalUserCC = params.api}
                            // onRowClicked={this.onRowClicked_Master.bind(this)}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                            />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    </Modal.Footer>
                </div>
            </Modal>

             {/* Branch Modal */}
             <Modal show={this.state.modalBranchShow} backdrop="static" size="md" >
                <div style={{ border: '2px solid #6c757d' }}>
                    <Modal.Header className="text-right">
                        <div className="col-md-12 text-rigth">
                            <Button variant="success" onClick={this.saveApprovalPolicyBranchData.bind(this)} >Save</Button>{' '}
                            <Button variant="secondary" onClick={function () {
                                this.setState({ modalBranchShow: false })
                            }.bind(this)}>Close</Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Row>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Entity</Form.Label>
                                        <Form.Control as="select" size="sm"
                                            name="entityCd"
                                            value={this.state.fiApprovalPolicyBranchDto.entityCd} onChange={this.onChangeHandlerBranch.bind(this)}
                                        >
                                            <GDHSelectOption cdMajor="0036" level={'11'} deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Form.Group>
                                        <Form.Label>■ Branch</Form.Label>
                                        <Form.Control as="select" size="sm"
                                            name="branchCd"
                                            value={this.state.fiApprovalPolicyBranchDto.branchCd} onChange={this.onChangeHandlerBranch.bind(this)}
                                        >
                                            {this.state.branchCdObj}
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
)(FiApprovalPolicyPurchase)
