import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

const _fiTravelGroupDto = {
    
}
class TaskingTravel extends Component {
    state = {
        activeKey: "list",
        boolButton: false,
        travelId: 0,
        apprId: 0,
        remark: '',
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Type', field: 'travelGbNm', minWidth: 100 },
                    { headerName: 'Req Nm', field: 'regIdNm', minWidth: 100 },
                    { headerName: 'Destination', field: 'destination', minWidth: 200 },
                    { headerName: 'Purpose', field: 'purpose', minWidth: 200 },
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
                    { headerName: 'Start Dt', field: 'startDt', minWidth: 100 },
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
        fiTravelGroupDto: {
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
        
                statusCdNm: "",
                travelGbNm: "",
                regIdNm: "",
                regIdDeptFullNm: "",
                estRevAmtNm: 0,
                estCostAmtNm: 0,

                certiTitleGb: ''
            },
            fiTravelDateDtos: [],
            fiTravelApprovalDtos: {
                c2: '',
                c3: '',
                c4: '',
                z9: ''
            }
        }
    }
    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getTaskingTravelList();
    }
    
    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getTaskingTravelList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiTravelService/GetTaskingTravelList", {
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
        var travelId = e.data.travelId;
        var apprId = e.data.apprId;
        
        this.setState({
            travelId: travelId,
            apprId: apprId,
            remark: '',
            boolButton: true,
        })
        this.getTaskingTravelDetail(travelId);
    }

    /*==========================================================*/
    /* 상세조회    */
    /*==========================================================*/
    getTaskingTravelDetail(travelId) {
        axios.get(this.props.storeState.serviceUrl + "/FiTravelService/GetTravelDetail", {
            params: {
                travelId: travelId
            }
        }).then(r => {
            var data = r.data;
            
            var strC2 = '';
            var strC3 = '';
            var strC4 = '';
            var strz9 = '';

            data.fiTravelApprovalDtos.map((row, i) => {
                if(row.apprCd === 'C2'){
                    strC2 += row.taskingUserNm
                }
                if(row.apprCd === 'C3'){
                    strC3 += row.taskingUserNm
                }
                if(row.apprCd === 'C4'){
                    strC4 += row.taskingUserNm
                }
                if(row.apprCd === 'Z9'){
                    strz9 += row.taskingUserNm
                }
            })

            this.setState({
                activeKey: 'detail', 
                fiTravelGroupDto: {
                    ...this.state.fiTravelGroupDto,
                    fiTravelDto: data.fiTravelDto,
                    fiTravelDateDtos: data.fiTravelDateDtos,
                    fiTravelApprovalDtos: {
                        c2: strC2,
                        c3: strC3,
                        c4: strC4,
                        z9: strz9,
                    }
                },
                dateGrid: { ...this.state.dateGrid, rowData: data.fiTravelDateDtos } 
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 승인 리젝 저장    */
    /*==========================================================*/
    saveTaskingApproval(e) {
        var btnId = e.target.id;

        axios.post(this.props.storeState.serviceUrl + "/FiTravelService/SaveTaskingApproval", {}, {
            params: {
                travelId: this.state.travelId,
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
            this.getTaskingTravelList();
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
                                            <Button variant="primary" onClick={this.getTaskingTravelList.bind(this)} >Search</Button>
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
                                ? <><Button variant="success" id="btnApproval" onClick={this.saveTaskingApproval.bind(this)}>Approval</Button>{' '}
                                    <Button variant="danger" id="btnReject" onClick={this.saveTaskingApproval.bind(this)}>Reject</Button></>
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
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Request Nm</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.regIdNm}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Department</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.regIdDeptFullNm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Status</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.statusCdNm}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Travel Type</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.travelGbNm}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Travel Destination</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.destination}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Estimated cost</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.estCostAmtNm} 원
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Customer</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.customer}
                                    </td>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Estimated revenue</th>
                                    <td>
                                        {this.state.fiTravelGroupDto.fiTravelDto.estRevAmtNm} 원
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Purpose of Travel</th>
                                    <td colSpan={3}>
                                        {this.state.fiTravelGroupDto.fiTravelDto.purpose}
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

                                {
                                    this.state.fiTravelGroupDto.fiTravelDto.certiTitleGb === '03'
                                        ? <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Branch Manager</th>
                                            <td colSpan={3}>
                                                {
                                                    this.state.fiTravelGroupDto.fiTravelApprovalDtos.c2.split('<br/>').map((line, i) => {
                                                        return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                                    })
                                                }
                                            </td>
                                        </tr>
                                        : <></>
                                }
                                
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Team Manager</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.fiTravelGroupDto.fiTravelApprovalDtos.c3.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ General Manager</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.fiTravelGroupDto.fiTravelApprovalDtos.c4.split('<br/>').map((line, i) => {
                                                return (line === '' ? null : <span key={i}>{line}<br /></span>)
                                            })
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#e9ecef' }}>■ CMD</th>
                                    <td colSpan={3}>
                                        {
                                            this.state.fiTravelGroupDto.fiTravelApprovalDtos.z9.split('<br/>').map((line, i) => {
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
)(TaskingTravel)
