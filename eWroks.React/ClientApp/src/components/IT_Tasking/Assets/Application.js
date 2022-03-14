import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import GDHSelectOption from '../../common/controls/GDHSelectOption';

const initDto = {
    itAssetsDto: {
        assetsId: 0,
        assetsGb: '01',
        assetsNm: '',
        useYn: 'Y',
        remark: '',
        cdRef1: '',
        cdRef2: '',
        cdRef3: '',
        regId: '',
        updId: '',
    },
    itAssetsItemDto: {
        assetsId: 0,
        itemId: 0,
        itemNm: '',
        itemCnt: 1,
        purchaseDt: '',
        controlNo: '',
        manufacture: '',
        serialNo: '',
        replaceDt: '',
        businessLine: '',
        hostNm: '',
        disposalDt: '',
        stockYn: 'N',
        useYn: 'Y',
        remark: '',
        cdRef1: '',
        cdRef2: '',
        cdRef3: '',
        cdRef4: '',
        cdRef5: '',
        cdRef6: '',
        cdRef7: '',
        cdRef8: '',
        cdRef9: '',
        cdRef10: '',
        regId: '',
        updId: '',
    }
}
class Application extends Component {
    state = {
        itAssetsDto: initDto.itAssetsDto,
        itAssetsGrid: {
            columnDefs:
                [
                    { headerName: 'App Type', field: 'assetsNm', minWidth: 100 },
                    { headerName: 'useYn', field: 'useYn', minWidth: 80, cellStyle: { textAlign: 'center' } },
                    { headerName: 'remark', field: 'remark', minWidth: 200 },
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
        itAssetsItemDto: initDto.itAssetsItemDto,
        itAssetsItemGrid: {
            columnDefs:
                [
                    { headerName: 'App Nm', field: 'itemNm', minWidth: 100 },
                    { headerName: 'App No', field: 'cdRef1', minWidth: 100 },
                    { headerName: 'App Level', field: 'cdRef2', minWidth: 100, cellStyle: { textAlign: 'center' } },
                    { headerName: 'UseYn', field: 'useYn', minWidth: 80, cellStyle: { textAlign: 'center' } },
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
        modalAssetsItem: false,
        settingGrid: {
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
    }
    /*==========================================================*/
	/* 페이지 로드    */
    /*==========================================================*/
    componentDidMount() {
        this.getAssetsList();
    }

    /*==========================================================*/
	/* 마스터 조회    */
	/*==========================================================*/
    getAssetsList() {
        axios.get(this.props.storeState.serviceUrl + "/ItAssetsService/GetAssetsList", {
            params: {
                assetsGb: '01'
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                itAssetsGrid: { ...this.state.itAssetsGrid, rowData: data },
                itAssetsDto: initDto.itAssetsDto,
                itAssetsItemDto: initDto.itAssetsItemDto,
                itAssetsItemGrid: {
                    ...this.state.itAssetsItemGrid,
                    rowData: []
                },
                settingGrid: {
                    ...this.state.settingGrid,
                    rowData: []
                }
            })
        }).catch(function (error) { 
            alert(error); 
        });
    }

    /*==========================================================*/
	/* 저장    */
	/*==========================================================*/
    saveAssetsData() {
        if (this.state.itAssetsDto.assetsNm === '')
        {
            alert('[ assetsNm ] 값을 입력해 주세요.');
            return;
        }
        var Gparam = {
            ...this.state.itAssetsDto,
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,

        }
        axios.post(this.props.storeState.serviceUrl + "/ItAssetsService/SaveAssetsData",
            Gparam)
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getAssetsList();
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
	/* 상세 가져오기    */
	/*==========================================================*/
    onRowClicked_Assets(e) {
        var row = e.api.getSelectedRows()[0];
        this.setState({
            itAssetsDto: {
                assetsId: row.assetsId,
                assetsGb: row.assetsGb,
                assetsNm: row.assetsNm,
                useYn: row.useYn,
                remark: row.remark,
                cdRef1: row.cdRef1,
                cdRef2: row.cdRef2,
                cdRef3: row.cdRef3,
                regId: '',
                updId: '',
            }
        });
        this.getAssetsItemList(row.assetsId);
    }

    // ITem 리스트
    getAssetsItemList(assetsId) {
        this.props.onIsLoadingTrue();
        
        axios.get(this.props.storeState.serviceUrl + "/ItAssetsService/GetAssetsItemList", {
            params: {
                assetsId: assetsId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                itAssetsItemDto: initDto.itAssetsItemDto,
                itAssetsItemGrid: {
                    ...this.state.itAssetsItemGrid,
                    rowData: data
                },
                modalAssetsItem: false,
                settingGrid: {
                    ...this.state.settingGrid,
                    rowData: []
                }
            })
        }).catch(function (error) { 
            alert(error); 
        });
    }

    /*==========================================================*/
	/* Item 추가    */
	/*==========================================================*/
    addAssetsItem() {
        if(this.state.itAssetsDto.assetsId === 0)
        {
            alert('상위 데이터 선택 후 진행해 주세요.');
            return;
        }
        this.setState({
            modalAssetsItem: true,
            itAssetsItemDto: initDto.itAssetsItemDto,
            settingGrid: {
                ...this.state.settingGrid,
                rowData: []
            }
        })
    }

    /*==========================================================*/
	/* Item 저장    */
	/*==========================================================*/
    saveAssetsItemData() {
        if (this.state.itAssetsItemDto.itemNm === '')
        {
            alert('[ App Nm ] 값을 입력해 주세요.');
            return;
        }
        var Gparam = {
            ...this.state.itAssetsItemDto,
            assetsId: this.state.itAssetsDto.assetsId,
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,

        }
        axios.post(this.props.storeState.serviceUrl + "/ItAssetsService/SaveAssetsItemData",
            Gparam)
        .then(r => {
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.getAssetsItemList(this.state.itAssetsDto.assetsId);
        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
	/* Item 더블클릭    */
	/*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();

        this.setState({
            modalAssetsItem: true,
            itAssetsItemDto: initDto.itAssetsItemDto
        }, () => {
            setTimeout(function () { //Start the timer
                this.setState({
                    itAssetsItemDto: {
                        ...this.state.itAssetsItemDto,
                        assetsId: data[0].assetsId,
                        itemId: data[0].itemId,
                        itemNm: data[0].itemNm,
                        cdRef1: data[0].cdRef1,
                        cdRef2: data[0].cdRef2,
                        useYn: data[0].useYn,
                        remark: data[0].remark,
                    }
                })
            }.bind(this), 100)
        })
    }
    /*==========================================================*/
	/* 신규    */
	/*==========================================================*/
    onClickNew() {
        this.setState({
            itAssetsDto: initDto.itAssetsDto,
            itAssetsItemDto: initDto.itAssetsItemDto,
            itAssetsItemGrid: {
                ...this.state.itAssetsItemGrid,
                rowData: []
            },
            settingGrid: {
                ...this.state.settingGrid,
                rowData: []
            }
        })
    }
    /*==========================================================*/
	/* 필드 체인지 공통    */
	/*==========================================================*/
    onChangeHandler(e) {
        this.setState({
            itAssetsDto: {
                ...this.state.itAssetsDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeItemHandler(e) {
        this.setState({
            itAssetsItemDto: {
                ...this.state.itAssetsItemDto,
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
                            <span style={{ fontWeight: 'bold', fontSize: 14 }}>■ Application</span>
                        </Card.Header>
                        <Card.Body style={{ padding: 0 }}>
                            <div className="ag-theme-material"
                                style={{ height: 300, borderTop: '2px solid #695405' }}
                            >
                                <AgGridReact headerHeight={45} rowHeight={45}
                                    columnDefs={this.state.itAssetsGrid.columnDefs}
                                    defaultColDef={this.state.itAssetsGrid.defaultColDef}
                                    rowData={this.state.itAssetsGrid.rowData}
                                    rowSelection="single" // single
                                    // onGridReady={params => this.gridApi = params.api}
                                     onRowClicked={this.onRowClicked_Assets.bind(this)}
                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Form>
                                <Form.Row>
                                    <div className="col-md-12 text-right">
                                        <Button variant="secondary" onClick={this.onClickNew.bind(this)} >New</Button>{' '}
                                        <Button variant="success" onClick={this.saveAssetsData.bind(this)} >Save</Button>{' '}
                                        <Button variant="primary" onClick={this.getAssetsList.bind(this)}>Search</Button>
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Id</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="assetsId"
                                                value={this.state.itAssetsDto.assetsId} onChange={this.onChangeHandler.bind(this)}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ App Type</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="assetsNm"
                                                value={this.state.itAssetsDto.assetsNm} onChange={this.onChangeHandler.bind(this)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Use Yn</Form.Label>
                                            <Form.Control as="select" size="sm"
                                                name="useYn"
                                                value={this.state.itAssetsDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                            >
                                                <option value="Y">Y</option>
                                                <option value="N">N</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12">
                                        <Form.Group>
                                            <Form.Label>■ Remark</Form.Label>
                                            <Form.Control type="text" size="sm"
                                                name="remark"
                                                value={this.state.itAssetsDto.remark} onChange={this.onChangeHandler.bind(this)}
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
                            <span style={{ fontWeight: 'bold', fontSize: 14 }}>■ Application Item</span>
                            <Form.Row>
                                <div className="col-md-12 text-right">
                                    <Button variant="secondary" onClick={this.addAssetsItem.bind(this)} >Add</Button>{' '}
                                    {/* <Button variant="danger" onClick={this.deleteRoleProgram.bind(this)} >Delete</Button> */}
                                </div>
                            </Form.Row>
                        </Card.Header>
                        <Card.Body style={{ padding: 0 }}>
                            <div className="ag-theme-material"
                                style={{ height: 650, borderTop: '2px solid #695405' }}
                            >
                                <AgGridReact headerHeight={45} rowHeight={45}
                                    columnDefs={this.state.itAssetsItemGrid.columnDefs}
                                    defaultColDef={this.state.itAssetsItemGrid.defaultColDef}
                                    rowData={this.state.itAssetsItemGrid.rowData}
                                    rowSelection="multiple" // single
                                    onGridReady={params => this.roleProgramGridApi = params.api}
                                // onRowClicked={this.onRowClicked_Master.bind(this)}
                                    onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Role Program Modal */}
            <Modal show={this.state.modalAssetsItem} backdrop="static" size="lg">
                <Modal.Header>
                    <Modal.Title>Item</Modal.Title>
                </Modal.Header>
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveAssetsItemData.bind(this)}>Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalAssetsItem: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="itemId"
                                        value={this.state.itAssetsItemDto.itemId} onChange={this.onChangeItemHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className="validateText">■ App Nm</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="itemNm"
                                        value={this.state.itAssetsItemDto.itemNm} onChange={this.onChangeItemHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Use Yn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.itAssetsItemDto.useYn} onChange={this.onChangeItemHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ App No</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="cdRef1"
                                        value={this.state.itAssetsItemDto.cdRef1} onChange={this.onChangeItemHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ App Level</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="cdRef2"
                                        value={this.state.itAssetsItemDto.cdRef2} onChange={this.onChangeItemHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0061" deleteMinor={[]} isEmpty={true} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>■ Remark</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="remark"
                                        value={this.state.itAssetsItemDto.remark} onChange={this.onChangeItemHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>

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
)(Application)