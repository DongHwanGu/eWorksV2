import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class ProgramDetail extends Component {
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state = {
        upProgramIdList: [],
        cmProgramDto: {
            programId: "",
            programNm: "",
            programUrl: "",
            upProgramId: "",
            dispSeq: 0,
            programLevel: 0,
            useYn: "Y",
            programIcon: "",
            regId: "",
            updId: "",
        }
    }
    /*==========================================================*/
	/* 페이지 로드    */
	/*==========================================================*/
    componentDidMount() {
        this.getUpProgramIdOptions();

        if (this.props.cmProgramDto !== '') {
            this.setState({
                cmProgramDto: this.props.cmProgramDto
            })
        }
    }
    /*==========================================================*/
	/* 저장    */
	/*==========================================================*/
    saveProgramData(e) {
        if (this.state.cmProgramDto.programNm === '')
        {
            alert('[ programNm ] 값을 입력해 주세요.');
            return;
        }
        this.setState({
            cmProgramDto: {
                ...this.state.cmProgramDto,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
            }
        }, () => {
            axios.post(this.props.storeState.serviceUrl + "/CmProgramService/SaveProgramData",
                this.state.cmProgramDto)
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
        })
    }
    /*==========================================================*/
	/* 신규생성    */
	/*==========================================================*/
    onClickNew() {
        this.props.onClickNew();
    }
    /*==========================================================*/
	/* 필드 체인지 공통    */
	/*==========================================================*/
    onChangeHandler(e) {
        this.setState({
            cmProgramDto: {
                ...this.state.cmProgramDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeNumberHandler(e) {
        this.setState({
            cmProgramDto: {
                ...this.state.cmProgramDto,
                [e.target.name]: Number(e.target.value)
            }
        });
    }
    /*==========================================================*/
	/* Up Program List 조회    */
	/*==========================================================*/
    getUpProgramIdOptions() {
        axios.get(this.props.storeState.serviceUrl + "/CmProgramService/GetUpProgramIdOptions")
        .then(r => {
            var data = r.data;
            this.setState({
                upProgramIdList: data
            });
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
	/* Render    */
	/*==========================================================*/
    render() {
        let upProgramId_options = this.state.upProgramIdList.length > 0
            && this.state.upProgramIdList.map((item, i) => {
                return (
                    <option key={i} value={item.programId}>{item.programNm}</option>
                )
            }, this);

        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>New</Button>{' '}
                                <Button variant="success" onClick={this.saveProgramData.bind(this)}>Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Program Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="programId"
                                        value={this.state.cmProgramDto.programId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Program Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="programNm"
                                        value={this.state.cmProgramDto.programNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Program Url</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="programUrl"
                                        value={this.state.cmProgramDto.programUrl} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Up Program Id</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="upProgramId"
                                        value={this.state.cmProgramDto.upProgramId} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option key={-1} value={""}>{"=== Select ==="}</option>
                                        {upProgramId_options}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Disp Seq</Form.Label>
                                    <Form.Control type="number" size="sm"
                                        name="dispSeq"
                                        value={this.state.cmProgramDto.dispSeq} onChange={this.onChangeNumberHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Use Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.cmProgramDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Program Icon</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="programIcon"
                                        value={this.state.cmProgramDto.programIcon} onChange={this.onChangeHandler.bind(this)}
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
)(ProgramDetail);