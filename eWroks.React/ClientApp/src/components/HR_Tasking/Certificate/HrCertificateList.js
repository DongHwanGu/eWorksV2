import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import HrCertificateOnBehalf from './HrCertificateOnBehalf';

class HrCertificateList extends Component {
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
                    { headerName: 'Req Nm', field: 'regIdNm', minWidth: 100 },
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
            moveId: 0,
            inMoveYn: "",
            regId: "",
            updId: "",

            statusCdNm: '',
            certiGbNm: '',
            langGbNm: '',
            reasonGbNm: '',

            moveIdNm: '',
            regIdNm: '',
            regDtNm: '',
            regIdDeptFullNm: '',
        }
    }

    componentDidMount() {
        this.getResponseCertificateList();
    }

    /*==========================================================*/
    /*  List    */
    /*==========================================================*/
    getResponseCertificateList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/HrCertificateService/GetResponseCertificateList", {
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
    /* 승인 리젝 저장    */
    /*==========================================================*/
    saveResponseCertificate(e) {
        var btnId = e.target.id;
        var gParam = { 
            ...this.state.hrCertificate,
            statusCd: btnId === 'btnApproval' ? '10' : '99',
            updId: this.props.storeState.userInfo.userId
        };
        axios.post(this.props.storeState.serviceUrl + "/HrCertificateService/SaveResponseCertificate", gParam)
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.setState({
                modalCertificate: false
            });
            this.getResponseCertificateList();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /*  더블 클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        this.setState({
            modalCertificate: true,
            hrCertificate: e.data
        })
    }

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onChangeModalHandler(e) {
        if (e.target.name === 'printYn') {
            this.setState({
                hrCertificate: {
                    ...this.state.hrCertificate,
                    [e.target.name]: e.target.checked === true ? 'Y' : 'N'
                }
            });
        } else {
            this.setState({
                hrCertificate: {
                    ...this.state.hrCertificate,
                    [e.target.name]: e.target.value
                }
            });
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
                                            <Button variant="primary" onClick={this.getResponseCertificateList.bind(this)} >Search</Button>
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
                <Tab eventKey="detail" title="On Behalf">
                    <div style={{ marginTop: 15 }}>
                        <HrCertificateOnBehalf saveCallback={this.getResponseCertificateList.bind(this)} />
                    </div>
                </Tab>
            </Tabs>

            {/* Role Program Modal */}
            <Modal show={this.state.modalCertificate} backdrop="static" size='lg'>
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        {
                            this.state.hrCertificate.statusCd === '10' || this.state.hrCertificate.statusCd === '99' 
                            ? <>
                                <Button variant="info" onClick={function(e) {
                                    var userId = this.props.storeState.userInfo.userId;
                                    var page = "CertificateReport";
                                    var key = this.state.hrCertificate.certiId;
                                    var url = '/?userId=' + userId + '&page=' + page + '&key=' + key;
                                    window.open(this.props.storeState.reportUrl + url, '_blank');
                                }.bind(this)}>Print</Button>{' '}
                            </>
                            : <>
                                <Button variant="success" id="btnApproval" onClick={this.saveResponseCertificate.bind(this)} >Approval</Button>{' '}
                                <Button variant="danger" id="btnReject" onClick={this.saveResponseCertificate.bind(this)} >Reject</Button>{' '}
                            </>
                        }
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalCertificate: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="table-responsive">
                                <Table bordered style={{ marginTop: 15, tableLayout: 'fixed' }} >
                                    <colgroup>
                                        <col style={{ width: '130px' }} />
                                        <col style={{ width: '200px' }} />
                                        <col style={{ width: '130px' }} />
                                        <col style={{ width: '200px' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr style={{ borderTop: '5px solid #e9ecef' }}>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Comment</th>
                                            <td colSpan={3}>
                                                <Form.Control type="text" size="sm"
                                                    name="remark"
                                                    className="responseRemarkBackcolor"
                                                    value={this.state.hrCertificate.remark} onChange={this.onChangeModalHandler.bind(this)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Request Nm</th>
                                            <td>
                                                {this.state.hrCertificate.regIdNm}
                                            </td>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Department</th>
                                            <td>
                                                {this.state.hrCertificate.regIdDeptFullNm}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Status</th>
                                            <td>
                                                {this.state.hrCertificate.statusCdNm}
                                            </td>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Type</th>
                                            <td>
                                                {this.state.hrCertificate.certiGbNm}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Language</th>
                                            <td>
                                                {this.state.hrCertificate.langGbNm}
                                            </td>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Reason</th>
                                            <td>
                                                {this.state.hrCertificate.reasonGbNm}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Career</th>
                                            <td>
                                                {this.state.hrCertificate.moveIdNm}
                                            </td>
                                            <th style={{ backgroundColor: '#e9ecef' }}>■ Including Yn</th>
                                            <td>
                                                {this.state.hrCertificate.inMoveYn}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <Form.Check
                                                    inline
                                                    label="Print"
                                                    name="printYn"
                                                    type='checkbox'
                                                    id='printYn'
                                                    style={{ fontSize: 13, fontWeight: 'bold' }}
                                                    checked={this.state.hrCertificate.printYn === 'Y' ? true : false}
                                                    onChange={this.onChangeModalHandler.bind(this)}
                                                /><br />
                                                <Form.Control type="text" size="sm"
                                                    name="printTitle"
                                                    value={this.state.hrCertificate.printTitle} onChange={this.onChangeModalHandler.bind(this)}
                                                />
                                            </th>
                                            <td colSpan={3}>
                                                <Form.Control as="textarea" rows={3}
                                                    name="printReason"
                                                    value={this.state.hrCertificate.printReason} onChange={this.onChangeModalHandler.bind(this)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
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
)(HrCertificateList)
