import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import BootstrapTreeTable from 'bootstrap-react-treetable';
import BootstrapTable from 'react-bootstrap-table-next';

class Directory extends Component {
    state = {
        userInfo: {},
        bootGrid: null,
        userGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100 },
                    { headerName: 'User Enm', field: 'userEnm', minWidth: 100 },
                    { headerName: 'Position', field: 'dutyCdKorNm', minWidth: 100 },
                    { headerName: 'Dept', field: 'deptFullNm', minWidth: 100 },
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
        masterGrid: {
            treeControls: {
                "visibleRows": 1,
                "allowSorting": false,
                "showPagination": false,
                "initialRowsPerPage": 10,
                "allowFiltering": false,
                "showExpandCollapseButton": true,
            },
            treeColumns: [
                {
                    "dataField": "name",
                    "heading": "User List",
                    "filterable": true,
                    "fixedWidth": true,
                    // "styleClass": "width_500",
                    // "percentageWidth": 30,
                    "renderer": (dataRow, dataField) => {
                        if (dataRow.data[dataField].indexOf('||') > 0) {
                            return <span dangerouslySetInnerHTML={{ __html: dataRow.data[dataField].replace('||', '') }}
                                style={{ fontWeight: 'bold' }}
                            ></span>;
                        } else {
                            return <Link onClick={(e) => { e.preventDefault(); this.getUserInfo(dataRow.data.userId) }}><span dangerouslySetInnerHTML={{ __html: dataRow.data[dataField] }}
                                style={{ fontWeight: 'bold' }}
                            ></span></Link>
                        }
                    }
                }
            ],
            treeData: []
        }

    }

    /*==========================================================*/
    /* 페이지 로드  */
    /*==========================================================*/
    componentDidMount() {
        this.getDirectoryList();
        this.getUserList();
    }

    /*==========================================================*/
    /* 유저 리스트  */
    /*==========================================================*/
    getUserList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserList", {
            params: {
                it_status_cd: "",
                hr_status_cd: "01"
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                userGrid: { ...this.state.userGrid, rowData: data, rowCount: data.length }
            }, () => {
                this.props.onIsLoadingFalse();
            });
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
    /* 유저정보  */
    /*==========================================================*/
    getUserInfo(userId) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserDetailData", {
            params: {
                userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                userInfo: data.cmUserDto
            })
        }).catch(function (error) {
            alert(error);
        });
    }


    /*==========================================================*/
    /* 유저리스트  */
    /*==========================================================*/
    getDirectoryList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CommonService/GetDirectoryList", {
            params: {
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            var data = r.data;
            var totalList = [];
            var arrDept1 = [];
            var arrDept2 = [];
            var arrDept3 = [];
            var arrDept4 = [];
            var userList = [];

            data.deptDtos.map((row, i) => {
                if (row.deptLevel === 1) {
                    arrDept1.push(row);
                }
                if (row.deptLevel === 2) {
                    arrDept2.push(row);
                }
                if (row.deptLevel === 3) {
                    arrDept3.push(row);
                }
                if (row.deptLevel === 4) {
                    arrDept4.push(row);
                }
            });
            data.userDtos.map((row, i) => {
                userList.push(row);
            });


            // Dept 1
            arrDept1.map((aRow, a) => {
                totalList.push({
                    data: {
                        name: aRow.deptNm,
                        id: aRow.deptId
                    },
                    children: []
                });

                // Dept 2
                arrDept2.map((bRow, b) => {
                    if (aRow.deptId === bRow.upDeptId) {
                        totalList[a].children.push({
                            data: {
                                name: bRow.deptNm,
                                id: bRow.deptId
                            },
                            children: []
                        });

                        // Dept 3
                        arrDept3.map((cRow, c) => {
                            if (bRow.deptId === cRow.upDeptId) {
                                var cnt1 = totalList[a].children.length - 1;
                                totalList[a].children[cnt1].children.push({
                                    data: {
                                        name: cRow.deptNm,
                                        id: cRow.deptId
                                    },
                                    children: []
                                });

                                // Dept 4
                                arrDept4.map((dRow, d) => {
                                    if (cRow.deptId === dRow.upDeptId) {
                                        var cnt2 = totalList[a].children[cnt1].children - 1;
                                        totalList[a].children[cnt1].children[cnt2].children.push({
                                            data: {
                                                name: dRow.deptNm,
                                                id: dRow.deptId
                                            },
                                            children: []
                                        });
                                    }
                                });
                            }
                        });
                    }
                });



                // 유저 설정
                if (totalList[a].children.length === 0) {
                    userList.map((row, i) => {
                        if (totalList[a].data.id === row.deptCd1) {
                            totalList[a].children.push({
                                data: {
                                    name: row.userNm,
                                    id: row.deptCd1,
                                    userId: row.userId,
                                },
                                children: []
                            })
                        }
                    })
                } else {
                    totalList[a].children.map((row1, i1) => {
                        if (row1.children.length === 0) {
                            userList.map((uRow, i) => {
                                if (row1.data.id === uRow.deptCd2) {
                                    row1.children.push({
                                        data: {
                                            name: uRow.userNm,
                                            id: uRow.deptCd1,
                                            userId: uRow.userId,
                                        },
                                        children: []
                                    })
                                }
                            })
                        } else {
                            row1.children.map((row2, i2) => {
                                if (row2.children.length === 0) {
                                    userList.map((uRow, i) => {
                                        if (row2.data.id === uRow.deptCd3) {
                                            row2.children.push({
                                                data: {
                                                    name: uRow.userNm,
                                                    id: uRow.deptCd1,
                                                    userId: uRow.userId,
                                                },
                                                children: []
                                            })
                                        }
                                    })
                                } else {
                                    row2.children.map((row3, i3) => {
                                        if (row3.children === 0) {
                                            userList.map((uRow, i) => {
                                                if (row3.data.id === uRow.deptCd4) {
                                                    row3.children.push({
                                                        data: {
                                                            name: uRow.userNm,
                                                            id: uRow.deptCd1,
                                                            userId: uRow.userId,
                                                        },
                                                        children: []
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });



            this.setState({
                bootGrid: <BootstrapTreeTable
                    tableData={totalList}
                    columns={this.state.masterGrid.treeColumns}
                    control={this.state.masterGrid.treeControls}
                    style={{ margin: 0, padding: 0 }}
                />
            }, () => {
                this.props.onIsLoadingFalse();
            });
        }).catch(function (error) {
            alert(error);
        });
    }
    render() {
        return (<>
            <div className="col-md-12">

                <div className="row">
                    <div className="col-md-4" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                        <div className="card border-left-warning shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-sm font-weight-bold text-success text-uppercase mb-4">
                                            Derectory
                                        </div>
                                        <div style={{ height: 700, padding: 0 }} className="table-responsive BTTbl_Directory">
                                            {this.state.bootGrid}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8" style={{ margin: 0, padding: 0, marginTop: 20 }}>
                        <div className="card border-left-secondary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-sm font-weight-bold text-success text-uppercase mb-4">
                                            User Info
                                        </div>
                                        <div style={{ height: 700, padding: 0 }} className="table-responsive">
                                            <Table bordered style={{ marginTop: 15, tableLayout: 'fixed' }}>
                                                <colgroup>
                                                    <col style={{ width: '100px' }} />
                                                    <col style={{ width: '150px' }} />
                                                    <col style={{ width: '100px' }} />
                                                    <col style={{ width: '150px' }} />
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={4}>
                                                            <div className="ag-theme-material"
                                                                style={{ height: 200, borderTop: '2px solid #695405' }}
                                                            >
                                                                <AgGridReact headerHeight={45} rowHeight={45}
                                                                    columnDefs={this.state.userGrid.columnDefs}
                                                                    defaultColDef={this.state.userGrid.defaultColDef}
                                                                    rowData={this.state.userGrid.rowData}
                                                                    // rowSelection="multiple" // single
                                                                // onGridReady={params => this.gridApi = params.api}
                                                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                                                    onRowClicked={(e) => {
                                                                        this.getUserInfo(e.data.userId)
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={4} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                            <Image src={this.state.userInfo.userPic} rounded style={{ height: 160 }} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ User Nm</th>
                                                        <td>
                                                            {this.state.userInfo.userNm}
                                                        </td>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ User Enm</th>
                                                        <td>
                                                            {this.state.userInfo.userEnm}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Office</th>
                                                        <td>
                                                            {this.state.userInfo.officeId}
                                                        </td>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ E-mail</th>
                                                        <td>
                                                            {this.state.userInfo.email}
                                                        </td>
                                                    </tr>
                                                    <th style={{ backgroundColor: '#e9ecef' }}>■ Dept</th>
                                                    <td colSpan={3}>
                                                        {this.state.userInfo.deptFullNm}
                                                    </td>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Office Addr</th>
                                                        <td colSpan={3}>
                                                            {this.state.userInfo.email}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Tel</th>
                                                        <td>
                                                            {this.state.userInfo.tel}
                                                        </td>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Ext</th>
                                                        <td>
                                                            {this.state.userInfo.extNum}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Mobile</th>
                                                        <td>
                                                            {this.state.userInfo.MobileTel}
                                                        </td>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Position En</th>
                                                        <td>
                                                            {this.state.userInfo.dutyCdEn}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ MAS</th>
                                                        <td>
                                                            {this.state.userInfo.masYn}
                                                        </td>
                                                        <th style={{ backgroundColor: '#e9ecef' }}>■ Position Kr</th>
                                                        <td>
                                                            {this.state.userInfo.dutyCdKorNm}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
)(Directory)
