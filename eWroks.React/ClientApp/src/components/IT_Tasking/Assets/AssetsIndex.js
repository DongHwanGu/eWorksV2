import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import Application from './Application';
import Software from './Software';
import Hardware from './Hardware';
import Network from './Network';

class AssetsIndex extends Component {
    state = {
        activeKey: "application",
    }
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="application" title="Application" >
                    <div style={{ marginTop: 15 }}>
                        <Application />
                    </div>
                </Tab>
                <Tab eventKey="software" title="Software">
                    <div style={{ marginTop: 15 }}>
                        <Software />
                    </div>
                </Tab>
                <Tab eventKey="hardware" title="Hardware">
                    <div style={{ marginTop: 15 }}>
                        <Hardware />
                    </div>
                </Tab>
                <Tab eventKey="network" title="Network">
                    <div style={{ marginTop: 15 }}>
                        <Network />
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
)(AssetsIndex)