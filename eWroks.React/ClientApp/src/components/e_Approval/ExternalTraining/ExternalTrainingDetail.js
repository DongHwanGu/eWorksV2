import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { InputGroup, Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Accordion } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';

import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';

import moment from 'moment';

class ExternalTrainingDetail extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        hrExternalTrainingDto: {
            trainingId: 0,
            userId: '',
            trainingGb: '01',
            trainingNm: '',
            subject: '',
            institution: '',
            reason: '',
            paymentDt: null,
            paymentMethod: '',
            trainingAmt: 0,
            insReturnYn: 'Y',
            returnAmt: 0,
            bankCd: '',
            paymentRegDt: '',
            accountNo: '',
            statusCd: '01',
            remark: '',
            regId: '',
            updId: '',
            dtlFileNm: '',
            dtlFileUrl: '',
            listFileNm: '',
            listFileUrl: '',

            statusCdNm: '',
            trainingGbNm: '',
            regIdNm: '',
            regIdDeptFullNm: '',
            trainingAmtNm: "0",
            returnAmtNm: "0",
        },
        hrExternalTrainingDateDtos: {
            trainingId: 0,
            dateId: 0,
            startDt: new Date(),
            startTime: new Date(),
            endDt: new Date(),
            endTime: new Date(),
            totalHours: '',
            remark: '',
            regId: '',
            updId: ''
        },
        hrExternalTrainingApprovalDtos: {
            b1: [],
            b3: [],
            b4: [],
            b5: [],
        },
        modalDateShow: false,
        dateGrid: {
            columnDefs:
                [
                    { headerName: '교육시작일', field: 'startDt', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: '시간', field: 'startTime', minWidth: 100 },
                    { headerName: '교육종료일', field: 'endDt', minWidth: 100 },
                    { headerName: '시간', field: 'endTime', minWidth: 100 },
                    { headerName: '요청시간', field: 'totalHours', minWidth: 100 },
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
        if (this.props.id !== '') {
            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/HrExternalTrainingService/GetExternalTrainingDetail", {
                params: {
                    trainingId: this.props.id
                }
            }).then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;

                var _master = data.hrExternalTrainingDto;
                var _dates = data.hrExternalTrainingDateDtos;
                var _approvals = data.hrExternalTrainingApprovalDtos;

                // 시간
                var dateList = [];
                _dates.map((row, i) => {
                    row.id = row.dateId;
                    dateList.push(row);
                });

                // 승인자
                var b1List = [];
                var b3List = [];
                var b4List = [];
                var b5List = [];

                _approvals.map((row, i) => {
                    if (row.apprCd === 'B1') {
                        b1List.push(row);
                    }
                    else if (row.apprCd === 'B3') {
                        b3List.push(row);
                    }
                    else if (row.apprCd === 'B4') {
                        b4List.push(row);
                    }
                    else if (row.apprCd === 'B5') {
                        b5List.push(row);
                    }
                });

                this.setState({
                    hrExternalTrainingDto: _master,
                    dateGrid: { ...this.state.dateGrid, rowData: dateList, rowCount: dateList.length },
                    hrExternalTrainingApprovalDtos: { ...this.state.hrExternalTrainingApprovalDtos, b1: b1List, b3: b3List, b4: b4List, b5: b5List }
                })


            }).catch(function (error) {
                alert(error);
            });
        }
    }

    /*==========================================================*/
	/* 날짜 추가    */
	/*==========================================================*/
    onClickDateAdd() {
        // if (this.state.dateGrid.rowData.length === 3) {
        //     alert('날짜는 최대 3줄만 설정 할 수 있습니다.');
        //     return;
        // }
        this.setState({
            modalDateShow: true,
            hrExternalTrainingDateDtos: { ...this.state.hrExternalTrainingDateDtos, 
                trainingId: 0,
                dateId: 0,
                startDt: new Date(),
                startTime: new Date('9999', '12', '31', '09', '00'),
                endDt: new Date(),
                endTime: new Date('9999', '12', '31', '18', '00'),
                totalHours: '9:00',
                remark: '',
                regId: '',
                updId: ''
            }
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
        var _dateId = this.state.hrExternalTrainingDateDtos.dateId > 0 
            ? this.state.hrExternalTrainingDateDtos.dateId
            : arrDateId.length === 0 ? 100 : Math.max.apply(null, arrDateId) + 1
        
        // 저장전 날짜 확인
        var tStartDt = this.props.storeState.getParsedDate(this.state.hrExternalTrainingDateDtos.startDt, "")
            + this.props.storeState.getParsedTime(this.state.hrExternalTrainingDateDtos.startTime, "");
        var tEndDt = this.props.storeState.getParsedDate(this.state.hrExternalTrainingDateDtos.endDt, "")
            + this.props.storeState.getParsedTime(this.state.hrExternalTrainingDateDtos.endTime, "");
        
        if (tStartDt > tEndDt)
        {
            alert('종료일은 시작일보다 작을 수 없습니다.');
            return;
        }
        
        // Update
        if (this.state.hrExternalTrainingDateDtos.dateId > 0) {
            var objDate = { ...this.state.hrExternalTrainingDateDtos };
            rows.map((row, i) => {
                if (row.dateId === _dateId)
                {
                    row.startDt = this.props.storeState.getParsedDate(objDate.startDt, "-");
                    row.startTime = this.props.storeState.getParsedTime(objDate.startTime, ":");
                    row.endDt = this.props.storeState.getParsedDate(objDate.endDt, "-");
                    row.endTime = this.props.storeState.getParsedTime(objDate.endTime, ":");
                    row.totalHours = objDate.totalHours;
                }
            })
        }
        else {
            var objDate = {
                trainingId: this.state.hrExternalTrainingDateDtos.trainingId,
                dateId: _dateId,
                startDt: this.props.storeState.getParsedDate(this.state.hrExternalTrainingDateDtos.startDt, "-"),
                startTime: this.props.storeState.getParsedTime(this.state.hrExternalTrainingDateDtos.startTime, ":"),
                endDt: this.props.storeState.getParsedDate(this.state.hrExternalTrainingDateDtos.endDt, "-"),
                endTime: this.props.storeState.getParsedTime(this.state.hrExternalTrainingDateDtos.endTime, ":"),
                totalHours: this.state.hrExternalTrainingDateDtos.totalHours,
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId
            }
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
	/* 날짜 삭제    */
	/*==========================================================*/
    onClickDateDelete() {
        var deleteRows = this.gridDateApi.getSelectedRows();
        if (deleteRows.length === 0)
        {
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
	/* 승인테이블 더블클릭    */
	/*==========================================================*/
    onDateRowDoubleClicked(e) {
        this.setState({
            modalDateShow: true,
            hrExternalTrainingDateDtos: {
                ...this.state.hrExternalTrainingDateDtos,
                trainingId: e.data.trainingId,
                dateId: e.data.dateId,
                startDt: new Date(e.data.startDt),
                startTime: new Date('9999', '12', '31', e.data.startTime.substr(0, 2), e.data.startTime.substr(3, 2)),
                endDt: new Date(e.data.endDt),
                endTime: new Date('9999', '12', '31', e.data.endTime.substr(0, 2), e.data.endTime.substr(3, 2)),
                totalHours: e.data.totalHours
            }
        })
    }

    /*==========================================================*/
	/* 시간 차이    */
	/*==========================================================*/
    getDiffTime(row) {
        var start = new Date(
            this.props.storeState.getParsedDate(row.startDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.startDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.startDt, "").substr(6, 2),
            this.props.storeState.getParsedTime(row.startTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.startTime, "").substr(2, 2)
        );
        var end = new Date(
            this.props.storeState.getParsedDate(row.endDt, "").substr(0, 4),
            Number(this.props.storeState.getParsedDate(row.endDt, "").substr(4, 2)) - 1,
            this.props.storeState.getParsedDate(row.endDt, "").substr(6, 2),
            this.props.storeState.getParsedTime(row.endTime, "").substr(0, 2),
            this.props.storeState.getParsedTime(row.endTime, "").substr(2, 2)
        );

        var gap = end.getTime() - start.getTime();

        var hour = parseInt(gap / 1000 / 60 / 60);
        var min = gap / 1000 / 60 % 60;

        this.setState({
            hrExternalTrainingDateDtos: {
                ...this.state.hrExternalTrainingDateDtos,
                totalHours: hour.toString() + ":" + ("00" + min.toString()).slice(-2)
            }
        })
    }
    /*==========================================================*/
	/* 저장    */
	/*==========================================================*/
    saveExternalTraining(e) {
        if (this.state.hrExternalTrainingDto.trainingNm === '')
        {
            alert('[ 교육명 ] 값을 입력해 주세요.');
            return;
        }
        // 마스터 설정
        var gParam = {
            ...this.state.hrExternalTrainingDto,
            userId: this.props.storeState.userInfo.userId,
            trainingAmt: Number(this.state.hrExternalTrainingDto.trainingAmtNm.replaceAll(',', '')),
            returnAmt: Number(this.state.hrExternalTrainingDto.returnAmtNm.replaceAll(',', '')),
            paymentDt: this.state.hrExternalTrainingDto.paymentDt === null ? '' 
                        : this.props.storeState.getParsedDate(this.state.hrExternalTrainingDto.paymentDt, ""),
            statusCd: e.target.id === 'btnDraft' ? '01' : '03',
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }

        // 날짜 설정
        if (this.state.dateGrid.rowData.length === 0)
        {
            alert('[ Date ] 값을 입력해 주세요.');
            return;
        } 
        var gParamDates = [ ...this.state.dateGrid.rowData ];
        gParamDates.map((row, i) => {
            row.startDt = this.props.storeState.getParsedDate(row.startDt);
            row.startTime = this.props.storeState.getParsedTime(new Date('9999', '12', '31', row.startTime.substr(0, 2), row.startTime.substr(3, 2)));
            row.endDt = this.props.storeState.getParsedDate(row.endDt);
            row.endTime = this.props.storeState.getParsedTime(new Date('9999', '12', '31', row.endTime.substr(0, 2), row.endTime.substr(3, 2)));
            row.totalHours = row.totalHours;
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });
        
        // 승인자 설정
        var gParamApprovals = [];
        this.state.hrExternalTrainingApprovalDtos.b1.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        }); 
        this.state.hrExternalTrainingApprovalDtos.b3.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        }); 
        this.state.hrExternalTrainingApprovalDtos.b4.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        }); 
        this.state.hrExternalTrainingApprovalDtos.b5.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        });
        if (gParamApprovals.length === 0)
        {
            alert('승인자는 최소 1명이상 입니다.');
            return;
        } 
        var gParamGroup = {
            hrExternalTrainingDto: gParam,
            hrExternalTrainingDateDtos: gParamDates,
            hrExternalTrainingApprovalDtos: gParamApprovals
        }
        axios.post(this.props.storeState.serviceUrl + "/HrExternalTrainingService/SaveExternalTraining",
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
            hrExternalTrainingDto : {
                ...this.state.hrExternalTrainingDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeCommaHandler(e) {
        var strNumber = Number(e.target.value.replaceAll(",", ""))
        
        this.setState({
            hrExternalTrainingDto : {
                ...this.state.hrExternalTrainingDto,
                [e.target.name]: isNaN(strNumber) ? '0' : strNumber.toString()
            }
        });
    }
    onDateChangeHandler(name, date) {
        this.setState({
            hrExternalTrainingDto: {
                ...this.state.hrExternalTrainingDto,
                [name]: date
            }
        });
    }
    onModalDateChangeHandler(name, date) {
        this.setState({
            hrExternalTrainingDateDtos: {
                ...this.state.hrExternalTrainingDateDtos,
                [name]: date
            }
        }, () => {
            var row = { ...this.state.hrExternalTrainingDateDtos }
            this.getDiffTime(row);
        });
    }

    /*==========================================================*/
	/* 파일 업로드    */
	/*==========================================================*/
    onfileUploadClick(e) {
        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'ExternalTraining')
        frmFiles.append('userId', this.props.storeState.userInfo.userId)

        axios.post(this.props.storeState.serviceUrl + "/CommonService/UploadFiels", frmFiles, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                hrExternalTrainingDto: {
                    ...this.state.hrExternalTrainingDto,
                    dtlFileNm: data[0].fileNm,
                    dtlFileUrl: data[0].fileUrl,
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
            case "B1":
                this.setState({
                    hrExternalTrainingApprovalDtos: { ...this.state.hrExternalTrainingApprovalDtos, b1: data }
                })
                break;
            case "B3":
                this.setState({
                    hrExternalTrainingApprovalDtos: { ...this.state.hrExternalTrainingApprovalDtos, b3: data }
                })
                break;
            case "B4":
                this.setState({
                    hrExternalTrainingApprovalDtos: { ...this.state.hrExternalTrainingApprovalDtos, b4: data }
                })
                break;
            case "B5":
                this.setState({
                    hrExternalTrainingApprovalDtos: { ...this.state.hrExternalTrainingApprovalDtos, b5: data }
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
                                <Button variant="warning" id="btnDraft" onClick={this.saveExternalTraining.bind(this)}
                                    disabled={this.state.hrExternalTrainingDto.statusCd !== '01' ? true : false}
                                >Draft</Button>{' '}
                                <Button variant="success" id="btnSave" onClick={this.saveExternalTraining.bind(this)}
                                    disabled={this.state.hrExternalTrainingDto.statusCd !== '01' ? true : false}
                                >Save</Button>
                                {
                                    this.state.hrExternalTrainingDto.statusCd === '10'
                                        ? <>{' '}
                                            <Button variant="info" onClick={function (e) {
                                                var userId = this.props.storeState.userInfo.userId;
                                                var page = "ExternalTrainingReport";
                                                var key = this.state.hrExternalTrainingDto.trainingId;
                                                var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                                window.open(this.props.storeState.reportUrl + url, '_blank');
                                            }.bind(this)}>Print</Button>
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
                                this.state.hrExternalTrainingDto.statusCd !== '10' && this.state.hrExternalTrainingDto.statusCd !== '99' 
                                ? <></>
                                : <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Comment</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="remark"
                                                className="responseRemarkBackcolor"
                                                value={this.state.hrExternalTrainingDto.remark}
                                            />
                                        </Form.Group>
                                    </div>
                            }
                            
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="trainingId"
                                        value={this.state.hrExternalTrainingDto.trainingId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.hrExternalTrainingDto.statusCd} onChange={this.onChangeHandler.bind(this)}
                                        disabled
                                    >
                                        <GDHSelectOption cdMajor="0028" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ 교육 성격</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="trainingGb"
                                        value={this.state.hrExternalTrainingDto.trainingGb} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0029" deleteMinor={[]} isEmpty={false} isEmptyText="" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">

                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ 교육명</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="trainingNm"
                                        value={this.state.hrExternalTrainingDto.trainingNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 교육 세부 내용</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="subject"
                                        value={this.state.hrExternalTrainingDto.subject} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 교육 기관</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="institution"
                                        value={this.state.hrExternalTrainingDto.institution} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ 교육 관련 증빙</Form.Label>
                                    <Form.File
                                        label="file upload click !!"
                                        custom
                                        multiple={false}
                                        onChange={this.onfileUploadClick.bind(this)}
                                    />
                                </Form.Group>
                                <Form.Row style={{ marginBottom: 10, fontWeight: 'bold' }}>
                                    <a href={this.state.hrExternalTrainingDto.dtlFileUrl} target={'_blank'}>
                                        {this.state.hrExternalTrainingDto.dtlFileNm}
                                    </a>
                                    {
                                        this.state.hrExternalTrainingDto.dtlFileNm !== ''
                                            ? <><>&nbsp;&nbsp;&nbsp;</>
                                                <a href={'#'} style={{ color: 'black', fontSize: 15 }} onClick={(e) => {
                                                    e.preventDefault();
                                                    this.setState({
                                                        hrExternalTrainingDto: {
                                                            ...this.state.hrExternalTrainingDto,
                                                            dtlFileNm: '',
                                                            dtlFileUrl: ''
                                                        }
                                                    })
                                                }}>ⓧ</a>
                                            </> 
                                            : <></> 
                                    }
                                </Form.Row>
                                <Form.Label>[ 안 내 ] 교육기관에 신청하는 신청서 또는 관련 교육 증빙자료 첨부 필수</Form.Label>
                            </div>

                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ 일자</Form.Label>
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
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ 신청사유</Form.Label>
                                    <Form.Control as="textarea" rows={3} 
                                        name="reason"
                                        value={this.state.hrExternalTrainingDto.reason} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ 결제방법</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="paymentMethod"
                                        value={this.state.hrExternalTrainingDto.paymentMethod} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0030" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 고용보험 환급여부</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="insReturnYn"
                                        value={this.state.hrExternalTrainingDto.insReturnYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ 교육비</Form.Label>
                                    <Form.Control type="text" size="sm" style={{ textAlign: 'right' }}
                                        name="trainingAmtNm"
                                        value={this.state.hrExternalTrainingDto.trainingAmtNm} onChange={this.onChangeCommaHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 환급금액</Form.Label>
                                    <Form.Control type="text" size="sm" style={{ textAlign: 'right' }}
                                        name="returnAmtNm"
                                        value={this.state.hrExternalTrainingDto.returnAmtNm} onChange={this.onChangeCommaHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 교육비 입금 요청 일자</Form.Label>
                                    <GDHDatepicker
                                        name='paymentDt'
                                        isClear={true}
                                        value={this.state.hrExternalTrainingDto.paymentDt === '' ? null : this.state.hrExternalTrainingDto.paymentDt
                                        } onDateChange={this.onDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 입금 일자</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="paymentRegDt"
                                        readOnly
                                        placeholder='Finance 입력예정'
                                        value={this.state.hrExternalTrainingDto.paymentRegDt}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 은행</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="bankCd"
                                        value={this.state.hrExternalTrainingDto.bankCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0031" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 계좌번호</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="accountNo"
                                        value={this.state.hrExternalTrainingDto.accountNo} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>


                        </Form.Row>
                    </Form>
                    <div style={{ marginTop: 25 }}></div>
                    {
                        this.props.storeState.userInfo.certiTitleGb === '03'
                            ? <></>
                            : <GDHApproval apprTitle="Carbon Copy" approvalGb="02" approvalCd="B1"
                                approvalUserList={this.state.hrExternalTrainingApprovalDtos.b1}
                                saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                    }

                    <GDHApproval apprTitle={ this.props.storeState.userInfo.certiTitleGb === '03' ? "Branch Manager" : "Team Manager" }
                        approvalGb="02" approvalCd="B3"
                        approvalUserList={this.state.hrExternalTrainingApprovalDtos.b3}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    <GDHApproval apprTitle={ this.props.storeState.userInfo.certiTitleGb === '03' ? "Team Manager" : "CS / Lab Manager" }
                        approvalGb="02" approvalCd="B4"
                        approvalUserList={this.state.hrExternalTrainingApprovalDtos.b4}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    <GDHApproval apprTitle="GM" approvalGb="02" approvalCd="B5"
                        approvalUserList={this.state.hrExternalTrainingApprovalDtos.b5}
                        saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
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
                            <Col xs={7}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ 교육시작일</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.hrExternalTrainingDateDtos.startDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={5}>
                                <Form.Group>
                                <Form.Label className="validateText">시간</Form.Label>
                                    <GDHDatepickerTime
                                        name='startTime'
                                        value={this.state.hrExternalTrainingDateDtos.startTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={7}>
                                <Form.Group>
                                    <Form.Label className="validateText">■ 교육종료일</Form.Label>
                                    <GDHDatepicker
                                        name='endDt'
                                        value={this.state.hrExternalTrainingDateDtos.endDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={5}>
                            <Form.Label className="validateText">시간</Form.Label>
                                <Form.Group>
                                    <GDHDatepickerTime
                                        name='endTime'
                                        value={this.state.hrExternalTrainingDateDtos.endTime} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} style={{ textAlign: 'center' }}>
                                <Form.Label className="validateText">
                                    <span style={{ color: 'black' }}>요청 시간 : </span>
                                    {' '}
                                    <span style={{ fontSize: 15 }}>{this.state.hrExternalTrainingDateDtos.totalHours}</span>
                                </Form.Label>
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
)(ExternalTrainingDetail)
