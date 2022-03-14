import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

class TaskingExternalTraining extends Component {
    state = {
        activeKey: "list",
        boolButton: false,
        trainingId: 0,
        apprId: 0,
        remark: '',
        masterGrid: {
            columnDefs:
                [
                    { headerName: '상태', field: 'statusCdNm', minWidth: 100 },
                    { headerName: '교육 성격', field: 'trainingGbNm', minWidth: 100 },
                    { headerName: '교육명', field: 'trainingNm', minWidth: 100 },
                    { headerName: '작성자', field: 'regIdNm', minWidth: 100 },
                    { headerName: '작성일 ', field: 'regDtNm', minWidth: 100 },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                // filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                // floatingFilter: true, // 멀티서치 기능
            }
        },
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
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getTaskingExternalTrainingList();
    }
    
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getTaskingExternalTrainingList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrExternalTrainingService/GetTaskingExternalTrainingList", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data }
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 상세보기    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var trainingId = e.data.trainingId;
        var apprId = e.data.apprId;
        this.setState({
            trainingId: trainingId,
            apprId: apprId,
            remark: '',
            boolButton: true,
        })
        this.getTaskingExternalTrainingDetail(trainingId);
    }

    /*==========================================================*/
    /* 상세조회    */
    /*==========================================================*/
    getTaskingExternalTrainingDetail(trainingId) {
        axios.get(this.props.storeState.serviceUrl + "/HrExternalTrainingService/GetExternalTrainingDetail", {
            params: {
                trainingId: trainingId
            }
        }).then(r => {
            var data = r.data;
            
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
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 승인 리젝 저장    */
    /*==========================================================*/
    saveTaskingExternalTrainingApproval(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/HrExternalTrainingService/SaveTaskingExternalTrainingApproval", {}, {
            params: {
                trainingId: this.state.trainingId,
                apprId: this.state.apprId,
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
                activeKey: 'list',
                boolButton: false,
            })
            this.getTaskingExternalTrainingList();
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
                                        <div className="col-md-12 text-right">
                                            <Button variant="primary" onClick={this.getTaskingExternalTrainingList.bind(this)} >Search</Button>
                                        </div>
                                    </Form.Row>
                                </Form>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                <div className="ag-theme-material"
                                    style={{ height: 300, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.masterGrid.columnDefs}
                                        defaultColDef={this.state.masterGrid.defaultColDef}
                                        rowData={this.state.masterGrid.rowData}
                                        // rowSelection="multiple" // single
                                        // rowHeight={40}
                                        // onGridReady={params => this.gridApi = params.api}
                                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    />
                                </div>
                            </Card.Body>
                            {/* <Card.Footer>
                                <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                            </Card.Footer> */}
                        </Card>
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail" >
                    <Form style={{ marginTop: 15 }}>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                            {
                                this.state.boolButton === true 
                                ? <><Button variant="success" id="btnApproval" onClick={this.saveTaskingExternalTrainingApproval.bind(this)}>Approval</Button>{' '}
                                    <Button variant="danger" id="btnReject" 
                                                style={{ display: this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.statusCd === '02' ? 'none' : 'inline' }}
                                        onClick={this.saveTaskingExternalTrainingApproval.bind(this)}>Reject</Button></>
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
                                    <td>
                                        {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.returnAmtNm} 원
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ 교육비 입금 요청 일자</th>
                                    <td>
                                        {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.paymentDt}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ 입금 일자</th>
                                    <td>
                                        {this.state.hrExternalTrainingGroupDto.hrExternalTrainingDto.paymentRegDt}
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
                </Tab>
            </Tabs>
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
)(TaskingExternalTraining)
