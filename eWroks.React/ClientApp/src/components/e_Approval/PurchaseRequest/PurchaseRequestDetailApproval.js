import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { InputGroup, Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

class PurchaseRequestDetailApproval extends Component {
    state = {
        policyId: this.props.row.policyId,
        itemId: this.props.row.itemId,
        levelSeq: this.props.row.levelSeq,
        apprCd: this.props.row.apprCd,

        approvalUserId: '',
        boolAdd: false,
        approvalUserIdAdd: '',

        options: [],
    }
    componentDidMount() {
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetApprovalUserList", {
            params: {
                policyId: this.props.row.policyId,
                apprCd: this.props.row.apprCd,
                userId: this.props.storeState.userInfo.userId,
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                ...this.state, options: data,
            })
        }).catch(function (error) {
            alert(error);
        });
    }


    // 필드 추가
    onClickPlus() {
        this.setState({
            boolAdd: true
        })
        this.props.onApprovalPlus((this.state.levelSeq + 0.1), this.state.apprCd, '');
    }
    // 필드 삭제
    onClickMinus() {
        this.setState({
            boolAdd: false
        })
        this.props.onApprovalMinus((this.state.levelSeq + 0.1), this.state.apprCd, '');
    }

    // 체인지 공통
    onChangeHandler(e) {
        var value = e.target.value;
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            this.props.onChageApprovalUser(this.state.levelSeq, this.state.apprCd, value)
        })
    }
     // 체인지 공통
     onChangeHandler2(e) {
        var value = e.target.value;
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            this.props.onChageApprovalUser((this.state.levelSeq + 0.1), this.state.apprCd, value)
        })
    }
    render() {
        return (<>
            <div className="col-md-12">
                <Form.Group>
                    <Form.Label>{this.props.row.apprCdNm}</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control as="select"
                            name="approvalUserId"
                            value={this.state.approvalUserId}
                            onChange={this.onChangeHandler.bind(this)}>
                            {
                                <option key={-1} value={""}>{'=== Select ==='}</option>
                            }
                            {this.state.options.length > 0
                                && this.state.options.map((item, i) => {
                                    return (
                                        <option key={i} value={item.userId}>{item.userNm}</option>
                                    )
                                })}
                        </Form.Control>
                        {
                            this.state.apprCd === '02'
                                ? <InputGroup.Append>
                                    <Button variant="secondary" size="sm" style={{ height: 38 }}
                                        onClick={this.onClickPlus.bind(this)}
                                    >
                                        <i className='fa fa-plus' />
                                    </Button>
                                </InputGroup.Append>
                                : <></>
                        }
                    </InputGroup>
                </Form.Group>
            </div>
            {
                this.state.boolAdd
                    ? <div className="col-md-12">
                        <Form.Group>
                            <Form.Label>{this.props.row.apprCdNm}</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control as="select"
                                    name="approvalUserIdAdd"
                                    value={this.state.approvalUserIdAdd}
                                    onChange={this.onChangeHandler2.bind(this)}>
                                    {
                                        <option key={-1} value={""}>{'=== Select ==='}</option>
                                    }
                                    {this.state.options.length > 0
                                        && this.state.options.map((item, i) => {
                                            return (
                                                <option key={i} value={item.userId}>{item.userNm}</option>
                                            )
                                        })}
                                </Form.Control>
                                <InputGroup.Append>
                                    <Button variant="secondary" size="sm" style={{ height: 38 }}
                                        onClick={this.onClickMinus.bind(this)}
                                    >
                                        <i className='fa fa-minus' />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </div>
                    : <></>
            }
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
)(PurchaseRequestDetailApproval)
