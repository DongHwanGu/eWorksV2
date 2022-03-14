import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class NoticeMgmtIndex extends Component {
    static getDerivedStateFromProps(props, state) {
        if (state.rowData !== props.list) {
            return { rowData: props.list }
        }
        return null;
    }
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        it_status_cd_s: "02",
        hr_status_cd_s: "",
        columnDefs:
            [
                { headerName: 'Notice Id', field: 'noticeId', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                {
                    headerName: 'Ttitle',
                    field: 'noticeTitle',
                    minWidth: 200
                },
                {
                    headerName: 'Desc',
                    field: 'noticeDesc',
                    minWidth: 200
                },
                {
                    headerName: 'Notice Id',
                    field: 'noticeNm',
                    minWidth: 500
                },
            ],
        rowData: this.props.list,
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
    onClickSearch() {
        this.props.getNoticeList();
    }
    onClickNew() {
        this.props.onClickNew();
    }
    // 그리드 더블클릭
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var noticeId = data[0].noticeId;
        this.props.onRowDoubleClicked(noticeId);
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
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>New</Button>{' '}
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
                            columnDefs={this.state.columnDefs}
                            defaultColDef={this.state.defaultColDef}
                            rowData={this.state.rowData}
                            rowSelection="multiple" // single
                            // onGridReady={params => this.gridApi = params.api}
                            onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
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
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(NoticeMgmtIndex)