import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import NoticeMgmtList from './NoticeMgmtList';
import NoticeMgmtDetail from './NoticeMgmtDetail';

class NoticeMgmtIndex extends Component {
    getDetailPage(data) {
        return (
            <NoticeMgmtDetail cmNoticeDto={data}
                onClickNew={this.onClickNew.bind(this)}
                getNoticeList={this.getNoticeList.bind(this)}
            />
        )
    }
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state={
        activeKey: "list",
        masterGrid: [],
        detailPage: this.getDetailPage("")
    }

    /*==========================================================*/
	/* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getNoticeList();
    }
   
    /*==========================================================*/
	/* List    */
    /*==========================================================*/
    getNoticeList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmNoticeService/GetNoticeList")
        .then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                activeKey: 'list',
                masterGrid: data
            })
        }).catch(function (error) { 
            alert(error); 
        });
    }

    /*==========================================================*/
	/* 상세조회    */
	/*==========================================================*/
    getNoticeDetailData(noticeId) {
        
        axios.get(this.props.storeState.serviceUrl + "/CmNoticeService/GetNoticeDetailData", {
            params: {
                noticeId
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

    /*==========================================================*/
	/* New    */
    /*==========================================================*/
    onClickNew() {
        this.setState({activeKey: 'detail', detailPage: null }, () => {
            this.setState({activeKey: 'detail', detailPage: this.getDetailPage("") })
        })
    }

    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="list" title="List" >
                    <div style={{ marginTop: 15 }}>
                        <NoticeMgmtList list={this.state.masterGrid} 
                                        getNoticeList={this.getNoticeList.bind(this)} 
                                        onClickNew={this.onClickNew.bind(this)}  
                                        onRowDoubleClicked ={this.getNoticeDetailData.bind(this)}
                        />
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
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(NoticeMgmtIndex)