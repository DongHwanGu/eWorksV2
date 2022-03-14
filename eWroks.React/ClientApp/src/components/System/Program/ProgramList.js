import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class ProgramList extends Component {
    /*==========================================================*/
	/* State    */
	/*==========================================================*/
    state = {
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'ProgramId', field: 'programId', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'ProgramNm', field: 'programNm', minWidth: 200 },
                    { headerName: 'ProgramUrl', field: 'programUrl', minWidth: 200 },
                    { headerName: 'UpProgramId', field: 'upProgramId_Nm', minWidth: 100 },
                    { headerName: 'DispSeq', field: 'dispSeq', minWidth: 100 },
                    { headerName: 'UseYn', field: 'useYn', minWidth: 100 },
                    { headerName: 'ProgramIcon', field: 'programIcon', minWidth: 100 }
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
	/* 페이지 로드    */
	/*==========================================================*/
    componentDidMount() {
        this.getProgramMasterList();
    }
    /*==========================================================*/
	/* 신규 생성    */
	/*==========================================================*/
    onClickNew() {
        this.props.onClickNew();
    }
    /*==========================================================*/
	/* 마스터 리스트 조회    */
	/*==========================================================*/
    getProgramMasterList() {
        axios.get(this.props.storeState.serviceUrl + "/CmProgramService/GetProgramMasterList")
        .then(r => {
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
        var programId = data[0].programId;

        this.props.onRowDoubleClicked(programId);
    }
    /*==========================================================*/
	/* Render    */
	/*==========================================================*/
    render() {
        return (<>
            <Form.Row>
                <div className="col-md-12 text-right">
                    <Button variant="secondary" onClick={this.onClickNew.bind(this)}>New</Button>{' '}
                    <Button variant="primary" onClick={this.getProgramMasterList.bind(this)}>Search</Button>
                </div>
            </Form.Row>
            <hr />
            <Card>
                <Card.Header>
                    <span>■ Program</span>
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
                            // onRowClicked={this.onRowClicked_Master.bind(this)}
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
)(ProgramList);