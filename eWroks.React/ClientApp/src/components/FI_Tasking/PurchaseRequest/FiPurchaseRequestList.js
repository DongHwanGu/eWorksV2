import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import paginationFactory from 'react-bootstrap-table2-paginator';
import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';

import FiPurchaseRequestDetail from './FiPurchaseRequestDetail';
import PurchaseRequestListSub from '../../e_Approval/PurchaseRequest/PurchaseRequestListSub';


const { SearchBar } = Search;
const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectColumn: true,
    style: { backgroundColor: '#c8e6c9' }
};
var selectRowId = 0;

class FiPurchaseRequestList extends Component {
    getDetailPage(data) {
        return (
            <FiPurchaseRequestDetail row={data} onClickNew={this.onClickNew.bind(this)} saveCallback={this.saveCallback.bind(this)} />
        )
    }

    state = {
        activeKey: "list",
        detailPage: null,

        statusCd: '',
        entityCd: '',
        startDt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDt: new Date(),

        defaultSearch: '',
        expanded: [],
        masterGrid: {
            columns: [{
                dataField: 'purchaseId',
                text: 'ID',
                style: { maxWidth: '80px', minWidth: '80px' },
                // events: {
                //     onClick: (e, column, columnIndex, row, rowIndex) => {
                //         alert('Click on Product ID field');
                //     }
                // }
            }, {
                dataField: 'statusCdNm',
                text: 'Status',
                style: { maxWidth: '150px', minWidth: '150px' },
            }, {
                dataField: 'entityCdNm',
                text: 'Entity Name',
                style: { maxWidth: '150px', minWidth: '150px' },
            }, {
                dataField: 'branchCdNm',
                text: 'Branch',
                style: { maxWidth: '150px', minWidth: '150px' },
            }, {
                dataField: 'purchaseRefNo',
                text: 'PR No',
                style: { maxWidth: '200px', minWidth: '200px' },
                classes: 'testclasses'
            }, {
                dataField: 'regIdNm',
                text: 'Registor',
                style: { maxWidth: '100px', minWidth: '100px' },
            }, {
                dataField: 'vendorNm',
                text: 'Vendor',
                style: { maxWidth: '200px', minWidth: '200px' },
            }, {
                dataField: 'productNm',
                text: 'Product Nm',
                style: { maxWidth: '200px', minWidth: '200px' },
            }],
            options: {
                // pageStartIndex: 0,
                sizePerPage: 15,
                hideSizePerPage: true,
                hidePageListOnlyOnePage: true
            },
            rowData: [],
            rowEvents: {
                onDoubleClick: (e, row, rowIndex) => {
                    this.setState({ activeKey: 'detail', detailPage: null }, () => {
                        this.setState({ activeKey: 'detail', detailPage: this.getDetailPage(row) })
                    })
                },
            },
            expandRow: {
                parentClassName: 'parent-expand-foo',
                renderer: row => (
                    <PurchaseRequestListSub row={row} saveCallback={this.saveCallback.bind(this)} pageGb={'Response'} />
                ),
                expanded: [],
                nonExpandable: [],
                showExpandColumn: true,
                expandByColumnOnly: true,
                onExpand: (row, isExpand, rowIndex, e) => {
                    selectRowId = row.purchaseId;
                },
                // 헤더 선택 활성화
                expandHeaderColumnRenderer: ({ isAnyExpands }) => {
                    if (isAnyExpands) {
                        return <i className="fas fa-minus-square fa-2x" style={{ color: '#f6c23e' }}></i>;
                    }
                    return <i className="fas fa-plus-square fa-2x" style={{ color: '#f6c23e' }}></i>;
                },
                // Row 선택 활성화
                expandColumnRenderer: ({ expanded, rowKey, expandable }) => {
                    if (expanded) {
                        return <i className="fas fa-minus-square" ></i>;
                    }
                    return expandable ? <i className="fas fa-plus-square" ></i> : <></>;
                }
            }
        }
    };

    // Page Load
    componentDidMount() {
        this.getResponsePurchaseList();
    }

    /*==========================================================*/
    /* 조회    */
    /*==========================================================*/
    getResponsePurchaseList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/FiPurchaseService/GetResponsePurchaseList", {
            params: {
                startDt: this.props.storeState.getParsedDate(this.state.startDt),
                endDt: this.props.storeState.getParsedDate(this.state.endDt),
                entityCd: this.state.entityCd,
                statusCd: this.state.statusCd,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: {
                    ...this.state.masterGrid,
                    rowData: [],
                    expanded: [],
                    nonExpandable: []
                }
            }, () => {
                var arrNonExpand = [];
                data.forEach(row => {
                    if (row.subOpenYn === 'N') {
                        arrNonExpand.push(row.purchaseId);
                    }
                });

                this.setState({
                    masterGrid: {
                        ...this.state.masterGrid,
                        rowData: data,
                        expandRow: {
                            ...this.state.masterGrid.expandRow,
                            expanded: [selectRowId],
                            nonExpandable: arrNonExpand
                        }
                    }
                })
            })
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 신규    */
    /*==========================================================*/
    onClickNew() {
        this.setState({ activeKey: 'detail', detailPage: null }, () => {
            this.setState({ activeKey: 'detail', detailPage: this.getDetailPage("") })
        })
    }
    /*==========================================================*/
    /* 저장 후 실행    */
    /*==========================================================*/
    saveCallback() {
        this.setState({ activeKey: "list", listPage: null, detailPage: null }, () => {
            this.setState({ activeKey: "list", detailPage: this.getDetailPage("") })
        });

        this.getResponsePurchaseList();
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
            <Tabs activeKey={this.state.activeKey}
                onSelect={(k) => {
                    this.setState({ activeKey: k })
                }}>
                <Tab eventKey="list" title="List" >
                    <div style={{ marginTop: 15 }}>
                        <Card>
                            <Card.Header>
                                <Form>
                                    <Form.Row>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Start Dt</Form.Label>
                                                <table>
                                                    <tbody>

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
                                                    </tbody>
                                                </table>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Entity Name</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="entityCd"
                                                    value={this.state.entityCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0036" level={'11'} deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>■ Status</Form.Label>
                                                <Form.Control as="select" size="sm"
                                                    name="statusCd"
                                                    value={this.state.statusCd}
                                                    onChange={this.onChangeHandler.bind(this)}>
                                                    <GDHSelectOption cdMajor="0208" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form.Row>
                                    <Form.Row>
                                        <div className="col-md-12 text-right">
                                            <Button variant="primary" onClick={this.getResponsePurchaseList.bind(this)} >Search</Button>
                                        </div>
                                    </Form.Row>
                                </Form>
                            </Card.Header>
                            <Card.Body style={{ padding: 0, paddingTop: 10, minHeight: 620 }} className='table-responsive'>
                                <ToolkitProvider
                                    keyField="id"
                                    data={this.state.masterGrid.rowData}
                                    columns={this.state.masterGrid.columns}
                                    search={{ defaultSearch: this.state.defaultSearch }}
                                >
                                    {
                                        props => (
                                            <div>
                                                <table style={{ width: '100%' }}>
                                                    <tbody>
                                                        <td style={{ textAlign: 'right', fontSize: 15, fontWeight: 'bold', paddingBottom: 10 }}>
                                                            {'Search Text : '}
                                                        </td>
                                                        <td>
                                                            <SearchBar style={{ width: '100%' }} {...props.searchProps} />
                                                        </td>
                                                    </tbody>
                                                </table>
                                                <BootstrapTable
                                                    {...props.baseProps}
                                                    expandRow={this.state.masterGrid.expandRow}
                                                    rowEvents={this.state.masterGrid.rowEvents}
                                                    pagination={paginationFactory(this.state.masterGrid.options)}
                                                    headerClasses="reactGrid-header-class"
                                                    bordered={false}
                                                    hover
                                                >
                                                </BootstrapTable>
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </Card.Body>
                        </Card>
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail">
                    <div style={{ marginTop: 15 }}>
                        {this.state.detailPage}
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
)(FiPurchaseRequestList)
