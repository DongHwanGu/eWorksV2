import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import {Form, Button, Table } from 'react-bootstrap';

import GDHDatepicker from '../../common/controls/GDHDatepicker';

class HrExternalTrainingDetail extends Component {
    state = {
        trainingId: 0,
        remark: '',
        paymentRegDt: null,
        returnAmt: 0,
        returnAmtNm: '',
        boolButton: false,
        dateGrid: {
            columnDefs:
                [
                    { headerName: '교육시작일', field: 'startDt', minWidth: 100 },
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
        hrExternalTrainingGroupDto: {
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

                paymentMethodNm: "",
                bankCdNm: ""
            },
            hrExternalTrainingDateDtos: [],
            hrExternalTrainingApprovalDtos: {
                b1: '',
                b3: '',
                b4: '',
                b5: '',
            },
        }
    }

     /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        if (this.props.hrExternalTrainingGroupDto !== '') {
            var data = this.props.hrExternalTrainingGroupDto;

            var strB1 = '';
            var strB3 = '';
            var strB4 = '';
            var strB5 = '';

            data.hrExternalTrainingApprovalDtos.map((row, i) => {
                if(row.apprCd === 'B1'){
                    strB1 += row.taskingUserNm
                }
                if(row.apprCd === 'B3'){
                    strB3 += row.taskingUserNm
                }
                if(row.apprCd === 'B4'){
                    strB4 += row.taskingUserNm
                }
                if(row.apprCd === 'B5'){
                    strB5 += row.taskingUserNm
                }
            })

            this.setState({
                trainingId: data.hrExternalTrainingDto.trainingId,
                remark: '',
                paymentRegDt: data.hrExternalTrainingDto.paymentRegDt === '' ? null : data.hrExternalTrainingDto.paymentRegDt,
                returnAmt: data.hrExternalTrainingDto.returnAmt,
                returnAmtNm: data.hrExternalTrainingDto.returnAmtNm,
                boolButton: data.hrExternalTrainingDto.statusCd === '09' ? true : false,
                activeKey: 'detail', 
                hrExternalTrainingGroupDto: {
                    ...this.state.hrExternalTrainingGroupDto,
                    hrExternalTrainingDto: data.hrExternalTrainingDto,
                    hrExternalTrainingDateDtos: data.hrExternalTrainingDateDtos,
                    hrExternalTrainingApprovalDtos: {
                        b1: strB1,
                        b3: strB3,
                        b4: strB4,
                        b5: strB5,
                    }
                },
                dateGrid: { ...this.state.dateGrid, rowData: data.hrExternalTrainingDateDtos } 
            })
        }
    }

     /*==========================================================*/
    /* 승인 리젝 저장    */
    /*==========================================================*/
    saveResponseExternalTrainingApproval(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/HrExternalTrainingService/saveResponseExternalTrainingApproval", {}, {
            params: {
                trainingId: this.state.trainingId,
                remark: this.state.remark,
                statusCd: btnId === 'btnApproval' ? '10' : '99',
                updId: this.props.storeState.userInfo.userId
            }   
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                boolButton: false
            })
            this.props.saveCallback();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 입금일자 업데이트    */
    /*==========================================================*/
    updateResponseExternalTraingData(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/HrExternalTrainingService/UpdateResponseExternalTraingData", {}, {
            params: {
                updateGb: btnId,
                trainingId: this.state.trainingId,
                returnAmt: Number(this.state.returnAmtNm.replaceAll(',', '')),
                paymentRegDt: this.state.paymentRegDt === null ? '' 
                    : this.props.storeState.getParsedDate(this.state.paymentRegDt, ""),
                updId: this.props.storeState.userInfo.userId
            }   
        }).then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            alert('Update 완료.')
        }).catch(function (error) {
            alert(error);
        });
    }

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }
    onDateChangeHandler(name, date) {
        this.setState({
            ...this.state,
            [name]: date
        });
    }
    onChangeCommaHandler(e) {
        var strNumber = Number(e.target.value.replaceAll(",", ""))
        
        this.setState({
            ...this.state,
            [e.target.name]: isNaN(strNumber) ? '0' : strNumber.toString()
        });
    }
    render() {
        return (<>
            <Form style={{ marginTop: 15 }}>
                <Form.Row>
                    <div className="col-md-12 text-right">
                        {
                            this.state.boolButton === true
                                ? <><Button variant="success" id="btnApproval" onClick={this.saveResponseExternalTrainingApproval.bind(this)}>Approval</Button>{' '}
                                    <Button variant="danger" id="btnReject" onClick={this.saveResponseExternalTrainingApproval.bind(this)}>Reject</Button></>
                                : <></>
                        }
                        {
                            this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.statusCd === '10'
                                ? <>{' '}
                                    <Button variant="info" onClick={function (e) {
                                        var userId = this.props.storeState.userInfo.userId;
                                        var page = "ExternalTrainingReport";
                                        var key = this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.trainingId;
                                        var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                        window.open(this.props.storeState.reportUrl + url, '_blank');
                                    }.bind(this)}>Print</Button>
                                </>
                                : <></>
                        }
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
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 작성자</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.regIdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 부서</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.regIdDeptFullNm}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 상태</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.statusCdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육 성격</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.trainingGbNm}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육명</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.trainingNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육 세부 내용</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.subject}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육 기관</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.institution}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육 관련 증빙</th>
                            <td>
                                <a href={this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.dtlFileUrl} target={'_blank'}>
                                    {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.dtlFileNm}
                                </a>
                            </td>
                        </tr>
                        <tr style={{ borderTop: '5px solid #e9ecef', borderBottom: '5px solid #e9ecef' }}>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ Date</th>
                            <td colSpan={3} style={{ padding: 3 }}>
                                <div className="ag-theme-material"
                                    style={{ height: 150, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.dateGrid.columnDefs}
                                        defaultColDef={this.state.dateGrid.defaultColDef}
                                        rowData={this.state.dateGrid.rowData}
                                        singleClickEdit={true}
                                    // rowSelection="multiple" // single
                                    // onGridReady={params => this.gridDateApi = params.api}
                                    // onRowDoubleClicked={this.onApprovalRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 신청사유</th>
                            <td colSpan={3}>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.reason}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 결제방법</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.paymentMethodNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 고용보험 환급여부</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.insReturnYn}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육비</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.trainingAmtNm} 원
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 환급금액</th>
                            <td style={{ margin: 0, padding: 0 }}>
                                <table style={{ margin: 0, padding: 0, width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ border: 0, borderRight: '1px solid #ddd' }}>
                                                <Form.Control type="text" size="sm"
                                                    name="returnAmtNm"
                                                    style={{ textAlign: 'right' }}
                                                    value={this.state.returnAmtNm} 
                                                    onChange={this.onChangeCommaHandler.bind(this)}
                                                />
                                            </td>
                                            <td style={{ border: 0 }}>
                                                <Button variant="success" id='btnReturnAmtNm'
                                                    onClick={this.updateResponseExternalTraingData.bind(this)}
                                                >Update</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 교육비 입금 요청 일자</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.paymentDt}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 입금 일자</th>
                            <td style={{ margin: 0, padding: 0 }}>
                                <table style={{ margin: 0, padding: 0, width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ border: 0, borderRight:'1px solid #ddd' }}>
                                                <GDHDatepicker
                                                    name='paymentRegDt'
                                                    isClear={true}
                                                    value={this.state.paymentRegDt}
                                                    onDateChange={this.onDateChangeHandler.bind(this)}
                                                />
                                            </td>
                                            <td style={{ border: 0 }}>
                                                <Button variant="success" id="btnPaymentRegDt"
                                                    onClick={this.updateResponseExternalTraingData.bind(this)}
                                                >Update</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 은행</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.bankCdNm}
                            </td>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ 계좌번호</th>
                            <td>
                                {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.accountNo}
                            </td>
                        </tr>

                        {
                            this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.certiTitleGb === '03'
                                ? <></>
                                : <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Carbon Copy</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.hrExternalTrainingGroupDto.hrExternalTrainingApprovalDtos.b1.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                        }

                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.certiTitleGb === '03' ? "Branch Manager" : "Team Manager"}</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrExternalTrainingGroupDto.hrExternalTrainingApprovalDtos.b3.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.certiTitleGb === '03' ? "Team Manager" : "CS / Lab Manager"}</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrExternalTrainingGroupDto.hrExternalTrainingApprovalDtos.b4.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: '#e9ecef' }}>■ GM</th>
                            <td colSpan={3}>
                                {
                                    this.state.hrExternalTrainingGroupDto.hrExternalTrainingApprovalDtos.b5.split('<br/>').map((line, i) => {
                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                    })
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
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
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(HrExternalTrainingDetail)
