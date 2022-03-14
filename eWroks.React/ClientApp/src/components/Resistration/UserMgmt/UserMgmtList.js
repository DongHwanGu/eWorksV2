import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

import GDHSelectOption from '../../common/controls/GDHSelectOption';

class UserMgmtList extends Component {
    state = {
        it_status_cd_s: "",
        hr_status_cd_s: "",
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'User Id', field: 'userId', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'User Nm',
                        field: 'userNm',
                        minWidth: 200
                    },
                    {
                        headerName: 'User Enm',
                        field: 'userEnm',
                        minWidth: 200
                    },
                    {
                        headerName: 'Login Id',
                        field: 'loginId',
                        minWidth: 500
                    },
                ],
            rowData: [],
            rowCount: 0,
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
    // 페이지 로드
    componentDidMount() {
        this.getUserList();
    }
   
    // 유저 조회
    async getUserList() {
        var gParams = {
            it_status_cd: this.state.it_status_cd_s,
            hr_status_cd: this.state.hr_status_cd_s
        }
        this.props.onIsLoadingTrue();
        var data = await this.props.storeState.axiosGet("/CmUserService/GetUserList", gParams);
        this.setState({
            // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
            masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
        }, () => {
            this.props.onIsLoadingFalse();
        });
    }
    // New 생성 클릭
    onClickNew() {
        this.props.onClickNew();
    }
    // 그리드 더블클릭
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
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="primary" onClick={this.getUserList.bind(this)}>Search</Button>
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
)(UserMgmtList);