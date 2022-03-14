import React, { Component } from 'react';
//import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Table, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import GDHSelectOption from '../../common/controls/GDHSelectOption';


import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

import CurrencyRenderer from '../../common/renderer/CurrencyRenderer';
import NumberRenderer from '../../common/renderer/NumberRenderer';

class AcountDetail extends Component {
    state = {
        ItAcountUserDto: {
            userId: '',
            userNm: '',
            userEnm: '',
            loginId: '',
            loginPassword: '',
            workerId: '',
            email: '',
            tel: '',
            mobileTel: '',
            enterDt: '',
            entireDt: '',
            entireGb: '',
            userGb: '',
            deptCd1: '',
            deptCd2: '',
            deptCd3: '',
            deptCd4: '',
            deptCdKor: '',
            dutyCdKor: '',
            upDutyCdEng: '',
            dutyCdEng: '',
            preLeaveCnt: '',
            orgLeaveCnt: '',
            userPic: '',
            birthDay: '',
            addressKor: '',
            genderGb: '',
            ctsTypeId: '',
            masYn: '',
            extNum: '',
            iT_StatusCd: '',
            hR_StatusCd: '',
            hR_Remark: '',
            remark: '',
            roleId: '',
            officeId: '',
            regId: '',
            updId: ''
        },
        applicationGrid: {
            modules: AllCommunityModules,
            columnDefs:
                [
                    { headerName: 'App Type', field: 'assetsNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'App Nm', field: 'itemNm', minWidth: 100 },
                    { headerName: 'Stock Yn', field: 'stockYn', minWidth: 100 },
                    {
                        headerName: 'Use Cnt', field: 'useItemCnt', minWidth: 100, editable: true,
                        // cellRenderer: 'numberRenderer',
                    },
                    // {
                    //     headerName: 'Use Cnt', field: 'useItemCnt', minWidth: 100,
                    //     cellRendererFramework: (params) => 
                    //     {
                    //         var index = params.rowIndex;
                    //         return (
                    //             <input type="text" value={params.data.useItemCnt} onChange={function(e) {
                    //                 var newRowData = []
                    //                 this.state.applicationGrid.rowData.map((data) => {
                    //                     newRowData.push(data);
                    //                 })
                    //                 newRowData[index].useItemCnt = Number(e.target.value);
                    //                 this.setState({
                    //                     applicationGrid: {
                    //                         ...this.state.applicationGrid,
                    //                         rowData: newRowData
                    //                     }
                    //                 });
                                    
                    //             }.bind(this)} />
                    //         )
                    //     }
                            
                    // },
                    { headerName: 'Reg Cnt', field: 'itemCnt', minWidth: 100 },
                    { headerName: 'Remainder Cnt', field: 'reCnt', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100, editable: true, },
                ],
            rowData: [],
            rowCount: 0,
            // frameworkComponents: {
            //     numberRenderer: NumberRenderer,
            // },
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: true, // 멀티서치 기능
            },
            isLoding: false,
        },
        softwareGrid: {
            columnDefs:
                [
                    { headerName: 'HW Host Nm', field: 'pHostNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'SW Type', field: 'cAssetsNm', minWidth: 100 },
                    { headerName: 'SW Nm', field: 'cItemNm', minWidth: 100 },
                    { headerName: 'Stock Yn', field: 'cStockYn', minWidth: 100 },
                    { headerName: 'Use Cnt', field: 'cUseItemCnt', minWidth: 100, editable: true, },
                    { headerName: 'Reg Cnt', field: 'cItemCnt', minWidth: 100 },
                    { headerName: 'Re Cnt', field: 'cReCnt', minWidth: 100 },
                    { headerName: 'Serial No', field: 'cSerialNo', minWidth: 100 },
                    { headerName: 'Remark', field: 'cRemark', minWidth: 100, editable: true },
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
            },
            isLoding: false,
        },
        hardwareGrid: {
            columnDefs:
                [
                    { headerName: 'HW Type', field: 'assetsNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Host Nm', field: 'hostNm', minWidth: 100 },
                    { headerName: 'Control No', field: 'controlNo', minWidth: 100 },
                    { headerName: 'Model', field: 'itemNm', minWidth: 100 },
                    { headerName: 'Serial No', field: 'serialNo', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100, editable: true },
                    { headerName: 'Stock Yn', field: 'stockYn', minWidth: 100 },
                    { headerName: 'Use Cnt', field: 'useItemCnt', minWidth: 100 },
                    { headerName: 'Reg Cnt', field: 'itemCnt', minWidth: 100 },
                    { headerName: 'Re Cnt', field: 'reCnt', minWidth: 100 },
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
            },
            isLoding: false,
        },
        networkGrid: {
            columnDefs:
                [
                    { headerName: 'Net Type', field: 'assetsNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Net Nm', field: 'itemNm', minWidth: 100 },
                    {
                        headerName: 'Status', field: 'itemStatus', minWidth: 100,
                        cellRendererFramework: (params) => 
                        {
                            var index = params.rowIndex;
                            return (
                                <select value={this.state.networkGrid.rowData[index].itemStatus} onChange={function (e) {
                                    var newRowData = []
                                    this.state.networkGrid.rowData.map((data) => {
                                        newRowData.push(data);
                                    })
                                    newRowData[index].itemStatus = e.target.value;
                                    this.setState({
                                        networkGrid: {
                                            ...this.state.networkGrid,
                                            rowData: []
                                        }
                                    }, () => {
                                        this.setState({
                                            networkGrid: {
                                                ...this.state.networkGrid,
                                                rowData: newRowData
                                            }
                                        });
                                    });
                                }.bind(this)}>
                                    <option value="01">Full Ctrl</option>
                                    <option value="02">Read Only</option>
                                </select>
                            )
                        }
                            
                    },
                    { headerName: 'Remark', field: 'remark', minWidth: 100, editable: true },
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
            },
            isLoding: false,
        },
        modalItemShow: false,
        modalItemGrid: {
            selectedAssetsGb: '',

            assetsNmList: [],
            selectedAssetsId: 0,

            hardwareNmList: [],
            selectedHardwareId: '',

            columnDefs: [],
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
        itAcountQnA: {
            qnAId: 0
          , qnADesc: ''
          , statusCd: ''
          , remark: ''
          , regId: ''
          , updId: ''

          , updDtNm: ''
      },
    }

    componentDidMount() {
        // 넘겨온값 받기
        if (this.props.ItAcountUserDto !== undefined && this.props.ItAcountUserDto !== '') {
            this.setState({
                ItAcountUserDto: this.props.ItAcountUserDto
            })

            // QnA
            this.getQnAData(this.props.ItAcountUserDto.userId);

            // Application
            this.getAcountAssetsList(this.props.ItAcountUserDto.userId, '01');
            // Hardware
            this.getAcountAssetsList(this.props.ItAcountUserDto.userId, '03');
            // Network
            this.getAcountAssetsList(this.props.ItAcountUserDto.userId, '04');
            // Software
            this.getAcountAssetsList(this.props.ItAcountUserDto.userId, '02');
        }
    }

    /*==========================================================*/
    /* QnA 정보    */
    /*==========================================================*/
    getQnAData(userId) {
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + "GetQnAData", {
            params: {
                userId: userId,
            }
        }).then(r => {
            var data = r.data;
            if(data === '') return;
            this.setState({
                itAcountQnA: {
                    ...this.state.itAcountQnA,
                    qnAId: data.qnAId,
                    qnADesc: data.qnADesc,
                    statusCd: data.statusCd,
                    updDtNm: data.updDtNm,
                }
            });
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* QnA 저장    */
    /*==========================================================*/
    saveQnAData() {
        var gParam = { ...this.state.itAcountQnA };
        gParam.qnAId= Number(this.state.itAcountQnA.qnAId);
        gParam.statusCd = '10';
        gParam.updId = this.props.storeState.userInfo.userId;

        axios.post(this.props.storeState.serviceUrl + "/ItAcountAssetsService/SaveQnAData",
            gParam
        ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getQnAData(this.state.ItAcountUserDto.userId);
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
	/* Item List    */
	/*==========================================================*/
    getAcountAssetsList(userId, assetsGb) {
        var serviceAction = "";
        if (assetsGb === '02') {
            serviceAction = "GetAcountAssetsToAssetsList";
        } else {
            serviceAction = "GetAcountAssetsList";
        }
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + serviceAction, {
            params: {
                userId, assetsGb
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            if (assetsGb === '01'){
                this.setState({ 
                    applicationGrid: { 
                        ...this.state.applicationGrid, 
                        rowData: data,
                        rowCount: data.length,
                        isLoding: false,
                    }
                }, () => {
                    setTimeout(function () { //Start the timer
                        this.setState({
                            modalItemShow: false,
                        })
                    }.bind(this), 300)
                })
            }
            if (assetsGb === '03'){
                this.setState({ 
                    hardwareGrid: { 
                        ...this.state.hardwareGrid, 
                        rowData: data,
                        rowCount: data.length,
                        isLoding: false,
                    }
                }, () => {
                    setTimeout(function () { //Start the timer
                        this.setState({
                            modalItemShow: false,
                        })
                    }.bind(this), 300)
                })
            }
            if (assetsGb === '04'){
                this.setState({ 
                    networkGrid: { 
                        ...this.state.networkGrid, 
                        rowData: data,
                        rowCount: data.length,
                        isLoding: false, 
                    }
                }, () => {
                    setTimeout(function () { //Start the timer
                        this.setState({
                            modalItemShow: false,
                        })
                    }.bind(this), 300)
                })
            }
            if (assetsGb === '02'){
                this.setState({ 
                    softwareGrid: { 
                        ...this.state.softwareGrid, 
                        rowData: data,
                        rowCount: data.length,
                        isLoding: false, 
                    }
                }, () => {
                    setTimeout(function () { //Start the timer
                        this.setState({
                            modalItemShow: false,
                        })
                    }.bind(this), 300)
                })
            }
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
	/* User Info 저장    */
	/*==========================================================*/
    saveUserInfoData() {
        var Gparam = {
            ...this.state.ItAcountUserDto,
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }
        if (Gparam.iT_StatusCd === '03') {
            if (window.confirm("Delete시 유저와 연결된 Assets는 삭제됩니다. 삭제하시겠습니까?")) {
                this.saveUserInfoData_Process(Gparam);
            }
        } else {
            this.saveUserInfoData_Process(Gparam);
        }

    }
    saveUserInfoData_Process(Gparam) {
        // this.props.onIsLoadingTrue();
        axios.post(this.props.storeState.serviceUrl + "/ItAcountAssetsService/saveUserInfoData",
            Gparam)
            .then(r => {
                // this.props.onIsLoadingFalse();
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
	/* Assets Item 저장    */
	/*==========================================================*/
    saveAssetsItemData(e) {
        function validateGrid(name, rows) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var useItemCnt = name === 'software' ? row.cUseItemCnt : row.useItemCnt;
                if (isNaN(Number(useItemCnt))) {
                    alert('Use Cnt 값은 숫자로 설정 바랍니다.')
                    return false;
                }
            }
            return true;
        }
        var rows = [];
        var name = e.target.name;
        var serviceAction = "SaveAssetsItemData";

        if (name === 'application') {
            this.gridApiApplication.stopEditing();
            this.setState({
                applicationGrid: {
                    ...this.state.applicationGrid,
                    isLoding: true
                }
            })
            rows = this.state.applicationGrid.rowData;
        }
        if (name === 'hardware') {
            this.gridApiHardware.stopEditing();
            this.setState({
                hardwareGrid: {
                    ...this.state.hardwareGrid,
                    isLoding: true
                }
            })
            rows = this.state.hardwareGrid.rowData;
        }
        if (name === 'network') {
            this.gridApiNetwork.stopEditing();
            this.setState({
                networkGrid: {
                    ...this.state.networkGrid,
                    isLoding: true
                }
            })
            rows = this.state.networkGrid.rowData;
        }
        if (name === 'software') {
            serviceAction = "SaveAssetsToAssetsItemData";
            this.gridApiSoftware.stopEditing();
            this.setState({
                softwareGrid: { 
                    ...this.state.softwareGrid, 
                    isLoding: true
                }
            })
            rows = this.state.softwareGrid.rowData; 
        }

        rows.map((row) => {
            if (name === 'software') row.cUseItemCnt = Number(row.cUseItemCnt);
            else row.useItemCnt = Number(row.useItemCnt);
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        })

        if (!validateGrid(name, rows)) {
            if (name === 'application') {
                this.setState({
                    applicationGrid: {
                        ...this.state.applicationGrid,
                        isLoding: false
                    },
                })
            }
            if (name === 'hardware') {
                this.setState({
                    hardwareGrid: {
                        ...this.state.hardwareGrid,
                        isLoding: false
                    },
                })
            }
            if (name === 'network') {
                this.setState({
                    networkGrid: {
                        ...this.state.networkGrid,
                        isLoding: false
                    },
                })
            }
            if (name === 'software') {
                this.setState({
                    softwareGrid: {
                        ...this.state.softwareGrid,
                        isLoding: false
                    },
                })
            }
            return;
        }
        axios.post(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + serviceAction,
            rows
        ).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }

            var userId = this.state.ItAcountUserDto.userId;
            if (name === 'application') this.getAcountAssetsList(userId, "01");
            if (name === 'hardware') { this.getAcountAssetsList(userId, "03") };
            if (name === 'network') this.getAcountAssetsList(userId, "04");
            if (name === 'software') this.getAcountAssetsList(userId, "02");
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
	/* Assets Item Delete   */
	/*==========================================================*/
    deleteAssetsItemData(e) {
        var rows = [];
        var name = e.target.name;

        if (name === 'software') {
            // empty
        }
        else {
            if (name === 'application') rows = this.gridApiApplication.getSelectedRows(); 
            if (name === 'hardware') rows = this.gridApiHardware.getSelectedRows(); 
            if (name === 'network') rows = this.gridApiNetwork.getSelectedRows(); 

            if (rows.length === 0) {
                alert('선택된 데이터가 없습니다.');
                return;
            }
            axios.post(this.props.storeState.serviceUrl + "/ItAcountAssetsService/DeleteAssetsItemData",
                    rows
                ).then(r => {
                    var data = r.data;
                    if (data.oV_RTN_CODE === -1) {
                        alert(data.oV_RTN_MSG);
                        return;
                    }

                    var userId = this.state.ItAcountUserDto.userId;
                    if (name === 'application') this.getAcountAssetsList(userId, "01");
                    if (name === 'hardware') {
                        this.getAcountAssetsList(userId, "03")
                        setTimeout(function () { //Start the timer
                            this.getAcountAssetsList(userId, "02")
                        }.bind(this), 300)
                    };
                    if (name === 'network') this.getAcountAssetsList(userId, "04");
                }).catch(function (error) {
                    alert(error);
                });
        }
    }

    /*==========================================================*/
	/* Item add    */
	/*==========================================================*/
    onClickAdd(e) {
        var name = e.target.name;
        var assetsGb = "";
        var columnDefs = [];
        if (name==="application"){
            assetsGb = "01";
            columnDefs =  [
                { headerName: 'App Nm', field: 'itemNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                { headerName: 'App No', field: 'cdRef1', minWidth: 100 },
                { headerName: 'Stock Yn', field: 'stockYn', minWidth: 100 },
                { headerName: 'Reg Cnt', field: 'itemCnt', minWidth: 100 },
                { headerName: 'Remainder Cnt', field: 'reCnt', minWidth: 100 },
                { headerName: 'Remark', field: 'remark', minWidth: 100 },
            ]
        }
        if (name==="hardware"){
            assetsGb = "03";
            columnDefs =  [
                { headerName: 'Host Nm', field: 'hostNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                { headerName: 'Control No', field: 'controlNo', minWidth: 100 },
                { headerName: 'Serial No', field: 'serialNo', minWidth: 100 },
                { headerName: 'Model', field: 'itemNm', minWidth: 100 },
                { headerName: 'SW Cnt', field: 'softwareCnt', minWidth: 100 },
                { headerName: 'Manufacture', field: 'manufacture', minWidth: 100 },
                { headerName: 'Cpu', field: 'cdRef1', minWidth: 100 },
                { headerName: 'Ram', field: 'cdRef2', minWidth: 100 },
                { headerName: 'HDD', field: 'cdRef3', minWidth: 100 },
                { headerName: 'Purchase Dt', field: 'purchaseDt', minWidth: 100 },
                { headerName: 'Replace Dt', field: 'replaceDt', minWidth: 100 },
                { headerName: 'Disposal Dt', field: 'disposalDt', minWidth: 100 },
                { headerName: 'Stock Yn', field: 'stockYn', minWidth: 100 },
                { headerName: 'Reg Cnt', field: 'itemCnt', minWidth: 100 },
                { headerName: 'Remainder Cnt', field: 'reCnt', minWidth: 100 },
                { headerName: 'Remark', field: 'remark', minWidth: 100 },
            ]
        }
        if (name==="network"){
            assetsGb = "04";
            columnDefs =  [
                { headerName: 'Network Nm', field: 'itemNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                { headerName: 'Stock Yn', field: 'stockYn', minWidth: 100 },
                { headerName: 'Reg Cnt', field: 'itemCnt', minWidth: 100 },
                { headerName: 'Remainder Cnt', field: 'ReCnt', minWidth: 100 },
                { headerName: 'Remark', field: 'remark', minWidth: 100 },
            ]
        }
        if( name === "software") {
            if (this.state.hardwareGrid.rowCount === 0) {
                alert('Hardware의 "Desktop" 또는 "Laptop" 장비가 존재해야 됩니다.');
                return;
            }
            for (var i = 0; i < this.state.hardwareGrid.rowCount; i++) {
                var dr = this.gridApiHardware.getRowNode(i);
                if (!(dr.data.assetsNm === 'Desktop' || dr.data.assetsNm === 'Laptop')) {
                    alert('Hardware의 "Desktop" 또는 "Laptop" 장비가 존재해야 됩니다.');
                    return;
                }
            }
            assetsGb = "02";
            columnDefs =  [
                { headerName: 'Network Nm', field: 'cItemNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                { headerName: 'Stock Yn', field: 'cStockYn', minWidth: 100 },
                { headerName: 'Reg Cnt', field: 'cItemCnt', minWidth: 100 },
                { headerName: 'Remainder Cnt', field: 'cReCnt', minWidth: 100 },
                { headerName: 'Remark', field: 'cRemark', minWidth: 100 },
            ]
        }

        this.setState({
            modalItemShow: true,
            modalItemGrid: {
                ...this.state.modalItemGrid,
                selectedAssetsGb: assetsGb,
                columnDefs: [],
            }
        }, () => {
            if (assetsGb === '02') {
                this.setState({
                    modalItemGrid: {
                        ...this.state.modalItemGrid,
                        columnDefs: columnDefs
                    }
                }, () => {
                    this.getHardwareNmList();
                })
                
            }
            else {
                this.setState({
                    modalItemGrid: {
                        ...this.state.modalItemGrid,
                        columnDefs: columnDefs
                    }
                }, () => {
                    // [1] 모달 상위 assetsNm 가져오기
                    this.getModalAssetsNmList(assetsGb);
                })
            }
        })
    }

    // [**] 하드웨어 가져오기
    getHardwareNmList() {
        var userId = this.state.ItAcountUserDto.userId
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/GetHardwareNmList", {
            params: {
                userId
            }
        }).then(r => {
                var data = r.data;
                this.setState({
                    modalItemGrid: {
                        ...this.state.modalItemGrid,
                        hardwareNmList: data,
                        selectedHardwareId: data.length > 0 ? data[0].hardwareId : ''
                    }
                }, () => {
                    // [1] 모달 상위 assetsNm 가져오기
                    this.getModalAssetsNmList("02");
                })
            })
            .catch(function (error) {
                alert(error);
            });
    }


    // [1] 모달 상위 assetsNm 가져오기
    getModalAssetsNmList(assetsGb) {
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/GetModalAssetsNmList", {
            params : {
                assetsGb
            }
        })
        .then(r => {
            var data = r.data;
            this.setState({
                modalItemGrid: {
                    ...this.state.modalItemGrid,
                    assetsNmList: data,
                    selectedAssetsId: data.length > 0 ? data[0].assetsId : 0
                }
            }, () => {
                if (assetsGb === '02') {
                    // [2] assetsId 를 통해 리스트 가져오기
                    var userId = this.state.ItAcountUserDto.userId;
                    var pAssetsId = Number(this.state.modalItemGrid.selectedHardwareId.split('_')[0]);    
                    var pItemId = Number(this.state.modalItemGrid.selectedHardwareId.split('_')[1]);    
                    var cAssetsId = this.state.modalItemGrid.selectedAssetsId;    

                    this.getModalHardwareSoftwareList(userId, pAssetsId, pItemId, cAssetsId);
                } else {
                    // [2] assetsId 를 통해 리스트 가져오기
                    var userId = this.state.ItAcountUserDto.userId;
                    var assetsId = this.state.modalItemGrid.selectedAssetsId;    
                    this.getModalAssetsItemList(userId, assetsId);
                }
            })
        })
        .catch(function (error) { 
            alert(error); 
        });
    }
    // [2] assetsId 를 통해 리스트 가져오기
    getModalAssetsItemList(userId, assetsId) {
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/GetModalAcountAssetsList", {
            params : {
                userId, assetsId
            }
        })
        .then(r => {
            var data = r.data;
            this.setState({
                modalItemShow: true,
                modalItemGrid: {
                    ...this.state.modalItemGrid,
                    rowData: []
                }
            },() => {
                setTimeout(function () { //Start the timer
                    this.setState({
                        modalItemGrid: {
                            ...this.state.modalItemGrid,
                            rowData: data
                        }
                    })
                }.bind(this), 300)
            })
        })
        .catch(function (error) { 
            alert(error); 
        });
    }

    // [2] Hardware에 속한 아이템 리스트 
    getModalHardwareSoftwareList(userId, pAssetsId, pItemId, cAssetsId)
    {
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/GetModalHardwareSoftwareList", {
            params : {
                userId, pAssetsId, pItemId, cAssetsId
            }
        })
        .then(r => {
            var data = r.data;
            this.setState({
                modalItemShow: true,
                modalItemGrid: {
                    ...this.state.modalItemGrid,
                    rowData: []
                }
            },() => {
                setTimeout(function () { //Start the timer
                    this.setState({
                        modalItemGrid: {
                            ...this.state.modalItemGrid,
                            rowData: data
                        }
                    })
                }.bind(this), 300)
            })
        })
        .catch(function (error) { 
            alert(error); 
        });
    }

    /*==========================================================*/
	/* Item popup 저장    */
	/*==========================================================*/
    saveModalItemData() {
        var rows = this.gridApiModalList.getSelectedRows();

        if (rows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var userId = this.state.ItAcountUserDto.userId;
        var assetsGb = this.state.modalItemGrid.selectedAssetsGb;
        var serviceAction = "";

        if (assetsGb === '02') {
            serviceAction = "saveModalAssetsToAssetsData";
            // 데이터 보정
            rows.map((row) => {
                row.pAssetsId = Number(this.state.modalItemGrid.selectedHardwareId.split('_')[0]);
                row.pItemId = Number(this.state.modalItemGrid.selectedHardwareId.split('_')[1]);    
                row.cAssetsId = row.cAssetsId
                row.cItemId = row.cItemId;
                row.cRemark = "";
                row.regId = this.props.storeState.userInfo.userId;
                row.updId = this.props.storeState.userInfo.userId;
            });
        }
        else {
            serviceAction = "saveModalItemData";
            // 데이터 보정
            rows.map((row) => {
                row.userId = userId;
                row.Remark = "";
                row.regId = this.props.storeState.userInfo.userId;
                row.updId = this.props.storeState.userInfo.userId;
            });
        }

        
        axios.post(this.props.storeState.serviceUrl + "/ItAcountAssetsService/" + serviceAction, rows)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.getAcountAssetsList(userId, assetsGb);
                if (assetsGb === '03') {
                    setTimeout(function () { //Start the timer
                        this.getAcountAssetsList(userId, "02")
                    }.bind(this), 300)
                };
            }).catch(function (error) {
                alert(error);
            });
    }


    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            ItAcountUserDto: {
                ...this.state.ItAcountUserDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeHandlerModal(e) {
        var name = e.target.name;
        var assetsGb = this.state.modalItemGrid.selectedAssetsGb;
        this.setState({
            modalItemGrid: {
                ...this.state.modalItemGrid,
                [e.target.name]: name === 'selectedHardwareId' ? e.target.value : Number(e.target.value)
                // [e.target.name]: Number(e.target.value)
            }
        }, () => {
            if (assetsGb === '02') {
                // [2] assetsId 를 통해 리스트 가져오기
                var userId = this.state.ItAcountUserDto.userId;
                var pAssetsId = Number(this.state.modalItemGrid.selectedHardwareId.split('_')[0]);    
                var pItemId = Number(this.state.modalItemGrid.selectedHardwareId.split('_')[1]);    
                var cAssetsId = this.state.modalItemGrid.selectedAssetsId;    

                this.getModalHardwareSoftwareList(userId, pAssetsId, pItemId, cAssetsId);
            } else {
                // [2] assetsId 를 통해 리스트 가져오기
                var userId = this.state.ItAcountUserDto.userId;
                var assetsId = this.state.modalItemGrid.selectedAssetsId;    
                this.getModalAssetsItemList(userId, assetsId);
            }
        });
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-center">
                                <span style={{ fontWeight: 'bold', fontSize: 15 }}>User Infomation</span>
                            </div>
                            <div className="col-md-12 text-right">
                                <Button variant="success" onClick={this.saveUserInfoData.bind(this)}>Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="userId"
                                        value={this.state.ItAcountUserDto.userId}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ User Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="userNm"
                                        value={this.state.ItAcountUserDto.userNm}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Login Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="loginId"
                                        value={this.state.ItAcountUserDto.loginId}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Email</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="email"
                                        value={this.state.ItAcountUserDto.email}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Tel</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="tel"
                                        value={this.state.ItAcountUserDto.tel}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Ext</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="tel"
                                        value={this.state.ItAcountUserDto.extNum}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Mobile</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="tel"
                                        value={this.state.ItAcountUserDto.mobileTel}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ User Gb</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="userGb"
                                        value={this.state.ItAcountUserDto.userGb}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Enter Dt</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="enterDt"
                                        value={this.state.ItAcountUserDto.enterDt}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Entire Dt</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="entireDt"
                                        value={this.state.ItAcountUserDto.entireDt}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ DeptCd1</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="deptCd1"
                                        value={this.state.ItAcountUserDto.deptCd1}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ DeptCd2</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="deptCd2"
                                        value={this.state.ItAcountUserDto.deptCd2}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ DeptCd3</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="deptCd3"
                                        value={this.state.ItAcountUserDto.deptCd3}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ DeptCd4</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="deptCd4"
                                        value={this.state.ItAcountUserDto.deptCd4}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Office Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="loginId"
                                        value={this.state.ItAcountUserDto.officeId}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ DutyCd Kor</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="dutyCdKor"
                                        value={this.state.ItAcountUserDto.dutyCdKor}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Role Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="roleId"
                                        value={this.state.ItAcountUserDto.roleId}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ HR_StatusCd</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="hR_StatusCd"
                                        value={this.state.ItAcountUserDto.hR_StatusCd}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ IT_Status Cd</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="iT_StatusCd"
                                        value={this.state.ItAcountUserDto.iT_StatusCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0006" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        value={this.state.ItAcountUserDto.remark} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Body>

                <Card.Body>
                    <Table bordered style={{ marginTop: 15, marginBottom: 15 }}>
                        <colgroup>
                            <col style={{ width: '70%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '20%' }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <Form.Control type="text" size="sm"
                                        name="qnADesc"
                                        value={this.state.itAcountQnA.qnADesc}
                                        style={{ border: 0, borderBottom: '2px solid #ddd' }}
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <Button variant="outline-success" onClick={this.saveQnAData.bind(this)} 
                                        disabled={this.state.itAcountQnA.updDtNm === '요청중...' ? false : true}
                                    >Release</Button>
                                </td>
                                <td>
                                    <Form.Label style={{ fontSize: 14, marginTop: 7 }}>
                                        {this.state.itAcountQnA.updDtNm}
                                    </Form.Label>

                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>

                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-center">
                                <span style={{ fontWeight: 'bold', fontSize: 15 }}>Application</span>
                            </div>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" name="application" onClick={this.onClickAdd.bind(this)}>Add</Button>{' '}
                                <Button variant="success" name="application" onClick={this.saveAssetsItemData.bind(this)}>{this.state.applicationGrid.isLoding ? "Loding..." : "Save"}</Button>{' '}
                                <Button variant="danger" name="application" onClick={this.deleteAssetsItemData.bind(this)}>Delete</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 250, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            modules={this.state.applicationGrid.modules}
                            columnDefs={this.state.applicationGrid.columnDefs}
                            defaultColDef={this.state.applicationGrid.defaultColDef}
                            rowData={this.state.applicationGrid.rowData}
                            singleClickEdit={true}
                            // frameworkComponents={this.state.applicationGrid.frameworkComponents}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiApplication = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-center">
                                <span style={{ fontWeight: 'bold', fontSize: 15 }}>Hardware</span>
                            </div>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" name="hardware" onClick={this.onClickAdd.bind(this)}>Add</Button>{' '}
                                <Button variant="success" name="hardware" onClick={this.saveAssetsItemData.bind(this)}>{this.state.hardwareGrid.isLoding ? "Loding..." : "Save"}</Button>{' '}
                                <Button variant="danger" name="hardware" onClick={this.deleteAssetsItemData.bind(this)}>Delete</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 250, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.hardwareGrid.columnDefs}
                            defaultColDef={this.state.hardwareGrid.defaultColDef}
                            rowData={this.state.hardwareGrid.rowData}
                            singleClickEdit={true}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiHardware = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-center">
                                <span style={{ fontWeight: 'bold', fontSize: 15 }}>Software</span>
                            </div>
                            <div className="col-md-12 text-right">
                            <Button variant="secondary" name="software" onClick={this.onClickAdd.bind(this)}>Add</Button>{' '}
                                <Button variant="success" name="software" onClick={this.saveAssetsItemData.bind(this)}>{this.state.softwareGrid.isLoding ? "Loding..." : "Save"}</Button>{' '}
                                <Button variant="danger" name="software" onClick={this.deleteAssetsItemData.bind(this)}>Delete</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 250, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.softwareGrid.columnDefs}
                            defaultColDef={this.state.softwareGrid.defaultColDef}
                            rowData={this.state.softwareGrid.rowData}
                            singleClickEdit={true}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiSoftware = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-center">
                                <span style={{ fontWeight: 'bold', fontSize: 15 }}>Network</span>
                            </div>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" name="network" onClick={this.onClickAdd.bind(this)}>Add</Button>{' '}
                                <Button variant="success" name="network" onClick={this.saveAssetsItemData.bind(this)}>{this.state.networkGrid.isLoding ? "Loding..." : "Save"}</Button>{' '}
                                <Button variant="danger" name="network" onClick={this.deleteAssetsItemData.bind(this)}>Delete</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 250, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.networkGrid.columnDefs}
                            defaultColDef={this.state.networkGrid.defaultColDef}
                            rowData={this.state.networkGrid.rowData}
                            singleClickEdit={true}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiNetwork = params.api}
                            // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>

            {/* Role Program Modal */}
            <Modal show={this.state.modalItemShow} backdrop="static" size="lg">
                <Modal.Header>
                    <Modal.Title>Item List</Modal.Title>
                </Modal.Header>
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveModalItemData.bind(this)}>Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            setTimeout(function () { //Start the timer
                                this.setState({ modalItemShow: false })
                            }.bind(this), 300)
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3" style={ this.state.modalItemGrid.selectedAssetsGb === '02' ? {display:'inherit'} : {display:'none'}}>
                                <Form.Group>
                                    <Form.Label>■ Hardware</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="selectedHardwareId"
                                        value={this.state.modalItemGrid.selectedHardwareId} onChange={this.onChangeHandlerModal.bind(this)}
                                    >
                                        {
                                            this.state.modalItemGrid.hardwareNmList.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.hardwareId}>{item.hardwareNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Type</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="selectedAssetsId"
                                        value={this.state.modalItemGrid.selectedAssetsId} onChange={this.onChangeHandlerModal.bind(this)}
                                    >
                                        {
                                            this.state.modalItemGrid.assetsNmList.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.assetsId}>{item.assetsNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                    <div className="ag-theme-material"
                        style={{ height: 400, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.modalItemGrid.columnDefs}
                            defaultColDef={this.state.modalItemGrid.defaultColDef}
                            rowData={this.state.modalItemGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiModalList = params.api}
                        // onRowClicked={this.onRowClicked_Master.bind(this)}
                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
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
)(AcountDetail)