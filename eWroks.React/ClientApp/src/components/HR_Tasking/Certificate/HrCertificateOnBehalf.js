import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';


import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class HrCertificateOnBehalf extends Component {
    state = {
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'User Id', field: 'userId', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'User Nm',
                        field: 'userNm',
                        minWidth: 200
                    },
                    {
                        headerName: 'User Enm',
                        field: 'userEnm',
                        minWidth: 200
                    },
                    {
                        headerName: 'Login Id',
                        field: 'loginId',
                        minWidth: 500
                    },
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
    // 페이지 로드
    componentDidMount() {
        this.getUserList();
    }
   
    // 유저 조회
    async getUserList() {
        var gParams = {
            it_status_cd: this.state.it_status_cd_s,
            hr_status_cd: this.state.hr_status_cd_s
        }
        this.props.onIsLoadingTrue();
        var data = await this.props.storeState.axiosGet("/CmUserService/GetUserList", gParams);
        this.setState({
            // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
            masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
        }, () => {
            this.props.onIsLoadingFalse();
        });
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        this.setState({
            modalCertificate: true,
            hrCertificate: {
                certiId: 0,
                userId: e.data.userId,
                certiGb: "01",
                langGb: "01",
                docNo: "",
                reasonGb: "01",
                remark: "",
                docUrl: "",
                issueDt: "",
                statusCd: "01",
                mailYn: "N",
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
    /* 자장    */
    /*==========================================================*/
    saveCertificateData() {
        var gParam = {
            ...this.state.hrCertificate,
            certiId: Number(this.state.hrCertificate.certiId),
            userId: this.state.hrCertificate.userId, 
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
            this.getUserList();
            this.props.saveCallback();
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
                userId: this.state.hrCertificate.userId
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
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                            <Button variant="primary" onClick={this.getUserList.bind(this)}>Search</Button>
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

            {/* Role Program Modal */}
            <Modal show={this.state.modalCertificate} backdrop="static">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveCertificateData.bind(this)}>Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalCertificate: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Comment</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        className="responseRemarkBackcolor"
                                        value={this.state.hrCertificate.remark} onChange={this.onChangeModalHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
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
                            <div className="col-md-12" style={{ display: this.state.hrCertificate.certiGb === '02' ? 'inline' : 'none' }}>
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
                            <div className="col-md-12" style={{ display: this.state.hrCertificate.certiGb === '02' ? 'inline' : 'none' }}>
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
)(HrCertificateOnBehalf)
