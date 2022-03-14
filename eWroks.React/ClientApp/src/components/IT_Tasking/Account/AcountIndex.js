import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import AcountList from './AcountList';
import AcountDetail from './AcountDetail';
import AcountAssetsExcel from './AcountAssetsExcel';

class AcountIndex extends Component {
    getListPage() {
        return (
            <AcountList onRowDoubleClicked={this.onRowDoubleClicked.bind(this)} />
        )
    }
    getDetailPage(data) {
        return (
            <AcountDetail ItAcountUserDto={data}  saveCallback={this.initControls.bind(this)} />
        )
    }
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,
        listPage: null
    }
    
    /*==========================================================*/
	/* Page Load    */
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
    onRowDoubleClicked(userId) {
        this.getAcountAssetsDetailData(userId);
    }
     /*==========================================================*/
	/* 상세조회    */
	/*==========================================================*/
    getAcountAssetsDetailData(userId) {
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/getAcountAssetsDetailData", {
            params: {
                userId
            }
        }).then(r => {
            var data = r.data;
            this.setState({activeKey: 'detail', detailPage: null }, () => {
                this.setState({activeKey: 'detail', detailPage: this.getDetailPage(data) })
            })
            
        }).catch(function (error) { 
            alert(error); 
        });
    }
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
                <Tab eventKey="excel" title="Excel Download">
                    <div style={{ marginTop: 15 }}>
                        <AcountAssetsExcel />
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
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(AcountIndex)