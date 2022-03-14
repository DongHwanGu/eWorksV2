import React from 'react';
import { connect } from 'react-redux';

import 'tui-time-picker/dist/tui-time-picker.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-calendar/dist/tui-calendar.css';
import '../../common/calendar/stories/app.css';

import Calendar from '../../common/calendar/src/index';
import myTheme from '../../common/calendar/stories/myTheme';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';

import './CalendarIndex.css';
import moment from 'moment';

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

class CalendarIndex extends React.Component {
    ref = React.createRef();

    calendarInst = null;

    state = {
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
            // // {
            // //     id: '1',
            // //     calendarId: '0',
            // //     title: 'TOAST UI Calendar Study',
            // //     category: 'time',
            // //     dueDateClass: '',
            // //     // body: '222222222',
            // //     location: 'zzzzzzzzz',
            // //     state: 'empty',
            // //     start: today.toISOString(),
            // //     end: getDate('hours', today, 3, '+').toISOString()
            // // },
            // {
            //     id: 1,
            //     calendarId: '03',
            //     title: 'Practice',
            //     category: 'milestone',
            //     dueDateClass: '',
            //     // body: '222222222',
            //     location: 'zzzzzzzzz',
            //     state: 'empty',
            //     start: getDate('date', today, 1, '+').toISOString(),
            //     end: getDate('date', today, 1, '+').toISOString(),
            //     isReadOnly: true
            // },
            // {
            //     id: 2,
            //     calendarId: '03',
            //     title: 'FE Workshop',
            //     category: 'allday',
            //     dueDateClass: '',
            //     // body: '222222222',
            //     location: 'zzzzzzzzz',
            //     state: 'empty',
            //     start: getDate('date', today, 2, '-').toISOString(),
            //     end: getDate('date', today, 1, '-').toISOString(),
            //     isReadOnly: false
            // },
            // // {
            // //     id: '4',
            // //     calendarId: '0',
            // //     title: 'Report',
            // //     category: 'time',
            // //     dueDateClass: '',
            // //     // body: '222222222',
            // //     location: 'zzzzzzzzz',
            // //     state: 'empty',
            // //     start: today.toISOString(),
            // //     end: getDate('hours', today, 1, '+').toISOString()
            // // }
        ]
    };

    componentDidMount() {
        this.calendarInst = this.ref.current.getInstance();
        this.setState({ view: 'month' });

        this.setRenderRangeText();
        // 스케줄가져오기
        this.getScheduleList();
    }

    /*==========================================================*/
	/* 스케줄 가져오기    */
	/*==========================================================*/
    getScheduleList() {
        axios.get(this.props.storeState.serviceUrl + "/CmHoliDayService/GetHoliDayList")
            .then(r => {
                var data = r.data;
                for (var i = 0; i < data.length; i++)
                {
                    data[i].start = new Date(data[i].start).toISOString();
                    data[i].end = new Date(data[i].end).toISOString();
                }
                this.setState({
                    schedule: data
                })
            }).catch(function (error) {
                alert(error);
            });
    }

    onAfterRenderSchedule(res) {
        console.group('onAfterRenderSchedule');
        console.log('Schedule Info : ', res.schedule);
        console.groupEnd();
    }

    onBeforeDeleteSchedule(res) {
        // console.group('onBeforeDeleteSchedule');
        // console.log('Schedule Info : ', res.schedule);
        // console.groupEnd();

        // const { id, calendarId } = res.schedule;

        // this.calendarInst.deleteSchedule(id, calendarId);
        const schedule = {
            id: String(Math.random()),
            calendarId: res.schedule.calendarId,
            category: 'allday',
            title: res.schedule.title,
            location: 'scheduleData.location',
            state: 'scheduleData.state',
            start: this.getParsedDate(res.schedule.start),
            end: this.getParsedDate(res.schedule.start),
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
            // raw: {
            //     class: scheduleData.raw['class']
            // },
            // body: scheduleData.location,
            // isAllDay: false,
            // dueDateClass: '',
            // isAllDay: scheduleData.isAllDay,
            // category: scheduleData.isAllDay ? 'allday' : 'time',
        };
        this.deleteScheduleData(schedule)
    }
    /*==========================================================*/
    /* 삭제  */
    /*==========================================================*/
    deleteScheduleData(schedule) {
        axios.post(this.props.storeState.serviceUrl + "/CmHoliDayService/DeleteScheduleData",
            schedule)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.getScheduleList();
            }).catch(function (error) {
                alert(error);
            });
    }

    onChangeSelect(ev) {
        this.setState({ view: ev.target.value });

        this.setRenderRangeText();
    }

    onClickDayname(res) {
        // view : week, day
        console.group('onClickDayname');
        console.log(res.date);
        console.groupEnd();
    }

    onClickNavi(event) {
        if (event.target.tagName === 'BUTTON') {
            const { target } = event;
            let action = target.dataset ? target.dataset.action : target.getAttribute('data-action');
            action = action.replace('move-', '');

            this.calendarInst[action]();
            this.setRenderRangeText();
        }
        this.getScheduleList();
    }

    onClickSchedule(res) {
        console.group('onClickSchedule');
        console.log('MouseEvent : ', res.event);
        console.log('Calendar Info : ', res.calendar);
        console.log('Schedule Info : ', res.schedule);
        console.groupEnd();
    }

    onClickTimezonesCollapseBtn(timezonesCollapsed) {
        // view : week, day
        console.group('onClickTimezonesCollapseBtn');
        console.log('Is Collapsed Timezone? ', timezonesCollapsed);
        console.groupEnd();

        const theme = {};
        if (timezonesCollapsed) {
            theme['week.daygridLeft.width'] = '200px';
            theme['week.timegridLeft.width'] = '200px';
        } else {
            theme['week.daygridLeft.width'] = '100px';
            theme['week.timegridLeft.width'] = '100px';
        }

        this.calendarInst.setTheme(theme);
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

    onBeforeUpdateSchedule(event) {
        const { schedule } = event;
        const { changes } = event;
        changes.body = changes.location;
        this.calendarInst.updateSchedule(schedule.id, schedule.calendarId, changes);
    }

    onBeforeCreateSchedule(scheduleData) {
        // const { calendar } = scheduleData;
        const schedule = {
            id: String(Math.random()),
            calendarId: scheduleData.calendarId,
            category: 'allday',
            title: scheduleData.title,
            location: 'scheduleData.location',
            state: 'scheduleData.state',
            start: this.getParsedDate(scheduleData.start),
            end: this.getParsedDate(scheduleData.end),
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
            // raw: {
            //     class: scheduleData.raw['class']
            // },
            // body: scheduleData.location,
            // isAllDay: false,
            // dueDateClass: '',
            // isAllDay: scheduleData.isAllDay,
            // category: scheduleData.isAllDay ? 'allday' : 'time',
        };

        // if (calendar) {
        //     schedule.calendarId = calendar.id;
        //     schedule.color = calendar.color;
        //     schedule.bgColor = calendar.bgColor;
        //     schedule.borderColor = calendar.borderColor;
        // }

        this.saveHoliDayData(schedule)

        // this.calendarInst.createSchedules([schedule]);
    }
    /*==========================================================*/
    /* 저장  */
    /*==========================================================*/
    saveHoliDayData(schedule) {
        if (schedule.title === '')
        {
            alert('[ title ] 값을 입력해 주세요.');
            return;
        }
        axios.post(this.props.storeState.serviceUrl + "/CmHoliDayService/SaveHoliDayData",
            schedule)
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getScheduleList();
        }).catch(function (error) {
            alert(error);
        });
    }
  /*==========================================================*/
    /* 날짜 변경  */
    /*==========================================================*/
    getParsedDate(strDate){
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
        date =  yyyy + "" + mm + "" + dd;
        return date.toString();
    }
    render() {
        const { dateRange, view, viewModeOptions } = this.state;
        const selectedView = view || this.props.view;

        return (<>
            <div>
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
                <Calendar
                    usageStatistics={false}
                    calendars={[
                        {
                            id: '03',
                            name: '공휴일',
                            bgColor: '#f54f3d',
                            borderColor: '#f54f3d',
                            color:'white'
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
                    useDetailPopup
                    useCreationPopup
                    view={selectedView}
                    week={{
                        showTimezoneCollapseButton: true,
                        timezonesCollapsed: false
                    }}
                    ref={this.ref}
                    // onAfterRenderSchedule={this.onAfterRenderSchedule.bind(this)}
                    // onClickDayname={this.onClickDayname.bind(this)}
                    // onClickTimezonesCollapseBtn={this.onClickTimezonesCollapseBtn.bind(this)}
                    onClickSchedule={this.onClickSchedule.bind(this)}
                    onBeforeCreateSchedule={this.onBeforeCreateSchedule.bind(this)}
                    onBeforeUpdateSchedule={this.onBeforeUpdateSchedule.bind(this)}
                    onBeforeDeleteSchedule={this.onBeforeDeleteSchedule.bind(this)}
                />
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
        }
    }
)(CalendarIndex)