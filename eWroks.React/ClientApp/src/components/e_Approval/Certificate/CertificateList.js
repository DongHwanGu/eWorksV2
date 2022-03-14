import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class CertificateList extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        sStartDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        sEndDt: new Date(),
        sStatusCd: "",
        reportUrl: '',
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Certificate', field: 'certiGbNm', minWidth: 100 },
                    { headerName: 'Language', field: 'langGbNm', minWidth: 100 },
                    { headerName: 'Reason', field: 'reasonGbNm', minWidth: 100 },
                    { headerName: 'Document No', field: 'docNo', minWidth: 100 },
                    { headerName: 'Issue Dt', field: 'issueDt', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
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
        modalCertificate: false,
        modalMoveList: [],
        hrCertificate: {
            certiId: 0,
            userId: "",
            certiGb: "01",
            langGb: "01",
            docNo: "",
            reasonGb: "01",
            remark: "",
            docUrl: "",
            issueDt: "",
            statusCd: "01",
            mailYn: "Y",
            printTitle: "",
            printReason: "",
            printYn: "",
            moveId: 999,
            inMoveYn: "N",
            regId: "",
            updId: "",
        }
    }

    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        this.getCertificateList();
    }


    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({
            modalCertificate: true,
            hrCertificate: {
                certiId: 0,
                userId: "",
                certiGb: "01",
                langGb: "01",
                docNo: "",
                reasonGb: "01",
                remark: "",
                docUrl: "",
                issueDt: "",
                statusCd: "01",
                mailYn: "Y",
                printTitle: "",
                printReason: "",
                printYn: "",
                moveId: 999,
                inMoveYn: "N",
                regId: "",
                updId: "",
            }
        })
    }

    /*==========================================================*/
    /*  List    */
    /*==========================================================*/
    getCertificateList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrCertificateService/GetCertificateList", {
            params: {
                sStartDt: this.props.storeState.getParsedDate(this.state.sStartDt),
                sEndDt: this.props.storeState.getParsedDate(this.state.sEndDt),
                sStatusCd: this.state.sStatusCd === '' ? '' : this.state.sStatusCd,
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            this.props.onIsLoadingFalse();
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            });
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* Move List    */
    /*==========================================================*/
    getMoveList() {
        axios.get(this.props.storeState.serviceUrl + "/HrCertificateService/GetMoveList", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        })
        .then(r => {
            var data = r.data;
            this.setState({
                modalMoveList: data
            });
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 자장    */
    /*==========================================================*/
    saveCertificateData() {
        var gParam = {
            ...this.state.hrCertificate,
            certiId: Number(this.state.hrCertificate.certiId),
            userId: this.props.storeState.userInfo.userId, 
            moveId: this.state.hrCertificate.certiGb === '02' ? Number(this.state.hrCertificate.moveId) : 0,
            inMoveYn: this.state.hrCertificate.certiGb === '02' ? this.state.hrCertificate.inMoveYn : '',
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
        }

        axios.post(this.props.storeState.serviceUrl + "/HrCertificateService/SaveCertificateData",
            gParam)
        .then(r => {
            var data = r.data;
            
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalCertificate: false
            })
            this.getCertificateList();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        this.setState({
            modalCertificate: true,
        }, () => {
            setTimeout(function() { //Start the timer
                this.setState({
                    hrCertificate: e.data
                }, () => {
                    if (e.data.certiGb === '02') // 경력 증명서
                    {
                        axios.get(this.props.storeState.serviceUrl + "/HrCertificateService/GetMoveList", {
                            params: {
                                userId: this.props.storeState.userInfo.userId
                            }
                        }).then(r => {
                                var data = r.data;
                                this.setState({
                                    modalMoveList: data
                                }, () => {
                                    this.setState({
                                        hrCertificate: {
                                            ...this.state.hrCertificate,
                                            moveId: e.data.moveId,
                                            inMoveYn: e.data.inMoveYn
                                        }
                                    })
                                });
                            }).catch(function (error) {
                                alert(error);
                            });
                    }
                })
            }.bind(this), 200)
        })
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onChangeModalHandler(e) {
        this.setState({
            hrCertificate: {
                ...this.state.hrCertificate,
                [e.target.name]: e.target.value
            }
        });
        if (e.target.name === 'certiGb') {
            if(e.target.value === '02')
            {
                this.getMoveList();
            }
        }
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
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
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Start Dt</Form.Label>
                                                <table>
                                                    <tbody>

                                                        <tr>
                                                            <td>
                                                                <GDHDatepicker
                                                                    name='sStartDt'
                                                                    value={this.state.sStartDt} onDateChange={this.onDateChange.bind(this)}
                                                                />
                                                            </td>
                                                            <td>{'~'}</td>
                                                            <td>
                                                                <GDHDatepicker
                                                                    name='sEndDt'
                                                                    value={this.state.sEndDt} onDateChange={this.onDateChange.bind(this)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="sStatusCd"
                                                    value={this.state.sStatusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0022" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                            <Button variant="primary" onClick={this.getCertificateList.bind(this)} >Search</Button>
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
                    </div>
                </Tab>
            </Tabs>

            {/* Role Program Modal */}
            <Modal show={this.state.modalCertificate} backdrop="static">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        {
                            this.state.hrCertificate.statusCd === '10' || this.state.hrCertificate.statusCd === '99' 
                            ? <></>
                            : <><Button variant="success" onClick={this.saveCertificateData.bind(this)} >Save</Button>{' '}</>
                        }
                        {
                            this.state.hrCertificate.statusCd === '10' && this.state.hrCertificate.docNo !== ''
                            ? <>
                                <Button variant="info" onClick={function(e) {
                                    var userId = this.props.storeState.userInfo.userId;
                                    var page = "CertificateReport";
                                    var key = this.state.hrCertificate.certiId;
                                    var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                    window.open(this.props.storeState.reportUrl + url, '_blank');
                                }.bind(this)}>Print</Button>{' '}
                            </>
                            : this.state.hrCertificate.statusCd === '10' && this.state.hrCertificate.docNo === ''
                                    ? <span style={{ color: 'red' }}>PDF : 생성 후 3일 경과로 다운로드 할 수 없습니다.</span>
                                : <></>
                        }
                        
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalCertificate: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            {
                                this.state.hrCertificate.statusCd !== '10' && this.state.hrCertificate.statusCd !== '99' 
                                ? <></>
                                : <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Comment</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="remark"
                                                className="responseRemarkBackcolor"
                                                value={this.state.hrCertificate.remark}
                                            />
                                        </Form.Group>
                                    </div>
                            }
                            
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.hrCertificate.statusCd}
                                        onChange={this.onChangeModalHandler.bind(this)}
                                        disabled={true}
                                        >
                                        
                                        <GDHSelectOption cdMajor="0022" deleteMinor={[]} isEmpty={false} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Type</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="certiGb"
                                        value={this.state.hrCertificate.certiGb}
                                        onChange={this.onChangeModalHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0019" deleteMinor={[]} isEmpty={false} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12" style={{display: this.state.hrCertificate.certiGb === '02' ? 'inline' : 'none' }}>
                                <Form.Group>
                                    <Form.Label>■ Career</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="moveId"
                                        value={this.state.hrCertificate.moveId} onChange={this.onChangeModalHandler.bind(this)}
                                    >
                                        {
                                            this.state.modalMoveList.map((item, i) => {
                                                return (
                                                    <option key={i} value={item.moveId}>{item.moveNm}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12" style={{display: this.state.hrCertificate.certiGb === '02' ? 'inline' : 'none' }}>
                                <Form.Group>
                                    <Form.Label>■ Including Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="inMoveYn"
                                        value={this.state.hrCertificate.inMoveYn} onChange={this.onChangeModalHandler.bind(this)}
                                    >
                                        <option value="N">N</option>
                                        <option value="Y">Y</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Language</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="langGb"
                                        value={this.state.hrCertificate.langGb}
                                        onChange={this.onChangeModalHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0020" deleteMinor={[]} isEmpty={false} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Reason</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="ReasonGb"
                                        value={this.state.hrCertificate.ReasonGb}
                                        onChange={this.onChangeModalHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0021" deleteMinor={[]} isEmpty={false} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                    <p><b>&nbsp;&nbsp;[ 알림 ]</b></p>
                    <p style={{ color: '#ff6a00', fontWeight: 'bold' }}>&nbsp;&nbsp;1. 경력증명서 선택 시 인터텍 이전 경력으로 발급이 진행 됨</p>
                    <p style={{ color: '#ff6a00', fontWeight: 'bold' }}>&nbsp;&nbsp;2. 온라인 발급 후 원본에 대한 증빙이 필요한 경우</p>
                    <p>&nbsp;&nbsp;&nbsp;- 온라인 발급 진행 후 해당 서류를 지참하여 HR Team 으로 방문(원본대조필 및 직인 날인)</p>
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
)(CertificateList)
