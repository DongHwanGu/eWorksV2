import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import GDHApprovalSelectOption from '../../common/approval/GDHApprovalSelectOption';
import UserCommuteList from '../../Resistration/UserMgmt/UserCommuteList';


class CbTimeSheetRecordList extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,
        registerDt: new Date(),
        statusCd: "",
        weeklyWorkTime: '',
        monthWorkTime: '',
        masterGrid: {
            columnDefs:
                [
                    { headerName: '상태', field: 'statusCdNm', minWidth: 100 },
                    { headerName: '등록일', field: 'registerDt', minWidth: 100 },
                    { headerName: '출근', field: 'commuteStartDtFullNm', minWidth: 150 },
                    { headerName: '퇴근', field: 'commuteEndDtFullNm', minWidth: 150 },
                    { headerName: '휴계', field: 'restTime', minWidth: 100 },
                    { headerName: '아간휴계', field: 'nightRestTime', minWidth: 100 },
                    { headerName: 'HI', field: 'hiTime', minWidth: 100 },
                    { headerName: 'MS/Tank', field: 'msTankTime', minWidth: 100 },
                    { headerName: 'IRT', field: 'irtTime', minWidth: 100 },
                    { headerName: 'AA', field: 'aaTime', minWidth: 100 },
                    { headerName: 'Agri', field: 'agriTime', minWidth: 100 },
                    { headerName: 'Min', field: 'minTime', minWidth: 100 },
                    { headerName: 'RoHS', field: 'rohsTime', minWidth: 100 },
                    { headerName: '근무시간', field: 'workTime', minWidth: 100 },
                    { headerName: '승인자', field: 'apprUserIdNm', minWidth: 100 },
                    { headerName: 'Comment', field: 'remark', minWidth: 100 },
                    { headerName: '작업내역', field: 'reason', minWidth: 100 },
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
        modalDateShow: false,
        otherWorkTime: "00:00",
        cbTimeSheetDto: {
            timeId: 0
            , registerDt: new Date()
            , commuteStartDt: new Date()
            , commuteStartTime: new Date()
            , commuteEndDt: new Date()
            , commuteEndTime: new Date()
            , restTime: new Date()
            , nightRestTime: new Date()
            , hiTime: new Date()
            , msTankTime: new Date()
            , irtTime: new Date()
            , aaTime: new Date()
            , agriTime: new Date()
            , minTime: new Date()
            , rohsTime: new Date()
            , workTime: ''
            , workRate: 0
            , statusCd: 'New'
            , reason: ''
            , remark: ''
            , regId: ''
            , updId: ''
        },
        cbTimeSheetApprovalDtos: {
            approvalUser1: '',
            approvalUser1Nm: ''
        }
    }

    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getCbTimeSheetList();
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getCbTimeSheetList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetCbTimeSheetList", {
            params: {
                registerDt: this.props.storeState.getParsedDate(this.state.registerDt),
                statusCd: this.state.statusCd,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            })
            if(data.length > 0) {
                this.setState({
                    weeklyWorkTime: data[0].weeklyWorkTime,
                    monthWorkTime: data[0].monthWorkTime
                })
            }
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({
            modalDateShow: true,
            otherWorkTime: "00:00",
            cbTimeSheetDto: {
                timeId: 0
                , registerDt: new Date()
                , commuteStartDt: new Date()
                , commuteStartTime: new Date('9999', '12', '31', '09', '00')
                , commuteEndDt: new Date()
                , commuteEndTime: new Date('9999', '12', '31', '18', '00')
                , restTime: new Date('9999', '12', '31', '00', '00')
                , nightRestTime: new Date('9999', '12', '31', '00', '00')
                , hiTime: new Date('9999', '12', '31', '00', '00')
                , msTankTime: new Date('9999', '12', '31', '00', '00')
                , irtTime: new Date('9999', '12', '31', '00', '00')
                , aaTime: new Date('9999', '12', '31', '00', '00')
                , agriTime: new Date('9999', '12', '31', '00', '00')
                , minTime: new Date('9999', '12', '31', '00', '00')
                , rohsTime: new Date('9999', '12', '31', '00', '00')
                , workTime: '09:00'
                , workRate: 0
                , statusCd: 'New'
                , reason: ''
                , remark: ''
                , regId: ''
                , updId: ''
            },
            cbTimeSheetApprovalDtos: {
                approvalUser1: '',
                approvalUser1Nm: ''
            }
        })
    }

    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    saveCbTimeSheet() {
        this.setState({
            cbTimeSheetDto : {
                ...this.state.cbTimeSheetDto,
                statusCd: 'New'
            }
        })
        // 마스터 설정
        var gParam = { ...this.state.cbTimeSheetDto };
        gParam.registerDt = this.props.storeState.getParsedDate(gParam.registerDt);
        gParam.commuteStartDt = this.props.storeState.getParsedDate(gParam.commuteStartDt);
        gParam.commuteStartTime = this.props.storeState.getParsedTime(gParam.commuteStartTime);
        gParam.commuteEndDt = this.props.storeState.getParsedDate(gParam.commuteEndDt);
        gParam.commuteEndTime = this.props.storeState.getParsedTime(gParam.commuteEndTime);
        gParam.restTime = this.props.storeState.getParsedTime(gParam.restTime);
        gParam.nightRestTime = this.props.storeState.getParsedTime(gParam.nightRestTime);
        gParam.hiTime = this.props.storeState.getParsedTime(gParam.hiTime);
        gParam.msTankTime = this.props.storeState.getParsedTime(gParam.msTankTime);
        gParam.irtTime = this.props.storeState.getParsedTime(gParam.irtTime);
        gParam.aaTime = this.props.storeState.getParsedTime(gParam.aaTime);
        gParam.agriTime = this.props.storeState.getParsedTime(gParam.agriTime);
        gParam.minTime = this.props.storeState.getParsedTime(gParam.minTime);
        gParam.rohsTime = this.props.storeState.getParsedTime(gParam.rohsTime);
        gParam.workTime = gParam.workTime.replace(':', '');
        gParam.regId = this.props.storeState.userInfo.userId;
        gParam.updId = this.props.storeState.userInfo.userId;

        var gParamApprovals = [];
        gParamApprovals.push({
            timeId: 0,
            apprId: 0,
            apprCd: 'A2',
            apprUserId: this.state.cbTimeSheetApprovalDtos.approvalUser1,
            statusCd: '01',
            mailYn: 'N',
            deleApprUserId: '',
            deleReason: '',
            remark: '',
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId
        });
        if (gParam.workRate !== 100) {
            alert('근무비율을 100% 설정 후 진행해 주세요.');
            return;
        }
        if (this.state.cbTimeSheetApprovalDtos.approvalUser1 === '') {
            alert('승인자가 설정되지 않았습니다.');
            return;
        }
        var gParamGroup = {
            cbTimeSheetDto: gParam,
            cbTimeSheetApprovalDtos: gParamApprovals
        }
        axios.post(this.props.storeState.serviceUrl + "/CbTimeSheetService/SaveCbTimeSheet",
            gParamGroup)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalDateShow: false
                })
                this.getCbTimeSheetList();

            }).catch(function (error) {
                alert(error);
            });

    }
    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].timeId;

        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetCbTimeSheetDetail", {
            params: {
                timeId: id
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;

            this.setState({
                modalDateShow: true,
                cbTimeSheetDto: {
                    ...this.state.cbTimeSheetDto
                    , timeId: data.cbTimeSheetDto.timeId
                    , registerDt: new Date(data.cbTimeSheetDto.registerDt)
                    , commuteStartDt: new Date(data.cbTimeSheetDto.commuteStartDt)
                    , commuteStartTime: new Date('9999', '12', '31', data.cbTimeSheetDto.commuteStartTime.substr(0, 2), data.cbTimeSheetDto.commuteStartTime.substr(3, 2))
                    , commuteEndDt:  new Date(data.cbTimeSheetDto.commuteEndDt)
                    , commuteEndTime: new Date('9999', '12', '31', data.cbTimeSheetDto.commuteEndTime.substr(0, 2), data.cbTimeSheetDto.commuteEndTime.substr(3, 2))
                    , restTime: new Date('9999', '12', '31', data.cbTimeSheetDto.restTime.substr(0, 2), data.cbTimeSheetDto.restTime.substr(3, 2))
                    , nightRestTime: new Date('9999', '12', '31', data.cbTimeSheetDto.nightRestTime.substr(0, 2), data.cbTimeSheetDto.nightRestTime.substr(3, 2))
                    , hiTime: new Date('9999', '12', '31', data.cbTimeSheetDto.hiTime.substr(0, 2), data.cbTimeSheetDto.hiTime.substr(3, 2))
                    , msTankTime: new Date('9999', '12', '31', data.cbTimeSheetDto.msTankTime.substr(0, 2), data.cbTimeSheetDto.msTankTime.substr(3, 2))
                    , irtTime: new Date('9999', '12', '31', data.cbTimeSheetDto.irtTime.substr(0, 2), data.cbTimeSheetDto.irtTime.substr(3, 2))
                    , aaTime: new Date('9999', '12', '31', data.cbTimeSheetDto.aaTime.substr(0, 2), data.cbTimeSheetDto.aaTime.substr(3, 2))
                    , agriTime: new Date('9999', '12', '31', data.cbTimeSheetDto.agriTime.substr(0, 2), data.cbTimeSheetDto.agriTime.substr(3, 2))
                    , minTime: new Date('9999', '12', '31', data.cbTimeSheetDto.minTime.substr(0, 2), data.cbTimeSheetDto.minTime.substr(3, 2))
                    , rohsTime: new Date('9999', '12', '31', data.cbTimeSheetDto.rohsTime.substr(0, 2), data.cbTimeSheetDto.rohsTime.substr(3, 2))
                    , workTime: data.cbTimeSheetDto.workTime.substr(0, 2) + ":" + data.cbTimeSheetDto.workTime.substr(3, 2)
                    , workRate: data.cbTimeSheetDto.workRate
                    , statusCd: data.cbTimeSheetDto.statusCd
                    , reason: data.cbTimeSheetDto.reason
                    , remark: data.cbTimeSheetDto.remark
                    , regId: data.cbTimeSheetDto.regId
                    , updId: data.cbTimeSheetDto.updId
                },
                cbTimeSheetApprovalDtos: {
                    approvalUser1: '',
                    approvalUser1Nm: data.cbTimeSheetApprovalDtos[0].apprUserIdNm
                }
            }, () => {
                
                var row = { ...this.state.cbTimeSheetDto }
                this.getDiffTime(row);
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
    onModalChangeHandler(e) {
        this.setState({
            cbTimeSheetDto: {
                ...this.state.cbTimeSheetDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onModalApprovalChangeHandler(e) {
        this.setState({
            cbTimeSheetApprovalDtos: {
                ...this.state.cbTimeSheetApprovalDtos,
                [e.target.name]: e.target.value
            }
        });
    }
    onModalDateChangeHandler(name, date) {
        if (
            name === 'commuteStartTime' ||
            name === 'commuteEndTime' ||
            name === 'restTime' ||
            name === 'nightRestTime' ||
            name === 'hiTime' ||
            name === 'msTankTime' ||
            name === 'irtTime' ||
            name === 'aaTime' ||
            name === 'agriTime' ||
            name === 'minTime' ||
            name === 'rohsTime'
        ) {
            if (date.getMinutes() % 10 !== 0) {
                date = new Date('9999', '12', '31', '00', '00');
            }
        }
        this.setState({
            cbTimeSheetDto: {
                ...this.state.cbTimeSheetDto,
                [name]: date
            }
        }, () => {
            var row = { ...this.state.cbTimeSheetDto }
            this.getDiffTime(row);
        });
    }
    /*==========================================================*/
    /* 시간 차이    */
    /*==========================================================*/
    async getDiffTime(row) {
        var startDay = new Date(
            this.props.storeState.getParsedDate(row.commuteStartDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.commuteStartDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.commuteStartDt, "").substr(6, 2),
            this.props.storeState.getParsedTime(row.commuteStartTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.commuteStartTime, "").substr(2, 2)
        );
        var endDay = new Date(
            this.props.storeState.getParsedDate(row.commuteEndDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.commuteEndDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.commuteEndDt, "").substr(6, 2),
            this.props.storeState.getParsedTime(row.commuteEndTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.commuteEndTime, "").substr(2, 2)
        );
        
        var hour = parseInt((endDay.getTime() - startDay.getTime()) / 1000 / 60 / 60);
        var minutes = parseInt((endDay.getTime() - startDay.getTime()) / 1000 / 60 % 60);

        var restHour = this.state.cbTimeSheetDto.restTime.getHours();
        var restMinutes = this.state.cbTimeSheetDto.restTime.getMinutes();

        if ((minutes - restMinutes) < 0) {
            minutes =  60 + (minutes - restMinutes);
            hour = hour - (restHour + 1);
        }
        else {
            minutes = (minutes - restMinutes);
            hour = hour - restHour;
        }

        var nightRestHour = this.state.cbTimeSheetDto.nightRestTime.getHours();
        var nightRestMinutes = this.state.cbTimeSheetDto.nightRestTime.getMinutes();

        if ((minutes - nightRestMinutes) < 0) {
            minutes =  60 + (minutes - nightRestMinutes);
            hour = hour - (nightRestHour + 1);
        }
        else {
            minutes = (minutes - nightRestMinutes);
            hour = hour - nightRestHour;
        }

        var strHour = hour.toString().length === 1 ? "0" + hour.toString() : hour.toString();
        var strMinutes = minutes.toString().length === 1 ? "0" + minutes.toString() : minutes.toString();

        ////////////////////////////////////////////////////////////////////////////////////////////////
        
        var hiHour = this.state.cbTimeSheetDto.hiTime.getHours();
        var hiMinutes = this.state.cbTimeSheetDto.hiTime.getMinutes();
        var msTankHour = this.state.cbTimeSheetDto.msTankTime.getHours();
        var msTankMinutes = this.state.cbTimeSheetDto.msTankTime.getMinutes();
        var irtHour = this.state.cbTimeSheetDto.irtTime.getHours();
        var irtMinutes = this.state.cbTimeSheetDto.irtTime.getMinutes();
        var aaHour = this.state.cbTimeSheetDto.aaTime.getHours();
        var aaMinutes = this.state.cbTimeSheetDto.aaTime.getMinutes();
        var agriHour = this.state.cbTimeSheetDto.agriTime.getHours();
        var agriMinutes = this.state.cbTimeSheetDto.agriTime.getMinutes();
        var minHour = this.state.cbTimeSheetDto.minTime.getHours();
        var minMinutes = this.state.cbTimeSheetDto.minTime.getMinutes();
        var rohsHour = this.state.cbTimeSheetDto.rohsTime.getHours();
        var rohsMinutes = this.state.cbTimeSheetDto.rohsTime.getMinutes();

        var otherHour = parseInt((hiHour + msTankHour + irtHour + aaHour + agriHour + minHour + rohsHour) +
            ((hiMinutes + msTankMinutes + irtMinutes + aaMinutes + agriMinutes + minMinutes + rohsMinutes) / 60))
        var otherMinutes = parseInt((hiMinutes + msTankMinutes + irtMinutes + aaMinutes + agriMinutes + minMinutes + rohsMinutes) % 60);

        var strOtherHour = otherHour.toString().length === 1 ? "0" + otherHour.toString() : otherHour.toString();
        var strOtherMinutes = otherMinutes.toString().length === 1 ? "0" + otherMinutes.toString() : otherMinutes.toString();
        
        ////////////////////////////////////////////////////////////////////////////////////////////////

        var intWrokRate = parseInt(strOtherHour + strOtherMinutes) / parseInt(strHour + strMinutes);
        intWrokRate = parseInt(intWrokRate * 100);

        this.setState({
            otherWorkTime: strOtherHour + ":" + strOtherMinutes,
            cbTimeSheetDto: {
                ...this.state.cbTimeSheetDto,
                workTime: strHour + ":" + strMinutes,
                workRate: intWrokRate
            }
        })
    }
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="list" title="List" >
                    <div style={{ marginTop: 15 }}>
                        <Card>
                            <Card.Header>
                                <Form>
                                    <Form.Row>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ 등록일</Form.Label>
                                                <GDHDatepicker
                                                    name='registerDt'
                                                    value={this.state.registerDt} onDateChange={this.onDateChange.bind(this)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="statusCd"
                                                    value={this.state.statusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0060" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                            <Button variant="primary" onClick={this.getCbTimeSheetList.bind(this)}>Search</Button>
                                        </div>
                                    </Form.Row>
                                </Form>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                <Table striped bordered style={{ width: '100%', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
                                    <tbody>
                                        <tr style={{ backgroundColor: '#d9edf7' }}>
                                            <td>주당 근로 시간</td>
                                            <td>월 근로 시간</td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.weeklyWorkTime === null ? "00:00" : this.state.weeklyWorkTime}</td>
                                            <td>{this.state.monthWorkTime === null ? "00:00" : this.state.monthWorkTime}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div className="ag-theme-material"
                                    style={{ height: 600, borderTop: '2px solid #695405' }}
                                >
                                    
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.masterGrid.columnDefs}
                                        defaultColDef={this.state.masterGrid.defaultColDef}
                                        rowData={this.state.masterGrid.rowData}
                                        rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                            </Card.Footer>
                        </Card>
                    </div>
                </Tab>
                <Tab eventKey="commute" title="Commute">
                    <div style={{ marginTop: 15 }}>
                        <UserCommuteList />
                    </div>
                </Tab>
            </Tabs>

            {/* Modal */}
            <Modal show={this.state.modalDateShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" 
                            disabled={this.state.cbTimeSheetDto.statusCd === 'New' || this.state.cbTimeSheetDto.statusCd === '99' ? false : true}
                        onClick={this.saveCbTimeSheet.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalDateShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-4" style={{ border: '1px solid #ddd', padding: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ 출근</Form.Label>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <GDHDatepicker
                                                        name='commuteStartDt'
                                                        value={this.state.cbTimeSheetDto.commuteStartDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                                    />
                                                </td>
                                                <td>
                                                    <GDHDatepickerTime
                                                        name='commuteStartTime'
                                                        value={this.state.cbTimeSheetDto.commuteStartTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 퇴근</Form.Label>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <GDHDatepicker
                                                        name='commuteEndDt'
                                                        value={this.state.cbTimeSheetDto.commuteEndDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                                    />
                                                </td>
                                                <td>
                                                    <GDHDatepickerTime
                                                        name='commuteEndTime'
                                                        value={this.state.cbTimeSheetDto.commuteEndTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 휴게</Form.Label>
                                    <GDHDatepickerTime
                                        name='restTime'
                                        value={this.state.cbTimeSheetDto.restTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 야간 휴게</Form.Label>
                                    <GDHDatepickerTime
                                        name='nightRestTime'
                                        value={this.state.cbTimeSheetDto.nightRestTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Alert key={1} variant={'danger'}>
                                        "야간 휴게"는 야간근무 22:00 ~ 06:00 중 휴게 시간이고 그 외 휴게는 모두 "휴게"로 넣어주세요.
                                    </Alert>
                                </Form.Group>
                            </div>
                            <div className="col-md-4" style={{ border: '1px solid #ddd', padding: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ HI</Form.Label>
                                    <GDHDatepickerTime
                                        name='hiTime'
                                        value={this.state.cbTimeSheetDto.hiTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ MS/Tank</Form.Label>
                                    <GDHDatepickerTime
                                        name='msTankTime'
                                        value={this.state.cbTimeSheetDto.msTankTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ IRT</Form.Label>
                                    <GDHDatepickerTime
                                        name='irtTime'
                                        value={this.state.cbTimeSheetDto.irtTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ AA</Form.Label>
                                    <GDHDatepickerTime
                                        name='aaTime'
                                        value={this.state.cbTimeSheetDto.aaTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ Agri</Form.Label>
                                    <GDHDatepickerTime
                                        name='agriTime'
                                        value={this.state.cbTimeSheetDto.agriTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4" style={{ border: '1px solid #ddd', padding: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ Min</Form.Label>
                                    <GDHDatepickerTime
                                        name='minTime'
                                        value={this.state.cbTimeSheetDto.minTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ RoHS</Form.Label>
                                    <GDHDatepickerTime
                                        name='rohsTime'
                                        value={this.state.cbTimeSheetDto.rohsTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 작업내역</Form.Label>
                                    <Form.Control as="textarea" rows={7} 
                                        name="reason"
                                        value={this.state.cbTimeSheetDto.reason} onChange={this.onModalChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '3px double #aaa' }}>
                                            <td style={{ textAlign: 'right', color: 'green', fontWeight: 'bold', padding: '10px 0px' }}>
                                                <span>(근무시간) </span>
                                                <span style={{ color: 'red', fontSize: 15 }}>
                                                    {this.state.cbTimeSheetDto.workTime}
                                                </span>
                                                <span style={{ fontSize: 15 }}> / </span>
                                                <span>(HI + MS/Tank + IRT + AA + Agri + Min + RoHS) </span>
                                                <span style={{ color: 'red', fontSize: 15 }}>
                                                    {this.state.otherWorkTime}
                                                </span>
                                                <span style={{ fontSize: 15 }}> = </span>
                                                <span style={{ color: 'red', fontSize: 15 }}>
                                                    {this.state.cbTimeSheetDto.workRate}%
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 0px' }}>
                                                <span>(주당근무시간) </span>
                                                <span>09 : 00</span>
                                                <span> + </span>
                                                <span>(HI + MS/Tank + IRT + AA + Agri + Min + RoHS) </span>
                                                <span>{this.state.otherWorkTime}</span>
                                                <span> = </span>
                                                <span>11 : 11</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ 승인자</Form.Label>
                                    {
                                        this.state.cbTimeSheetDto.statusCd === 'New'
                                            ? <Form.Control as="select" size="sm"
                                                name="approvalUser1"
                                                value={this.state.cbTimeSheetApprovalDtos.approvalUser1}
                                                onChange={this.onModalApprovalChangeHandler.bind(this)}>
                                                <GDHApprovalSelectOption approvalGb="01" approvalCd="A2" isEmpty={true} isEmptyText="=== Select ===" />
                                            </Form.Control>
                                            :
                                            <Form.Control type="text" size="sm"
                                                name="approvalUser1Nm"
                                                value={this.state.cbTimeSheetApprovalDtos.approvalUser1Nm}
                                                readOnly
                                            />
                                    }
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Comment</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        className="responseRemarkBackcolor"
                                        value={this.state.cbTimeSheetDto.remark}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
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
)(CbTimeSheetRecordList)
