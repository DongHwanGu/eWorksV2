import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, InputGroup, Modal, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import GDHSelectOption from "../../common/controls/GDHSelectOption";
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHToastEditor from '../../common/Editor/GDHToastEditor';
import GDHQuillEditor from '../../common/Editor/GDHQuillEditor';

class NoticeMgmtDetail extends Component {
    // static getDerivedStateFromProps(props, state) {
    //     if (props.data !== null) {
    //         if (state.cmNoticeDto.noticeId !== props.data.noticeId) {
    //             return { cmNoticeDto: props.data }
    //         }
    //     }
    //     else {
    //         return { 
    //             cmNoticeDto: _cmNoticeDto
    //          }
    //     }

    //     return null;
    // }
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        cmNoticeDto: {
            noticeId: 0,
            noticeTitle: '',
            noticeDesc: '',
            alertGb: '01',
            deptList: 'ALL',
            startDt: new Date(),
            endDt: new Date(),
            clickCnt: 0,
            useYn: 'Y',
            regId: '',
            updId: '',

            noticeFiles: []
        },
        fileGrid: {
            columnDefs:
                [
                    { headerName: 'File Nm', field: 'fileNm', minWidth: 300, checkboxSelection: true, headerCheckboxSelection: true }
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: true,
                flex: 1,
                // editable: true,
                resizable: true,
            }
        },
        modalDept: false,
        modalDeptGrid: {
            columnDefs:
                [
                    { headerName: 'Dept Nm', field: 'deptNm', minWidth: 300, checkboxSelection: true, headerCheckboxSelection: true }
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

    componentDidMount() {
        // 넘겨온값 받기
        if (this.props.cmNoticeDto !== undefined && this.props.cmNoticeDto !== '') {
            this.setState({
                cmNoticeDto: this.props.cmNoticeDto
            })
        }
    }

    /*==========================================================*/
    /* 부서 리스트 추가    */
    /*==========================================================*/
    addDeptList() {
        axios.get(this.props.storeState.serviceUrl + "/CmNoticeService/GetDeptList")
            .then(r => {
                var data = r.data;
                this.setState({
                    modalDept: true,
                    modalDeptGrid: { ...this.state.modalDeptGrid, rowData: data }
                })
            }).catch(function (error) {
                alert(error);
            });
    }

    /*==========================================================*/
    /* 부서 리스트 저장    */
    /*==========================================================*/
    saveDeptData() {
        var rows = this.modalDeptGridApi.getSelectedRows();

        if (rows.length === 0) {
            alert('선택된 데이터가 없습니다.');
            return;
        }
        var dept = '';
        var deptNm = '';
        rows.map((data, i) => {
            dept += data.deptId + ','
            deptNm += data.deptNm + ','
        });

        this.setState({
            cmNoticeDto: {
                ...this.state.cmNoticeDto,
                deptList: deptNm
            },
            modalDept: false
        });
    }

    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    saveNoticeData() {
        var noticeFiles = [];
        this.noticeFilesGridApi.forEachNode(row => {
            // row.data.noticeId = 0;
            // row.data.fileSeq = 0;
            row.data.regId = this.props.storeState.userInfo.userId;
            row.data.updId = this.props.storeState.userInfo.userId;
            noticeFiles.push(row.data);
        });

        var Gparam = {
            ...this.state.cmNoticeDto,
            startDt: this.getParsedDate(this.state.cmNoticeDto.startDt),
            endDt: this.getParsedDate(this.state.cmNoticeDto.endDt),
            regId: this.props.storeState.userInfo.userId,
            updId: this.props.storeState.userInfo.userId,
            noticeFiles: noticeFiles
        }
        if (Gparam.noticeTitle === '')
        {
            alert('[ Title ] 값을 입력해 주세요.');
            return;
        }
        this.props.onIsLoadingTrue();
        axios.post(this.props.storeState.serviceUrl + "/CmNoticeService/SaveNoticeData",
            Gparam
        ).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            if (data.oV_RTN_CODE === -1) {
                alert(data.oV_RTN_MSG);
                return;
            }
            this.props.getNoticeList();
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 날짜 변경  */
    /*==========================================================*/
    getParsedDate(strDate){
        var date = new Date(strDate);
        // alert(date);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
    
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        date =  yyyy + "" + mm + "" + dd;
        return date.toString();
    }
    /*==========================================================*/
    /* 신규생성    */
    /*==========================================================*/
    onClickNew() {
        this.props.onClickNew();
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            cmNoticeDto: {
                ...this.state.cmNoticeDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeNumberHandler(e) {
        this.setState({
            cmNoticeDto: {
                ...this.state.cmNoticeDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onDateChange(name, date) {
        this.setState({
            cmNoticeDto: {
                ...this.state.cmNoticeDto,
                [name]: date
            }
        });
    }
    onQuillChangeHandler(name, desc) {
        this.setState({
            cmNoticeDto: {
                ...this.state.cmNoticeDto,
                [name]: desc
            }
        });
    }
    onfileUploadClick(e) {
        const frmFiles = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            frmFiles.append('files', e.target.files[i])
        }
        frmFiles.append('filePath', 'Notice')
        frmFiles.append('userId', this.props.storeState.userInfo.userId)

        axios.post(this.props.storeState.serviceUrl + "/CommonService/UploadFiels", frmFiles, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(r => {
            var data = r.data;
            this.setState({
                cmNoticeDto: {
                    ...this.state.cmNoticeDto,
                    noticeFiles: data
                }
            })
        }).catch(function (error) {
            alert(error);
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
                                <Button variant="success" onClick={this.saveNoticeData.bind(this)}>Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-3 hidden">
                                <Form.Group>
                                    <Form.Label>■ Notice Id</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="noticeId"
                                        value={this.state.cmNoticeDto.noticeId} onChange={this.onChangeHandler.bind(this)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ Title</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="noticeTitle"
                                        value={this.state.cmNoticeDto.noticeTitle} onChange={this.onChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group style={{ height: 400, paddingBottom: 75 }}>
                                    <Form.Label>■ Desc</Form.Label>
                                    <GDHQuillEditor
                                        name="noticeDesc"
                                        value={this.state.cmNoticeDto.noticeDesc} onChange={this.onQuillChangeHandler.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Alert Gb</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="alertGb"
                                        value={this.state.cmNoticeDto.alertGb} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <GDHSelectOption cdMajor="0009" deleteMinor={[]} isEmpty={false} isEmptyText="=== Select ===" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-9">
                                <Form.Group>
                                    <Form.Label>■ Dept List</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control type="text" size="sm"
                                            name="deptList"
                                            value={this.state.cmNoticeDto.deptList} onChange={this.onChangeHandler.bind(this)}
                                            readOnly
                                        />
                                        <InputGroup.Append>
                                            <Button variant="outline-secondary" size="sm" style={{ height: 29 }}
                                                onClick={this.addDeptList.bind(this)}
                                            >
                                                Add
                                            </Button>
                                            <Button variant="outline-secondary" size="sm" style={{ height: 29 }}
                                                onClick={() => this.setState({
                                                    cmNoticeDto: {
                                                        ...this.state.cmNoticeDto,
                                                        deptList: 'ALL'
                                                    }
                                                })}
                                            >
                                                X
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>


                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label >■ Start Dt</Form.Label>
                                    <GDHDatepicker
                                        name='startDt'
                                        value={this.state.cmNoticeDto.startDt} onDateChange={this.onDateChange.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label >■ End Dt</Form.Label>
                                    <GDHDatepicker
                                        name='endDt'
                                        value={this.state.cmNoticeDto.endDt} onDateChange={this.onDateChange.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ UseYn</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="useYn"
                                        value={this.state.cmNoticeDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                    >
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group>
                                    <Form.Label>■ File</Form.Label>
                                    <Form.File
                                        label="file upload click !!"
                                        custom
                                        multiple={true}
                                        onChange={this.onfileUploadClick.bind(this)}
                                    />
                                    <div className="ag-theme-material"
                                        style={{ height: 200, borderTop: '2px solid #695405' }}
                                    >
                                        <AgGridReact headerHeight={45} rowHeight={45}
                                            columnDefs={this.state.fileGrid.columnDefs}
                                            defaultColDef={this.state.fileGrid.defaultColDef}
                                            rowData={this.state.cmNoticeDto.noticeFiles}
                                            rowSelection="multiple" // single
                                            onGridReady={params => this.noticeFilesGridApi = params.api}
                                        // onRowClicked={this.onRowClicked_Master.bind(this)}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>

            {/* Role Program Modal */}
            <Modal show={this.state.modalDept} backdrop="static" size="md">
                <Modal.Header>
                    <Modal.Title>Program List</Modal.Title>
                </Modal.Header>
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveDeptData.bind(this)}>Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalDept: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="ag-theme-material"
                        style={{ height: 400, borderTop: '2px solid #695405' }}
                    >
                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.modalDeptGrid.columnDefs}
                            defaultColDef={this.state.modalDeptGrid.defaultColDef}
                            rowData={this.state.modalDeptGrid.rowData}
                            rowSelection="multiple" // single
                            onGridReady={params => this.modalDeptGridApi = params.api}
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
)(NoticeMgmtDetail)