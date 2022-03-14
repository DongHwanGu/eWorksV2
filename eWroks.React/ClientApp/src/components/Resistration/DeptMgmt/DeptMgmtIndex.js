import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';
import axios from 'axios';
import DeptMgmtList from './DeptMgmtList';


class DeptMgmtIndex extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        modalDeptData: false,
        deptOptions: {
            dept1: [],
            dept2: [],
            dept3: [],
        },
        cmDeptDto: {
            deptId: 0,
            deptNm: '',
            upDeptId: 0,
            dispSeq: 0,
            deptLevel: 0,
            useYn: 'Y',
            deptRef1: '',
            deptRef2: '',
            deptRef3: '',
            regId: '',
            updId: '',

            deptCd1: 0,
            deptCd2: 0,
            deptCd3: 0,
        },
        deptList1: [],
        deptList2: [],
        deptList3: [],
        deptList4: [],
    }
    /*==========================================================*/
    /* 페이지 로드    */
    /*==========================================================*/
    componentDidMount() {
        this.getDeptMasterList();
    }
    /*==========================================================*/
    /* Dept 1 List    */
    /*==========================================================*/
    getDeptMasterList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmDeptService/GetDeptMasterList"
        ).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                modalDeptData: false,
                deptList1: data,
                deptList2: [],
                deptList3: [],
                deptList4: [],
            });
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 그리드클릭    */
    /*==========================================================*/
    onRowClicked(row) {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmDeptService/GetDeptSubList", {
            params: {
                deptId: Number(row.deptId)
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            if (row.deptLevel === 1)
                this.setState({ deptList2: data, deptList3: [], deptList4: [] })
            else if (row.deptLevel === 2)
                this.setState({ deptList3: data, deptList4: [] })
            else if (row.deptLevel === 3)
                this.setState({ deptList4: data })
            else return;
        }).catch(function (error) {
            alert(error);
        });
    }
    /*==========================================================*/
    /* 그리드 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(row) {
        this.setState({
            modalDeptData: true,
            cmDeptDto: {
                deptId: row.deptId,
                deptNm: row.deptNm,
                upDeptId: 0,
                dispSeq: 0,
                deptLevel: 0,
                useYn: row.useYn,
                deptRef1: row.deptRef1,
                deptRef2: row.deptRef2,
                deptRef3: row.deptRef3,
                regId: '',
                updId: '',
                deptCd1: row.deptCd1,
                deptCd2: row.deptCd2,
                deptCd3: row.deptCd3
            },
        });

        if (row.deptLevel === 1) {
            this.getDeptOptions("01", 0);
        }
        if (row.deptLevel === 2) {
            this.getDeptOptions("01", 0, row.deptCd1);
            setTimeout(function() { //Start the timer
                this.getDeptOptions("02", row.deptCd1, row.deptCd2);
            }.bind(this), 100)
        }
        if (row.deptLevel === 3) {
            this.getDeptOptions("01", 0, row.deptCd1);
            setTimeout(function() { //Start the timer
                this.getDeptOptions("02", row.deptCd1, row.deptCd2);
            }.bind(this), 100)
            setTimeout(function() { //Start the timer
                this.getDeptOptions("03", row.deptCd2, row.deptCd3);
            }.bind(this), 200)
        }
    }
    /*==========================================================*/
    /* Add    */
    /*==========================================================*/
    onAddClic() {
        this.getDeptOptions("01", 0);

        this.setState({
            modalDeptData: true,
            cmDeptDto: {
                deptId: 0,
                deptNm: '',
                upDeptId: 0,
                dispSeq: 0,
                deptLevel: 0,
                useYn: 'Y',
                deptRef1: '',
                deptRef2: '',
                deptRef3: '',
                regId: '',
                updId: '',

                deptCd1: 0,
                deptCd2: 0,
                deptCd3: 0,
            },
        })
    }
    /*==========================================================*/
    /* Dept 저장    */
    /*==========================================================*/
    saveDeptData() {
        if (this.state.cmDeptDto.deptNm === '')
        {
            alert('[ deptNm ] 값을 입력해 주세요.');
            return;
        }
        this.props.onIsLoadingTrue();
        this.setState({
            cmDeptDto: {
                ...this.state.cmDeptDto,
                regId: this.props.storeState.userInfo.userId,
                updId: this.props.storeState.userInfo.userId,
            }
        }, () => {
            axios.post(this.props.storeState.serviceUrl + "/CmDeptService/SaveDeptData"
                , this.state.cmDeptDto
            ).then(r => {
                    this.props.onIsLoadingFalse();
                    var data = r.data;
                    if (data.oV_RTN_CODE === -1) {
                        alert(data.oV_RTN_MSG);
                        return;
                    }
                    this.getDeptMasterList();
                }).catch(function (error) {
                    alert(error);
                });
        })
    }
    /*==========================================================*/
    /* 필드 체인지 공통    */
    /*==========================================================*/
    onChangeHandler(e) {
        this.setState({
            cmDeptDto: {
                ...this.state.cmDeptDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onDeptChangeHandler(e) {
        var eValue = Number(e.target.value);
        this.setState({
            cmDeptDto: {
                ...this.state.cmDeptDto,
                [e.target.name]: eValue
            }
        });
        if (e.target.name === 'deptCd1') { 
            if(eValue === 0) this.getDeptOptions("01", eValue)  
            else this.getDeptOptions("02", eValue) 
        }
        if (e.target.name === 'deptCd2') { 
            this.getDeptOptions("03", eValue) 
        }
    }
    /*==========================================================*/
	/* Dept 조회    */
	/*==========================================================*/
    getDeptOptions(deptGb, deptId, upDeptId = 0) {

        axios.get(this.props.storeState.serviceUrl + "/CmDeptService/GetDeptOptions", {
            params: {
                deptId: deptId
            }
        }).then(r => {
            var data = r.data;
            if (deptGb === '01') {
                this.setState({
                    cmDeptDto: { ...this.state.cmDeptDto, deptCd1: deptId, deptCd2: 0, deptCd3: 0 },
                    deptOptions: { ...this.state.deptOptions, dept1: data, dept2: [], dept3: [] },
                }, () => {
                    if(upDeptId > 0) {
                        this.setState({
                            cmDeptDto: { ...this.state.cmDeptDto, deptCd1: upDeptId, deptCd2: 0, deptCd3: 0 },
                        })
                    }
                });
            }
            if (deptGb === '02') {
                this.setState({
                    cmDeptDto: { ...this.state.cmDeptDto, deptCd2: 0, deptCd3: 0 },
                    deptOptions: { ...this.state.deptOptions, dept2: data, dept3: [] }
                }, () => {
                    if(upDeptId > 0) {
                        this.setState({
                            cmDeptDto: { ...this.state.cmDeptDto, deptCd2: upDeptId, deptCd3: 0 },
                        })
                    }
                });
            }
            if (deptGb === '03') {
                this.setState({
                    cmDeptDto: { ...this.state.cmDeptDto, deptCd3: 0 },
                    deptOptions: { ...this.state.deptOptions, dept3: data }
                }, () => {
                    if(upDeptId > 0) {
                        this.setState({
                            cmDeptDto: { ...this.state.cmDeptDto, deptCd3: upDeptId },
                        })
                    }
                });
            }
        }).catch(function (error) { 
            alert(error); 
        });
    }
    render() {
        return (<>
            <hr />
            <Form.Row>
                <div className="col-md-12 text-right">
                    <Button variant="secondary" onClick={this.onAddClic.bind(this)} >Add</Button>{' '}
                    <Button variant="primary" onClick={this.getDeptMasterList.bind(this)}>Search</Button>
                </div>
            </Form.Row>
            <hr />
            <div className="row">
                <div className="col-md-6">
                    <DeptMgmtList title="Dept 1"
                        list={this.state.deptList1}
                        onRowClicked={this.onRowClicked.bind(this)}
                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                    />
                </div>
                <div className="col-md-6">
                    <DeptMgmtList title="Dept 2"
                        list={this.state.deptList2}
                        onRowClicked={this.onRowClicked.bind(this)}
                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                    />
                </div>
            </div>

            <div className="row" style={{ marginTop: 15 }}>
                <div className="col-md-6">
                    <DeptMgmtList title="Dept 3"
                        list={this.state.deptList3}
                        onRowClicked={this.onRowClicked.bind(this)}
                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                    />
                </div>
                <div className="col-md-6">
                    <DeptMgmtList title="Dept 4"
                        list={this.state.deptList4}
                        onRowClicked={this.onRowClicked.bind(this)}
                        onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                    />
                </div>
            </div>


            {/* Role Program Modal */}
            <Modal show={this.state.modalDeptData} backdrop="static" size="lg">
                <Modal.Header>
                    <Modal.Title>Dept Data</Modal.Title>
                </Modal.Header>
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="success" onClick={this.saveDeptData.bind(this)}>Save</Button>{' '}
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalDeptData: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form.Row>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>■ Dept 1</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="deptCd1"
                                    value={this.state.cmDeptDto.deptCd1} onChange={this.onDeptChangeHandler.bind(this)}
                                >
                                    <option key={-1} value={0}>{"=== Select ==="}</option>
                                    {this.state.deptOptions.dept1.map(item =>(
                                        <option key={item.deptId} value={item.deptId}>{item.deptNm}</option>
                                    ))}   
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>■ Dept 2</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="deptCd2"
                                    value={this.state.cmDeptDto.deptCd2} onChange={this.onDeptChangeHandler.bind(this)}
                                >
                                    <option key={-1} value={0}>{"=== Select ==="}</option>
                                    {this.state.deptOptions.dept2.map(item =>(
                                        <option key={item.deptId} value={item.deptId}>{item.deptNm}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>■ Dept 3</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="deptCd3"
                                    value={this.state.cmDeptDto.deptCd3} onChange={this.onDeptChangeHandler.bind(this)}
                                >
                                    <option key={-1} value={0}>{"=== Select ==="}</option>
                                    {this.state.deptOptions.dept3.map(item =>(
                                        <option key={item.deptId} value={item.deptId}>{item.deptNm}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </div>

                        <div className="col-md-12" style={{ borderTop: '2px solid #000', marginBottom:10 }}>
                            <input type="hidden" value={this.state.cmDeptDto.deptId} />
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>■ Dept Nm</Form.Label>
                                <Form.Control type="text" size="sm"
                                    name="deptNm"
                                    value={this.state.cmDeptDto.deptNm} onChange={this.onChangeHandler.bind(this)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>■ Disp Seq</Form.Label>
                                <Form.Control type="number" size="sm"
                                    name="dispSeq"
                                    value={this.state.cmDeptDto.dispSeq} onChange={this.onChangeHandler.bind(this)}
                                    readOnly
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>■ Use Yn</Form.Label>
                                <Form.Control as="select" size="sm"
                                    name="useYn"
                                    value={this.state.cmDeptDto.useYn} onChange={this.onChangeHandler.bind(this)}
                                >
                                    <option value="Y">Y</option>
                                    <option value="N">N</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>■ Dept Ref1</Form.Label>
                                <Form.Control type="text" size="sm"
                                    name="deptRef1"
                                    value={this.state.cmDeptDto.deptRef1} onChange={this.onChangeHandler.bind(this)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>■ Dept Ref2</Form.Label>
                                <Form.Control type="text" size="sm"
                                    name="deptRef2"
                                    value={this.state.cmDeptDto.deptRef2} onChange={this.onChangeHandler.bind(this)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>■ Dept Ref3</Form.Label>
                                <Form.Control type="text" size="sm"
                                    name="deptRef3"
                                    value={this.state.cmDeptDto.deptRef3} onChange={this.onChangeHandler.bind(this)}
                                />
                            </Form.Group>
                        </div>
                    </Form.Row>
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
)(DeptMgmtIndex)