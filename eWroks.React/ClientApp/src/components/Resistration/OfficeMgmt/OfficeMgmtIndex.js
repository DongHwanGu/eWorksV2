import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import OfficeMgmtList from './OfficeMgmtList';
import OfficeMgmtDetail from './OfficeMgmtDetail';


class OfficeMgmtIndex extends Component {
    getDetailPage(data) {
        return(
            <OfficeMgmtDetail cmVendorDto={data}
                            onClickNew={this.onClickNew.bind(this)}
                            getVendorList={this.getVendorList.bind(this)}
                        />
        ) 
    }
    /*==========================================================*/
	/* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        masterGrid: [],
        detailPage: this.getDetailPage("")
    }
    /*==========================================================*/
	/* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getVendorList();
    }
    
    /*==========================================================*/
	/* Office List    */
    /*==========================================================*/
    getVendorList() {
        axios.get(this.props.storeState.serviceUrl + "/CmVendorService/GetVendorList")
        .then(r => {
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
    getVendorDetailData(vendorId) {
        axios.get(this.props.storeState.serviceUrl + "/CmVendorService/GetVendorDetailData", {
            params: {
                vendorId
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
                        <OfficeMgmtList list={this.state.masterGrid} 
                            onClickNew={this.onClickNew.bind(this)}
                            onClickSearch={this.getVendorList.bind(this)}
                            onRowDoubleClicked={this.getVendorDetailData.bind(this)}
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
        }
    }
)(OfficeMgmtIndex)