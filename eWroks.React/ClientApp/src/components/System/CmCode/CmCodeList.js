import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class CmCodeList extends Component {
    state = {
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Major', field: 'cdMajor', minWidth: 200, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Minor', field: 'cdMinor', minWidth: 200 },
                    { headerName: 'Use Yn', field: 'useYn', minWidth: 100 },
                    { headerName: 'Full Name', field: 'fullName', minWidth: 300 },
                    { headerName: 'Small Name', field: 'smallName', minWidth: 300 },
                    { headerName: 'Fr Minor', field: 'frCdMinor', minWidth: 100 },
                    { headerName: 'Se Minor', field: 'seCdMinor', minWidth: 100 },
                    { headerName: 'Level', field: 'cdLevel', minWidth: 100 }
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
        subGrid: {
            columnDefs:
                [
                    { headerName: 'Major', field: 'cdMajor', minWidth: 200, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Minor', field: 'cdMinor', minWidth: 200 },
                    { headerName: 'Use Yn', field: 'useYn', minWidth: 100 },
                    { headerName: 'Full Name', field: 'fullName', minWidth: 300 },
                    { headerName: 'Small Name', field: 'smallName', minWidth: 300 },
                    { headerName: 'Fr Minor', field: 'frCdMinor', minWidth: 100 },
                    { headerName: 'Se Minor', field: 'seCdMinor', minWidth: 100 },
                    { headerName: 'Level', field: 'cdLevel', minWidth: 100 }
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

    // 페이지 로드
    componentDidMount() {
        // 마스터 조회
        this.getCmCodeMasterList();
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    // 마스터 리스트
    getCmCodeMasterList() {
        axios.get(this.props.storeState.serviceUrl + "/CmCodeService/GetCmCodeMasterList")
        .then(r => {
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data },
                subGrid: { ...this.state.subGrid, rowData: [] }
            })
        })
        .catch(function (error) { 
            alert(error); 
        });
    }
    // 마스터 그리드 체인지
    onRowClicked_Master(e) {
        // console.log(e.api.getSelectedRows())
        var cdMajor = e.api.getSelectedRows()[0].cdMajor;
        this.getCmCodeSubList(cdMajor);
    }
    // 서브 리스트
    getCmCodeSubList(cdMajor) {
        axios.get(this.props.storeState.serviceUrl + "/CmCodeService/GetCmCodeSubList", {
            params: {
                cdMajor: cdMajor
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                subGrid: { ...this.state.subGrid, rowData: data }
            })
        }).catch(function (error) { 
            alert(error); 
        });
    }
    // New 생성 클릭
    onClickNew() {
        this.props.onClickNew();
    }
    // 그리드 더블클릭
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var cdMajor = data[0].cdMajor;
        var cdMinor = data[0].cdMinor;

        this.props.onRowDoubleClicked(cdMajor, cdMinor);
    }
    render() {
        return (<>
            {/* <Breadcrumb>
                <Breadcrumb.Item active>List</Breadcrumb.Item>
                <Breadcrumb.Item href="#" onClick={this.onClickNew.bind(this)}>Detail</Breadcrumb.Item>
            </Breadcrumb> */}

            <Form.Row>
                <div className="col-md-12 text-right">
                    <Button variant="secondary" onClick={this.onClickNew.bind(this)}>New</Button>{' '}
                    <Button variant="primary" onClick={this.getCmCodeMasterList.bind(this)}>Search</Button>
                </div>
            </Form.Row>
            <hr />
            <Card>
                <Card.Header>
                    <span>■ Master Code</span>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.masterGrid.columnDefs}
                            defaultColDef={this.state.masterGrid.defaultColDef}
                            rowData={this.state.masterGrid.rowData}
                            rowSelection="multiple" // single
                            // onGridReady={params => this.gridApi = params.api}
                            onRowClicked={this.onRowClicked_Master.bind(this)}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
            </Card>
            <hr />
            <Card>
                <Card.Header>
                    <span>■ Sub Code</span>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.subGrid.columnDefs}
                            defaultColDef={this.state.subGrid.defaultColDef}
                            rowData={this.state.subGrid.rowData}
                            rowSelection="multiple" // single
                            // onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
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
)(CmCodeList);