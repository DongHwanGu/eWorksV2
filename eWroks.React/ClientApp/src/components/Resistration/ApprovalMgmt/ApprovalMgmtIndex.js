import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import ApprovalTravel from './ApprovalTravel';
import ApprovalExternalTraining from './ApprovalExternalTraining';
import ApprovalLeaveHoli from './ApprovalLeaveHoli';

class ApprovalMgmtIndex extends Component {
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state = {
        activeKey: "listLeaveHoli",
    }
    
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="listLeaveHoli" title="Leave Form / OT" >
                    <div style={{ marginTop: 15 }}>
                        <ApprovalLeaveHoli />
                    </div>
                </Tab>
                <Tab eventKey="listTravel" title="Travel" >
                    <div style={{ marginTop: 15 }}>
                        <ApprovalTravel />
                    </div>
                </Tab>
                <Tab eventKey="listExternalTraining" title="External Training" >
                    <div style={{ marginTop: 15 }}>
                        <ApprovalExternalTraining />
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
)(ApprovalMgmtIndex)