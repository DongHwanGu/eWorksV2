import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class CmCodeDetail extends Component {
    state = {
        newYn: 'Y',
        cmCodeDto: {
            cdMajor: '', cdMinor: '', useYn: 'Y', fullName: '', smallName: ''
            , frCdMinor: '', seCdMinor: '', cdLevel: '', cdOrder: '0', cdRef1: ''
            , cdRef2: '', cdRef3: '', cdRef4: '', cdRef5: '', cdProperty: ''
            , regId: '', updId: ''
        }
    }
    initControls() {
        this.setState({
            newYn: 'Y',
            cmCodeDto: {
                cdMajor: '', cdMinor: '', useYn: 'Y', fullName: '', smallName: ''
                , frCdMinor: '', seCdMinor: '', cdLevel: '', cdOrder: '0', cdRef1: ''
                , cdRef2: '', cdRef3: '', cdRef4: '', cdRef5: '', cdProperty: ''
                , regId: '', updId: ''
            }
        })
    }
    // 페이지 로드
    componentDidMount() {
        if (this.props.cmCodeDto === '') {
            this.initControls();
        } else {
            // 넘겨온값 받기
            this.setState({
                newYn: 'N',
                cmCodeDto: this.props.cmCodeDto
            })
        }
    }
    // 저장
    saveCmCodeData(e) {
        if (this.state.cmCodeDto.cdMajor === '' || this.state.cmCodeDto.cdMajor.length !== 4)
        {
            alert('[ CdMajor ] 4자리 숫자로 입력해 주세요.');
            return;
        }
        if (this.state.cmCodeDto.cdMinor === '' || this.state.cmCodeDto.cdMinor.length !== 2)
        {
            alert('[ CdMinor ] 2자리 숫자로 입력해 주세요.');
            return;
        }
        if (this.state.cmCodeDto.fullName === '')
        {
            alert('[ FullName ] 값을 입력해 주세요.');
            return;
        }
        if (this.state.cmCodeDto.smallName === '')
        {
            alert('[ SmallName ] 값을 입력해 주세요.');
            return;
        }
        if (this.state.cmCodeDto.cdLevel === '')
        {
            alert('[ CdLevel ] 값을 입력해 주세요.');
            return;
        }
        if (this.state.cmCodeDto.cdOrder === '')
        {
            alert('[ Seq ] 값을 입력해 주세요.');
            return;
        }
        this.setState({
            cmCodeDto: {
                ...this.state.cmCodeDto,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
            }
        }, () => {
            axios.post(this.props.storeState.serviceUrl + "/CmCodeService/SaveCmCodeData",
                this.state.cmCodeDto)
                .then(r => {
                    var data = r.data;
                    if (data.oV_RTN_CODE === -1) {
                        alert(data.oV_RTN_MSG);
                        return;
                    }
                    this.initControls();
                    this.props.saveCallback();
                }).catch(function (error) { 
                    alert(error); 
                });
        });
    }
    // New 생성 클릭
    onClickNew() {
        this.initControls();
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            cmCodeDto: {
                ...this.state.cmCodeDto,
                [e.target.name]: e.target.value
            }
        });
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>New</Button>{' '}
                                <Button variant="success" onClick={this.saveCmCodeData.bind(this)}>Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ CdMajor</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdMajor"
                                        value={this.state.cmCodeDto.cdMajor} onChange={this.onChangeHandler.bind(this)} 
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ CdMinor</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="cdMinor"
                                        value={this.state.cmCodeDto.cdMinor} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ UseYn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.cmCodeDto.useYn} onChange={this.onChangeHandler.bind(this)} 
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Full Name</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="fullName"
                                        value={this.state.cmCodeDto.fullName} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Small Name</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="smallName"
                                        value={this.state.cmCodeDto.smallName} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Cd Level</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdLevel"
                                        value={this.state.cmCodeDto.cdLevel} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Seq</Form.Label>
                                    <Form.Control type="number" size="sm" 
                                        name="cdOrder"
                                        value={this.state.cmCodeDto.cdOrder} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Fr Minor</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="frCdMinor"
                                        value={this.state.cmCodeDto.frCdMinor} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Se Minor</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="seCdMinor"
                                        value={this.state.cmCodeDto.seCdMinor} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Ref1</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdRef1"
                                        value={this.state.cmCodeDto.cdRef1} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Ref2</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdRef2"
                                        value={this.state.cmCodeDto.cdRef2} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Ref3</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdRef3"
                                        value={this.state.cmCodeDto.cdRef3} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Ref4</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdRef4"
                                        value={this.state.cmCodeDto.cdRef4} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Ref5</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdRef5"
                                        value={this.state.cmCodeDto.cdRef5} onChange={this.onChangeHandler.bind(this)} 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Property</Form.Label>
                                    <Form.Control type="text" size="sm" 
                                        name="cdProperty"
                                        value={this.state.cmCodeDto.cdProperty} onChange={this.onChangeHandler.bind(this)} 
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
        }
    }
)(CmCodeDetail);