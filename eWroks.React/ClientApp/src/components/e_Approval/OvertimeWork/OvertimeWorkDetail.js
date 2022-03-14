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

class OvertimeWorkDetail extends Component {
    state = {
        weeklyTimeTotal: '',
        hrOvertimeWorkDto: {
            otId: 0
            , reason: ''
            , statusCd: '01'
            , remark: ''
            , fileNm: ''
            , fileUrl: ''
            , regId: ''
            , updId: ''
        },
        hrOvertimeWorkDateDto: {
            otId: 0
            , statusCd: '01'
            , startDt: new Date()
            , startTime: new Date('9999', '12', '31', '18', '00')
            , endDt: new Date()
            , endTime: new Date('9999', '12', '31', '18', '00')
            , recogTime: '00:00'
            , dinnerTime: '0'
            , regId: ''
            , updId: ''
        },
        hrOvertimeWorkApprovalDtos: {
            approvalUser1: '',
            approvalUser1Nm: '',
            approvalUser2: '',
            approvalUser2Nm: '',
            approvalUser3: '',
            approvalUser3Nm: '',
        },
        dateGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Start Dt', field: 'startDtFullNm', minWidth: 100 },
                    { headerName: 'End Dt', field: 'endDtFullNm', minWidth: 100 },
                    { headerName: 'Dinner', field: 'dinnerTime', minWidth: 50 },
                    { headerName: 'Reqest Time', field: 'recogTimeNm', minWidth: 100 },
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
        
    }


    /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getWeeklyTimeTotal(this.state.hrOvertimeWorkDateDto.startDt, this.props.storeState.userInfo.userId);

        if (this.props.id !== '') {
            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetOvertimeWorkDetail", {
                params: {
                    otId: this.props.id
                }
            }).then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;

                var _master = data.hrOvertimeWorkDto;
                var _date = data.hrOvertimeWorkDateDto;
                var _dates = data.hrOvertimeWorkDateDtos;
                var _approvals = data.hrOvertimeWorkApprovalDtos;

                _date.startDt = new Date(_date.startDt);
                _date.startTime = new Date('9999', '12', '31', _date.startTime.substr(0, 2), _date.startTime.substr(2, 2));
                _date.endDt = new Date(_date.endDt);
                _date.endTime = new Date('9999', '12', '31', _date.endTime.substr(0, 2), _date.endTime.substr(2, 2));
                _date.recogTime = _date.recogTimeNm;

                var _approvalsObj = {
                    approvalUser1: '',
                    approvalUser1Nm: '',
                    approvalUser2: '',
                    approvalUser2Nm: '',
                    approvalUser3: '',
                    approvalUser3Nm: ''
                }

                _approvals.map((row, i) => {
                   if (row.apprCd === 'A3') {
                        _approvalsObj.approvalUser1 = '';
                        _approvalsObj.approvalUser1Nm = row.taskingUserNm;
                    }
                    else if (row.apprCd === 'A4') {
                        _approvalsObj.approvalUser2 = '';
                        _approvalsObj.approvalUser2Nm = row.taskingUserNm;
                    }
                    else if (row.apprCd === 'A5') {
                        _approvalsObj.approvalUser3 = '';
                        _approvalsObj.approvalUser3Nm = row.taskingUserNm;
                    }
                });

                this.setState({
                    hrOvertimeWorkDto: _master,
                    hrOvertimeWorkDateDto: _date,
                    dateGrid: { ...this.state.dateGrid, rowData: _dates, rowCount: _dates.length },
                    hrOvertimeWorkApprovalDtos: _approvalsObj
                }, () => {
                    this.getWeeklyTimeTotal(_date.startDt, this.props.storeState.userInfo.userId);
                })


            }).catch(function (error) {
                alert(error);
            });
        }
    }

    /*==========================================================*/
    /* 해당유저의 주 토탈 시간   */
    /*==========================================================*/
    getWeeklyTimeTotal(startDt, userId) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetWeeklyTimeTotal", {
            params: {
                startDt: this.props.storeState.getParsedDate(startDt),
                userId: userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                weeklyTimeTotal: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Save Data   */
    /*==========================================================*/
    saveOvertimeWork(e) {
        if (this.state.hrOvertimeWorkDto.reason === '') {
            alert('[ Reason ] 값을 입력해 주세요.');
            return;
        }

        // 반려상태 다시 요청이라면 상태 돌려주기
        if (this.state.hrOvertimeWorkDto.statusCd === '99') {
            this.setState({
                hrOvertimeWorkDto: {
                    ...this.state.hrOvertimeWorkDto,
                    statusCd: '01'
                }
            })
        }
        
        // 마스터 설정
        var gParam = {
            ...this.state.hrOvertimeWorkDto,
            statusCd: this.state.hrOvertimeWorkDto.statusCd === '05' 
                        ? '05'
                        : e.target.id === 'btnDraft' ? '01' : '02',
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }

        // 시간
        var gParamDate = { ...this.state.hrOvertimeWorkDateDto };
        gParamDate.startDt = this.props.storeState.getParsedDate(gParamDate.startDt);
        gParamDate.startTime = this.props.storeState.getParsedTime(gParamDate.startTime);
        gParamDate.endDt = this.props.storeState.getParsedDate(gParamDate.endDt);
        gParamDate.endTime = this.props.storeState.getParsedTime(gParamDate.endTime);
        gParamDate.recogTime = Number(gParamDate.recogTime.replaceAll(':', '.'));
        gParamDate.regId = this.props.storeState.userInfo.userId;
        gParamDate.updId = this.props.storeState.userInfo.userId;

        // 승인자 설정
        var gParamApprovals = [];

        if(this.state.hrOvertimeWorkApprovalDtos.approvalUser1 !== '') {
            gParamApprovals.push({
                otId: 0,
                apprId: 0,
                apprCd: 'A3',
                apprUserId: this.state.hrOvertimeWorkApprovalDtos.approvalUser1,
                statusCd: '01',
                mailYn: 'N',
                deleApprUserId: '',
                deleReason: '',
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        }
        if(this.state.hrOvertimeWorkApprovalDtos.approvalUser2 !== '') {
            gParamApprovals.push({
                otId: 0,
                apprId: 0,
                apprCd: 'A4',
                apprUserId: this.state.hrOvertimeWorkApprovalDtos.approvalUser2,
                statusCd: '01',
                mailYn: 'N',
                deleApprUserId: '',
                deleReason: '',
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        }
        if(this.state.hrOvertimeWorkApprovalDtos.approvalUser3 !== '') {
            gParamApprovals.push({
                otId: 0,
                apprId: 0,
                apprCd: 'A5',
                apprUserId: this.state.hrOvertimeWorkApprovalDtos.approvalUser3,
                statusCd: '01',
                mailYn: 'N',
                deleApprUserId: '',
                deleReason: '',
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            });
        }
        if(gParam.statusCd !== '05') {
            if (gParamApprovals.length === 0) {
                alert('승인자는 최소 1명이상 입니다.');
                return;
            }
        }
        var gParamGroup = {
            hrOvertimeWorkDto: gParam,
            hrOvertimeWorkDateDto: gParamDate,
            hrOvertimeWorkApprovalDtos: gParamApprovals
        }
        axios.post(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/SaveOvertimeWork",
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
            hrOvertimeWorkDto: {
                ...this.state.hrOvertimeWorkDto,
                [e.target.name]: e.target.value
            }
        });
    }

    onDateChangeHandler(name, date) {
        this.setState({
            hrOvertimeWorkDateDto: {
                ...this.state.hrOvertimeWorkDateDto,
                [name]: date,
                endDt: name === 'startTime' || name === 'endTime' ? this.state.hrOvertimeWorkDateDto.endDt : date,
            }
        }, () => {
            var row = { ...this.state.hrOvertimeWorkDateDto }
            this.getDiffTime(row);
            if (name === 'startDt') {
                this.getWeeklyTimeTotal(row.startDt, this.props.storeState.userInfo.userId);
            }
        });
    }
    onDateChangeHandler2(e) {
        this.setState({
            hrOvertimeWorkDateDto: {
                ...this.state.hrOvertimeWorkDateDto,
                [e.target.name]: e.target.value,
            }
        }, () => {
            var row = { ...this.state.hrOvertimeWorkDateDto }
            this.getDiffTime(row);
        });
    }

    onApprovalChangeHandler(e) {
        this.setState({
            hrOvertimeWorkApprovalDtos: {
                ...this.state.hrOvertimeWorkApprovalDtos,
                [e.target.name]: e.target.value
            }
        });
    }

    /*==========================================================*/
    /* 시간 차이    */
    /*==========================================================*/
    getDiffTime(row) {
        var startDay = new Date(
            this.props.storeState.getParsedDate(row.startDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.startDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.startDt, "").substr(6, 2),
            this.props.storeState.getParsedTime(row.startTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.startTime, "").substr(2, 2)
        );
        var endDay = new Date(
            this.props.storeState.getParsedDate(row.endDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.endDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.endDt, "").substr(6, 2),
            this.props.storeState.getParsedTime(row.endTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.endTime, "").substr(2, 2)
        );
        
        var hour = parseInt((endDay.getTime() - startDay.getTime()) / 1000 / 60 / 60);
        var minutes = parseInt((endDay.getTime() - startDay.getTime()) / 1000 / 60 % 60);

        var dinnerMinutes = Number(row.dinnerTime);
        
        if ((minutes - dinnerMinutes) < 0) {
            minutes =  60 + (minutes - dinnerMinutes);
            hour = hour - 1;
        }
        else {
            minutes = (minutes - dinnerMinutes);
        }


        var strHour = hour.toString().length === 1 ? "0" + hour.toString() : hour.toString();
        var strMinutes = minutes.toString().length === 1 ? "0" + minutes.toString() : minutes.toString();

        this.setState({
            hrOvertimeWorkDateDto: {
                ...this.state.hrOvertimeWorkDateDto,
                recogTime: strHour + ":" + strMinutes,
            }
        })
    }

    /*==========================================================*/
    /* 파일 업로드    */
    /*==========================================================*/
    onfileUploadClick(e) {
        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'OvertimeWork')
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

            this.setState({
                hrOvertimeWorkDto: {
                    ...this.state.hrOvertimeWorkDto,
                    fileNm: data[0].fileNm,
                    fileUrl: data[0].fileUrl,
                }
            })
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
                                {/* <Button variant="warning" id="btnDraft"
                                    onClick={this.saveOvertimeWork.bind(this)}
                                    disabled={this.state.hrOvertimeWorkDto.statusCd !== '01' ? true : false}
                                >Draft</Button>{' '} */}
                                <Button variant="success" id="btnSave"
                                    onClick={this.saveOvertimeWork.bind(this)}
                                    style={{
                                        display: this.state.hrOvertimeWorkDto.statusCd === '01' || this.state.hrOvertimeWorkDto.statusCd === '05' || this.state.hrOvertimeWorkDto.statusCd === '99'
                                        ? 'inline' : 'none'
                                    }}
                                >{
                                    this.state.hrOvertimeWorkDto.statusCd === '01' || this.state.hrOvertimeWorkDto.statusCd === '99' ? 'Save (1단계)'
                                    : this.state.hrOvertimeWorkDto.statusCd === '05' ? 'Save (2단계)'
                                    : '-'
                                }</Button>
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
                                this.state.hrOvertimeWorkDto.statusCd !== '10' && this.state.hrOvertimeWorkDto.statusCd !== '99'
                                    ? <></>
                                    : <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Comment</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="remark"
                                                className="responseRemarkBackcolor"
                                                value={this.state.hrOvertimeWorkDto.remark}
                                            />
                                        </Form.Group>
                                    </div>
                            }
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="otId"
                                        value={this.state.hrOvertimeWorkDto.otId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.hrOvertimeWorkDto.statusCd} onChange={this.onChangeHandler.bind(this)}
                                        disabled
                                    >
                                        <GDHSelectOption cdMajor="0203" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-6"></div>
                            <div className="col-md-12">
                                <Alert variant={'danger'} style={{ fontSize: 15, textAlign: 'center' }}>
                                    ★★★ Start Dt 설정 시, 9시 출근: 18:00 / 10시 출근: 19:00 시작으로 시간 설정 바랍니다. ★★★
                                </Alert>
                            </div>
                            <div className="col-md-6">
                                <div className="ag-theme-material"
                                    style={{ height: 265, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.dateGrid.columnDefs}
                                        defaultColDef={this.state.dateGrid.defaultColDef}
                                        rowData={this.state.dateGrid.rowData}
                                        enableCellTextSelection={true}
                                    // rowSelection="multiple" // single
                                    // onGridReady={params => this.gridApi = params.api}
                                    // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <Table bordered style={{ borderTop: '2px solid #695405' }}>
                                    <colgroup>
                                        <col style={{ width: 150 }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>Weekly Time Total</th>
                                            <td colSpan={2} style={{textAlign: 'center', fontSize: 15 }}>
                                                {this.state.weeklyTimeTotal}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Start Dt</th>
                                            <td>
                                                <GDHDatepicker
                                                    name='startDt'
                                                    value={this.state.hrOvertimeWorkDateDto.startDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <GDHDatepickerTime
                                                    name={1}
                                                    value={this.state.hrOvertimeWorkDateDto.startTime} onDateChange={this.onDateChangeHandler.bind(this)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>End Dt</th>
                                            <td>
                                                <GDHDatepicker
                                                    name='endDt'
                                                    value={this.state.hrOvertimeWorkDateDto.endDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <GDHDatepickerTime
                                                    name='endTime'
                                                    value={this.state.hrOvertimeWorkDateDto.endTime} onDateChange={this.onDateChangeHandler.bind(this)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Dinner</th>
                                            <td colSpan={2}>
                                                <Form.Control as="select" size="sm"
                                                    name="dinnerTime"
                                                    value={this.state.hrOvertimeWorkDateDto.dinnerTime} onChange={this.onDateChangeHandler2.bind(this)}
                                                >
                                                    <option value="0">00</option>
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                    <option value="30">30</option>
                                                    <option value="40">40</option>
                                                    <option value="50">50</option>
                                                    <option value="60">60</option>
                                                </Form.Control>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Request Time</th>
                                            <td colSpan={2} style={{ borderTop: '2px solid #695405', textAlign: 'right', fontSize: 15, fontWeight: 'bold', color: 'red' }}>
                                                {this.state.hrOvertimeWorkDateDto.recogTime}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Reason</Form.Label>
                                    <Form.Control as="textarea" rows={3} 
                                        name="reason"
                                        value={this.state.hrOvertimeWorkDto.reason} onChange={this.onChangeHandler.bind(this)}
                                    />
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
                                        <a href={this.state.hrOvertimeWorkDto.fileUrl} target={'_blank'}>
                                            {this.state.hrOvertimeWorkDto.fileNm}
                                        </a>
                                        {
                                            this.state.hrOvertimeWorkDto.fileNm !== ''
                                                ? <><>&nbsp;&nbsp;&nbsp;</>
                                                    <a href={'#'} style={{ color: 'black', fontSize: 15 }} onClick={(e) => {
                                                        e.preventDefault();
                                                        this.setState({
                                                            hrOvertimeWorkDto: {
                                                                ...this.state.hrOvertimeWorkDto,
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
                            <div className="col-md-12" style={{ marginTop: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ Part Leader</Form.Label>
                                    {
                                        this.state.hrOvertimeWorkDto.statusCd === '01'
                                            ? <Form.Control as="select"
                                                name="approvalUser1"
                                                value={this.state.hrOvertimeWorkApprovalDtos.approvalUser1}
                                                onChange={this.onApprovalChangeHandler.bind(this)}>
                                                <GDHApprovalSelectOption approvalGb="01" approvalCd="A3" isEmpty={true} isEmptyText="=== Select ===" />
                                            </Form.Control>
                                            :
                                            <Form.Control type="text" size="sm"
                                                name="approvalUser1Nm"
                                                value={this.state.hrOvertimeWorkApprovalDtos.approvalUser1Nm}
                                                readOnly
                                            />
                                    }
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Team Manager</Form.Label>
                                    {
                                        this.state.hrOvertimeWorkDto.statusCd === '01'
                                            ? <Form.Control as="select"
                                                name="approvalUser2"
                                                value={this.state.hrOvertimeWorkApprovalDtos.approvalUser2}
                                                onChange={this.onApprovalChangeHandler.bind(this)}>
                                                <GDHApprovalSelectOption approvalGb="01" approvalCd="A4" isEmpty={true} isEmptyText="=== Select ===" />
                                            </Form.Control>
                                            :
                                            <Form.Control type="text" size="sm"
                                                name="approvalUser2Nm"
                                                value={this.state.hrOvertimeWorkApprovalDtos.approvalUser2Nm}
                                                readOnly
                                            />
                                    }
                                    
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ CS / Lab Manager</Form.Label>
                                    {
                                        this.state.hrOvertimeWorkDto.statusCd === '01'
                                            ? <Form.Control as="select"
                                                name="approvalUser3"
                                                value={this.state.hrOvertimeWorkApprovalDtos.approvalUser3}
                                                onChange={this.onApprovalChangeHandler.bind(this)}>
                                                <GDHApprovalSelectOption approvalGb="01" approvalCd="A5" isEmpty={true} isEmptyText="=== Select ===" />
                                            </Form.Control>
                                            :
                                            <Form.Control type="text" size="sm"
                                                name="approvalUser3Nm"
                                                value={this.state.hrOvertimeWorkApprovalDtos.approvalUser3Nm}
                                                readOnly
                                            />
                                    }
                                    
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Body>
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
)(OvertimeWorkDetail)
