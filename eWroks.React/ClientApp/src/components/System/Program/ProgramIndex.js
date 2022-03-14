import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import ProgramList from './ProgramList';
import ProgramDetail from './ProgramDetail';

class ProgramIndex extends Component {
    getListPage() {
        return (
            <ProgramList onClickNew={this.onClickNew.bind(this)} onRowDoubleClicked={this.onRowDoubleClicked.bind(this)} />
        )
    }
    getDetailPage(data) {
        return (
            <ProgramDetail cmProgramDto={data} onClickNew={this.onClickNew.bind(this)} saveCallback={this.saveCallback.bind(this)} />
        )
    }
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state={
        activeKey: "list",
        listPage: null,
        detailPage: null,
    }
    /*==========================================================*/
	/* 페이지 로드    */
	/*==========================================================*/
    componentDidMount() {
        this.initControls();
    }
    /*==========================================================*/
	/* 초기화    */
	/*==========================================================*/
    initControls = async () => {
        await this.setState({ activeKey: "list", listPage: null, detailPage: null });
        await this.setState({ activeKey: "list", listPage: this.getListPage(), detailPage: this.getDetailPage("") })
    }
    /*==========================================================*/
	/* 마스터 그리드 더블클릭    */
	/*==========================================================*/
    onRowDoubleClicked(programId) {
        this.getProgramDetailData(programId);
    }
    /*==========================================================*/
	/* 상세조회    */
	/*==========================================================*/
    getProgramDetailData(programId) {
        axios.get(this.props.storeState.serviceUrl + "/CmProgramService/GetProgramDetailData", {
            params: {
                programId
            }
        }).then(r => {
            var data = r.data;
            this.setState({activeKey: 'detail', detailPage: null })
            this.setState({activeKey: 'detail', detailPage: this.getDetailPage(data) })
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
	/* 신규 추가    */
	/*==========================================================*/
    onClickNew = async () => {
        await this.setState({ activeKey: 'detail', detailPage: null });
        await this.setState({ activeKey: 'detail', detailPage: this.getDetailPage("") })
    }
    /*==========================================================*/
	/* 저장 후 콜백    */
	/*==========================================================*/ 
    saveCallback () {
        this.initControls();
    }
    /*==========================================================*/
	/* Render    */
	/*==========================================================*/
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
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
)(ProgramIndex);