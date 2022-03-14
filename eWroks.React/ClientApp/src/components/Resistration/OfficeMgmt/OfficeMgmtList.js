import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';

class OfficeMgmtList extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        masterGrid: {
            columnDefs:
                [
                    { headerName: 'Vendor Id', field: 'vendorId', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    {
                        headerName: 'Vendor Nm',
                        field: 'vendorNm',
                        minWidth: 200
                    },
                    {
                        headerName: 'Vendor Enm',
                        field: 'vendorEnm',
                        minWidth: 700
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
    /*==========================================================*/
	/* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getVendorList();
    }
    
    /*==========================================================*/
	/* Office List    */
    /*==========================================================*/
    getVendorList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmVendorService/GetVendorList")
        .then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
            })
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.props.onClickNew();
    }
    onClickSearch() {
        this.props.onClickSearch();
    }
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var vendorId = data[0].vendorId;
        this.props.onRowDoubleClicked(vendorId);
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="primary" onClick={this.onClickSearch.bind(this)}>Search</Button>
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
                            rowData={this.props.list}
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
)(OfficeMgmtList)