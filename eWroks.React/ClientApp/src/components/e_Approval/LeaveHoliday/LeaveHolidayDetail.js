import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';


import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';

class LeaveHolidayDetail extends Component {
    state = {
        arrLeaveYear: [],
        hrLeaveHolidayDto: {
            leaveHoliId: 0
            , reason: ''
            , statusCd: '01'
            , remark: ''
            , fileNm: ''
            , fileUrl: ''
            , leaveYear: ''
            , regId: ''
            , updId: ''
        },
        hrLeaveHolidayDateDtos: {
            leaveHoliId: 0
            , dateId: 0
            , leaveTypeCd: ''
            , leaveTypeDetailCd: ''
            , startDt: new Date()
            , startTime: new Date()
            , endDt: new Date()
            , endTime: new Date()
            , recogDay: 0.0
            , regId: ''
            , updId: ''

            , leaveTypeCdNm: ''
            , leaveTypeDetailCdNm: ''
        },
        hrLeaveHolidayApprovalDtos: {
            a1: [],
            a2: [],
            a3: [],
            a4: [],
            a5: [],
            a6: [],
            z9: [],
        },
        modalDateShow: false,
        leaveTypeDetailCdObj: null,
        timeControl: true,
        dateGrid: {
            columnDefs:
                [
                    { headerName: 'Leave Type', field: 'leaveTypeCdNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Leave Detail', field: 'leaveTypeDetailCdNm', minWidth: 100 },
                    { headerName: 'Start Dt', field: 'startDt', minWidth: 100 },
                    { headerName: 'Start Time', field: 'startTime', minWidth: 100 },
                    { headerName: 'End Dt', field: 'endDt', minWidth: 100 },
                    { headerName: 'End Time', field: 'endTime', minWidth: 100 },
                    { headerName: 'Request Days', field: 'recogDay', minWidth: 100 },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                // floatingFilter: true, // 멀티서치 기능
            },
            isLoding: false,
        },
    }
    /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetLeaveCntList", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                arrLeaveYear: data,
                hrLeaveHolidayDto: {
                    ...this.state.hrLeaveHolidayDto,
                    leaveYear: data.length > 0 ? data[0].leaveYear : ""
                }
            })
        }).catch(function (error) {
            alert(error);
        });

        if (this.props.id !== '') {
            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/HrLeaveHolidayService/GetLeaveHolidayDetail", {
                params: {
                    leaveHoliId: this.props.id
                }
            }).then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;

                var _master = data.hrLeaveHolidayDto;
                var _dates = data.hrLeaveHolidayDateDtos;
                var _approvals = data.hrLeaveHolidayApprovalDtos;

                // 시간
                var dateList = [];
                _dates.map((row, i) => {
                    row.id = row.dateId;
                    dateList.push(row);
                });

                // 승인자
                var a1List = [];
                var a2List = [];
                var a3List = [];
                var a4List = [];
                var a5List = [];
                var a6List = [];
                var z9List = [];

                _approvals.map((row, i) => {
                    if (row.apprCd === 'A1') {
                        a1List.push(row);
                    }
                    else if (row.apprCd === 'A2') {
                        a2List.push(row);
                    }
                    else if (row.apprCd === 'A3') {
                        a3List.push(row);
                    }
                    else if (row.apprCd === 'A4') {
                        a4List.push(row);
                    }
                    else if (row.apprCd === 'A5') {
                        a5List.push(row);
                    }
                    else if (row.apprCd === 'A6') {
                        a6List.push(row);
                    }
                    else if (row.apprCd === 'Z9') {
                        z9List.push(row);
                    }
                });

                this.setState({
                    hrLeaveHolidayDto: _master,
                    dateGrid: { ...this.state.dateGrid, rowData: dateList, rowCount: dateList.length },
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a1: a1List, a2: a2List, a3: a3List, a4: a4List, a5: a5List, a6: a6List, z9: z9List }
                })


            }).catch(function (error) {
                alert(error);
            });


        }
    }

    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    saveLeaveHolidayData(e) {
        if (this.state.hrLeaveHolidayDto.reason === '') {
            alert('[ Reason ] 값을 입력해 주세요.');
            return;
        }
        // 마스터 설정
        var gParam = {
            ...this.state.hrLeaveHolidayDto,
            statusCd: e.target.id === 'btnDraft' ? '01' : '03',
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }

        // 날짜 설정
        if (this.state.dateGrid.rowData.length === 0) {
            alert('[ Date ] 값을 입력해 주세요.');
            return;
        }
        var gParamDates = [...this.state.dateGrid.rowData];
        gParamDates.map((row, i) => {
            row.startDt = this.props.storeState.getParsedDate(row.startDt);
            row.startTime = this.props.storeState.getParsedTime(new Date('9999', '12', '31', row.startTime.substr(0, 2), row.startTime.substr(3, 2)));
            row.endDt = this.props.storeState.getParsedDate(row.endDt);
            row.endTime = this.props.storeState.getParsedTime(new Date('9999', '12', '31', row.endTime.substr(0, 2), row.endTime.substr(3, 2)));
            row.recogDay = Number(row.recogDay);
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });

        // 승인자 설정
        var gParamApprovals = [];
        this.state.hrLeaveHolidayApprovalDtos.a1.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        this.state.hrLeaveHolidayApprovalDtos.a2.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        this.state.hrLeaveHolidayApprovalDtos.a3.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        this.state.hrLeaveHolidayApprovalDtos.a4.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        this.state.hrLeaveHolidayApprovalDtos.a5.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        this.state.hrLeaveHolidayApprovalDtos.a6.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        this.state.hrLeaveHolidayApprovalDtos.z9.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        if (gParamApprovals.length === 0) {
            alert('승인자는 최소 1명이상 입니다.');
            return;
        }
        var gParamGroup = {
            hrLeaveHolidayDto: gParam,
            hrLeaveHolidayDateDtos: gParamDates,
            hrLeaveHolidayApprovalDtos: gParamApprovals
        }
        axios.post(this.props.storeState.serviceUrl + "/HrLeaveHolidayService/SaveLeaveHolidayData",
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
    /* 날짜 추가    */
    /*==========================================================*/
    onClickDateAdd() {
        this.setState({
            modalDateShow: true,
            leaveTypeDetailCdObj: <GDHSelectOption cdMajor="0202" frCdMinor={'99'} deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />,
            timeControl: true,
            hrLeaveHolidayDateDtos: {
                ...this.state.hrLeaveHolidayDateDtos,
                leaveHoliId: 0
                , dateId: 0
                , leaveTypeCd: ''
                , leaveTypeDetailCd: ''
                , startDt: new Date()
                , startTime: new Date('9999', '12', '31', '09', '00')
                , endDt: new Date()
                , endTime: new Date('9999', '12', '31', '18', '00')
                , recogDay: 1.0
                , regId: ''
                , updId: ''
            }
        })
    }
    /*==========================================================*/
    /* 날짜 삭제    */
    /*==========================================================*/
    onClickDateDelete() {
        var deleteRows = this.gridDateApi.getSelectedRows();
        if (deleteRows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var rows = [];
        this.state.dateGrid.rowData.map((row, i) => {
            var boolCheck = false;
            deleteRows.map((sRow, j) => {
                if (sRow.dateId === row.dateId) {
                    boolCheck = true;
                }
            })
            if (!boolCheck) {
                rows.push(row);
            }
        })

        this.setState({
            modalDateShow: false,
            dateGrid: { ...this.state.dateGrid, rowData: [], rowCount: 0 }
        }, () => {
            this.setState({
                dateGrid: { ...this.state.dateGrid, rowData: rows, rowCount: rows.length }
            })
        })
    }
    /*==========================================================*/
    /* Date 테이블 더블클릭    */
    /*==========================================================*/
    onDateRowDoubleClicked(e) {
        var tValue = e.data.leaveTypeCd;

        this.setState({
            modalDateShow: true,
            hrLeaveHolidayDateDtos: {
                ...this.state.hrLeaveHolidayDateDtos,
                leaveHoliId: e.data.leaveHoliId,
                dateId: e.data.dateId,
                leaveTypeCd: e.data.leaveTypeCd,
                startDt: new Date(e.data.startDt),
                startTime: new Date('9999', '12', '31', e.data.startTime.substr(0, 2), e.data.startTime.substr(3, 2)),
                endDt: new Date(e.data.endDt),
                endTime: new Date('9999', '12', '31', e.data.endTime.substr(0, 2), e.data.endTime.substr(3, 2)),
                recogDay: e.data.recogDay,

                leaveTypeCdNm: e.data.leaveTypeCdNm
            }
        }, () => {
            this.setState({
                leaveTypeDetailCdObj: <GDHSelectOption cdMajor="0202" frCdMinor={tValue} deleteMinor={
                    this.props.storeState.userInfo.certiTitleGb === '03'
                        ? ['E9'] // 기타휴가
                        : []
                } isEmpty={true} isEmptyText="=== Select ===" />,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        hrLeaveHolidayDateDtos: {
                            ...this.state.hrLeaveHolidayDateDtos,
                            leaveTypeDetailCd: e.data.leaveTypeDetailCd,
                            leaveTypeDetailCdNm: e.data.leaveTypeDetailCdNm,
                        }
                    })
                }, 300);
            })
        })
    }

    /*==========================================================*/
    /* 날짜 저장    */
    /*==========================================================*/
    saveDate() {
        var rows = [];
        var arrDateId = [];
        this.state.dateGrid.rowData.map((row, i) => {
            arrDateId.push(row.dateId);
            rows.push(row);
        })


        var objDate = { ...this.state.hrLeaveHolidayDateDtos };

        var _dateId = objDate.dateId > 0
            ? objDate.dateId
            : arrDateId.length === 0 ? 100 : Math.max.apply(null, arrDateId) + 1

        // 저장전 날짜 확인
        var tStartDt = this.props.storeState.getParsedDate(objDate.startDt, "")
            + this.props.storeState.getParsedTime(objDate.startTime, "");
        var tEndDt = this.props.storeState.getParsedDate(objDate.endDt, "")
            + this.props.storeState.getParsedTime(objDate.endTime, "");

        if (tStartDt > tEndDt) {
            alert('종료일은 시작일보다 작을 수 없습니다.');
            return;
        }
        if (objDate.leaveTypeCd === '') {
            alert('Leave Type을 선택해 주세요.');
            return;
        }
        if (objDate.leaveTypeDetailCd === '') {
            alert('Leave Type Detail을 선택해 주세요.');
            return;
        }

        // Update
        if (objDate.dateId > 0) {
            rows.map((row, i) => {
                if (row.dateId === _dateId) {
                    row.leaveTypeCd = objDate.leaveTypeCd;
                    row.leaveTypeDetailCd = objDate.leaveTypeDetailCd;
                    row.startDt = this.props.storeState.getParsedDate(objDate.startDt, "-");
                    row.startTime = this.props.storeState.getParsedTime(objDate.startTime, ":");
                    row.endDt = this.props.storeState.getParsedDate(objDate.endDt, "-");
                    row.endTime = this.props.storeState.getParsedTime(objDate.endTime, ":");
                    row.recogDay = objDate.recogDay;

                    row.leaveTypeCdNm = objDate.leaveTypeCdNm;
                    row.leaveTypeDetailCdNm = objDate.leaveTypeDetailCdNm;
                }
            })
        }
        else {
            objDate.dateId = _dateId;
            objDate.startDt = this.props.storeState.getParsedDate(objDate.startDt, "-");
            objDate.startTime = this.props.storeState.getParsedTime(objDate.startTime, ":");
            objDate.endDt = this.props.storeState.getParsedDate(objDate.endDt, "-");
            objDate.endTime = this.props.storeState.getParsedTime(objDate.endTime, ":");

            // Save
            rows.push(objDate);
        }
        this.setState({
            modalDateShow: false,
            dateGrid: { ...this.state.dateGrid, rowData: [], rowCount: 0 }
        }, () => {
            this.setState({
                dateGrid: { ...this.state.dateGrid, rowData: rows, rowCount: rows.length }
            })
        })
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
            hrLeaveHolidayDto: {
                ...this.state.hrLeaveHolidayDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onModalChangeHandler(e) {
        var tValue = e.target.value;
        var tName = e.target.name;
        var tText = e.target.selectedOptions[0].text;

        this.setState({
            timeControl: tValue === 'G1' || tValue === 'G2' ? false : true,
            hrLeaveHolidayDateDtos: {
                ...this.state.hrLeaveHolidayDateDtos,
                leaveTypeDetailCd: ''
                , leaveTypeDetailCdNm: ''
                , [tName]: tValue
                , [tName + "Nm"]: tText
                , startDt: new Date()
                , startTime: tValue === 'A3' // 오후반차
                    ? new Date('9999', '12', '31', '14', '00')
                    : new Date('9999', '12', '31', '09', '00')
                , endDt: new Date()
                , endTime: tValue === 'A2' // 오전반차
                    ? new Date('9999', '12', '31', '13', '00')
                    : new Date('9999', '12', '31', '18', '00')
                , recogDay: tValue === 'A2' || tValue === 'A3' ? 0.5 : 1.0
            }
        }, () => {
            if (tName === 'leaveTypeCd') {
                this.setState({
                    leaveTypeDetailCdObj: null,
                }, () => {
                    this.setState({
                        leaveTypeDetailCdObj: <GDHSelectOption cdMajor="0202" frCdMinor={tValue} deleteMinor={
                            this.props.storeState.userInfo.certiTitleGb === '03'
                                ? ['E9'] // 기타휴가
                                : []
                        } isEmpty={true} isEmptyText="=== Select ===" />
                    })
                })
            }
        })
    }
    onModalDateChangeHandler(name, date) {
        this.setState({
            hrLeaveHolidayDateDtos: {
                ...this.state.hrLeaveHolidayDateDtos,
                [name]: date,
                endDt: name === 'startTime' || name === 'endTime' ? this.state.hrLeaveHolidayDateDtos.endDt : date,
            }
        }, () => {
            var row = { ...this.state.hrLeaveHolidayDateDtos }
            this.getDiffTime(row);
        });
    }
    /*==========================================================*/
    /* 시간 차이    */
    /*==========================================================*/
    async getDiffTime(row) {
        var startDay = new Date(
            this.props.storeState.getParsedDate(row.startDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.startDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.startDt, "").substr(6, 2),
            '00',
            '00'
        );
        var endDay = new Date(
            this.props.storeState.getParsedDate(row.endDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.endDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.endDt, "").substr(6, 2),
            '00',
            '00'
        );
        var startHours = new Date(
            '9999',
            '12',
            '31',
            this.props.storeState.getParsedTime(row.startTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.startTime, "").substr(2, 2)
        );
        var endHours = new Date(
            '9999',
            '12',
            '31',
            this.props.storeState.getParsedTime(row.endTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.endTime, "").substr(2, 2)
        );

        var holidayCnt = await this.getHolidayCnt(this.props.storeState.getParsedDate(row.startDt, ""), this.props.storeState.getParsedDate(row.endDt, ""));
        var day = Math.ceil((endDay.getTime() - startDay.getTime()) / (1000 * 3600 * 24));
        var hour = parseInt((endHours.getTime() - startHours.getTime()) / 1000 / 60 / 60);

        if (hour >= 4) {
            if (hour >= 8) {
                hour = 1;
            }
            else {
                hour = 0.5;
            }
        } else {
            hour = 0;
        }

        var rDay = day + hour;
        if (row.leaveTypeCd === '01' || row.leaveTypeCd === '02'
            || row.leaveTypeDetailCd === 'E1' || row.leaveTypeDetailCd === 'E2' || row.leaveTypeDetailCd === 'E4' || row.leaveTypeDetailCd === 'E5' || row.leaveTypeDetailCd === 'E9') {
            rDay = rDay - holidayCnt;
        }

        this.setState({
            hrLeaveHolidayDateDtos: {
                ...this.state.hrLeaveHolidayDateDtos,
                recogDay: rDay
            }
        })
    }
    // 휴일 가져오기
    async getHolidayCnt(startDt, endDt) {
        var r = await axios.get(this.props.storeState.serviceUrl + "/CommonService/GetHolidayCnt", {
            params: {
                startDt, endDt
            }
        }).then(r => {
            var data = r.data;
            return data.holidayCnt;
        }).catch(function (error) {
            alert(error);
        });

        return r;
    }

    /*==========================================================*/
    /* 파일 업로드    */
    /*==========================================================*/
    onfileUploadClick(e) {
        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'LeaveHoliday')
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
                hrLeaveHolidayDto: {
                    ...this.state.hrLeaveHolidayDto,
                    fileNm: data[0].fileNm,
                    fileUrl: data[0].fileUrl,
                }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 신규생성    */
    /*==========================================================*/
    saveApprovalUserList = (data, gb) => {
        switch (gb) {
            case "A1":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a1: data }
                })
                break;
            case "A2":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a2: data }
                })
                break;
            case "A3":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a3: data }
                })
                break;
            case "A4":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a4: data }
                })
                break;
            case "A5":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a5: data }
                })
                break;
            case "A6":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, a6: data }
                })
                break;
            case "Z9":
                this.setState({
                    hrLeaveHolidayApprovalDtos: { ...this.state.hrLeaveHolidayApprovalDtos, z9: data }
                })
                break;
            default:
                break;
        }
    }

    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="warning" id="btnDraft"
                                    disabled={this.state.hrLeaveHolidayDto.statusCd !== '01' ? true : false}
                                    onClick={this.saveLeaveHolidayData.bind(this)}
                                >Draft</Button>{' '}
                                <Button variant="success" id="btnSave"
                                    disabled={this.state.hrLeaveHolidayDto.statusCd !== '01' ? true : false}
                                    onClick={this.saveLeaveHolidayData.bind(this)}
                                >Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12" style={{ marginBottom: 10 }}>
                                <Table bordered>
                                    <colgroup>
                                        <col style={{ width: 150 }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Employee Nm</th>
                                            <td>{this.props.storeState.userInfo.userNm}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Department</th>
                                            <td>{this.props.storeState.userInfo.deptFullNm}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Position Kr</th>
                                            <td>{this.props.storeState.userInfo.dutyCdKorNm}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            {
                                this.state.hrLeaveHolidayDto.statusCd !== '10' && this.state.hrLeaveHolidayDto.statusCd !== '99'
                                    ? <></>
                                    : <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Comment</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="remark"
                                                className="responseRemarkBackcolor"
                                                value={this.state.hrLeaveHolidayDto.remark}
                                            />
                                        </Form.Group>
                                    </div>
                            }
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="leaveHoliId"
                                        value={this.state.hrLeaveHolidayDto.leaveHoliId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.hrLeaveHolidayDto.statusCd} onChange={this.onChangeHandler.bind(this)}
                                        disabled
                                    >
                                        <GDHSelectOption cdMajor="0012" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Leave Year</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="leaveYear"
                                        value={this.state.hrLeaveHolidayDto.leaveYear} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        {
                                            this.state.arrLeaveYear.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.leaveYear}>{item.leaveYear}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-6"></div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Reason</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="reason"
                                        value={this.state.hrLeaveHolidayDto.reason} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Alert variant={'danger'}>
                                    Total Annual Leave 적용 일수 (17년 5월 30일 이후 입사자부터 적용)<br />
                                    입사 년도 : 0일<br />
                                    입사 다음 년도 : 11일(법 개정으로 인한 추가 연차) + 비례보상연차
                                </Alert>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Date</Form.Label>
                                    <div className="col-md-12 text-right" style={{ marginBottom: 5 }}>
                                        <Button variant="secondary" onClick={this.onClickDateAdd.bind(this)} >Add</Button>{' '}
                                        <Button variant="danger" onClick={this.onClickDateDelete.bind(this)} >Delete</Button>
                                    </div>
                                    <div className="ag-theme-material"
                                        style={{ height: 200, borderTop: '2px solid #695405' }}
                                    >
                                        <AgGridReact headerHeight={45} rowHeight={45}
                                            columnDefs={this.state.dateGrid.columnDefs}
                                            defaultColDef={this.state.dateGrid.defaultColDef}
                                            rowData={this.state.dateGrid.rowData}
                                            singleClickEdit={true}
                                            rowSelection="multiple" // single
                                            onGridReady={params => this.gridDateApi = params.api}
                                            onRowDoubleClicked={this.onDateRowDoubleClicked.bind(this)}
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <Form.Group style={{ marginBottom: 10, fontWeight: 'bold' }}>
                                    <Form.Label>{' '}</Form.Label>
                                    <Form.Row style={{ paddingLeft: 15 }}>
                                        <a href={this.state.hrLeaveHolidayDto.fileUrl} target={'_blank'}>
                                            {this.state.hrLeaveHolidayDto.fileNm}
                                        </a>
                                        {
                                            this.state.hrLeaveHolidayDto.fileNm !== ''
                                                ? <><>&nbsp;&nbsp;&nbsp;</>
                                                    <a href={'#'} style={{ color: 'black', fontSize: 15 }} onClick={(e) => {
                                                        e.preventDefault();
                                                        this.setState({
                                                            hrLeaveHolidayDto: {
                                                                ...this.state.hrLeaveHolidayDto,
                                                                fileNm: '',
                                                                fileUrl: ''
                                                            }
                                                        })
                                                    }}>ⓧ</a>
                                                </>
                                                : <></>
                                        }
                                    </Form.Row>
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>

                    <div style={{ marginTop: 25 }}></div>

                    {
                        this.props.storeState.userInfo.certiTitleGb === '03'
                            ? <GDHApproval apprTitle="Second Manager" approvalGb="01" approvalCd="A2"
                                approvalUserList={this.state.hrLeaveHolidayApprovalDtos.a2}
                                saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                            : <GDHApproval apprTitle="Carbon Copy" approvalGb="01" approvalCd="A1"
                                approvalUserList={this.state.hrLeaveHolidayApprovalDtos.a1}
                                saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                    }

                    <GDHApproval apprTitle={this.props.storeState.userInfo.certiTitleGb === '03' ? "Branch Manager" : "Part Leader"}
                        approvalGb="01" approvalCd="A3"
                        approvalUserList={this.state.hrLeaveHolidayApprovalDtos.a3}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    <GDHApproval apprTitle="Team Manager"
                        approvalGb="01" approvalCd="A4"
                        approvalUserList={this.state.hrLeaveHolidayApprovalDtos.a4}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    {
                        this.props.storeState.userInfo.certiTitleGb === '03'
                            ? <></>
                            : <GDHApproval apprTitle="CS / Lab Manager"
                                approvalGb="01" approvalCd="A5"
                                approvalUserList={this.state.hrLeaveHolidayApprovalDtos.a5}
                                saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                    }

                    <GDHApproval apprTitle="General Manager"
                        approvalGb="01" approvalCd="A6"
                        approvalUserList={this.state.hrLeaveHolidayApprovalDtos.a6}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    <GDHApproval apprTitle="CMD" approvalGb="01" approvalCd="Z9"
                        approvalUserList={this.state.hrLeaveHolidayApprovalDtos.z9}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                </Card.Body>

            </Card>

            {/* Modal */}
            <Modal show={this.state.modalDateShow} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveDate.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalDateShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>■ Leave Type</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="leaveTypeCd"
                                        value={this.state.hrLeaveHolidayDateDtos.leaveTypeCd} onChange={this.onModalChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0202" level={'11'} deleteMinor={
                                            this.props.storeState.userInfo.certiTitleGb === '03'
                                                ? ['91']
                                                : ['06']
                                        } isEmpty={true} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>■ Leave Type Detail</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="leaveTypeDetailCd"
                                        value={this.state.hrLeaveHolidayDateDtos.leaveTypeDetailCd} onChange={this.onModalChangeHandler.bind(this)}
                                    >
                                        {this.state.leaveTypeDetailCdObj}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={7}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ Start Dt</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.hrLeaveHolidayDateDtos.startDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={5}>
                                <Form.Group>
                                    <Form.Label className="validateText">Time</Form.Label>
                                    <GDHDatepickerTime
                                        name='startTime'
                                        value={this.state.hrLeaveHolidayDateDtos.startTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                        readOnly={this.state.timeControl}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={7}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ End Dt</Form.Label>
                                    <GDHDatepicker
                                        name='endDt'
                                        value={this.state.hrLeaveHolidayDateDtos.endDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={5}>
                                <Form.Label className="validateText">Time</Form.Label>
                                <Form.Group>
                                    <GDHDatepickerTime
                                        name='endTime'
                                        value={this.state.hrLeaveHolidayDateDtos.endTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                        readOnly={this.state.timeControl}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Alert variant={'info'} style={{ fontWeight: 'bold', fontSize: 14 }}>
                                    Total number of Days : {this.state.hrLeaveHolidayDateDtos.recogDay}
                                </Alert>
                            </Col>
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
)(LeaveHolidayDetail)
