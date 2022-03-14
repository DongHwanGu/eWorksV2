import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';


class DeptMgmtList extends Component {
    state = {
        deptGrid: {
            columnDefs:
                [
                    { headerName: 'Dept Id', field: 'deptId', minWidth: 100 },
                    { headerName: 'Dept Nm', field: 'deptNm', minWidth: 150 },
                    { headerName: 'Use Yn', field: 'useYn', minWidth: 80, cellStyle: { textAlign: 'center' } },
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
    onRowClicked(e) {
        var row = e.api.getSelectedRows()[0];
        this.props.onRowClicked(row);
    }
    onRowDoubleClicked(e) {
        var row = e.api.getSelectedRows()[0];
        this.props.onRowDoubleClicked(row);
    }
    render() {
        return (<>
            <Card>
                <Card.Header>
                    <span>■ {this.props.title}</span>
                    
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.deptGrid.columnDefs}
                            defaultColDef={this.state.deptGrid.defaultColDef}
                            rowData={this.props.list}
                            rowSelection="single" // single
                            //onGridReady={params => this.roleProgramGridApi = params.api}
                            onRowClicked={this.onRowClicked.bind(this)}
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
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(DeptMgmtList)
