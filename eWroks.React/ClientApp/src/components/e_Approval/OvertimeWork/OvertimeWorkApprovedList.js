import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';
import queryString from 'query-string'

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import OvertimeWorkApprovedSetepOne from './OvertimeWorkApprovedSetepOne';
import OvertimeWorkApprovedSetepTwo from './OvertimeWorkApprovedSetepTwo';
import OvertimeWorkStatistics from './OvertimeWorkStatistics';
import OvertimeWorkApprovedSetepList from './OvertimeWorkApprovedSetepList';


class OvertimeWorkApprovedList extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,

        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),
        statusCd: "",
        btnColor1: true,
        btnColor2: false,
        btnColor3: false,
        btnColor4: false,

        stepPage: null,

        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100 },
                    { headerName: 'Reason', field: 'reason', minWidth: 300 },
                    { headerName: '1단계 요청시간', field: 'travelGbNm', minWidth: 300 },
                    { headerName: '2단계 요청시간', field: 'travelGbNm', minWidth: 300 },
                    { headerName: 'HR Reviewed', field: 'destination', minWidth: 300 },
                    { headerName: 'HR Comment', field: 'purpose', minWidth: 100 },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: true, // 멀티서치 기능
            }
        },

    }

    componentDidMount() {
        const { search } = this.props.location;	// 문자열 형식으로 결과값이 반환된다.
        const queryObj = queryString.parse(search);	// 문자열의 쿼리스트링을 Object로 변환

        const { clickGb } = queryObj;


        if (clickGb === 'two') {
            this.setState({
                btnColor2: true,
                btnColor1: false,
                btnColor3: false,
                btnColor4: false,
                stepPage: <OvertimeWorkApprovedSetepTwo />
            })
        } else {
            this.setState({
                btnColor1: true,
                btnColor2: false,
                btnColor3: false,
                btnColor4: false,
                stepPage: <OvertimeWorkApprovedSetepOne />
            })
        }
    }

    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }

    render() {
        return (<>
            <div className="col-md-12 text-left" style={{ paddingLeft: 0 }}>
                <Button variant={this.state.btnColor1 ? 'warning' : 'light'} style={{ padding: 15, width: 150, fontWeight: this.state.btnColor2 ? 'normal' : 'bold' }}
                    onClick={(e) => {
                        this.setState({
                            btnColor1: true,
                            btnColor2: false,
                            btnColor3: false,
                            btnColor4: false,
                            stepPage: <OvertimeWorkApprovedSetepOne />
                        })
                    }}
                >1단계</Button>{' '}
                <Button variant={this.state.btnColor2 ? 'warning' : 'light'} style={{ padding: 15, width: 150, fontWeight: this.state.btnColor1 ? 'normal' : 'bold' }}
                    onClick={(e) => {
                        this.setState({
                            btnColor2: true,
                            btnColor1: false,
                            btnColor3: false,
                            btnColor4: false,
                            stepPage: <OvertimeWorkApprovedSetepTwo />
                        })
                    }}
                >2단계</Button>{' '}
                <Button variant={this.state.btnColor3 ? 'warning' : 'light'} style={{ padding: 15, width: 150, fontWeight: this.state.btnColor1 ? 'normal' : 'bold' }}
                    onClick={(e) => {
                        this.setState({
                            btnColor3: true,
                            btnColor2: false,
                            btnColor1: false,
                            btnColor4: false,
                            stepPage: <OvertimeWorkApprovedSetepList />
                        })
                    }}
                >Approved</Button>{' '}
                <Button variant={this.state.btnColor4 ? 'warning' : 'light'} style={{ padding: 15, width: 150, fontWeight: this.state.btnColor1 ? 'normal' : 'bold' }}
                    onClick={(e) => {
                        this.setState({
                            btnColor4: true,
                            btnColor2: false,
                            btnColor1: false,
                            btnColor3: false,
                            stepPage: <OvertimeWorkStatistics />
                        })
                    }}
                >Statistics</Button>
            </div>
            {this.state.stepPage}
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
)(OvertimeWorkApprovedList)
