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

var _address_name = '';
var _lat = 0.0;
var _lng = 0.0;

class UserCommuteList extends Component {
     /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        registerDt: new Date(),
        statusCd: "",

        masterGrid: {
            columnDefs:
                [
                    { headerName: '상태', field: 'statusCdNm', minWidth: 100 },
                    { headerName: '시간', field: 'startDtNm', minWidth: 100 },
                    { headerName: '주소', field: 'addrNm', minWidth: 200 },
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
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        this.getUserCommuteList();
    }

    /*==========================================================*/
    /* 조회   */
    /*==========================================================*/
    getUserCommuteList() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserCommuteList", {
            params: {
                thisDt: this.props.storeState.getParsedDate(this.state.registerDt),
                userId: this.props.storeState.userInfo.userId
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
                let container = document.getElementById("map2");
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
                var infoDiv = document.getElementById('centerAddr2');
                infoDiv.innerHTML = _address_name;
            });
        };
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
                        </Form.Row>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="primary" onClick={this.getUserCommuteList.bind(this)}>Search</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                    <Form.Row>
                        <Col md={6} style={{ margin: 0, padding: 0 }}>
                            <div className="ag-theme-material"
                                style={{ height: 600, borderTop: '2px solid #695405', margin: 0, padding: 0 }}
                            >

                                <AgGridReact headerHeight={45} rowHeight={45}
                                    columnDefs={this.state.masterGrid.columnDefs}
                                    defaultColDef={this.state.masterGrid.defaultColDef}
                                    rowData={this.state.masterGrid.rowData}
                                    rowSelection="multiple" // single
                                // onGridReady={params => this.gridApi = params.api}
                                // onRowDoubleClicked={this.onRowDoubleClicked.bind(this)}
                                    onRowClicked={this.setCacaoMap.bind(this)}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div style={{ width: "100%", height: "600px", border: '1px solid #ddd', padding: 50 }}>
                                <div id="map2" style={{ width: "100%", height: "100%" }}>
                                </div>
                                <Alert key={1} variant={'dark'} style={{ zIndex: 1, position: 'absolute', top: 20, left: 20 }}>
                                    <span style={{ fontWeight: 'bold' }} id="centerAddr2"></span>
                                </Alert>
                            </div>
                        </Col>
                    </Form.Row>
                </Card.Body>
                <Card.Footer>
                    <Form.Label>Total : {this.state.masterGrid.rowCount}</Form.Label>
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
)(UserCommuteList)
