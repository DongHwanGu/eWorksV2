import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Modal, Form, Col, Card, Button, Breadcrumb, DropdownButton, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import GDHDatepicker from '../../common/controls/GDHDatepicker'
import GDHSelectOption from '../../common/controls/GDHSelectOption';
import UserMgmtLeaveCnt from './UserMgmtLeaveCnt';

class UserMgmtDetail extends Component {
    state = {
        cmUserDto: {
            userId: '',
            userNm: '',
            userEnm: '',
            loginId: '',
            loginPassword: '',
            workerId: '',
            email: '',
            tel: '',
            mobileTel: '',
            enterDt: new Date(),
            entireDt: new Date('9999-12-31'),
            entireGb: '',
            userGb: '',
            deptCd1: 0,
            deptCd2: 0,
            deptCd3: 0,
            deptCd4: 0,
            deptCdKor: '',
            dutyCdKor: '',
            upDutyCdEng: '',
            dutyCdEng: '',
            preLeaveCnt: 0.0,
            orgLeaveCnt: 0.0,
            userPic: '',
            birthDay: '',
            addressKor: '',
            genderGb: '',
            ctsTypeId: 0,
            masYn: '',
            extNum: '',
            iT_StatusCd: '',
            hR_StatusCd: '',
            hR_Remark: '',
            remark: '',
            roleId: '',
            officeId: 0,
            regId: '',
            updId: '',
            certiTitleGb: '',

            deptFullNm: ''
        },
        deptCdKorObj: null,

        roleList: [],

        officeList: [],

        deptList1: [],
        deptList2: [],
        deptList3: [],
        deptList4: [],

        dutyCdEngList1: [],
        dutyCdEngList2: [],

        modalMove: false,
        moveGrid: {
            columnDefs:
                [
                    { headerName: 'Dept 1', field: 'deptCd1Nm', minWidth: 150, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'Dept 2',
                        field: 'deptCd2Nm',
                        minWidth: 150
                    },
                    {
                        headerName: 'Dept 3',
                        field: 'deptCd3Nm',
                        minWidth: 150
                    },
                    {
                        headerName: 'Dept 4',
                        field: 'deptCd4Nm',
                        minWidth: 150
                    },
                    {
                        headerName: 'Position Kr',
                        field: 'dutyCdKorNm',
                        minWidth: 150
                    },
                    {
                        headerName: 'User Gb',
                        field: 'userGbNm',
                        minWidth: 150
                    },
                    {
                        headerName: 'Date of enterance',
                        field: 'enterDt',
                        minWidth: 150
                    },
                    {
                        headerName: 'Date of leave',
                        field: 'entireDt',
                        minWidth: 150
                    },
                    {
                        headerName: 'TM Nm',
                        field: 'preTmNm',
                        minWidth: 150
                    },
                    {
                        headerName: 'Remark',
                        field: 'remark',
                        minWidth: 150
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
        cmUserDeptMove: {
            moveId: 0,
            userId: '',
            deptCd1: 0,
            deptCd2: 0,
            deptCd3: 0,
            deptCd4: 0,
            enterDt: new Date(),
            entireDt: new Date(),
            preTmNm: '',
            userGb: '',
            dutyCdKor: '',
            deptCdKor: '',
            remark: '',
            regId: '',
            updId: '',

            deptCd1Nm: '',
            deptCd2Nm: '',
            deptCd3Nm: '',
            deptCd4Nm: '',
            userGbNm: '',
            dutyCdKorNm: '',
            deptCdKorNm: '',
        },
        moveDeptList1: [],
        moveDeptList2: [],
        moveDeptList3: [],
        moveDeptList4: [],

        deptCdKorMoveObj: null,

        
    }

    // 페이지 로드
    componentDidMount() {
        // role options
        this.getRoleIdOptions();
        // role options
        this.getOfficeOptions();
        // Dept 1
        this.getDeptListOptions('deptCd1', 0);
        // Duty Eng
        this.getDutyEngOptions('00');

        this.setState({
            deptCdKorObj: <GDHSelectOption cdMajor="0101" deleteMinor={[]} frCdMinor={'99'} isEmpty={true} isEmptyText="=== Select ===" />
        })

        // 넘겨온값 받기
        if (this.props.cmUserGroupDto !== undefined && this.props.cmUserGroupDto !== '') {
            var _cmUserDto = this.props.cmUserGroupDto.cmUserDto;
            var _cmUserDeptMoveDtos = this.props.cmUserGroupDto.cmUserDeptMoveDtos;

            var cd = '99';
            if (_cmUserDto.deptFullNm !== null)
            {
                if (_cmUserDto.deptFullNm.toLowerCase().indexOf('electrical') > -1) cd = '03'
                if (_cmUserDto.deptFullNm.toLowerCase().indexOf('kimsco') > -1) cd = '02'
                if (_cmUserDto.deptFullNm.toLowerCase().indexOf('testing') > -1) cd = '03'
                if (_cmUserDto.deptFullNm.toLowerCase().indexOf('moody') > -1) cd = '04'
            }
            this.setState({
                deptCdKorObj: null
            }, () => {
                this.setState({
                    deptCdKorObj: <GDHSelectOption cdMajor="0101" deleteMinor={[]} frCdMinor={cd} isEmpty={true} isEmptyText="=== Select ===" />,
                    cmUserDto: _cmUserDto,
                    moveGrid: { ...this.state.moveGrid, rowData: _cmUserDeptMoveDtos, rowCount: _cmUserDeptMoveDtos.length }
                })
            })

            // Dept 1
            axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                params: { deptId: 0 }
            }).then(r => {
                var data = r.data;
                this.setState({ deptList1: data, deptList2: [], deptList3: [], deptList4: [] });

                // Dept 2
                axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                    params: { deptId: _cmUserDto.deptCd1 }
                }).then(r => {
                    var data = _cmUserDto.deptCd1 === 0 ? [] : r.data;
                    this.setState({ deptList2: data, deptList3: [], deptList4: [] });

                    // Dept 3
                    axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                        params: { deptId: _cmUserDto.deptCd2 }
                    }).then(r => {
                        var data = _cmUserDto.deptCd2 === 0 ? [] : r.data;
                        this.setState({ deptList3: data, deptList4: [] });

                        // Dept 4
                        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                            params: { deptId: _cmUserDto.deptCd3 }
                        }).then(r => {
                            var data = _cmUserDto.deptCd3 === 0 ? [] : r.data;
                            this.setState({
                                deptList4: data
                            }, () => {
                                this.setState({
                                    ...this.state.cmUserDto,
                                    deptCd1: _cmUserDto.deptCd1,
                                    deptCd2: _cmUserDto.deptCd2,
                                    deptCd3: _cmUserDto.deptCd3,
                                    deptCd4: _cmUserDto.deptCd4,
                                })
                            });

                        }).catch(function (error) {
                            alert(error);
                        });


                    }).catch(function (error) {
                        alert(error);
                    });

                }).catch(function (error) {
                    alert(error);
                });

            }).catch(function (error) {
                alert(error);
            });

            var strUpDutyEng = _cmUserDto.upDutyCdEng;
            // Up 셋팅
            axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDutyEngList", {
                params: { cdMinor: "00" }
            }).then(r => {
                var data = r.data;
                this.setState({ dutyCdEngList1: data, dutyCdEngList2: [] });
                // 하위 셋팅
                axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDutyEngList", {
                    params: { cdMinor: strUpDutyEng }
                }).then(r => {
                    var data = r.data;
                    this.setState({
                        dutyCdEngList2: data
                    }, () => {
                        this.setState({
                            ...this.state.cmUserDto,
                            upDutyCdEng: _cmUserDto.upDutyCdEng,
                            dutyCdEng: _cmUserDto.dutyCdEng
                        })
                    });

                }).catch(function (error) {
                    alert(error);
                });

            }).catch(function (error) {
                alert(error);
            });

        }
    }


    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    saveUserMgmtData() {
        if (this.state.cmUserDto.userNm === '') {
            alert('[ userNm ] 값을 입력해 주세요.');
            return;
        }
        var gParam = {
            ...this.state.cmUserDto,
            enterDt: this.getParsedDate(this.state.cmUserDto.enterDt),
            entireDt: this.getParsedDate(this.state.cmUserDto.entireDt),
            deptCd1: Number(this.state.cmUserDto.deptCd1),
            deptCd2: Number(this.state.cmUserDto.deptCd2),
            deptCd3: Number(this.state.cmUserDto.deptCd3),
            deptCd4: Number(this.state.cmUserDto.deptCd4),
            preLeaveCnt: Number.parseFloat(this.state.cmUserDto.preLeaveCnt),
            orgLeaveCnt: Number.parseFloat(this.state.cmUserDto.orgLeaveCnt),
            ctsTypeId: Number(this.state.cmUserDto.ctsTypeId),
            officeId: Number(this.state.cmUserDto.officeId),

            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,

        }
        var gParamMoves = this.state.moveGrid.rowData;
        gParamMoves.map((row, i) => {
            row.deptCd1 = Number(row.deptCd1);
            row.deptCd2 = Number(row.deptCd2);
            row.deptCd3 = Number(row.deptCd3);
            row.deptCd4 = Number(row.deptCd4);
            row.enterDt = this.props.storeState.getParsedDate(row.enterDt, "");
            row.entireDt = this.props.storeState.getParsedDate(row.entireDt, "");

            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });

        var gParamGroup = {
            cmUserDto: gParam,
            cmUserDeptMoveDtos: gParamMoves,
        }

        axios.post(this.props.storeState.serviceUrl + "/CmUserService/SaveUserMgmtData",
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
        this.setState({
            cmUserDto: {
                ...this.state.cmUserDto,
                [e.target.name]: e.target.value
            }
        });
        if (e.target.name === 'upDutyCdEng') {
            this.getDutyEngOptions(e.target.value === '' ? '00' : e.target.value);
        }
    }
    onChangeNumberHandler(e) {
        this.setState({
            cmUserDto: {
                ...this.state.cmUserDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onDateChange(name, date) {
        this.setState({
            cmUserDto: {
                ...this.state.cmUserDto,
                [name]: date
            }
        });
    }
    onDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            cmUserDto: {
                ...this.state.cmUserDto,
                [e.target.name]: eValue
            }
        });
        this.getDeptListOptions(e.target.name, eValue);

        if (e.target.name === 'deptCd1') {
            var cd = '99';
            switch (e.target.selectedOptions[0].text.toLowerCase()) {
                case 'electrical': cd = '01'; break;
                case 'kimsco': cd = '02'; break;
                case 'testing': cd = '03'; break;
                case 'moody': cd = '04'; break;
                default:
                    break;
            }

            this.setState({
                deptCdKorObj: null
            }, () => {
                this.setState({
                    deptCdKorObj: <GDHSelectOption cdMajor="0101" deleteMinor={[]} frCdMinor={cd} isEmpty={true} isEmptyText="=== Select ===" />
                })
            })
        }
    }

    /*==========================================================*/
    /* Move Add    */
    /*==========================================================*/
    onClickAddMove() {
        this.getDeptListOptions('deptCd1', 0, 'move');
        this.setState({
            modalMove: true,
            deptCdKorMoveObj: <GDHSelectOption cdMajor="0101" deleteMinor={[]} frCdMinor={'99'} isEmpty={true} isEmptyText="=== Select ===" />,
            cmUserDeptMove: {
                moveId: 0,
                userId: '',
                deptCd1: 0,
                deptCd2: 0,
                deptCd3: 0,
                deptCd4: 0,
                enterDt: new Date(),
                entireDt: new Date(),
                preTmNm: '',
                userGb: '',
                dutyCdKor: '',
                deptCdKor: '',
                remark: '',
                regId: '',
                updId: '',

                deptCd1Nm: '',
                deptCd2Nm: '',
                deptCd3Nm: '',
                deptCd4Nm: '',
                userGbNm: '',
                dutyCdKorNm: '',
                deptCdKorNm: '',
            },
        })
    }

    /*==========================================================*/
    /* Move Save    */
    /*==========================================================*/
    saveMoveUserData() {
        if (this.state.cmUserDeptMove.deptCd1 === 0) {
            alert('[ Dept Cd1 ] 값을 입력해 주세요.');
            return;
        }

        var rows = [];
        var arrId = [];
        this.state.moveGrid.rowData.map((row, i) => {
            arrId.push(row.moveId);
            rows.push(row);
        })
        var _Id = this.state.cmUserDeptMove.moveId > 0
            ? this.state.cmUserDeptMove.moveId
            : arrId.length === 0 ? 100 : Math.max.apply(null, arrId) + 1

        // Update
        if (this.state.cmUserDeptMove.moveId > 0) {
            var obj = {
                ...this.state.cmUserDeptMove,
                userId: this.state.cmUserDto.userId,
                enterDt: this.props.storeState.getParsedDate(this.state.cmUserDeptMove.enterDt, "02"),
                entireDt: this.props.storeState.getParsedDate(this.state.cmUserDeptMove.entireDt, "02"),
            }
            rows.map((row, i) => {
                if (row.moveId === _Id) {
                    rows[i] = obj;
                }
            })
        }
        else {
            var obj = {
                ...this.state.cmUserDeptMove,
                moveId: _Id,
                userId: this.state.cmUserDto.userId,
                enterDt: this.props.storeState.getParsedDate(this.state.cmUserDeptMove.enterDt, "02"),
                entireDt: this.props.storeState.getParsedDate(this.state.cmUserDeptMove.entireDt, "02"),
            }
            // Save
            rows.push(obj);
        }
        this.setState({
            modalMove: false,
            moveGrid: { ...this.state.moveGrid, rowData: [], rowCount: 0 }
        }, () => {
            this.setState({
                moveGrid: { ...this.state.moveGrid, rowData: rows, rowCount: rows.length }
            })
        })
    }

    /*==========================================================*/
    /* Move Delete    */
    /*==========================================================*/
    onClickDeleteMove() {
        var deleteRows = this.gridMoveApi.getSelectedRows();
        if (deleteRows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var rows = [];
        this.state.moveGrid.rowData.map((row, i) => {
            var boolCheck = false;
            deleteRows.map((sRow, j) => {
                if (sRow.moveId === row.moveId) {
                    boolCheck = true;
                }
            })
            if (!boolCheck) {
                rows.push(row);
            }
        })

        this.setState({
            moveGrid: { ...this.state.moveGrid, rowData: [], rowCount: 0 }
        }, () => {
            this.setState({
                moveGrid: { ...this.state.moveGrid, rowData: rows, rowCount: rows.length }
            })
        })
    }

    /*==========================================================*/
    /* Move double Click    */
    /*==========================================================*/
    onMoveRowDoubleClicked(e) {
        var cd = '99';
        if (e.data.deptCd1Nm.toLowerCase().indexOf('electrical') > -1) cd = '03'
        if (e.data.deptCd1Nm.toLowerCase().indexOf('kimsco') > -1) cd = '02'
        if (e.data.deptCd1Nm.toLowerCase().indexOf('testing') > -1) cd = '03'
        if (e.data.deptCd1Nm.toLowerCase().indexOf('moody') > -1) cd = '04'

        this.setState({
            deptCdKorMoveObj: null
        }, () => {
            this.setState({
                deptCdKorMoveObj: <GDHSelectOption cdMajor="0101" deleteMinor={[]} frCdMinor={cd} isEmpty={true} isEmptyText="=== Select ===" />,
                modalMove: true,
                cmUserDeptMove: e.data
            })
        })

        // Dept 1
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
            params: { deptId: 0 }
        }).then(r => {
            var data = r.data;
            this.setState({ moveDeptList1: data, moveDeptList2: [], moveDeptList3: [], moveDeptList4: [] });

            // Dept 2
            axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                params: { deptId: e.data.deptCd1 }
            }).then(r => {
                var data = e.data.deptCd1 === 0 ? [] : r.data;
                this.setState({ moveDeptList2: data, moveDeptList3: [], moveDeptList4: [] });

                // Dept 3
                axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                    params: { deptId: e.data.deptCd2 }
                }).then(r => {
                    var data = e.data.deptCd2 === 0 ? [] : r.data;
                    this.setState({ moveDeptList3: data, moveDeptList4: [] });

                    // Dept 4
                    axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
                        params: { deptId: e.data.deptCd3 }
                    }).then(r => {
                        var data = e.data.deptCd3 === 0 ? [] : r.data;
                        this.setState({
                            moveDeptList4: data
                        }, () => {
                            this.setState({
                                ...this.state.cmUserDeptMove,
                                deptCd1: e.data.deptCd1,
                                deptCd2: e.data.deptCd2,
                                deptCd3: e.data.deptCd3,
                                deptCd4: e.data.deptCd4,
                            })
                        });

                    }).catch(function (error) {
                        alert(error);
                    });
                }).catch(function (error) {
                    alert(error);
                });
            }).catch(function (error) {
                alert(error);
            });
        }).catch(function (error) {
            alert(error);
        });

    }

    /*==========================================================*/
    /* Move Change Common    */
    /*==========================================================*/
    onMoveDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            cmUserDeptMove: {
                ...this.state.cmUserDeptMove,
                [e.target.name]: eValue,
                [e.target.name + 'Nm']: e.target.selectedOptions[0].text
            }
        });
        this.getDeptListOptions(e.target.name, eValue, 'move');

        if (e.target.name === 'deptCd1') {
            var cd = '99';
            switch (e.target.selectedOptions[0].text.toLowerCase()) {
                case 'electrical': cd = '01'; break;
                case 'kimsco': cd = '02'; break;
                case 'testing': cd = '03'; break;
                case 'moody': cd = '04'; break;
                default:
                    break;
            }

            this.setState({
                deptCdKorMoveObj: null
            }, () => {
                this.setState({
                    deptCdKorMoveObj: <GDHSelectOption cdMajor="0101" deleteMinor={[]} frCdMinor={cd} isEmpty={true} isEmptyText="=== Select ===" />
                })
            })
        }
    }
    onMoveChangeHandler(e) {
        if (e.target.name === 'userGb' || e.target.name === 'dutyCdKor' || e.target.name === 'deptCdKor') {
            this.setState({
                cmUserDeptMove: {
                    ...this.state.cmUserDeptMove,
                    [e.target.name]: e.target.value,
                    [e.target.name + 'Nm']: e.target.selectedOptions[0].text
                }
            })
        }
        else {
            this.setState({
                cmUserDeptMove: {
                    ...this.state.cmUserDeptMove,
                    [e.target.name]: e.target.value
                }
            });
        }
    }
    onMoveDateChange(name, date) {
        this.setState({
            cmUserDeptMove: {
                ...this.state.cmUserDeptMove,
                [name]: date
            }
        });
    }
    /*==========================================================*/
    /* Duty List    */
    /*==========================================================*/
    getDutyEngOptions(cdMinor) {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDutyEngList", {
            params: {
                cdMinor
            }
        }
        ).then(r => {
            var data = r.data;
            if (cdMinor === '00') {
                this.setState({ dutyCdEngList1: data, dutyCdEngList2: [] });
            } else {
                this.setState({ dutyCdEngList2: data });
            }
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* Dept 1 List    */
    /*==========================================================*/
    getDeptListOptions(name, deptId, gb = '') {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetDeptList", {
            params: {
                deptId: Number(deptId)
            }
        }
        ).then(r => {
            var data = r.data;
            if (gb === 'move') {
                if (name === 'deptCd1') {
                    if (deptId === 0) {
                        this.setState({ moveDeptList1: data, moveDeptList2: [], moveDeptList3: [], moveDeptList4: [] });
                    } else {
                        this.setState({ moveDeptList2: data, moveDeptList3: [], moveDeptList4: [] });
                    }
                }
                if (name === 'deptCd2') {
                    this.setState({ moveDeptList3: data, moveDeptList4: [] });
                }
                if (name === 'deptCd3') {
                    this.setState({ moveDeptList4: data });
                }
            }
            else {
                if (name === 'deptCd1') {
                    if (deptId === 0) {
                        this.setState({ deptList1: data, deptList2: [], deptList3: [], deptList4: [] });
                    } else {
                        this.setState({ deptList2: data, deptList3: [], deptList4: [] });
                    }
                }
                if (name === 'deptCd2') {
                    this.setState({ deptList3: data, deptList4: [] });
                }
                if (name === 'deptCd3') {
                    this.setState({ deptList4: data });
                }
            }
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* Office Options 조회    */
    /*==========================================================*/
    getOfficeOptions() {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetOfficeList")
            .then(r => {
                var data = r.data;
                this.setState({
                    officeList: data
                });
            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* Role Options 조회    */
    /*==========================================================*/
    getRoleIdOptions() {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetRoleList")
            .then(r => {
                var data = r.data;
                this.setState({
                    roleList: data
                });
            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* 날짜 변경  */
    /*==========================================================*/
    getParsedDate(strDate) {
        var date = new Date(strDate);
        // alert(date);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        date = yyyy + "" + mm + "" + dd;
        return date.toString();
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="success" onClick={this.saveUserMgmtData.bind(this)} >Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <div className="col-md-12" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                        <div className="card border-left-success shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-sm font-weight-bold text-success text-uppercase mb-4">
                                            IT Mgmt</div>

                                        <Form.Row>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ User Id</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="userId"
                                                        value={this.state.cmUserDto.userId} onChange={this.onChangeHandler.bind(this)}
                                                        readOnly
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Office Id</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="officeId"
                                                        value={this.state.cmUserDto.officeId} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <option key={-1} value={""}>{"=== Select ==="}</option>
                                                        {
                                                            this.state.officeList.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.vendorId}>{item.cdRef1}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ User Nm</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="userNm"
                                                        value={this.state.cmUserDto.userNm} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ User Enm</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="userEnm"
                                                        value={this.state.cmUserDto.userEnm} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Login Id</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="loginId"
                                                        value={this.state.cmUserDto.loginId} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Login Password</Form.Label>
                                                    <Form.Control type="password" size="sm"
                                                        name="loginPassword"
                                                        value={this.state.cmUserDto.loginPassword} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Email</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control type="text" size="sm"
                                                            name="email"
                                                            value={this.state.cmUserDto.email} onChange={this.onChangeHandler.bind(this)}
                                                        />
                                                        {/* <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend" style={{ height: 29, fontSize: 9 }}>@intertek.com</InputGroup.Text>
                                        </InputGroup.Prepend> */}
                                                    </InputGroup>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Tel</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="tel"
                                                        value={this.state.cmUserDto.tel} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Ext Num</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="extNum"
                                                        value={this.state.cmUserDto.extNum} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Role Id</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="roleId"
                                                        value={this.state.cmUserDto.roleId} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <option key={-1} value={""}>{"=== Select ==="}</option>
                                                        {
                                                            this.state.roleList.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.roleId}>{item.roleNm}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Mas Yn</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="masYn"
                                                        value={this.state.cmUserDto.masYn} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <option value={""}>{"=== Select ==="}</option>
                                                        <option value="Y">Y</option>
                                                        <option value="N">N</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ IT_Status Cd</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="iT_StatusCd"
                                                        value={this.state.cmUserDto.iT_StatusCd} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0006" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Dept Cd1</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="deptCd1"
                                                        value={this.state.cmUserDto.deptCd1} onChange={this.onDeptChangeHandler.bind(this)}
                                                    >
                                                        <option key={-1} value={0}>{"=== Select ==="}</option>
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
                                                        value={this.state.cmUserDto.deptCd2} onChange={this.onDeptChangeHandler.bind(this)}
                                                    >
                                                        <option key={-1} value={0}>{"=== Select ==="}</option>
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
                                                        value={this.state.cmUserDto.deptCd3} onChange={this.onDeptChangeHandler.bind(this)}
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
                                                    <Form.Label>■ Dept Cd4</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="deptCd4"
                                                        value={this.state.cmUserDto.deptCd4} onChange={this.onDeptChangeHandler.bind(this)}
                                                    >
                                                        <option key={-1} value={0}>{"=== Select ==="}</option>
                                                        {
                                                            this.state.deptList4.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-12">
                                                <Form.Group>
                                                    <Form.Label>■ Remark</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="remark"
                                                        value={this.state.cmUserDto.remark} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </Form.Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="col-md-12" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                        <div className="card border-left-success shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-sm font-weight-bold text-success text-uppercase mb-4">
                                            HR Mgmt</div>


                                        <Form.Row>
                                            <div className="col-md-6">
                                                <Form.Group>
                                                    <Form.Label>■ DutyCd Eng</Form.Label>
                                                    <InputGroup className="mb-3">
                                                        <Form.Control as="select" size="sm"
                                                            name="upDutyCdEng"
                                                            value={this.state.cmUserDto.upDutyCdEng} onChange={this.onChangeHandler.bind(this)}
                                                            style={{ marginRight: 10 }}
                                                        >
                                                            <option key={-1} value={""}>{"=== Select ==="}</option>
                                                            {
                                                                this.state.dutyCdEngList1.map((item, i) => {
                                                                    return (
                                                                        <option key={i} value={item.cdMinor}>{item.fullName}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Form.Control>
                                                        <Form.Control as="select" size="sm"
                                                            name="dutyCdEng"
                                                            value={this.state.cmUserDto.dutyCdEng} onChange={this.onChangeHandler.bind(this)}
                                                        >
                                                            <option key={-1} value={""}>{"=== Select ==="}</option>
                                                            {
                                                                this.state.dutyCdEngList2.map((item, i) => {
                                                                    return (
                                                                        <option key={i} value={item.cdMinor}>{item.fullName}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Form.Control>
                                                    </InputGroup>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ DutyCd Kor</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="dutyCdKor"
                                                        value={this.state.cmUserDto.dutyCdKor} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0013" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ User Gb</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="userGb"
                                                        value={this.state.cmUserDto.userGb} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0002" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Worker Id</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="workerId"
                                                        value={this.state.cmUserDto.workerId} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Birth Day</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="birthDay"
                                                        value={this.state.cmUserDto.birthDay} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Gender Gb</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="genderGb"
                                                        value={this.state.cmUserDto.genderGb} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <option value={""}>{"=== Select ==="}</option>
                                                        <option value="M">남</option>
                                                        <option value="W">여</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Mobile Tel</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="mobileTel"
                                                        value={this.state.cmUserDto.mobileTel} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ DeptCd Kor</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="deptCdKor"
                                                        value={this.state.cmUserDto.deptCdKor} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        {this.state.deptCdKorObj}
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3 hidden">
                                                <Form.Group>
                                                    <Form.Label>■ OrgLeave Cnt</Form.Label>
                                                    <Form.Control type="number" size="sm"
                                                        name="orgLeaveCnt"
                                                        value={this.state.cmUserDto.orgLeaveCnt} onChange={this.onChangeNumberHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3 hidden">
                                                <Form.Group>
                                                    <Form.Label>■ Leave Cnt</Form.Label>
                                                    <Form.Control type="number" size="sm"
                                                        name="preLeaveCnt"
                                                        value={this.state.cmUserDto.preLeaveCnt} onChange={this.onChangeNumberHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label >■ Enter Dt</Form.Label>
                                                    <GDHDatepicker
                                                        name='enterDt'
                                                        value={this.state.cmUserDto.enterDt} onDateChange={this.onDateChange.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Entire Dt</Form.Label>
                                                    <GDHDatepicker
                                                        name='entireDt'
                                                        value={this.state.cmUserDto.entireDt} onDateChange={this.onDateChange.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Entire Gb</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="entireGb"
                                                        value={this.state.cmUserDto.entireGb} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0023" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ HR_Status Cd</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="hR_StatusCd"
                                                        value={this.state.cmUserDto.hR_StatusCd} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0032" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Certificate Title</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="certiTitleGb"
                                                        value={this.state.cmUserDto.certiTitleGb} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <GDHSelectOption cdMajor="0200" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ Address Kor</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="addressKor"
                                                        value={this.state.cmUserDto.addressKor} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3 hidden">
                                                <Form.Group>
                                                    <Form.Label>■ User Pic</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="userPic"
                                                        value={this.state.cmUserDto.userPic} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3 hidden">
                                                <Form.Group>
                                                    <Form.Label>■ CtsType Id</Form.Label>
                                                    <Form.Control type="number" size="sm"
                                                        name="ctsTypeId"
                                                        value={this.state.cmUserDto.ctsTypeId} onChange={this.onChangeNumberHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group>
                                                    <Form.Label>■ HR_Remark</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="hR_Remark"
                                                        value={this.state.cmUserDto.hR_Remark} onChange={this.onChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-12">
                                                <Form.Group>
                                                    <Form.Label>■ 이력 관리 (셋팅 후 상위 Save 버튼을 통해 최종 저장해 주세요.)</Form.Label>
                                                    <div className="col-md-12 text-right" style={{ marginBottom: 5 }}>
                                                        <Button variant="secondary" onClick={this.onClickAddMove.bind(this)}  >Add</Button>{' '}
                                                        <Button variant="danger" onClick={this.onClickDeleteMove.bind(this)}  >Delete</Button>
                                                    </div>
                                                    <div className="ag-theme-material"
                                                        style={{ height: 200, borderTop: '2px solid #695405' }}
                                                    >
                                                        <AgGridReact headerHeight={45} rowHeight={45}
                                                            columnDefs={this.state.moveGrid.columnDefs}
                                                            defaultColDef={this.state.moveGrid.defaultColDef}
                                                            rowData={this.state.moveGrid.rowData}
                                                            // singleClickEdit={true}
                                                            rowSelection="multiple" // single
                                                            onGridReady={params => this.gridMoveApi = params.api}
                                                            onRowDoubleClicked={this.onMoveRowDoubleClicked.bind(this)}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </Form.Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 휴가 갯수 관리 */}
                    {
                        this.state.cmUserDto.userId === '' 
                        ? <></>
                        : <UserMgmtLeaveCnt selectUserId={this.state.cmUserDto.userId} />
                    }
                    

                    {/* Role Program Modal */}
                    <Modal show={this.state.modalMove} backdrop="static" size="lg">
                        <Modal.Header className="text-right">
                            <div className="col-md-12 text-rigth">
                                <Button variant="success" onClick={this.saveMoveUserData.bind(this)} >Save</Button>{' '}
                                <Button variant="secondary" onClick={function () {
                                    this.setState({ modalMove: false })
                                }.bind(this)}>Close</Button>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Row>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ Dept Cd1</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="deptCd1"
                                                value={this.state.cmUserDeptMove.deptCd1} onChange={this.onMoveDeptChangeHandler.bind(this)}
                                            >
                                                <option key={-1} value={0}>{"=== Select ==="}</option>
                                                {
                                                    this.state.moveDeptList1.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ Dept Cd2</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="deptCd2"
                                                value={this.state.cmUserDeptMove.deptCd2} onChange={this.onMoveDeptChangeHandler.bind(this)}
                                            >
                                                <option key={-1} value={0}>{"=== Select ==="}</option>
                                                {
                                                    this.state.moveDeptList2.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ Dept Cd3</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="deptCd3"
                                                value={this.state.cmUserDeptMove.deptCd3} onChange={this.onMoveDeptChangeHandler.bind(this)}
                                            >
                                                <option key={-1} value={0}>{"=== Select ==="}</option>
                                                {
                                                    this.state.moveDeptList3.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ Dept Cd4</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="deptCd4"
                                                value={this.state.cmUserDeptMove.deptCd4} onChange={this.onMoveDeptChangeHandler.bind(this)}
                                            >
                                                <option key={-1} value={0}>{"=== Select ==="}</option>
                                                {
                                                    this.state.moveDeptList4.map((item, i) => {
                                                        return (
                                                            <option key={i} value={item.deptId}>{item.deptNm}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ DeptCd Kor</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="deptCdKor"
                                                value={this.state.cmUserDeptMove.deptCdKor} onChange={this.onMoveChangeHandler.bind(this)}
                                            >
                                                {this.state.deptCdKorMoveObj}
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ Position Kr</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="dutyCdKor"
                                                value={this.state.cmUserDeptMove.dutyCdKor} onChange={this.onMoveChangeHandler.bind(this)}
                                            >
                                                <GDHSelectOption cdMajor="0013" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ User Gb</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="userGb"
                                                value={this.state.cmUserDeptMove.userGb} onChange={this.onMoveChangeHandler.bind(this)}
                                            >
                                                <GDHSelectOption cdMajor="0002" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ TM Name</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="preTmNm"
                                                value={this.state.cmUserDeptMove.preTmNm} onChange={this.onMoveChangeHandler.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label >■ Enter Dt</Form.Label>
                                            <GDHDatepicker
                                                name='enterDt'
                                                value={this.state.cmUserDeptMove.enterDt} onDateChange={this.onMoveDateChange.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group>
                                            <Form.Label>■ Entire Dt</Form.Label>
                                            <GDHDatepicker
                                                name='entireDt'
                                                value={this.state.cmUserDeptMove.entireDt} onDateChange={this.onMoveDateChange.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Remark</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="remark"
                                                value={this.state.cmUserDeptMove.remark} onChange={this.onMoveChangeHandler.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>
                                </Form.Row>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
                <Card.Footer>

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
)(UserMgmtDetail);