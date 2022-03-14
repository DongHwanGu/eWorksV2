import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import GDHSelectOption from '../controls/GDHSelectOption';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

class GDHApproval extends Component {
      /*==========================================================*/
	/* State    */
    /*==========================================================*/
    state = {
        approvalGrid: {
            approvalCd: this.props.approvalCd,
            approvalGb: this.props.approvalGb,
            columnDefs:
                [
                    { headerName: 'Status', field: 'statusCdNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100 },
                    { headerName: 'Upd Dt', field: 'updDtNm', minWidth: 100 },
                    { headerName: 'Remark', field: 'remark', minWidth: 100 },
                ],
            rowData: this.props.approvalUserList,
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                // floatingFilter: true, // 멀티서치 기능
            },
            isLoding: false,
        },
        modalItemShow: false,
        approvalPopupGrid: {
            columnDefs:
                [
                    { headerName: 'User Nm', field: 'userNm', minWidth: 100, checkboxSelection: true, headerCheckboxSelection: true },
                    { headerName: 'Position', field: 'dutyCdKorNm', minWidth: 100 },
                    { headerName: 'Division', field: 'deptFullNm', minWidth: 100 },
                ],
            rowData: [],
            rowCount: 0,
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
                // floatingFilter: true, // 멀티서치 기능
            },
            isLoding: false,
        },
    }

    /*==========================================================*/
	/* Props 변경 감지    */
	/*==========================================================*/
    componentDidUpdate = (prevProps, prevState) => { //componentDidUpdate가 props의 변과를 감지한다
        if (this.props.approvalUserList.length !== prevProps.approvalUserList.length) { //하위컴포넌트가 받은 props값 적어주기(둘다)
            this.setState({
                approvalGrid: { ...this.state.approvalGrid, rowData: this.props.approvalUserList, rowCount: this.props.approvalUserList.length }
            })
        }
      };

    /*==========================================================*/
	/* 팝업 저장    */
	/*==========================================================*/
    saveApprovalUserList = () => {
        var rows = this.gridApiPopup.getSelectedRows();

        if (rows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        var arrApprId = [];
        var gParamRows = [];

        this.state.approvalGrid.rowData.map((row, i) => {
            arrApprId.push(row.apprId);
            gParamRows.push(row)
        });
        rows.map((row, i) => {
            var num = arrApprId.length === 0 ? 100 : Math.max.apply(null, arrApprId) + 1;
            arrApprId.push(num);
            gParamRows.push({
                apprId: num,
                apprCd: row.approvalCd,
                apprUserId: row.approvalUserId,
                statusCd: '01',
                mailYn: 'N',
                deleApprUserId: '',
                deleReason: '',
                remark: '',
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
                statusCdNm: '승인요청',
                userNm: row.userNm,
                updDtNm: ''
            });
        });

        this.setState({
            modalItemShow: false,
            approvalGrid: { ...this.state.approvalGrid, rowData: gParamRows, rowCount: gParamRows.length }
        })

        this.props.saveApprovalUserList(gParamRows, this.props.approvalCd);
    }

    /*==========================================================*/
	/* 유저 삭제    */
	/*==========================================================*/
    onClickDelete() {
        var rows = this.gridApi.getSelectedRows();

        if (rows.length === 0)
        {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        var cRows = [];
        this.state.approvalGrid.rowData.map((row, i) => {
            cRows.push(row)
        });

        var gParamRows = [];
        cRows.map((row, i) => {
            var boolCheck = false;
            rows.map((sRow, j) => {
                if (row.apprId === sRow.apprId)
                {
                    boolCheck = true;
                }
            })
            if (!boolCheck) {
                gParamRows.push(cRows[i])
            }
        });

        this.setState({
            approvalGrid: { ...this.state.approvalGrid, rowData: gParamRows, rowCount: gParamRows.length }
        })

        this.props.saveApprovalUserList(gParamRows, this.props.approvalCd);
    }
    /*==========================================================*/
	/* 팝업 조회    */
	/*==========================================================*/
    onClickAdd() {
        this.setState({
            modalItemShow: true
        }, () => {
            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/CommonService/GetApprovalUserList", {
                params: {
                    userId: this.props.storeState.userInfo.userId,
                    approvalGb: this.state.approvalGrid.approvalGb,
                    approvalCd: this.state.approvalGrid.approvalCd
                }
            }).then(r => {
                var data = r.data;
                this.setState({
                    // masterGrid: Object.assign({}, this.state.masterGrid, { rowData: data })
                    approvalPopupGrid: { ...this.state.approvalPopupGrid, rowData: data, rowCount: data.length }
                }, () => {
                    this.props.onIsLoadingFalse();
                });
            }).catch(function (error) {
                alert(error);
            });
        })
    }

    render() {
        return (<>
            <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-center">
                                <span style={{ fontWeight: 'bold' }}>
                                    {this.props.apprTitle}
                                </span>
                            </div>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickAdd.bind(this)} >Add</Button>{' '}
                                <Button variant="danger" onClick={this.onClickDelete.bind(this)}>Delete</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <div className="ag-theme-material"
                        style={{ height: 120, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.approvalGrid.columnDefs}
                            defaultColDef={this.state.approvalGrid.defaultColDef}
                            rowData={this.state.approvalGrid.rowData}
                            singleClickEdit={true}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApi = params.api}
                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                        />
                    </div>
                </Card.Body>
            </Card>


            {/* Modal */}
            <Modal show={this.state.modalItemShow} backdrop="static" size="md">
                {/* <Modal.Header>
                    <Modal.Title>User List</Modal.Title>
                </Modal.Header> */}
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveApprovalUserList.bind(this)} >Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            // setTimeout(function () { //Start the timer
                                this.setState({ modalItemShow: false })
                            // }.bind(this), 300)
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 300, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.approvalPopupGrid.columnDefs}
                            defaultColDef={this.state.approvalPopupGrid.defaultColDef}
                            rowData={this.state.approvalPopupGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.gridApiPopup = params.api}
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
)(GDHApproval)