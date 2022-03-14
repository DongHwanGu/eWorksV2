import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

import PurchaseSettingCurrency from './PurchaseSettingCurrency';
import PurchaseSettingVendor from './PurchaseSettingVendor';
import FiApprovalPolicyList from './FiApprovalPolicyList';


class PurchaseSettingList extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "currency",
    }
    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="currency" title="Currency" >
                    <div style={{ marginTop: 15 }}>
                        <PurchaseSettingCurrency />
                    </div>
                </Tab>
                <Tab eventKey="vendor" title="Vendor">
                    <div style={{ marginTop: 15 }}>
                        <PurchaseSettingVendor />
                    </div>
                </Tab>
                <Tab eventKey="policy" title="Policy">
                    <div style={{ marginTop: 15 }}>
                        <FiApprovalPolicyList />
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
)(PurchaseSettingList)
