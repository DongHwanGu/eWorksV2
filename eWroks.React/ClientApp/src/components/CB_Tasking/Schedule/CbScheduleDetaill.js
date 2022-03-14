import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';
import GDHSelectOption from '../../common/controls/GDHSelectOption';

import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';

class CbScheduleDetaill extends Component {
    state = {
        cbSchduleDto: {
            schId: 0
            , statusCd: '01'
            , workingDt: new Date()
            , teamCd: ''
            , terminal: ''
            , vessel: ''
            , customer: ''
            , product: ''
            , etaDt: new Date()
            , etaTime: new Date('9999', '12', '31', '00', '00')
            , etbDt: new Date()
            , etbTime: new Date('9999', '12', '31', '00', '00')
            , etcDt: new Date()
            , etcTime: new Date('9999', '12', '31', '00', '00')
            , pic: ''
            , picTime: ''
            , piC2: ''
            , ops: ''
            , bl: ''
            , vesselYn: false
            , lineYn: false
            , oneStFootYn: false
            , shoreYn: false
            , wwtYn: false
            , agent: ''
            , remark: ''
            , fileNm: ''
            , fileUrl: ''
            , regId: ''
            , updId: ''

            , statusCdNm: ''
            , teamCdNm: ''
            , regIdNm: ''
            , regDtNm: ''
            , updIdNm: ''
            , updDtNm: ''
            , etaFullDtNm: ''
            , etbFullDtNm: ''
            , etcFullDtNm: ''
            , picNm : ''
        },
        pICUserList: [],
    }

    /*==========================================================*/
	/* Page Load    */
	/*==========================================================*/
    componentDidMount() {
        this.getPICUserList();

        if (this.props.id !== '') {
            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/CbScheduleService/GetScheduleDetail", {
                params: {
                    schId: this.props.id
                }
            }).then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;

                data.workingDt = new Date(data.workingDt);
                data.etaDt = new Date(data.etaDt);
                data.etaTime = new Date('9999', '12', '31', data.etaTime.substr(0, 2), data.etaTime.substr(3, 2));
                data.etbDt = new Date(data.etbDt);
                data.etbTime = new Date('9999', '12', '31', data.etbTime.substr(0, 2), data.etbTime.substr(3, 2));
                data.etcDt = new Date(data.etcDt);
                data.etcTime = new Date('9999', '12', '31', data.etcTime.substr(0, 2), data.etcTime.substr(3, 2));
                data.vesselYn = data.vesselYn === 'Y' ? true : false;
                data.lineYn = data.lineYn === 'Y' ? true : false;
                data.oneStFootYn = data.oneStFootYn === 'Y' ? true : false;
                data.shoreYn = data.shoreYn === 'Y' ? true : false;
                data.wwtYn = data.wwtYn === 'Y' ? true : false;

                this.setState({
                    cbSchduleDto: data,
                })

            }).catch(function (error) {
                alert(error);
            });
        }
    }

    /*==========================================================*/
	/* Save    */
	/*==========================================================*/
    saveCbScheduleData() {
        // 마스터 설정
        var gParam = { ...this.state.cbSchduleDto }
        gParam.workingDt = this.props.storeState.getParsedDate(gParam.workingDt);
        gParam.etaDt = this.props.storeState.getParsedDate(gParam.etaDt);
        gParam.etaTime = this.props.storeState.getParsedTime(gParam.etaTime);
        gParam.etbDt = this.props.storeState.getParsedDate(gParam.etbDt);
        gParam.etbTime = this.props.storeState.getParsedTime(gParam.etbTime);
        gParam.etcDt = this.props.storeState.getParsedDate(gParam.etcDt);
        gParam.etcTime = this.props.storeState.getParsedTime(gParam.etcTime);
        gParam.vesselYn = gParam.vesselYn === true? "Y" : "N";
        gParam.lineYn = gParam.lineYn === true? "Y" : "N";
        gParam.oneStFootYn = gParam.oneStFootYn === true? "Y" : "N";
        gParam.shoreYn = gParam.shoreYn === true? "Y" : "N";
        gParam.wwtYn = gParam.wwtYn === true ? "Y" : "N";
        gParam.regId = this.props.storeState.userInfo.userId;
        gParam.updId = this.props.storeState.userInfo.userId;

        axios.post(this.props.storeState.serviceUrl + "/CbScheduleService/SaveCbScheduleData",
        gParam)
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
	/* PIC User List    */
	/*==========================================================*/
    getPICUserList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbScheduleService/GetPICUserList", {
            params: {
                date: this.props.storeState.getParsedDate(this.state.cbSchduleDto.workingDt, ""),
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                pICUserList: data
            })
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
            cbSchduleDto : {
                ...this.state.cbSchduleDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onDateChangeHandler(name, date) {
        this.setState({
            cbSchduleDto: {
                ...this.state.cbSchduleDto,
                [name]: date
            }
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
        frmFiles.append('filePath', 'CbSchedule')
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
                cbSchduleDto: {
                    ...this.state.cbSchduleDto,
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
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="success" id="btnSave" onClick={this.saveCbScheduleData.bind(this)}
                                >Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.cbSchduleDto.statusCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0063" deleteMinor={[]} isEmpty={false} isEmptyText="" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Update</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        value={this.state.cbSchduleDto.updIdNm + " (" + this.state.cbSchduleDto.updDtNm + ")"}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 작업일</Form.Label>
                                    <GDHDatepicker
                                        name='workingDt'
                                        value={this.state.cbSchduleDto.workingDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Team</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="teamCd"
                                        value={this.state.cbSchduleDto.teamCd} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0064" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Terminal</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="terminal"
                                        value={this.state.cbSchduleDto.terminal} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Vessel</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="vessel"
                                        value={this.state.cbSchduleDto.vessel} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Customer</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="customer"
                                        value={this.state.cbSchduleDto.customer} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Product</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="product"
                                        value={this.state.cbSchduleDto.product} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <table>
                                    <colgroup>
                                        <col style={{ width: '60%' }} />
                                        <col style={{ width: '40%' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Group>
                                                    <Form.Label>■ ETA</Form.Label>
                                                    <GDHDatepicker
                                                        name='etaDt'
                                                        value={this.state.cbSchduleDto.etaDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </td>
                                            <td>
                                                <Form.Label style={{ marginTop: 15 }}>{' '}</Form.Label>
                                                <Form.Group>
                                                    <GDHDatepickerTime
                                                        name='etaTime'
                                                        value={this.state.cbSchduleDto.etaTime} onDateChange={this.onDateChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-3">
                                <table>
                                    <colgroup>
                                        <col style={{ width: '60%' }} />
                                        <col style={{ width: '40%' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Group>
                                                    <Form.Label>■ ETB</Form.Label>
                                                    <GDHDatepicker
                                                        name='etbDt'
                                                        value={this.state.cbSchduleDto.etbDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </td>
                                            <td>
                                                <Form.Label style={{ marginTop: 15 }}>{' '}</Form.Label>
                                                <Form.Group>
                                                    <GDHDatepickerTime
                                                        name='etbTime'
                                                        value={this.state.cbSchduleDto.etbTime} onDateChange={this.onDateChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-3">
                                <table>
                                    <colgroup>
                                        <col style={{ width: '60%' }} />
                                        <col style={{ width: '40%' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Group>
                                                    <Form.Label>■ ETC</Form.Label>
                                                    <GDHDatepicker
                                                        name='etcDt'
                                                        value={this.state.cbSchduleDto.etcDt} onDateChange={this.onDateChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </td>
                                            <td>
                                                <Form.Label style={{ marginTop: 15 }}>{' '}</Form.Label>
                                                <Form.Group>
                                                    <GDHDatepickerTime
                                                        name='etcTime'
                                                        value={this.state.cbSchduleDto.etcTime} onDateChange={this.onDateChangeHandler.bind(this)}
                                                    />
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ OPS</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="ops"
                                        value={this.state.cbSchduleDto.ops} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <table>
                                    <colgroup>
                                        <col style={{ width: '60%' }} />
                                        <col style={{ width: '40%' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Group>
                                                    <Form.Label>■ PIC</Form.Label>
                                                    <Form.Control as="select" size="sm"
                                                        name="pic"
                                                        value={this.state.cbSchduleDto.pic} onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                        <option key={-1} value={0}>{"=== Select ==="}</option>
                                                        {
                                                            this.state.pICUserList.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.userId}>{item.userNm}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                                
                                            </td>
                                            <td>
                                                <Form.Group>
                                                    <Form.Label style={{ marginTop: 13 }}>{' '}</Form.Label>
                                                    <Form.Control type="text" size="sm"
                                                        name="picTime"
                                                        value={this.state.cbSchduleDto.picTime} onChange={this.onChangeHandler.bind(this)}
                                                        readOnly
                                                    />
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ PIC2</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="piC2"
                                        value={this.state.cbSchduleDto.piC2} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>■ ANALYSIS</Form.Label>
                                    <table style={{ width: '100%', borderBottom:'1px solid #ddd' }}>
                                        <colgroup>
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '20%' }} />
                                            <col style={{ width: '20%' }} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Form.Group controlId="vesselYn">
                                                        <Form.Check
                                                            inline
                                                            label="Vessel" name="vesselYn" type="checkbox"
                                                            checked={this.state.cbSchduleDto.vesselYn}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    cbSchduleDto: {
                                                                        ...this.state.cbSchduleDto,
                                                                        vesselYn: e.target.checked
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Group controlId="lineYn">
                                                        <Form.Check
                                                            inline
                                                            label="Line" name="lineYn" type="checkbox"
                                                            checked={this.state.cbSchduleDto.lineYn}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    cbSchduleDto: {
                                                                        ...this.state.cbSchduleDto,
                                                                        lineYn: e.target.checked
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Group controlId="oneStFootYn">
                                                        <Form.Check
                                                            inline
                                                            label="1st" name="oneStFootYn" type="checkbox"
                                                            checked={this.state.cbSchduleDto.oneStFootYn}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    cbSchduleDto: {
                                                                        ...this.state.cbSchduleDto,
                                                                        oneStFootYn: e.target.checked
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Group controlId="shoreYn">
                                                        <Form.Check
                                                            inline
                                                            label="Shore" name="shoreYn" type="checkbox"
                                                            checked={this.state.cbSchduleDto.shoreYn}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    cbSchduleDto: {
                                                                        ...this.state.cbSchduleDto,
                                                                        shoreYn: e.target.checked
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Group controlId="wwtYn">
                                                        <Form.Check
                                                            inline
                                                            label="WWT" name="wwtYn" type="checkbox"
                                                            checked={this.state.cbSchduleDto.wwtYn}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    cbSchduleDto: {
                                                                        ...this.state.cbSchduleDto,
                                                                        wwtYn: e.target.checked
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                  
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ B/L</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="bl"
                                        value={this.state.cbSchduleDto.bl} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ AGENT</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="agent"
                                        value={this.state.cbSchduleDto.agent} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ File Attached</Form.Label>
                                    <Form.File
                                        style={{ zIndex: 0 }}
                                        label="file upload click !!"
                                        custom
                                        multiple={false}
                                        onChange={this.onfileUploadClick.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group style={{ marginBottom: 10, fontWeight: 'bold' }}>
                                    <Form.Label style={{ marginTop: 15 }}>{' '}</Form.Label>
                                    <Form.Row style={{ paddingLeft: 15 }}>
                                        <a href={this.state.cbSchduleDto.fileUrl} target={'_blank'}>
                                            {this.state.cbSchduleDto.fileNm}
                                        </a>
                                        {
                                            this.state.cbSchduleDto.fileNm !== ''
                                                ? <><>&nbsp;&nbsp;&nbsp;</>
                                                    <a href={'#'} style={{ color: 'black', fontSize: 15 }} onClick={(e) => {
                                                        e.preventDefault();
                                                        this.setState({
                                                            cbSchduleDto: {
                                                                ...this.state.cbSchduleDto,
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
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label >■ Remark</Form.Label>
                                    <Form.Control as="textarea" rows={3} 
                                        name="remark"
                                        value={this.state.cbSchduleDto.remark} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>
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
)(CbScheduleDetaill)
