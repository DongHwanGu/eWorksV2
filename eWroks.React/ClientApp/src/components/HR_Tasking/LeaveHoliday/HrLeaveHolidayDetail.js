import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';


import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';

class HrLeaveHolidayDetail extends Component {
    state = {
        arrLeaveYear: [],

        leaveHoliId: 0,
        leaveYear: '',
        remark: '',
        reason: '',

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
        hrLeaveHolidayGroupDto: {
            hrLeaveHolidayDto: {
                leaveHoliId: 0
                , reason: ''
                , statusCd: '01'
                , remark: ''
                , fileNm: ''
                , fileUrl: ''
                , regId: ''
                , updId: ''

                , statusCdNm: ''
                , regIdNm: ''
                , regIdDeptFullNm: ''
            },
            hrLeaveHolidayApprovalDtos: {
                a1: '',
                a2: '',
                a3: '',
                a4: '',
                a5: '',
                a6: '',
                z9: '',
            },
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
    }

    /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetLeaveCntList", {
            params: {
                userId: this.props.regId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                arrLeaveYear: data,
                leaveYear: data.length > 0 ? data[0].leaveYear : ""
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

                var strA1 = '';
                var strA2 = '';
                var strA3 = '';
                var strA4 = '';
                var strA5 = '';
                var strA6 = '';
                var strZ9 = '';

                data.hrLeaveHolidayApprovalDtos.map((row, i) => {
                    if (row.apprCd === 'A1') {
                        strA1 += row.taskingUserNm
                    }
                    if (row.apprCd === 'A2') {
                        strA2 += row.taskingUserNm
                    }
                    if (row.apprCd === 'A3') {
                        strA3 += row.taskingUserNm
                    }
                    if (row.apprCd === 'A4') {
                        strA4 += row.taskingUserNm
                    }
                    if (row.apprCd === 'A5') {
                        strA5 += row.taskingUserNm
                    }
                    if (row.apprCd === 'A6') {
                        strA6 += row.taskingUserNm
                    }
                    if (row.apprCd === 'Z9') {
                        strZ9 += row.taskingUserNm
                    }
                })

                this.setState({
                    leaveHoliId: data.hrLeaveHolidayDto.leaveHoliId,
                    reason: data.hrLeaveHolidayDto.reason,
                    leaveYear: data.hrLeaveHolidayDto.leaveYear,
                    remark: '',
                    hrLeaveHolidayGroupDto: {
                        ...this.state.hrLeaveHolidayGroupDto,
                        hrLeaveHolidayDto: data.hrLeaveHolidayDto,
                        hrLeaveHolidayApprovalDtos: {
                            a1: strA1,
                            a2: strA2,
                            a3: strA3,
                            a4: strA4,
                            a5: strA5,
                            a6: strA6,
                            z9: strZ9,
                        }
                    },
                    dateGrid: { ...this.state.dateGrid, rowData: data.hrLeaveHolidayDateDtos }
                })
            }).catch(function (error) {
                alert(error);
            });


        }
    }

    /*==========================================================*/
    /* 승인 리젝 저장    */
    /*==========================================================*/
    saveResponseLeaveHolidayApproval(e) {
        var btnId = e.target.id;

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
            row.updId = this.props.storeState.userInfo.userId;
        });

        axios.post(this.props.storeState.serviceUrl + "/HrLeaveHolidayService/saveResponseLeaveHolidayApproval", gParamDates, {
            params: {
                leaveHoliId: this.state.leaveHoliId,
                remark: this.state.remark,
                reason: this.state.reason,
                leaveYear: this.state.leaveYear,
                statusCd: btnId === 'btnApproval' ? '10' : '99',
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
                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
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

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
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
                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
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
    render() {
        return (<>
            <Form style={{ marginTop: 15 }}>
                <Form.Row>
                    <div className="col-md-12 text-right">
                        <Button variant="success" id="btnApproval"
                            style={{
                                display: this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '09'
                                    ? 'inline' : 'none'
                            }}
                            onClick={this.saveResponseLeaveHolidayApproval.bind(this)}
                        >Approval</Button>
                        {' '}
                        <Button variant="danger" id="btnReject"
                            style={{
                                display: this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '09'
                                    || this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '10'
                                    ? 'inline' : 'none'
                            }}
                            onClick={this.saveResponseLeaveHolidayApproval.bind(this)}
                        >Reject</Button>
                        {' '}
                        <Button variant="info" 
                            style={{
                                display: this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '09'
                                    || this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '10'
                                    || this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCd === '99'
                                    ? 'inline' : 'none'
                            }}
                            onClick={function (e) {
                            var userId = this.props.storeState.userInfo.userId;
                            var page = "VacationReport";
                            var key = this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.leaveHoliId;
                            var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                            window.open(this.props.storeState.reportUrl + url, '_blank');
                        }.bind(this)}>Print</Button>
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
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Comment</th>
                            <td colSpan={3}>
                                <Form.Control type="text" size="sm"
                                    name="remark"
                                    className="responseRemarkBackcolor"
                                    value={this.state.remark} onChange={this.onChangeHandler.bind(this)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Request Nm</th>
                            <td>
                                {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.regIdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Department</th>
                            <td>
                                {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.regIdDeptFullNm}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Leave Year</th>
                            <td>
                                <Form.Control as="select" size="sm"
                                    name="leaveYear"
                                    value={this.state.leaveYear} onChange={this.onChangeHandler.bind(this)}
                                >
                                    {
                                        this.state.arrLeaveYear.map((item, i) => {
                                            return (
                                                <option key={i} value={item.leaveYear}>{item.leaveYear}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Status</th>
                            <td>
                                {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.statusCdNm}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef', color: 'red' }}>■ Reason</th>
                            <td colSpan={3}>
                                <Form.Control type="text" size="sm"
                                    name="reason"
                                    value={this.state.reason} onChange={this.onChangeHandler.bind(this)}
                                />
                            </td>
                        </tr>
                        <tr style={{ borderTop: '5px solid #e9ecef', borderBottom: '5px solid #e9ecef' }}>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Date</th>
                            <td colSpan={3} style={{ padding: 3 }}>
                                <div className="col-md-12 text-right" style={{ marginBottom: 5, marginTop: 15 }}>
                                    <Button variant="secondary" onClick={this.onClickDateAdd.bind(this)} >Add</Button>{' '}
                                    <Button variant="danger" onClick={this.onClickDateDelete.bind(this)} >Delete</Button>
                                </div>
                                <div className="ag-theme-material"
                                    style={{ height: 150, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.dateGrid.columnDefs}
                                        defaultColDef={this.state.dateGrid.defaultColDef}
                                        rowData={this.state.dateGrid.rowData}
                                        singleClickEdit={true}
                                        // rowSelection="multiple" // single
                                        onGridReady={params => this.gridDateApi = params.api}
                                        onRowDoubleClicked={this.onDateRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ File Attached</th>
                            <td colSpan={3}>
                                <a href={this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.fileUrl} target={'_blank'}>
                                    {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.fileNm}
                                </a>
                            </td>
                        </tr>


                        {
                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
                                ? <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Second Manager</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a2.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                                : <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Carbon Copy</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a1.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                        }

                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>
                                ■ {this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03' ? "Branch Manager" : "Part Leader"}</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a3.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Team Manager</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a4.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>
                        {
                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
                                ? <></>
                                : <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ CS / Lab Manager</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a5.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                        }

                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ General Manager</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.a6.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ CMD</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayApprovalDtos.z9.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>


                    </tbody>
                </Table>
            </div>

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
                                            this.state.hrLeaveHolidayGroupDto.hrLeaveHolidayDto.certiTitleGb === '03'
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
)(HrLeaveHolidayDetail)
