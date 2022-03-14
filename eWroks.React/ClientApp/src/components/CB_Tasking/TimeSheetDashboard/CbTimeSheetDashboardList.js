import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import GDHApprovalSelectOption from '../../common/approval/GDHApprovalSelectOption';

import { Line } from "react-chartjs-2";
import CbTimeSheetDashboardOffice from './CbTimeSheetDashboardOffice';

class CbTimeSheetDashboardList extends Component {
    state = {
        activeKey: "office",
        chartData: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "주차별 평균 근무 시간",
                    data: [33, 53, 85, 41, 44, 65],
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)"
                }
                //   ,
                //   {
                //     label: "Second dataset",
                //     data: [33, 25, 35, 51, 54, 76],
                //     fill: false,
                //     borderColor: "#742774"
                //   }
            ]
        }
    }

    render() {
        return (<>
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="total" title="Total" >
                    <div style={{ marginTop: 15 }}>
                        <Card>
                            <Card.Header>
                                <Form>
                                    <Form.Row>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="statusCd"
                                                    // value={this.state.statusCd}
                                                    // onChange={this.onChangeHandler.bind(this)}
                                                    >
                                                    <GDHSelectOption cdMajor="0060" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            {/* <Button variant="primary" onClick={this.getCbTimeSheetList.bind(this)}>Search</Button> */}
                                        </div>
                                    </Form.Row>
                                </Form>
                            </Card.Header>
                            <Card.Body>
                             <div className="offset-md-2 col-md-8">
                                {/* <Line data={this.state.chartData} /> */}
                             </div>
                            </Card.Body>
                            <Card.Footer>
                            </Card.Footer>
                        </Card>
                    </div>
                </Tab>
                <Tab eventKey="office" title="Office">
                    <div style={{ marginTop: 15 }}>
                        <CbTimeSheetDashboardOffice />
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
)(CbTimeSheetDashboardList)
