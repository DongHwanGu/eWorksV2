import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

class LoginLogList extends Component {
    state = {
        startDt: new Date(),
        endDt: new Date(),
        columnDefs:
            [
                { headerName: 'LoginDt', field: 'loginDt', minWidth: 150 },
                { headerName: 'UserNm', field: 'userNm', minWidth: 150 },
                { headerName: 'Dept2', field: 'dept2', minWidth: 150 },
                { headerName: 'Dept3', field: 'dept3', minWidth: 150 },
                { headerName: 'LoginIp', field: 'loginIp', minWidth: 100 },
                { headerName: 'BrowserType', field: 'browserType', minWidth: 100 },
                { headerName: 'BrowserVer', field: 'browserVer', minWidth: 100 },
            ],
        rowData: [],
        defaultColDef: {
            sortable: true,
            filter: true,
            flex: 1,
            // editable: true,
            resizable: true,
            floatingFilter: true, // 멀티서치 기능
        },
        rowCount: 0
    }

    // 페이지 로드
    componentDidMount() {
        this.getLoginLogList();
    }

    // 로그인 리스트
    getLoginLogList() {
        axios.get(this.props.storeState.serviceUrl + "/CommonService/GetLoginLogList", {
            params: {
                startDt: this.getParsedDate(this.state.startDt),
                endDt: this.getParsedDate(this.state.endDt),
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                rowData: data
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 체인지 */
    /*==========================================================*/
    onDateChange(name, date) {
        this.setState({
            [name]: date
        });
    }
    /*==========================================================*/
    /* 날짜 변경  */
    /*==========================================================*/
    getParsedDate(strDate) {
        var date = new Date(strDate);
        // alert(date);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        date = yyyy + "" + mm + "" + dd;
        return date.toString();
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Start Dt</Form.Label>
                                    <table>
                                        <tr>
                                            <td>
                                                <GDHDatepicker
                                                    name='startDt'
                                                    value={this.state.startDt} onDateChange={this.onDateChange.bind(this)}
                                                />
                                            </td>
                                            <td>{'~'}</td>
                                            <td>
                                                <GDHDatepicker
                                                    name='endDt'
                                                    value={this.state.endDt} onDateChange={this.onDateChange.bind(this)}
                                                />
                                            </td>
                                        </tr>
                                    </table>
                                </Form.Group>
                            </div>

                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getLoginLogList.bind(this)}>Search</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 600, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.columnDefs}
                            defaultColDef={this.state.defaultColDef}
                            rowData={this.state.rowData}
                        // rowSelection="multiple" // single
                        // onGridReady={params => this.gridApi = params.api}
                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.rowCount}</Form.Label>
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
        }
    }
)(LoginLogList)