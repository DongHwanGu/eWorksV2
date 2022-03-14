import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion, Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import GDHSelectOption from '../../common/controls/GDHSelectOption';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';


class TravelDetail extends Component {
      /*==========================================================*/
	/* State    */
    /*==========================================================*/
    state = {
        fiTravelDto: {
            travelId: 0,
            travelGb: "01",
            destination: "",
            customer: "",
            estRevAmt: 0,
            estCostAmt: 0,
            purpose: "",
            remark: "",
            statusCd: "01",
            regId: "",
            updId: "",

            statusCdNm: '',
            travelGbNm: '',
            regIdNm: '',
            regIdDeptFullNm: '',
            estRevAmtNm: "0",
            estCostAmtNm: "0",
        },
        fiTravelDateDto: {
            travelId: 0,
            dateId: 0,
            startDt: new Date(),
            endDt: new Date(),
            remark: '',
            regId: '',
            updId: '',
        },
        fiTravelApprovalDto: {
            c2: [],
            c3: [],
            c4: [],
            z9: [],
        },
        modalDateShow: false,
        dateGrid: {
            columnDefs:
                [
                    { headerName: 'Start Dt', field: 'startDt', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'End Dt', field: 'endDt', minWidth: 100 },
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
        if(this.props.id !== '') 
        {
            axios.get(this.props.storeState.serviceUrl + "/FiTravelService/GetTravelDetail", {
                params: {
                    travelId: this.props.id
                }
            }).then(r => {
                var data = r.data;
                // 시간
                var dateList = [];
                data.fiTravelDateDtos.map((row, i) => {
                    row.id = row.dateId;
                    dateList.push(row);
                });

                // 승인자
                var c2List = [];
                data.fiTravelApprovalDtos.map((row, i) => {
                    if (row.apprCd === 'C2') {
                        c2List.push(row);
                    }
                });
                var c3List = [];
                data.fiTravelApprovalDtos.map((row, i) => {
                    if (row.apprCd === 'C3') {
                        c3List.push(row);
                    }
                });
                var c4List = [];
                data.fiTravelApprovalDtos.map((row, i) => {
                    if (row.apprCd === 'C4') {
                        c4List.push(row);
                    }
                });
                var z9List = [];
                data.fiTravelApprovalDtos.map((row, i) => {
                    if (row.apprCd === 'Z9') {
                        z9List.push(row);
                    }
                });

                this.setState({
                    fiTravelDto: data.fiTravelDto,
                    dateGrid: { ...this.state.dateGrid, rowData: dateList, rowCount: dateList.length },
                    fiTravelApprovalDto: { ...this.state.fiTravelApprovalDto, c2: c2List, c3: c3List, c4: c4List, z9: z9List }
                })

            }).catch(function (error) {
                alert(error);
            });
        }
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
        var _dateId = this.state.fiTravelDateDto.dateId > 0 
            ? this.state.fiTravelDateDto.dateId
            : arrDateId.length === 0 ? 100 : Math.max.apply(null, arrDateId) + 1
        
        // 저장전 날짜 확인
        var tStartDt = this.props.storeState.getParsedDate(this.state.fiTravelDateDto.startDt, "01");
        var tEndDt = this.props.storeState.getParsedDate(this.state.fiTravelDateDto.endDt, "01");
        
        if (tStartDt > tEndDt)
        {
            alert('종료일은 시작일보다 작을 수 없습니다.');
            return;
        }
        
        // Update
        if (this.state.fiTravelDateDto.dateId > 0) {
            rows.map((row, i) => {
                if (row.dateId === _dateId)
                {
                    row.startDt = this.props.storeState.getParsedDate(this.state.fiTravelDateDto.startDt, "02");
                    row.endDt = this.props.storeState.getParsedDate(this.state.fiTravelDateDto.endDt, "02");
                }
            })
        }
        else {
            var objDate = {
                travelId: this.state.fiTravelDto.travelId,
                dateId: _dateId,
                startDt: this.props.storeState.getParsedDate(this.state.fiTravelDateDto.startDt, "02"),
                endDt: this.props.storeState.getParsedDate(this.state.fiTravelDateDto.endDt, "02"),
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
	/* 날짜 추가    */
	/*==========================================================*/
    onClickDateAdd() {
        if (this.state.dateGrid.rowData.length === 3) {
            alert('날짜는 최대 3줄만 설정 할 수 있습니다.');
            return;
        }
        this.setState({
            modalDateShow: true,
            fiTravelDateDto: { ...this.state.fiTravelDateDto, 
                travelId: 0,
                dateId: 0,
                startDt: new Date(),
                endDt: new Date(),
                remark: '',
                regId: '',
                updId: '',
            }
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
	/* 출장 저장    */
	/*==========================================================*/
    saveTravelData(e) {
        if (this.state.fiTravelDto.destination === '')
        {
            alert('[ Travel Destination ] 값을 입력해 주세요.');
            return;
        }
        if (this.state.fiTravelDto.customer === '')
        {
            alert('[ Customer ] 값을 입력해 주세요.');
            return;
        }
        if (this.state.fiTravelDto.estRevAmtNm === "0")
        {
            alert('[ Estimated revenue ] 값을 입력해 주세요.');
            return;
        }

        // 마스터 설정
        var gParam = {
            ...this.state.fiTravelDto,
            estRevAmt: Number(this.state.fiTravelDto.estRevAmtNm.replaceAll(',', '')),
            estCostAmt: Number(this.state.fiTravelDto.estCostAmtNm.replaceAll(',', '')),
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
            row.endDt = this.props.storeState.getParsedDate(row.endDt);
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });
        
        // 승인자 설정
        var gParamApprovals = [];
        this.state.fiTravelApprovalDto.c2.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        }); 
        this.state.fiTravelApprovalDto.c3.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        }); 
        this.state.fiTravelApprovalDto.c4.map((row, i) => {
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
            gParamApprovals.push(row)
        }); 
        this.state.fiTravelApprovalDto.z9.map((row, i) => {
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
            fiTravelDto: gParam,
            fiTravelDateDtos: gParamDates,
            fiTravelApprovalDtos: gParamApprovals
        }
        axios.post(this.props.storeState.serviceUrl + "/FiTravelService/SaveTravelData",
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
	/* 승인테이블 더블클릭    */
	/*==========================================================*/
    onDateRowDoubleClicked(e) {
        this.setState({
            modalDateShow: true,
            fiTravelDateDto: {
                ...this.state.fiTravelDateDto,
                travelId: e.data.travelId,
                dateId: e.data.dateId,
                startDt: new Date(e.data.startDt),
                endDt: new Date(e.data.endDt)
            }
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
            fiTravelDto : {
                ...this.state.fiTravelDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeCommaHandler(e) {
        var strNumber = Number(e.target.value.replaceAll(",", ""))
        
        this.setState({
            fiTravelDto : {
                ...this.state.fiTravelDto,
                [e.target.name]: isNaN(strNumber) ? '0' : strNumber.toString()
            }
        });
    }
    onModalDateChangeHandler(name, date) {
        this.setState({
            fiTravelDateDto: {
                ...this.state.fiTravelDateDto,
                [name]: date
            }
        });
    }
    /*==========================================================*/
	/* 신규생성    */
	/*==========================================================*/
    saveApprovalUserList = (data, gb) => {
        switch (gb) {
            case "C2":
                this.setState({
                    fiTravelApprovalDto: { ...this.state.fiTravelApprovalDto, c2: data }
                })
                break;
            case "C3":
                this.setState({
                    fiTravelApprovalDto: { ...this.state.fiTravelApprovalDto, c3: data }
                })
                break;
            case "C4":
                this.setState({
                    fiTravelApprovalDto: { ...this.state.fiTravelApprovalDto, c4: data }
                })
                break;
            case "Z9":
                this.setState({
                    fiTravelApprovalDto: { ...this.state.fiTravelApprovalDto, z9: data }
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
                                <Button variant="warning" id="btnDraft" onClick={this.saveTravelData.bind(this)}
                                    disabled={this.state.fiTravelDto.statusCd !== '01' ? true : false}
                                >Draft</Button>{' '}
                                <Button variant="success" id="btnSave" onClick={this.saveTravelData.bind(this)}
                                    disabled={this.state.fiTravelDto.statusCd !== '01' ? true : false}
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
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="travelId"
                                        value={this.state.fiTravelDto.travelId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.fiTravelDto.statusCd} onChange={this.onChangeHandler.bind(this)}
                                        disabled
                                    >
                                        <GDHSelectOption cdMajor="0034" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Travel Type</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="travelGb"
                                        value={this.state.fiTravelDto.travelGb} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0033" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">

                            </div>
                            <div className="col-md-9">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Travel Destination</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="destination"
                                        value={this.state.fiTravelDto.destination} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Estimated cost</Form.Label>
                                    <Form.Control type="text" size="sm" style={{ textAlign: 'right' }}
                                        name="estCostAmtNm"
                                        value={this.state.fiTravelDto.estCostAmtNm} onChange={this.onChangeCommaHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-9">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Customer</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="customer"
                                        value={this.state.fiTravelDto.customer} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Estimated revenue</Form.Label>
                                    <Form.Control type="text" size="sm" style={{ textAlign: 'right' }}
                                        name="estRevAmtNm"
                                        value={this.state.fiTravelDto.estRevAmtNm} onChange={this.onChangeCommaHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Purpose of Travel</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        name="purpose"
                                        value={this.state.fiTravelDto.purpose} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
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
                        </Form.Row>


                        <Accordion defaultActiveKey="0" style={{ marginBottom: 10 }} >
                            <Card>
                                <Card.Header style={{ textAlign: 'center' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        승인테이블 확인
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        {
                                            this.props.storeState.userInfo.certiTitleGb === '03' ?
                                                <Form.Row>
                                                <div className="col-md-6">
                                                    <p style={{ textAlign: 'center', color: 'red' }}>[ 국내 ]</p>
                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <th className="text-center">요청자</th>
                                                                <th className="text-center">1차 승인자</th>
                                                                <th className="text-center">2차 승인자</th>
                                                                <th className="text-center">확인</th>
                                                            </tr>
                                                            <tr><td>직원</td><td>소장</td><td></td><td>FIN</td></tr>
                                                            <tr><td>소장</td><td>팀장</td><td>부사장</td><td>FIN</td></tr>
                                                            <tr><td>팀장</td><td>부사장</td><td></td><td>FIN</td></tr>
                                                            <tr><td>부사장</td><td></td><td></td><td>FIN</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="col-md-6">
                                                    <p style={{ textAlign: 'center', color: 'red' }}>[ 해외 ]</p>
                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <th className="text-center">요청자</th>
                                                                <th className="text-center">1차 승인자</th>
                                                                <th className="text-center">2차 승인자</th>
                                                                <th className="text-center">3차 승인자</th>
                                                                <th className="text-center">확인</th>
                                                            </tr>
                                                            <tr><td>직원</td><td>소장</td><td>팀장</td><td>부사장</td><td>FIN</td></tr>
                                                            <tr><td>소장</td><td>팀장</td><td>부사장</td><td></td><td>FIN</td></tr>
                                                            <tr><td>팀장</td><td>부사장</td><td>사장</td><td></td><td>FIN</td></tr>
                                                            <tr><td>부사장</td><td>사장</td><td></td><td></td><td>FIN</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Form.Row>
                                            : 
                                            <Form.Row>
                                            <div className="col-md-6">
                                                <p style={{ textAlign: 'center', color: 'red' }}>[ 국내 ]</p>
                                                <table className="table table-bordered">
                                                    <tbody>
                                                    <tr>
                                                            <th className="text-center">요청자</th>
                                                            <th className="text-center">1차 승인자</th>
                                                            <th className="text-center">2차 승인자</th>
                                                            <th className="text-center">확인</th>
                                                        </tr>
                                                        <tr><td>직원</td><td>팀장</td><td></td><td>FIN</td></tr>
                                                        <tr><td>팀장</td><td>GM</td><td></td><td>FIN</td></tr>
                                                        <tr><td>GM</td><td></td><td></td><td>FIN</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-6">
                                                <p style={{ textAlign: 'center', color: 'red' }}>[ 해외 ]</p>
                                                <table className="table table-bordered">
                                                    <tbody>
                                                    <tr>
                                                            <th className="text-center">요청자</th>
                                                            <th className="text-center">1차 승인자</th>
                                                            <th className="text-center">2차 승인자</th>
                                                            <th className="text-center">3차 승인자</th>
                                                            <th className="text-center">확인</th>
                                                        </tr>
                                                        <tr><td>직원</td><td>팀장</td><td>GM</td><td>CMD</td><td>FIN</td></tr>
                                                        <tr><td>팀장</td><td>GM</td><td>CMD</td><td></td><td>FIN</td></tr>
                                                        <tr><td>GM</td><td>CMD</td><td></td><td></td><td>FIN</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Form.Row>
                                        }
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Form>

                    {
                        this.props.storeState.userInfo.certiTitleGb === '03' 
                        ? <GDHApproval apprTitle="Branch Manager" approvalGb="03" approvalCd="C2" 
                            approvalUserList={this.state.fiTravelApprovalDto.c2}
                            saveApprovalUserList={this.saveApprovalUserList.bind(this)} />
                        : null
                    }

                    <GDHApproval apprTitle="Team Manager" approvalGb="03" approvalCd="C3" 
                                 approvalUserList={this.state.fiTravelApprovalDto.c3}
                                 saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    <GDHApproval apprTitle="General Manager" approvalGb="03" approvalCd="C4" 
                                 approvalUserList={this.state.fiTravelApprovalDto.c4}
                                 saveApprovalUserList={this.saveApprovalUserList.bind(this)} />

                    <GDHApproval apprTitle="CMD" approvalGb="03" approvalCd="Z9" 
                                 approvalUserList={this.state.fiTravelApprovalDto.z9}
                                 saveApprovalUserList={this.saveApprovalUserList.bind(this)} />            
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>




            {/* Role Program Modal */}
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
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Start Dt</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.fiTravelDateDto.startDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label className="validateText">■ End Dt</Form.Label>
                                    <GDHDatepicker
                                        name='endDt'
                                        value={this.state.fiTravelDateDto.endDt} onDateChange={this.onModalDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                    <p><b>&nbsp;&nbsp;[ 알림 ]</b></p>
                    <p style={{ color: '#ff6a00', fontWeight: 'bold' }}>&nbsp;&nbsp;※ 1박 이상 출장일 경우 작성하세요.</p>
                    <p style={{ color: '#ff6a00', fontWeight: 'bold' }}>&nbsp;&nbsp;※ 반드시 출장전에 요청서 승인을 받으세요.</p>
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
)(TravelDetail)