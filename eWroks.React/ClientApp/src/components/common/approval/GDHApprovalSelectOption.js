import React, { Component } from 'react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';


class GDHApprovalSelectOption extends Component {
    state={
        approvalCd: this.props.approvalCd,
        approvalGb: this.props.approvalGb,
        isEmpty: this.props.isEmpty,
        isEmptyText: this.props.isEmptyText,
        userId: this.props.storeState.userInfo.userId,
        options: []
    }
    componentDidMount() {
        axios.get(this.props.storeState.serviceUrl + "/CommonService/GetApprovalUserList", {
            params: {
                userId: this.props.storeState.userInfo.userId,
                approvalGb: this.state.approvalGb,
                approvalCd: this.state.approvalCd
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
                ...this.state, options: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    render() {
        return (<>
            {
                this.state.isEmpty 
                    ? <option key={-1} value={""}>{this.state.isEmptyText}</option>
                    : null
            }
            { this.state.options.length > 0
            && this.state.options.map((item, i) => {
                return (
                    <option key={i} value={item.approvalUserId}>{item.userNm}</option>
                )
            })}
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
)(GDHApprovalSelectOption)