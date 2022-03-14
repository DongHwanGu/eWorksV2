import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
class OfficeMgmtDetail extends Component {
    /*==========================================================*/
	/* State    */
    /*==========================================================*/
    state = {
        cmVendorDto: {
            vendorId: 0,
            vendorGb: '01',
            vendorNm: '',
            vendorEnm: '',
            zipCode: '',
            addrKr: '',
            addrEn: '',
            country: '',
            tel: '',
            fax: '',
            cdRef1: '',
            cdRef2: '',
            cdRef3: '',
            useYn: 'Y',
            businessNo: '',
            remark: '',
            regId: '',
            updId: '',

            fI_BankAccNo: '',
            fI_VendorId: '',
            fI_BankNm: '',
            fI_BankCd: '',
            fI_FileNm: '',
            fI_FileUrl: ''

        }
    }
    /*==========================================================*/
	/* Page Load    */
	/*==========================================================*/
    componentDidMount() {
        if(this.props.cmVendorDto !== '') 
        {
            this.setState({
                cmVendorDto: this.props.cmVendorDto
            })
        }

    }
    /*==========================================================*/
	/* 저장    */
	/*==========================================================*/
    saveVendorData() {
        if (this.state.cmVendorDto.vendorNm === '')
        {
            alert('[ vendorNm ] 값을 입력해 주세요.');
            return;
        }
        this.props.onIsLoadingTrue();
        this.setState({
            cmVendorDto: {
                ...this.state.cmVendorDto,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
            }
        }, () => {
            axios.post(this.props.storeState.serviceUrl + "/CmVendorService/SaveVendorData",
                this.state.cmVendorDto)
                .then(r => {
                    this.props.onIsLoadingFalse();
                    var data = r.data;
                    if (data.oV_RTN_CODE === -1) {
                        alert(data.oV_RTN_MSG);
                        return;
                    }
                    this.props.getVendorList();
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
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            cmVendorDto : {
                ...this.state.cmVendorDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeNumberHandler(e) {
        this.setState({
            cmVendorDto : {
                ...this.state.cmVendorDto,
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
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="success" onClick={this.saveVendorData.bind(this)}>Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Vendor Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="vendorId"
                                        value={this.state.cmVendorDto.vendorId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label className="validateText">■ Vendor Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="vendorNm"
                                        value={this.state.cmVendorDto.vendorNm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Vendor Enm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="vendorEnm"
                                        value={this.state.cmVendorDto.vendorEnm} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Zip Code</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="zipCode"
                                        value={this.state.cmVendorDto.zipCode} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Addr Kr</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="addrKr"
                                        value={this.state.cmVendorDto.addrKr} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Addr En</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="addrEn"
                                        value={this.state.cmVendorDto.addrEn} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Country</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="country"
                                        value={this.state.cmVendorDto.country} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Tel</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="tel"
                                        value={this.state.cmVendorDto.tel} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Fax</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="fax"
                                        value={this.state.cmVendorDto.fax} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ CdRef1</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="cdRef1"
                                        value={this.state.cmVendorDto.cdRef1} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ CdRef2</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="cdRef2"
                                        value={this.state.cmVendorDto.cdRef2} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ CdRef3</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="cdRef3"
                                        value={this.state.cmVendorDto.cdRef3} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ UseYn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.cmVendorDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Business No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="businessNo"
                                        value={this.state.cmVendorDto.businessNo} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        value={this.state.cmVendorDto.remark} onChange={this.onChangeHandler.bind(this)}
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
)(OfficeMgmtDetail)