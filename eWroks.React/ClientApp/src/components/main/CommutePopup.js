/*global kakao*/
import React, { Component } from "react";
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert } from 'react-bootstrap';
import styled from "styled-components";

var _address_name = '';
var _lat = 0.0;
var _lng = 0.0;
class CommutePopup extends Component {
    /*==========================================================*/
    /* State    */
    /*==========================================================*/
    state = {
        cmUserCommuteBtnInfo: {
            comStartBtn: ''
            , outStartBtn: ''
            , outEndBtn: ''
            , comEndBtn: ''
            , comStartDt: ''
            , outStartDt: ''
        }
    }
      /*==========================================================*/
    /* Page Load    */
    /*==========================================================*/
    componentDidMount() {
        setTimeout(() => {
            this.setCacaoMap();
        }, 300);
        this.getUserCommuteBtnInfo();
    }

    /*==========================================================*/
    /* 카카오 맵    */
    /*==========================================================*/
    setCacaoMap() {
        _address_name = '';
        _lat = 0.0;
        _lng = 0.0;

        navigator.geolocation.getCurrentPosition(function (position) {
            _lat = position.coords.latitude;
            _lng = position.coords.longitude;
        });
        const script = document.createElement("script");
        script.async = true;
        script.src = this.props.storeState.cacaoMapSrc;
        document.head.appendChild(script);

        script.onload = async () => {
            // 주소-좌표 변환 객체를 생성합니다.
            const geocoder = new kakao.maps.services.Geocoder();

            kakao.maps.load(async () => {
                let container = document.getElementById("map");
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

                // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
                var r = await searchAddrFromCoords(map.getCenter(), displayCenterInfo);
            });

            function searchAddrFromCoords(coords, callback) {
                // 좌표로 행정동 주소 정보를 요청합니다
                geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
            }

            // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
            function displayCenterInfo(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var infoDiv = document.getElementById('centerAddr');

                    for (var i = 0; i < result.length; i++) {
                        // 행정동의 region_type 값은 'H' 이므로
                        if (result[i].region_type === 'H') {
                            infoDiv.innerHTML = result[i].address_name;
                            _address_name = result[i].address_name;
                            break;
                        }
                    }
                }
            }
        };
    }

    /*==========================================================*/
    /* 출퇴근 저장    */
    /*==========================================================*/
    saveUserCommuteData(e) {
        this.setState({
            cmUserCommuteBtnInfo: {
                comStartBtn: 'N'
                , outStartBtn: 'N'
                , outEndBtn: 'N'
                , comEndBtn: 'N'
                , comStartDt: ''
                , outStartDt: ''
            }
        })
        var btnGb = '';
        if (e.target.id === 'btnCommuteIn') btnGb = '01';
        if (e.target.id === 'btnOutIn') btnGb = '02';
        if (e.target.id === 'btnCommuteOut') btnGb = '04';

        if (_address_name === '') {
            alert('주소값을 얻지 못했습니다. Refresh 후 다시 진행해 주세요.');
            return;
        }
        axios.post(this.props.storeState.serviceUrl + "/CmUserService/SaveUserCommuteData", {},
            {
                params: {
                    btnGb: btnGb,
                    comStartDt: this.state.cmUserCommuteBtnInfo.comStartDt,
                    outStartDt: this.state.cmUserCommuteBtnInfo.outStartDt,
                    lat: _lat.toString(),
                    lng: _lng.toString(),
                    addrName: _address_name,
                    remark: '',
                    userId: this.props.storeState.userInfo.userId
                }
            })
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {

                    alert(data.oV_RTN_MSG);
                    return;
                }
                setTimeout(() => {
                    this.getUserCommuteBtnInfo();
                }, 1000);
                
            })
            .catch(function (error) {
                alert(error);
            });
    }

      /*==========================================================*/
    /* 버튼 설정    */
    /*==========================================================*/
    getUserCommuteBtnInfo() {
        this.props.onIsLoadingTrue();
        axios.get(this.props.storeState.serviceUrl + "/CmUserService/GetUserCommuteBtnInfo", {
            params: {
                thisDt: this.props.storeState.getParsedDate(new Date()),
                userId: this.props.storeState.userInfo.userId
            }
        }).then(r => {
            this.props.onIsLoadingFalse();
            var data = r.data;
            
            if (data === '') {
                this.setState({
                    cmUserCommuteBtnInfo: {
                        comStartBtn: ''
                        , outStartBtn: ''
                        , outEndBtn: ''
                        , comEndBtn: ''
                        , comStartDt: ''
                        , outStartDt: ''
                    }
                })
            }
            else {
                this.setState({
                    cmUserCommuteBtnInfo: data
                })
            }
            
        }).catch(function (error) {
            alert(error);
        });
    }
    render() {
        return (<>
            <div style={{ width: "100%", height: "400px" }}>
                <div id="map" style={{ width: "100%", height: "100%" }}>
                </div>
                <Alert key={1} variant={'dark'} style={{ zIndex: 1, position: 'absolute', top: 20, left: 20 }}>
                    <span style={{ fontWeight: 'bold' }} id="centerAddr"></span>
                </Alert>
            </div>
            <div style={{ marginTop: 0 }}>&nbsp;</div>
            <Button id="btnCommuteIn" variant="success" style={{ width: '100%', height: '50px' }} onClick={this.saveUserCommuteData.bind(this)}
                disabled={this.state.cmUserCommuteBtnInfo.comStartBtn === 'Y' || this.state.cmUserCommuteBtnInfo.comStartBtn === '' ? false : true}
            >
                출&nbsp;&nbsp;근
            </Button>
            <div style={{ marginTop: 0 }}>&nbsp;</div>
            <Button id="btnOutIn" variant="secondary" style={{ width: '100%', height: '50px' }} onClick={this.saveUserCommuteData.bind(this)}
                disabled={this.state.cmUserCommuteBtnInfo.outStartBtn === 'Y' ? false : true}
            >
                외&nbsp;&nbsp;근
            </Button>
            {/* <div style={{ marginTop: 0 }}>&nbsp;</div>
            <Button variant="secondary" style={{ width: '100%', height: '50px' }} onClick={function () { }.bind(this)}
                disabled={this.state.cmUserCommuteBtnInfo.outEndBtn === 'Y' ? false : true}
            >
                <span className="glyphicon glyphicon-log-in"></span>&nbsp;복&nbsp;&nbsp;귀
            </Button> */}
            <div style={{ marginTop: 0 }}>&nbsp;</div>
            <Button id="btnCommuteOut" variant="danger" style={{ width: '100%', height: '50px' }} onClick={this.saveUserCommuteData.bind(this)}
                disabled={this.state.cmUserCommuteBtnInfo.comEndBtn === 'Y' ? false : true}
            >
                퇴&nbsp;&nbsp;근
            </Button>
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
)(CommutePopup)
