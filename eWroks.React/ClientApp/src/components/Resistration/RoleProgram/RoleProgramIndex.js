import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { createThrow } from 'typescript';

class RoleProgramIndex extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        cmRoleDto: {
            roleId: '',
            roleNm: '',
            roleDesc: '',
            useYn: 'Y',
            regId: '',
            updId: ''
        },
        roleGrid: {
            columnDefs:
                [
                    { headerName: 'RoleId', field: 'roleId', minWidth: 100 },
                    { headerName: 'RoleNm', field: 'roleNm', minWidth: 200 },
                    { headerName: 'RoleDesc', field: 'roleDesc', minWidth: 200 },
                    { headerName: 'UseYn', field: 'useYn', minWidth: 100 },
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
        roleProgramGrid: {
            columnDefs:
                [
                    { headerName: 'ProgramNm', field: 'programNm', minWidth: 300, checkboxSelection: true, headerCheckboxSelection: true }
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
        modalRoleProgram: false,
        modalRoleProgramGrid: {
            columnDefs:
                [
                    { headerName: 'ProgramNm', field: 'programNm', minWidth: 300, checkboxSelection: true, headerCheckboxSelection: true }
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
	/* 초기화    */
	/*==========================================================*/
    initControles() {
        this.setState({
            cmRoleDto: {
                roleId: '',
                roleNm: '',
                roleDesc: '',
                useYn: 'Y',
                regId: '',
                updId: ''
            }
        })
    }
    /*==========================================================*/
	/* 페이지 로드    */
	/*==========================================================*/
    componentDidMount(){
        this.getRoleList()
    }

    /*==========================================================*/
	/* Role 리스트    */
	/*==========================================================*/
    getRoleList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmRoleProgramService/GetProgramMasterList")
        .then(r => {
            var data = r.data;
            this.initControles();
            this.setState({
                roleGrid: { ...this.state.roleGrid, rowData: data },
                roleProgramGrid: { ...this.state.roleProgramGrid, rowData: [] },
                modalRoleProgramGrid: { ...this.state.modalRoleProgramGrid, rowData: [] }
            }, () => {
                this.props.onIsLoadingFalse();
            })
        })
        .catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
	/* Role Save    */
	/*==========================================================*/
    saveRoleData() {
        if (this.state.cmRoleDto.roleNm === '')
        {
            alert('[ roleNm ] 값을 입력해 주세요.');
            return;
        }
        this.props.onIsLoadingTrue();
        this.setState({
            cmRoleDto: {
                ...this.state.cmRoleDto,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
            }
        }, () => {
            axios.post(this.props.storeState.serviceUrl + "/CmRoleProgramService/SaveRoleData",
                this.state.cmRoleDto)
                .then(r => {
                    this.props.onIsLoadingFalse();
                    var data = r.data;
                    if (data.oV_RTN_CODE === -1) {
                        alert(data.oV_RTN_MSG);
                        return;
                    }
                    this.getRoleList();
                }).catch(function (error) {
                    alert(error);
                });
        })
    }
    /*==========================================================*/
	/* Role New    */
	/*==========================================================*/
    onRowClicked_Role(e) {
        var row = e.api.getSelectedRows()[0];
        this.setState({
            cmRoleDto: {
                roleId: row.roleId,
                roleNm: row.roleNm,
                roleDesc: row.roleDesc,
                useYn: row.useYn,
                regId: '',
                updId: ''
            }
        });
        this.getRoleProgramList();
    }
    /*==========================================================*/
	/* Role New    */
	/*==========================================================*/
    onClickNew() {
        this.initControles();
            this.setState({
                roleProgramGrid: { ...this.state.roleProgramGrid, rowData: [] },
                modalRoleProgramGrid: { ...this.state.modalRoleProgramGrid, rowData: [] }
            })
    }
    /*==========================================================*/
	/* Role Program List    */
	/*==========================================================*/
    getRoleProgramList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmRoleProgramService/GetRoleProgramList", {
            params: {
                roleId: this.state.cmRoleDto.roleId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                roleProgramGrid: { ...this.state.roleProgramGrid, rowData: data },
                modalRoleProgramGrid: { ...this.state.modalRoleProgramGrid, rowData: [] }
            });
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
	/* Role Program Add    */
	/*==========================================================*/
    addRoleProgram() {
        if(this.state.cmRoleDto.roleId === '')
        {
            alert('Role 선택 후 진행해 주세요.');
            return;
        }
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmRoleProgramService/GetModalRoleProgramList", {
            params: {
                roleId: this.state.cmRoleDto.roleId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalRoleProgram: true,
                modalRoleProgramGrid: { ...this.state.modalRoleProgramGrid, rowData: data }
            })
        }).catch(function (error) { 
            alert(error); 
        });
    }
    /*==========================================================*/
	/* Role Program Delete    */
	/*==========================================================*/
    deleteRoleProgram() {
        if(this.state.cmRoleDto.roleId === '')
        {
            alert('Role 선택 후 진행해 주세요.');
            return;
        }
        var rows = this.roleProgramGridApi.getSelectedRows();

        if (rows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        this.props.onIsLoadingTrue();
        axios.post(this.props.storeState.serviceUrl + "/CmRoleProgramService/DeleteRoleProgramData", rows)
            .then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.getRoleProgramList();

            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
	/* Save Role Program List Save    */
	/*==========================================================*/
    saveRoleProgramData() {
        var rows = this.modalRoleProgramGridApi.getSelectedRows();

        if (rows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        rows.map((row, i) => {
            row.roleId = this.state.cmRoleDto.roleId;
            row.regId = this.props.storeState.userInfo.userId;
            row.updId = this.props.storeState.userInfo.userId;
        });

        axios.post(this.props.storeState.serviceUrl + "/CmRoleProgramService/SaveRoleProgramData", rows)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.setState({
                    modalRoleProgram: false,
                    modalRoleProgramGrid: { ...this.state.modalRoleProgramGrid, rowData: []}
                });
                this.getRoleProgramList();

            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
	/* 필드 체인지 공통    */
	/*==========================================================*/
    onChangeHandler(e) {
        this.setState({
            cmRoleDto: {
                ...this.state.cmRoleDto,
                [e.target.name]: e.target.value
            }
        });
    }
    render() {
        return (<>
            <hr />
            <div className="row">
                <div className="col-md-6">
                    <Card>
                        <Card.Header>
                            <span>■ Role</span>
                        </Card.Header>
                        <Card.Body style={{ padding: 0 }}>
                            <div className="ag-theme-material"
                                style={{ height: 300, borderTop: '2px solid #695405' }}
                            >
                                <AgGridReact headerHeight={45} rowHeight={45}
                                    columnDefs={this.state.roleGrid.columnDefs}
                                    defaultColDef={this.state.roleGrid.defaultColDef}
                                    rowData={this.state.roleGrid.rowData}
                                    rowSelection="single" // single
                                // onGridReady={params => this.gridApi = params.api}
                                    onRowClicked={this.onRowClicked_Role.bind(this)}
                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Form>
                                <Form.Row>
                                    <div className="col-md-12 text-right">
                                        <Button variant="secondary" onClick={this.onClickNew.bind(this)} >New</Button>{' '}
                                        <Button variant="success" onClick={this.saveRoleData.bind(this)} >Save</Button>
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Role Id</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="roleId"
                                                value={this.state.cmRoleDto.roleId} onChange={this.onChangeHandler.bind(this)}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Role Nm</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="roleNm"
                                                value={this.state.cmRoleDto.roleNm} onChange={this.onChangeHandler.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Use Yn</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="useYn"
                                                value={this.state.cmRoleDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                            >
                                                <option value="Y">Y</option>
                                                <option value="N">N</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Role Desc</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="roleDesc"
                                                value={this.state.cmRoleDto.roleDesc} onChange={this.onChangeHandler.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>
                                </Form.Row>
                            </Form>
                        </Card.Footer>
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card>
                        <Card.Header>
                            <span>■ Role Program</span>
                            <Form.Row>
                                <div className="col-md-12 text-right">
                                    <Button variant="secondary" onClick={this.addRoleProgram.bind(this)} >Add</Button>{' '}
                                    <Button variant="danger" onClick={this.deleteRoleProgram.bind(this)} >Delete</Button>
                                </div>
                            </Form.Row>
                        </Card.Header>
                        <Card.Body style={{ padding: 0 }}>
                            <div className="ag-theme-material"
                                style={{ height: 600, borderTop: '2px solid #695405' }}
                            >
                                <AgGridReact headerHeight={45} rowHeight={45}
                                    columnDefs={this.state.roleProgramGrid.columnDefs}
                                    defaultColDef={this.state.roleProgramGrid.defaultColDef}
                                    rowData={this.state.roleProgramGrid.rowData}
                                    rowSelection="multiple" // single
                                    onGridReady={params => this.roleProgramGridApi = params.api}
                                // onRowClicked={this.onRowClicked_Master.bind(this)}
                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Role Program Modal */}
            <Modal show={this.state.modalRoleProgram} backdrop="static" size="lg">
                <Modal.Header>
                    <Modal.Title>Program List</Modal.Title>
                </Modal.Header>
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveRoleProgramData.bind(this)}>Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalRoleProgram: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 400, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.modalRoleProgramGrid.columnDefs}
                            defaultColDef={this.state.modalRoleProgramGrid.defaultColDef}
                            rowData={this.state.modalRoleProgramGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.modalRoleProgramGridApi = params.api}
                        // onRowClicked={this.onRowClicked_Master.bind(this)}
                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
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
)(RoleProgramIndex)