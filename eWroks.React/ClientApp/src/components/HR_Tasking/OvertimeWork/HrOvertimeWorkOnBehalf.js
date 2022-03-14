import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import GDHApprovalSelectOption from '../../common/approval/GDHApprovalSelectOption';

class HrOvertimeWorkOnBehalf extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100 },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Email', field: 'email', minWidth: 100 },
                    { headerName: 'DutyCdKorNm', field: 'dutyCdKorNm', minWidth: 100 },
                    { headerName: 'DeptFullNm', field: 'deptFullNm', minWidth: 300 },
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
        modalOnBehalf: false,
        weeklyTimeTotal: '',
        selectUserId: '',
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
    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        // 마스터 조회
        this.getOnBehalfUserList();
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getOnBehalfUserList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/GetOnBehalfUserList")
            .then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;
                this.setState({
                    masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
                })
            })
            .catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 대리 생성    */
    /*==========================================================*/
    saveResponseOvertimeWorkOnBehalf(e) {
        if (this.state.hrOvertimeWorkDto.reason === '') {
            alert('[ Reason ] 값을 입력해 주세요.');
            return;
        }

        // 마스터 설정
        var gParam = {
            ...this.state.hrOvertimeWorkDto,
            statusCd: '09',
            remark: 'onbehalf',
            regId: this.state.selectUserId,
            updId: this.props.storeState.userInfo.userId,
        }

        // 시간
        var gParamDate = { ...this.state.hrOvertimeWorkDateDto };
        gParamDate.startDt = this.props.storeState.getParsedDate(gParamDate.startDt);
        gParamDate.startTime = this.props.storeState.getParsedTime(gParamDate.startTime);
        gParamDate.endDt = this.props.storeState.getParsedDate(gParamDate.endDt);
        gParamDate.endTime = this.props.storeState.getParsedTime(gParamDate.endTime);
        gParamDate.recogTime = Number(gParamDate.recogTime.replaceAll(':', '.'));
        gParamDate.statusCd = '10';
        gParamDate.regId = this.state.selectUserId;
        gParamDate.updId = this.props.storeState.userInfo.userId;

        var gParamGroup = {
            hrOvertimeWorkDto: gParam,
            hrOvertimeWorkDateDto: gParamDate,
            hrOvertimeWorkApprovalDtos: []
        }
        axios.post(this.props.storeState.serviceUrl + "/HrOvertimeWorkService/SaveResponseOvertimeWorkOnBehalf",
            gParamGroup)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalOnBehalf: false
                })

                this.props.saveCallback();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].userId;

        this.setState({
            weeklyTimeTotal: '',
            selectUserId: '',
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
        }, () => {
            this.setState({
                modalOnBehalf: true,
                selectUserId: id
            });
        })
        this.getWeeklyTimeTotal(new Date(), id);
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
                this.getWeeklyTimeTotal(row.startDt, this.state.selectUserId);
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
            minutes = 60 + (minutes - dinnerMinutes);
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
                                <Button variant="primary" onClick={this.getOnBehalfUserList.bind(this)}>Search</Button>
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
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>





            {/* Modal */}
            <Modal show={this.state.modalOnBehalf} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success"
                            onClick={this.saveResponseOvertimeWorkOnBehalf.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalOnBehalf: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Table bordered style={{ borderTop: '2px solid #695405' }}>
                                    <colgroup>
                                        <col style={{ width: 150 }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>Weekly Time Total</th>
                                            <td colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold' }}>
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
                                                    name='startTime'
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
)(HrOvertimeWorkOnBehalf)
