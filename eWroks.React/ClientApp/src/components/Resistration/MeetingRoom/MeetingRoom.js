import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import Calendar from '../../common/calendar/src/index';
import myTheme from '../../common/calendar/stories/myTheme';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';

const today = new Date();
const getDate = (type, start, value, operator) => {
    start = new Date(start);
    type = type.charAt(0).toUpperCase() + type.slice(1);

    if (operator === '+') {
        start[`set${type}`](start[`get${type}`]() + value);
    } else {
        start[`set${type}`](start[`get${type}`]() - value);
    }

    return start;
};
class MeetingRoom extends Component {
    ref = React.createRef();

    calendarInst = null;

    state = {
        btnSave: true,
        modalMeetingRoom: false,
        cmMeetingRoomDto: {
            meetingId: 0
            , meetingGb: '01'
            , roomGb: '01'
            , roomSubject: ''
            , startDt: new Date()
            , startTime: new Date()
            , endDt: new Date()
            , endTime: new Date()
            , contentDesc: ''
            , regId: ''
            , updId: ''

            , roomGbNm: ''
            , startDtNm: ''
            , endDtNm: ''
            , regIdNm: ''
            , regDtNm: ''
        },
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Room', field: 'roomGbNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'Subject',
                        field: 'roomSubject',
                        minWidth: 100
                    },
                    {
                        headerName: 'Start Dt',
                        field: 'startDtNm',
                        minWidth: 100
                    },
                    {
                        headerName: 'End Dt',
                        field: 'endDtNm',
                        minWidth: 100
                    },
                ],
            rowData: this.props.list,
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: true, // 멀티서치 기능
            },
        },
        dateRange: '',
        view: 'month',
        viewModeOptions: [
            {
                title: 'Monthly',
                value: 'month'
            },
            {
                title: 'Weekly',
                value: 'week'
            },
            {
                title: 'Daily',
                value: 'day'
            }
        ],
        schedule: [
            {
                id: '1',
                calendarId: '1',
                title: 'my schedule',
                category: 'time',
                dueDateClass: '',
                start: '2021-08-18T22:30:00+09:00',
                end: '2021-08-19T02:30:00+09:00'
            },
            {
                id: '2',
                calendarId: '1',
                title: 'second schedule',
                category: 'time',
                dueDateClass: '',
                start: '2021-08-18T17:30:00+09:00',
                end: '2021-08-18T17:31:00+09:00',
                isReadOnly: false    // schedule is read-only
            }
        ]
    };

    componentDidMount() {
        this.calendarInst = this.ref.current.getInstance();
        this.setState({ view: 'month' });

        this.setRenderRangeText();
        // 가져오기
        this.getMeetingRoomList();
    }

    /*==========================================================*/
    /* 가져오기    */
    /*==========================================================*/
    getMeetingRoomList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmMeetingRoomService/GetMeetingRoomList", {
            params: {
                meetingGb: this.state.cmMeetingRoomDto.meetingGb,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
                var data = r.data;
                var _schedule = [];

                for (var i = 0; i < data.length; i++) {
                    var _data = {
                        id: data[i].meetingId,
                        calendarId: data[i].roomGb,
                        title: data[i].roomSubject,
                        category: 'time',
                        dueDateClass: '',
                        start: new Date(data[i].startDtNm).toISOString(),
                        end: new Date(data[i].endDtNm).toISOString(),
                        location: data[i].regId,
                    }
                    _schedule.push(_data);
                }
                this.setState({
                    masterGrid: { ...this.state.masterGrid, rowData: [] },
                    schedule: _schedule
                })

                this.props.onIsLoadingFalse();

            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* 날짜 선택    */
    /*==========================================================*/
    getMeetingRoomSelectList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmMeetingRoomService/GetMeetingRoomSelectList", {
            params: {
                selectDt: this.props.storeState.getParsedDate(this.state.cmMeetingRoomDto.startDt, ""),
                meetingGb: this.state.cmMeetingRoomDto.meetingGb,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
                var data = r.data;

                this.setState({
                    masterGrid: { ...this.state.masterGrid, rowData: data },
                })
                this.props.onIsLoadingFalse();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 네비 이동    */
    /*==========================================================*/
    onClickNavi(event) {
        if (event.target.tagName === 'BUTTON') {
            const { target } = event;
            let action = target.dataset ? target.dataset.action : target.getAttribute('data-action');
            action = action.replace('move-', '');

            this.calendarInst[action]();
            this.setRenderRangeText();
        }
        this.getMeetingRoomList();
    }

    setRenderRangeText() {
        const view = this.calendarInst.getViewName();
        const calDate = this.calendarInst.getDate();
        const rangeStart = this.calendarInst.getDateRangeStart();
        const rangeEnd = this.calendarInst.getDateRangeEnd();
        let year = calDate.getFullYear();
        let month = calDate.getMonth() + 1;
        let date = calDate.getDate();
        let dateRangeText = '';
        let endMonth, endDate, start, end;

        switch (view) {
            case 'month':
                dateRangeText = `${year}년 ${month < 10 ? '0' + month : month}월`;
                break;
            case 'week':
                year = rangeStart.getFullYear();
                month = rangeStart.getMonth() + 1;
                date = rangeStart.getDate();
                endMonth = rangeEnd.getMonth() + 1;
                endDate = rangeEnd.getDate();

                start = `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;
                end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${endDate < 10 ? '0' : ''
                    }${endDate}`;
                dateRangeText = `${start} ~ ${end}`;
                break;
            default:
                dateRangeText = `${year}-${month}-${date}`;
        }

        this.setState({ dateRange: dateRangeText });
    }
    /*==========================================================*/
    /* 날짜 선택  */
    /*==========================================================*/
    onBeforeCreateSchedule(scheduleData) {
        // const { calendar } = scheduleData;
        const schedule = {
              meetingId: 0
            , meetingGb: this.state.cmMeetingRoomDto.meetingGb
            , roomGb: this.state.cmMeetingRoomDto.roomGb
            , roomSubject: this.state.cmMeetingRoomDto.roomSubject
            , startDt: new Date(this.props.storeState.getParsedDate(scheduleData.start, '-'))
            , startTime: new Date()
            , endDt: new Date(this.props.storeState.getParsedDate(scheduleData.start, '-'))
            , endTime: new Date()
            , contentDesc: ''
            , regId: this.props.storeState.userInfo.userId
            , updId: this.props.storeState.userInfo.userId

            , startDtNm: ''
            , endDtNm: ''
            , regIdNm: ''
            , regDtNm: ''
        };
        this.setState({
            cmMeetingRoomDto: schedule
        }, () => {
            this.getMeetingRoomSelectList();
        })
    }

    /*==========================================================*/
    /* 그리드 더블클릭  */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        this.setState({
            btnSave: this.props.storeState.userInfo.userId === e.data.regId ? true : false,
            modalMeetingRoom: true,
            cmMeetingRoomDto: {
                ...this.state.cmMeetingRoomDto
                , meetingId: e.data.meetingId
                , roomGb: e.data.roomGb
                , roomSubject: e.data.roomSubject
                , startDt: new Date(e.data.startDt)
                , startTime: new Date("9999", "12", "31", 9, 0)
                , endDt: new Date(e.data.endDt)
                , endTime:new Date("9999", "12", "31", 18, 0)
                , contentDesc: e.data.contentDesc
                , regId: e.data.regId
                , updId: e.data.updId

                , regIdNm: e.data.regIdNm
                , regDtNm: e.data.regDtNm
            },
        })
    }

    /*==========================================================*/
    /* 신규 팝업  */
    /*==========================================================*/
    onClickNew() {
        this.setState({
            btnSave: true,
            modalMeetingRoom: true,
            cmMeetingRoomDto: {
                ...this.state.cmMeetingRoomDto
                , roomGb: this.state.cmMeetingRoomDto.meetingGb === '01' ? '01' : '21'
                , roomSubject: ''
                , startTime: new Date("9999", "12", "31", 9, 0)
                , endTime:new Date("9999", "12", "31", 18, 0)
                , contentDesc: ''
                , regId: ''
                , updId: ''

                , startDtNm: ''
                , endDtNm: ''
                , regIdNm: this.props.storeState.userInfo.userNm
                , regDtNm: this.props.storeState.getParsedDate(new Date(), "-")
            },
        })
    }

    /*==========================================================*/
    /* 저장  */
    /*==========================================================*/
    saveMeetRoomData() {
        if (this.state.cmMeetingRoomDto.roomSubject === '')
        {
            alert('[ Subject ] 값을 입력해 주세요.');
            return;
        }

        // 마스터 설정
        var gParam = { ...this.state.cmMeetingRoomDto }
        gParam.startDt = this.props.storeState.getParsedDate(gParam.startDt);
        gParam.startTime = this.props.storeState.getParsedTime(new Date('9999', '12', '31', gParam.startTime.toTimeString().substr(0, 2), gParam.startTime.toTimeString().substr(3, 2)));
        gParam.endDt = this.props.storeState.getParsedDate(gParam.endDt);
        gParam.endTime = this.props.storeState.getParsedTime(new Date('9999', '12', '31', gParam.endTime.toTimeString().substr(0, 2), gParam.endTime.toTimeString().substr(3, 2)));
        gParam.regId = this.props.storeState.userInfo.userId;
        gParam.updId = this.props.storeState.userInfo.userId;

        axios.post(this.props.storeState.serviceUrl + "/CmMeetingRoomService/SaveMeetRoomData",
            gParam)
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }

            this.setState({
                modalMeetingRoom: false
            })
            this.getMeetingRoomList();

        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 삭제  */
    /*==========================================================*/
    onBeforeDeleteSchedule(res) {
        var meetingId = res.schedule.id;
        var regId = res.schedule.location;

        if(regId !== this.props.storeState.userInfo.userId) {
            alert('본인이 작성한 건만 삭제 가능 합니다.');
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/CmMeetingRoomService/DeleteMeetRoomData", {},
        {
            params: {
                meetingId: meetingId,
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getMeetingRoomList();
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
     // 체인지 공통
     onModalChangeHandler(e) {
        this.setState({
            cmMeetingRoomDto : {
                ...this.state.cmMeetingRoomDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onModalDateChangeHandler(name, date) {
        this.setState({
            cmMeetingRoomDto: {
                ...this.state.cmMeetingRoomDto,
                [name]: date
            }
        });
    }
    render() {
        function getTimeTemplate(schedule, isAllDay) {
            var html = [];

            if (!isAllDay) {
                html.push('<strong>' + schedule.start.getHours().toString() + ":" + schedule.start.getMinutes().toString() + '</strong> ');
            }
            if (schedule.isPrivate) {
                html.push('<span class="calendar-font-icon ic-lock-b"></span>');
                html.push(' Private');
            } else {
                if (schedule.isReadOnly) {
                    html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
                } else if (schedule.recurrenceRule) {
                    html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
                } else if (schedule.attendees.length) {
                    html.push('<span class="calendar-font-icon ic-user-b"></span>');
                } else if (schedule.location) {
                    html.push('<span class="calendar-font-icon ic-location-b"></span>');
                }
                html.push(' ' + schedule.title);
            }

            return html.join('');
        }
        const { dateRange, view, viewModeOptions } = this.state;
        const selectedView = view || this.props.view;
        return (<>
            <Form.Row style={{ marginBottom: 10 }}>
                <Col md={12}>
                    <Card>
                        <Card.Header>
                            <Button variant={this.state.cmMeetingRoomDto.meetingGb === '01' ? 'warning' : 'light'} 
                                style={{ fontWeight: 'bold' }}
                                onClick={() => {
                                    this.setState({
                                        cmMeetingRoomDto: {
                                            ...this.state.cmMeetingRoomDto,
                                            meetingGb: '01'
                                        }
                                    }, () => {
                                        this.getMeetingRoomList();
                                    })
                            }} >군포 사무실</Button>{' '}
                            <Button variant={this.state.cmMeetingRoomDto.meetingGb === '02' ? 'warning' : 'light'} 
                                style={{ fontWeight: 'bold' }}
                                onClick={() => {
                                    this.setState({
                                        cmMeetingRoomDto: {
                                            ...this.state.cmMeetingRoomDto,
                                            meetingGb: '02'
                                        }
                                    }, () => {
                                        this.getMeetingRoomList();
                                    })
                            }} >성수 사무실</Button>
                        </Card.Header>
                    </Card>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <Form>
                                <Form.Row>
                                    <div className="col-md-12">
                                        <Button variant="primary"
                                            className="btn btn-primary btn-sm move-today"
                                            data-action="move-today"
                                            onClick={this.onClickNavi.bind(this)}>Today</Button>{' '}
                                        <Button variant="secondary"
                                            className="btn btn-default btn-sm move-day"
                                            data-action="move-prev"
                                            onClick={this.onClickNavi.bind(this)}>Prev</Button>{' '}
                                        <Button variant="secondary"
                                            className="btn btn-default btn-sm move-day"
                                            data-action="move-next"
                                            onClick={this.onClickNavi.bind(this)}>Next</Button>{' '}
                                        <span className="render-range" style={{ fontWeight: 'bold' }}>{dateRange}</span>
                                    </div>
                                </Form.Row>
                            </Form>
                        </Card.Header>
                    </Card>
                    <div style={{ border: '1px solid #ddd' }}>
                        <Calendar
                            usageStatistics={false}
                            calendars={[
                                {
                                    id: '01',
                                    name: 'Winning(5층)',
                                    bgColor: '#8d0000',
                                    borderColor: '#8d0000',
                                    color: 'white'
                                },
                                {
                                    id: '02',
                                    name: 'MAI(5층 대회의실)',
                                    bgColor: '#ff6a00',
                                    borderColor: '#ff6a00',
                                    color: 'white'
                                },
                                {
                                    id: '03',
                                    name: 'Inspirational(1층)',
                                    bgColor: '#b9a400',
                                    borderColor: '#b9a400',
                                    color: 'white'
                                },
                                {
                                    id: '04',
                                    name: 'Emotional(4층)',
                                    bgColor: '#138e00',
                                    borderColor: '#138e00',
                                    color: 'white'
                                },
                                {
                                    id: '05',
                                    name: 'Engaging(5층)',
                                    bgColor: '#003ca9',
                                    borderColor: '#003ca9',
                                    color: 'white'
                                },
                                {
                                    id: '06',
                                    name: 'Pioneering(1층)',
                                    bgColor: '#a000bf',
                                    borderColor: '#a000bf',
                                    color: 'white'
                                },
                                {
                                    id: '21',
                                    name: '제주(1층)',
                                    bgColor: '#8d0000',
                                    borderColor: '#8d0000',
                                    color: 'white'
                                },
                                {
                                    id: '22',
                                    name: '하와이(1층)',
                                    bgColor: '#ff6a00',
                                    borderColor: '#ff6a00',
                                    color: 'white'
                                },
                                {
                                    id: '23',
                                    name: 'Food(4층)',
                                    bgColor: '#b9a400',
                                    borderColor: '#b9a400',
                                    color: 'white'
                                },
                                {
                                    id: '24',
                                    name: 'Che(3층)',
                                    bgColor: '#138e00',
                                    borderColor: '#138e00',
                                    color: 'white'
                                },
                                {
                                    id: '25',
                                    name: 'Phy(2층)',
                                    bgColor: '#2900ae',
                                    borderColor: '#2900ae',
                                    color: 'white'
                                }

                            ]}
                            defaultView="month"
                            disableDblClick={true}
                            height="600px"
                            isReadOnly={false}
                            month={{
                                startDayOfWeek: 0
                            }}
                            schedules={this.state.schedule}
                            scheduleView
                            taskView
                            template={{
                                time: function (schedule) {
                                    return getTimeTemplate(schedule, false);
                                },
                            }}
                            theme={myTheme}
                            timezones={[
                                {
                                    timezoneOffset: 540,
                                    displayLabel: 'GMT+09:00',
                                    tooltip: 'Seoul'
                                },
                                {
                                    timezoneOffset: -420,
                                    displayLabel: 'GMT-08:00',
                                    tooltip: 'Los Angeles'
                                }
                            ]}
                            useCreationPopup={false}
                            useDetailPopup={true}
                            view={selectedView}
                            week={{
                                showTimezoneCollapseButton: true,
                                timezonesCollapsed: false
                            }}
                            ref={this.ref}
                            // onAfterRenderSchedule={this.onAfterRenderSchedule.bind(this)}
                            // onClickDayname={this.onClickDayname.bind(this)}
                            // onClickTimezonesCollapseBtn={this.onClickTimezonesCollapseBtn.bind(this)}
                            // onClickSchedule={this.onClickSchedule.bind(this)}
                            onBeforeCreateSchedule={this.onBeforeCreateSchedule.bind(this)}
                        // onBeforeUpdateSchedule={this.onBeforeUpdateSchedule.bind(this)}

                            onBeforeDeleteSchedule={this.onBeforeDeleteSchedule.bind(this)}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <Form>
                                <Form.Row>
                                    <div className="col-md-12 text-right">
                                        {this.props.storeState.getParsedDate(this.state.cmMeetingRoomDto.startDt, "-") + ' '}
                                        <Button variant="secondary" onClick={this.onClickNew.bind(this)} >New</Button>
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
                                    // rowSelection="multiple" // single
                                // onGridReady={params => this.gridApi = params.api}
                                    onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Form.Row>

            {/* Role Program Modal */}
            <Modal show={this.state.modalMeetingRoom} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        {
                            this.state.btnSave 
                            ? <><Button variant="success" onClick={this.saveMeetRoomData.bind(this)}  >Save</Button>{' '}</>
                            : <></>
                        }
                        
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalMeetingRoom: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>■ Room</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="roomGb"
                                        value={this.state.cmMeetingRoomDto.roomGb} onChange={this.onModalChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0008" 
                                            frCdMinor={this.state.cmMeetingRoomDto.meetingGb}
                                            deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ Start Dt</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.cmMeetingRoomDto.startDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="validateText">시간</Form.Label>
                                <Form.Group>
                                    <GDHDatepickerTime
                                        name='startTime'
                                        value={this.state.cmMeetingRoomDto.startTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ End Dt</Form.Label>
                                    <GDHDatepicker
                                        name='endDt'
                                        value={this.state.cmMeetingRoomDto.endDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="validateText">시간</Form.Label>
                                <Form.Group>
                                    <GDHDatepickerTime
                                        name='endTime'
                                        value={this.state.cmMeetingRoomDto.endTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ Subject</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="roomSubject"
                                        value={this.state.cmMeetingRoomDto.roomSubject} onChange={this.onModalChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>■ Content</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        name="contentDesc"
                                        value={this.state.cmMeetingRoomDto.contentDesc} onChange={this.onModalChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Table bordered>
                                    <colgroup>
                                        <col style={{ width: 100 }} />
                                        <col style={{ width: 150 }} />
                                        <col style={{ width: 100 }} />
                                        <col style={{ width: 150 }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Regist User</th>
                                            <td>{this.state.cmMeetingRoomDto.regIdNm}</td>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Regist Dt</th>
                                            <td>{this.state.cmMeetingRoomDto.regDtNm}</td>
                                        </tr>
                                    </tbody>
                                </Table>
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
)(MeetingRoom)
