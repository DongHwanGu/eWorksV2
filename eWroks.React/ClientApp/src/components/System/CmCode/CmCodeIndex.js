import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import CmCodeList from './CmCodeList';
import CmCodeDetail from './CmCodeDetail';

class CmCodeIndex extends Component {
    constructor(props) {
        super(props);
        this.state={
            activeKey: "list",
            listPage: this.getListPage(),
            detailPage: this.getDetailPage("")
        }
        this.saveCallback = this.saveCallback.bind(this);
    }
    // 상세페이지 공통
    getListPage() {
        return (
            <CmCodeList onRowDoubleClicked={this.onRowDoubleClicked.bind(this)} onClickNew={this.onClickNew.bind(this)} /> 
        )
    }
    getDetailPage(data) {
        return (
            <CmCodeDetail cmCodeDto={data} saveCallback={this.saveCallback.bind(this)} />
        )
    }
    // 그리드 더블클릭
    onRowDoubleClicked(cdMajor, cdMinor) {
        this.getCmCodeData(cdMajor, cdMinor);
    }
    // 상세 조회
    getCmCodeData(cdMajor, cdMinor) {
        axios.get(this.props.storeState.serviceUrl + "/CmCodeService/GetCmCodeDetailData", {
            params: {
                cdMajor, cdMinor
            }
        }).then(r => {
            var data = r.data;
            this.setState({activeKey: 'detail', detailPage: null })
            this.setState({activeKey: 'detail', detailPage: this.getDetailPage(data) })
        }).catch(function (error) { 
            alert(error); 
        });
    }
    onClickNew() {
        this.setState({activeKey: 'detail', detailPage: null })
        this.setState({activeKey: 'detail', detailPage: this.getDetailPage("") })
    }
    saveCallback() {
        this.setState({activeKey: 'list', listPage: null })
        this.setState({activeKey: 'list', listPage: this.getListPage() })
    }
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}
            >
                <Tab eventKey="list" title="List" >
                    <div style={{ marginTop: 15 }}>
                        {this.state.listPage}
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail">
                    <div style={{ marginTop: 15 }}>
                        {this.state.detailPage}
                    </div>
                </Tab>
                {/* <Tab eventKey="contact" title="Contact" disabled>
                    33
                </Tab> */}
            </Tabs>
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
)(CmCodeIndex);