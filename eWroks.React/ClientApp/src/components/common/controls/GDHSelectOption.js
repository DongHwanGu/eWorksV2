import React, { Component } from 'react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';


class GDHSelectOption extends Component {
    state={
        cdMajor: this.props.cdMajor,
        deleteMinor: this.props.deleteMinor,
        isEmpty: this.props.isEmpty,
        isEmptyText: this.props.isEmptyText,
        level: this.props.level,
        frCdMinor: this.props.frCdMinor,
        userId: this.props.storeState.userInfo.userId,
        options: []
    }
    async componentDidMount() {
        var gParams = {
            cdMajor: this.state.cdMajor,
            userId: this.state.userId
        }
        var data = await this.props.storeState.axiosGet("/CommonService/GetCodeOpions", gParams);
        this.setState({
            ...this.state, options: data
        });
    }
    render() {
        // let _options = this.state.options.length > 0
        //     && this.state.options.map((item, i) => {
        //         // 삭제할게 있는지 확인
        //         if (this.state.deleteMinor.indexOf(item.cdMinor) > -1) {
        //             return (<React.Fragment key={i}></React.Fragment>);
        //         }
        //         // 레벨 몇을 가져오는지 
        //         if (this.state.level !== undefined) {
        //             if(this.state.level !== item.cdLevel)
        //             return (<React.Fragment key={i}></React.Fragment>);
        //         }
        //         // Fi CdMinor 
        //         if (this.state.frCdMinor !== undefined) {
        //             if(this.state.frCdMinor !== item.frCdMinor)
        //             return (<React.Fragment key={i}></React.Fragment>);
        //         }
        //         return (
        //             <option key={item.cdMinor} value={item.cdMinor}>{item.fullName}</option>
        //         )
        //     }, this);
        
        return (<>
            {
                this.state.isEmpty 
                    ? <option key={-1} value={""}>{this.state.isEmptyText}</option>
                    : null
            }
            { this.state.options.length > 0
            && this.state.options.map((item, i) => {
                // 삭제할게 있는지 확인
                if (this.state.deleteMinor.indexOf(item.cdMinor) > -1) {
                    return (<React.Fragment key={item.cdMinor}></React.Fragment>);
                }
                // 레벨 몇을 가져오는지 
                if (this.state.level !== undefined) {
                    if(this.state.level !== item.cdLevel)
                    return (<React.Fragment key={item.cdMinor}></React.Fragment>);
                }
                // Fi CdMinor 
                if (this.state.frCdMinor !== undefined) {
                    if(this.state.frCdMinor !== item.frCdMinor)
                    return (<React.Fragment key={item.cdMinor}></React.Fragment>);
                }
                return (
                    <option key={item.cdMinor} value={item.cdMinor}>{item.fullName}</option>
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
)(GDHSelectOption)