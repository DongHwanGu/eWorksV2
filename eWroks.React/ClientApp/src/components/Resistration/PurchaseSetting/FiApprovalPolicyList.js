import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import FiApprovalPolicyPurchase from './FiApprovalPolicyPurchase';

class FiApprovalPolicyList extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "amountList",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),
        
        masterGrid: {
            columnDefs:
                [
                    {
                        headerName: '-', field: '-', minWidth: 150,
                        cellRendererFramework: (params) => {
                            var policyId = params.data.policyId;
                            return (
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#dc3545', fontWeight: 'bold', fontSize: 15 }} onClick={() => {
                                        this.setState({
                                            modalPolicyPurchase: true,
                                            modalPolicyPurchaseObj: <FiApprovalPolicyPurchase id={policyId} onClickModalClose={this.onClickModalClose.bind(this)} />
                                        })
                                    }}>[ Setting ]</span>
                                </div>
                            )
                        }
                    },
                    { headerName: 'Process Nm', field: 'processGbNm', minWidth: 150 },
                    { headerName: 'Policy Nm', field: 'policyNm', minWidth: 200 },
                    { headerName: 'Remark', field: 'remark', minWidth: 400 },
                    { headerName: 'Use Yn', field: 'useYn', minWidth: 300 },
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
        modalPolicy: false,

        fiApprovalPolicyDto: {
            policyId: 0,
            policyNm: '',
            processGb: '01',
            remark: '',
            useYn: 'Y',
            regId: '',
            updId: '',
        },

        modalPolicyPurchase: false,
        modalPolicyPurchaseObj: <></>,
        
    }

     /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        // 마스터 조회
        this.getPolicyList();
    }

    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({
            modalPolicy: true,
            fiApprovalPolicyDto: {
                policyId: 0,
                policyNm: '',
                processGb: '01',
                remark: '',
                useYn: 'Y',
                regId: '',
                updId: '',
            },
        })
    }

     /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getPolicyList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/GetPolicyList", {
            params: {
                processGb: this.state.fiApprovalPolicyDto.processGb,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            })
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    savePolicyData() {
        var gParam = {
            ...this.state.fiApprovalPolicyDto,
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        };

        if (gParam.policyNm === '') {
            alert('[ Policy Nm ] 값을 입력해 주세요.');
            return;
        }

        axios.post(this.props.storeState.serviceUrl + "/FiPurchaseSettingServeice/SavePolicyData",
            gParam)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalPolicy: false
                })
                this.getPolicyList();

            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var policyId = data[0].policyId;
        var policyNm = data[0].policyNm;
        var processGb = data[0].processGb;
        var remark = data[0].remark;
        var useYn = data[0].useYn;

        this.setState({
            modalPolicy: true,
            fiApprovalPolicyDto: {
                policyId: 0,
                policyNm: '',
                processGb: '01',
                remark: '',
                useYn: 'Y',
                regId: '',
                updId: '',
            },
        }, () => {
            this.setState({
                fiApprovalPolicyDto: {
                    policyId: policyId,
                    policyNm: policyNm,
                    processGb: processGb,
                    remark: remark,
                    useYn: useYn,
                    regId: '',
                    updId: '',
                },
            })
        })
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            fiApprovalPolicyDto: {
                ...this.state.fiApprovalPolicyDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }
    onClickModalClose() {
        this.setState({
            modalPolicyPurchase: false
        })
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Process</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="processGb"
                                        value={this.state.fiApprovalPolicyDto.processGb}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0205" deleteMinor={[]} isEmpty={false} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="primary" onClick={this.getPolicyList.bind(this)}>Search</Button>
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
                            // onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>

            {/* 정책 추가 Modal */}
            <Modal show={this.state.modalPolicy} backdrop="static" size="md">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.savePolicyData.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalPolicy: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Policy Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="policyNm"
                                        value={this.state.fiApprovalPolicyDto.policyNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        value={this.state.fiApprovalPolicyDto.remark} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Use Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.fiApprovalPolicyDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value={'Y'}>Y</option>
                                        <option value={'N'}>N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>
            </Modal>


            {/* 정책 설정 Modal */}
            <Modal show={this.state.modalPolicyPurchase} backdrop="static" size="xl">
                {this.state.modalPolicyPurchaseObj}
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
)(FiApprovalPolicyList)
