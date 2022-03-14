/*global kakao*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHApproval from '../../common/approval/GDHApproval';
import GDHDatepicker from '../../common/controls/GDHDatepicker';
import GDHDatepickerTime from '../../common/controls/GDHDatepickerTime';
import GDHApprovalSelectOption from '../../common/approval/GDHApprovalSelectOption';

class CbTimeSheetDepartmentDetail extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        activeKey: "list",
        detailPage: null,
        registerDt: new Date(),
        statusCd: "",

        masterGrid: {
            columnDefs:
                [
                    { headerName: '상태', field: 'statusCdNm', minWidth: 100 },
                    { headerName: '등록일', field: 'registerDt', minWidth: 100 },
                    { headerName: '출근', field: 'commuteStartDtFullNm', minWidth: 150 },
                    { headerName: '퇴근', field: 'commuteEndDtFullNm', minWidth: 150 },
                    { headerName: '휴계', field: 'restTime', minWidth: 100 },
                    { headerName: '아간휴계', field: 'nightRestTime', minWidth: 100 },
                    { headerName: 'HI', field: 'hiTime', minWidth: 100 },
                    { headerName: 'MS/Tank', field: 'msTankTime', minWidth: 100 },
                    { headerName: 'IRT', field: 'irtTime', minWidth: 100 },
                    { headerName: 'AA', field: 'aaTime', minWidth: 100 },
                    { headerName: 'Agri', field: 'agriTime', minWidth: 100 },
                    { headerName: 'Min', field: 'minTime', minWidth: 100 },
                    { headerName: 'RoHS', field: 'rohsTime', minWidth: 100 },
                    { headerName: '근무시간', field: 'workTime', minWidth: 100 },
                    { headerName: '승인자', field: 'apprUserIdNm', minWidth: 100 },
                    { headerName: 'Comment', field: 'remark', minWidth: 100 },
                    { headerName: '작업내역', field: 'reason', minWidth: 100 },
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
        modalDateShow: false,
        otherWorkTime: "00:00",
        cbTimeSheetDto: {
            timeId: 0
            , registerDt: ''
            , commuteStartDt: ''
            , commuteStartTime: ''
            , commuteEndDt: ''
            , commuteEndTime: ''
            , restTime: ''
            , nightRestTime: ''
            , hiTime: ''
            , msTankTime: ''
            , irtTime: ''
            , aaTime: ''
            , agriTime: ''
            , minTime: ''
            , rohsTime: ''
            , workTime: ''
            , workRate: 0
            , statusCd: ''
            , reason: ''
            , remark: ''
            , regId: ''
            , updId: ''
            , apprId: 0
        },
        cbTimeSheetApprovalDtos: {
            approvalUser1: '',
            approvalUser1Nm: ''
        },
        weeklyTable: <></>,
        commuteGrid: {
            columnDefs:
                [
                    { headerName: '상태', field: 'statusCdNm', minWidth: 100 },
                    { headerName: '시간', field: 'startDtNm', minWidth: 100 },
                    { headerName: '주소', field: 'addrNm', minWidth: 200 },
                ],
            rowData: [],
            defaultColDef: {
                sortable: true,
                filter: false,
                flex: 1,
                // editable: true,
                resizable: true,
                floatingFilter: false, // 멀티서치 기능
            }
        },

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

    /*==========================================================*/
    /* PageLoad    */
    /*==========================================================*/
    componentDidMount() {
        if (this.props.selectUserInfo !== null) {
            this.getCbTimeSheetList();
        }
    }

    /*==========================================================*/
    /* 카카오 맵    */
    /*==========================================================*/
    setCacaoMap(e) {
        var _lat = e.data.latNm;
        var _lng = e.data.lngNm;
        var _address_name = e.data.addrNm;

        const script = document.createElement("script");
        script.async = true;
        script.src = this.props.storeState.cacaoMapSrc;
        document.head.appendChild(script);

        script.onload = async () => {
            // 주소-좌표 변환 객체를 생성합니다.
            const geocoder = new kakao.maps.services.Geocoder();
            kakao.maps.load(async () => {
                let container = document.getElementById("mapCbTimeSheetDepartmentDetail");
                let options = {
                    center: new kakao.maps.LatLng(_lat, _lng),
                    level: 1
                };

                const map = new window.kakao.maps.Map(container, options);

                var markerPosition = new kakao.maps.LatLng(_lat, _lng);
                var marker = new kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);
                var infoDiv = document.getElementById('centerAddrCbTimeSheetDepartmentDetail');
                infoDiv.innerHTML = _address_name;
            });
        };
    }

    /*==========================================================*/
    /* 마스터 리스트 더블클릭    */
    /*==========================================================*/
    onRowDoubleClicked(e) {
        var data = e.api.getSelectedRows();
        var id = data[0].timeId;
        var registerDt = data[0].registerDt;
        var selectUserId = data[0].regId;

        // 마스터
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetCbTimeSheetDetail", {
            params: {
                timeId: id
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;

            this.setState({
                modalDateShow: true,
                cbTimeSheetDto: {
                    ...this.state.cbTimeSheetDto
                    , timeId: data.cbTimeSheetDto.timeId
                    , registerDt: data.cbTimeSheetDto.registerDt
                    , commuteStartDt: data.cbTimeSheetDto.commuteStartDt
                    , commuteStartTime: data.cbTimeSheetDto.commuteStartTime
                    , commuteEndDt: data.cbTimeSheetDto.commuteEndDt
                    , commuteEndTime: data.cbTimeSheetDto.commuteEndTime
                    , restTime: data.cbTimeSheetDto.restTime
                    , nightRestTime: data.cbTimeSheetDto.nightRestTime
                    , hiTime: data.cbTimeSheetDto.hiTime
                    , msTankTime: data.cbTimeSheetDto.msTankTime
                    , irtTime: data.cbTimeSheetDto.irtTime
                    , aaTime: data.cbTimeSheetDto.aaTime
                    , agriTime: data.cbTimeSheetDto.agriTime
                    , minTime: data.cbTimeSheetDto.minTime
                    , rohsTime: data.cbTimeSheetDto.rohsTime
                    , workTime: data.cbTimeSheetDto.workTime.substr(0, 2) + ":" + data.cbTimeSheetDto.workTime.substr(3, 2)
                    , workRate: data.cbTimeSheetDto.workRate
                    , statusCd: data.cbTimeSheetDto.statusCd
                    , reason: data.cbTimeSheetDto.reason
                    , remark: data.cbTimeSheetDto.remark
                    , regId: data.cbTimeSheetDto.regId
                    , updId: data.cbTimeSheetDto.updId

                    , apprId: data.cbTimeSheetDto.apprId
                },
                cbTimeSheetApprovalDtos: {
                    approvalUser1: '',
                    approvalUser1Nm: data.cbTimeSheetApprovalDtos[0].apprUserIdNm
                }
            })
        }).catch(function (error) {
            alert(error);
        });

        // 주간
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetCbTimeSheetWeeklyList", {
            params: {
                timeId: id,
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;

            var table = <></>;
            if (data.length === 7) {
                table = <Table striped bordered style={{ textAlign: 'center' }}>
                    <tbody>
                        <tr>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[0].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[1].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[2].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[3].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[4].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[5].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>{data[6].todate}</td>
                            <td style={{ backgroundColor: '#d9edf7', fontWeight: 'bold' }}>총 근무시간</td>
                        </tr>
                        <tr>
                            <td>{data[0].workTimeNm}</td>
                            <td>{data[1].workTimeNm}</td>
                            <td>{data[2].workTimeNm}</td>
                            <td>{data[3].workTimeNm}</td>
                            <td>{data[4].workTimeNm}</td>
                            <td>{data[5].workTimeNm}</td>
                            <td>{data[6].workTimeNm}</td>
                            <td>{data[6].workTimeTotalNm}</td>
                        </tr>
                    </tbody>
                </Table>
            }
            this.setState({
                weeklyTable: table
            })
        }).catch(function (error) {
            alert(error);
        });

        // 출퇴근
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserCommuteList", {
            params: {
                thisDt: registerDt.replaceAll("-", ""),
                userId: selectUserId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;

            this.setState({
                commuteGrid: { ...this.state.commuteGrid, rowData: data, rowCount: data.length }
            })

        }).catch(function (error) {
            alert(error);
        });
    }

    /*==========================================================*/
    /* 마스터 리스트 조회    */
    /*==========================================================*/
    getCbTimeSheetList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CbTimeSheetService/GetCbTimeSheetList", {
            params: {
                registerDt: this.props.storeState.getParsedDate(this.state.registerDt),
                statusCd: this.state.statusCd,
                userId: this.props.selectUserInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            this.setState({
                masterGrid: { ...this.state.masterGrid, rowData: data, rowCount: data.length }
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
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ 등록일</Form.Label>
                                    <GDHDatepicker
                                        name='registerDt'
                                        value={this.state.registerDt} onDateChange={this.onDateChange.bind(this)}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>■ Status</Form.Label>
                                    <Form.Control as="select" size="sm"
                                        name="statusCd"
                                        value={this.state.statusCd}
                                        onChange={this.onChangeHandler.bind(this)}>
                                        <GDHSelectOption cdMajor="0060" deleteMinor={[]} isEmpty={true} isEmptyText="ALL" />
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getCbTimeSheetList.bind(this)}>Search</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <Table striped bordered style={{ width: '100%', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
                        <tbody>
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>
                                    {this.props.selectUserInfo.userNm}님의 근무일정 표
                                </td>
                            </tr>
                            <tr style={{ backgroundColor: '#d9edf7' }}>
                                <td>주당 근로 시간</td>
                                <td>월 근로 시간</td>
                            </tr>
                            <tr>
                                <td>{this.props.selectUserInfo.weeklyWorkTime === null ? "00:00" : this.props.selectUserInfo.weeklyWorkTime}</td>
                                <td>{this.props.selectUserInfo.monthWorkTime === null ? "00:00" : this.props.selectUserInfo.monthWorkTime}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className="ag-theme-material"
                        style={{ height: 600, borderTop: '2px solid #695405' }}
                    >

                        <AgGridReact headerHeight={45} rowHeight={45}
                            columnDefs={this.state.masterGrid.columnDefs}
                            defaultColDef={this.state.masterGrid.defaultColDef}
                            rowData={this.state.masterGrid.rowData}
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

            {/* Modal */}
            <Modal show={this.state.modalDateShow} backdrop="static" size="lg">
                <Modal.Header className="text-right">
                    <div className="col-md-12 text-rigth">
                        <Button variant="secondary" onClick={function () {
                            this.setState({ modalDateShow: false })
                        }.bind(this)}>Close</Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-4" style={{ border: '1px solid #ddd', padding: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ 출근</Form.Label>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Form.Control type="text" size="sm"
                                                        name="commuteStartDt"
                                                        value={this.state.cbTimeSheetDto.commuteStartDt}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control type="text" size="sm"
                                                        name="commuteStartTime"
                                                        value={this.state.cbTimeSheetDto.commuteStartTime}
                                                        readOnly
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 퇴근</Form.Label>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Form.Control type="text" size="sm"
                                                        name="commuteEndDt"
                                                        value={this.state.cbTimeSheetDto.commuteEndDt}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control type="text" size="sm"
                                                        name="commuteEndTime"
                                                        value={this.state.cbTimeSheetDto.commuteEndTime}
                                                        readOnly
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 휴게</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="restTime"
                                        value={this.state.cbTimeSheetDto.restTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 야간 휴게</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="nightRestTime"
                                        value={this.state.cbTimeSheetDto.nightRestTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Alert key={1} variant={'danger'}>
                                        "야간 휴게"는 야간근무 22:00 ~ 06:00 중 휴게 시간이고 그 외 휴게는 모두 "휴게"로 넣어주세요.
                                    </Alert>
                                </Form.Group>
                            </div>
                            <div className="col-md-4" style={{ border: '1px solid #ddd', padding: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ HI</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="hiTime"
                                        value={this.state.cbTimeSheetDto.hiTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ MS/Tank</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="msTankTime"
                                        value={this.state.cbTimeSheetDto.msTankTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ IRT</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="irtTime"
                                        value={this.state.cbTimeSheetDto.irtTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ AA</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="aaTime"
                                        value={this.state.cbTimeSheetDto.aaTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ Agri</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="agriTime"
                                        value={this.state.cbTimeSheetDto.agriTime}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4" style={{ border: '1px solid #ddd', padding: 15 }}>
                                <Form.Group>
                                    <Form.Label>■ Min</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="minTime"
                                        value={this.state.cbTimeSheetDto.minTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ RoHS</Form.Label>
                                    <Form.Control type="text" size="sm"
                                        name="rohsTime"
                                        value={this.state.cbTimeSheetDto.rohsTime}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>■ 작업내역</Form.Label>
                                    <Form.Control as="textarea" rows={7}
                                        name="reason"
                                        value={this.state.cbTimeSheetDto.reason}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '3px double #aaa' }}>
                                            <td style={{ textAlign: 'right', color: 'green', fontWeight: 'bold', padding: '10px 0px' }}>
                                                <span>(근무시간) </span>
                                                <span style={{ color: 'red', fontSize: 15 }}>
                                                    {this.state.cbTimeSheetDto.workTime}
                                                </span>
                                                <span style={{ fontSize: 15 }}> / </span>
                                                <span>(HI + MS/Tank + IRT + AA + Agri + Min + RoHS) </span>
                                                <span style={{ color: 'red', fontSize: 15 }}>
                                                    {this.state.cbTimeSheetDto.workTime}
                                                </span>
                                                <span style={{ fontSize: 15 }}> = </span>
                                                <span style={{ color: 'red', fontSize: 15 }}>
                                                    {this.state.cbTimeSheetDto.workRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-12" style={{ marginTop: 15 }}>
                                <Form.Label>■ 주당 근로 시간 (요청일자 기준)</Form.Label>
                                {this.state.weeklyTable}
                            </div>
                            <div className="col-md-6" style={{ marginTop: 15 }}>
                                <Form.Label>■ 출퇴근 기록 (요청일자 기준)</Form.Label>
                                <div className="ag-theme-material"
                                    style={{ height: 300, borderTop: '2px solid #695405' }}
                                >
                                    <AgGridReact headerHeight={45} rowHeight={45}
                                        columnDefs={this.state.commuteGrid.columnDefs}
                                        defaultColDef={this.state.commuteGrid.defaultColDef}
                                        rowData={this.state.commuteGrid.rowData}
                                        rowSelection="multiple" // single
                                        // onGridReady={params => this.gridApi = params.api}
                                        // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                        onRowClicked={this.setCacaoMap.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6" style={{ marginTop: 15 }}>
                                <Form.Label>■ Map</Form.Label>
                                <div style={{ width: "100%", height: "300px", border: '1px solid #ddd', padding: 20 }}>
                                    <div id="mapCbTimeSheetDepartmentDetail" style={{ width: "100%", height: "100%" }}>
                                    </div>
                                    <Alert key={1} variant={'dark'} style={{ zIndex: 1, position: 'absolute', top: 40, left: 20 }}>
                                        <span style={{ fontWeight: 'bold' }} id="centerAddrCbTimeSheetDepartmentDetail"></span>
                                    </Alert>
                                </div>
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
)(CbTimeSheetDepartmentDetail)
