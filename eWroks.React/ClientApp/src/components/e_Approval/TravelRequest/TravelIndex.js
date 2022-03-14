import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import TravelList from './TravelList';
import TravelDetail from './TravelDetail';

class TravelIndex extends Component {
    getDetailPage(data) {
        return (
            <TravelDetail fiTravelGroupDto={data}  saveCallback={this.initControls.bind(this)} onClickNew={this.onClickNew.bind(this)} />
        )
    }
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state = {
        activeKey: "list",
        masterGrid: [],
        detailPage: null,
    }
    testRef = React.createRef();
    
    /*==========================================================*/
	/* Page Load    */
	/*==========================================================*/
    componentDidMount() {
        this.initControls();
    }

     /*==========================================================*/
	/* 초기화    */
	/*==========================================================*/
    initControls () {
        this.setState({ activeKey: "list", listPage: null, detailPage: null }, () => {
            this.setState({ activeKey: "list", detailPage: this.getDetailPage("") })
        });
    }
    /*==========================================================*/
	/* 마스터 그리드 더블클릭    */
	/*==========================================================*/
    onRowDoubleClicked(id) {
        this.getTravelDetail(id);
    }
    /*==========================================================*/
	/* 신규    */
	/*==========================================================*/
    onClickNew() {
        this.setState({activeKey: 'detail', detailPage: null }, () => {
            this.setState({activeKey: 'detail', detailPage: this.getDetailPage("") })
        })
    }
     /*==========================================================*/
	/* 상세조회    */
	/*==========================================================*/
    getTravelDetail(id) {
        axios.get(this.props.storeState.serviceUrl + "/FiTravelService/GetTravelDetail", {
            params: {
                travelId: id
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
                        <TravelList onClickNew={this.onClickNew.bind(this)} onRowDoubleClicked={this.onRowDoubleClicked.bind(this)} 
                            ret={this.testRef}
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
)(TravelIndex)