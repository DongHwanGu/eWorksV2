import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

import GDHSelectOption from '../../common/controls/GDHSelectOption';

class AcountList extends Component {
     /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state = {
        it_status_cd_s: "",
        hr_status_cd_s: "",
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Alert', field: 'alertNm', minWidth: 100 },
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100 },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Login Id', field: 'loginId', minWidth: 100 },
                    { headerName: 'Email', field: 'email', minWidth: 100 },
                    { headerName: 'Host Nm', field: 'hostNm', minWidth: 100 },
                    { headerName: 'Ctrl No', field: 'controlNm', minWidth: 100 },
                    { headerName: 'Office Cd', field: 'officeId', minWidth: 100 },
                    { headerName: 'Tel', field: 'tel', minWidth: 100 },
                    { headerName: 'Dept1', field: 'deptCd1', minWidth: 100 },
                    { headerName: 'Dept2', field: 'deptCd2', minWidth: 100 },
                    { headerName: 'Dept3', field: 'deptCd3', minWidth: 100 },
                    { headerName: 'Dept4', field: 'deptCd4', minWidth: 100 },
                    { headerName: 'User Gb', field: 'userGb', minWidth: 100 },
                    { headerName: 'Position Kr', field: 'dutyCdKor', minWidth: 100 },
                    { headerName: 'IT Status', field: 'iT_StatusCd', minWidth: 100 },
                    { headerName: 'HR Status', field: 'hR_StatusCd', minWidth: 100 },
                    { headerName: 'Role', field: 'roleId', minWidth: 100 },
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
        }
    }
    /*==========================================================*/
	/* PageLoad    */
	/*==========================================================*/
    componentDidMount() {
        this.getAcountAssetsList();
    }
    /*==========================================================*/
	/* 마스터 리스트 조회    */
	/*==========================================================*/
    getAcountAssetsList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/ItAcountAssetsService/GetAcountUserList")
        .then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data }
            })
        })
        .catch(function (error) { 
            alert(error); 
        });
    }
     /*==========================================================*/
	/* 마스터 리스트 더블클릭    */
	/*==========================================================*/
     onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var userId = data[0].userId;

        this.props.onRowDoubleClicked(userId);
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render() {
        return (<>
         <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ IT Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="it_status_cd_s"
                                        value={this.state.it_status_cd_s}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0006" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ HR Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="hr_status_cd_s"
                                        value={this.state.hr_status_cd_s}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0032" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getAcountAssetsList.bind(this)}>Search</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 600, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.masterGrid.columnDefs}
                            defaultColDef={this.state.masterGrid.defaultColDef}
                            rowData={this.state.masterGrid.rowData}
                            rowSelection="multiple" // single
                            // onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
                </Card.Footer>
            </Card>
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
)(AcountList)