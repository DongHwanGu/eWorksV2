import React, { Component } from 'react';
import { createStore } from 'redux';
import axios from 'axios';

// 날짜 변환
function fnGetParsedDate(strDate, gb) {
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

    if (gb === "" || gb === "01") date = yyyy + "" + mm + "" + dd;
    if (gb === "-" || gb === "02") date = yyyy + "-" + mm + "-" + dd;
    else date = yyyy + "" + mm + "" + dd;

    return date.toString();
}
function fnGetParsedTime(strDate, gb) {
    var date = new Date(strDate);
    // alert(date);
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();

    var hour = ("00" + date.getHours()).slice(-2);
    var minutes = ("00" + date.getMinutes()).slice(-2);

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    if (gb === "" || gb === "01") date = hour + "" + minutes;
    if (gb === ":" || gb === "02") date = hour + ":" + minutes;
    else date = hour + "" + minutes;

    return date.toString();
}
// 공통 GET
async function fnAxiosGet (url, gParam) {
    var data = [];
    
    await axios.get(initState.serviceUrl + url, { 
        params: gParam
    }).then(r => {
         data = r.data;
    }).catch(function (error) {
        alert(error);
    });

    return data;
}
// 공통 POST
async function fnAxiosPost (url, gParam, gb = "01") {
    var data = {};

    if (gb === '01') {
        await axios.get(initState.serviceUrl + url, gParam)
        .then(r => {
            data = r.data;
        }).catch(function (error) {
            alert(error);
        });
    }
    else {
        await axios.get(initState.serviceUrl + url, {}, { params: gParam })
        .then(r => {
            data = r.data;
        }).catch(function (error) {
            alert(error);
        });
    }
    return data;
}
var initState = {
    serviceUrl: "https://localhost:44312/api", reportUrl: "https://localhost:44377/ReportFiles/CommonReportViewer",
    //serviceUrl: "http://172.17.92.251:9292/api", reportUrl: "http://172.17.92.251:9393/ReportFiles/CommonReportViewer",
    //serviceUrl: "https://localhost:44338/api", reportUrl: "https://localhost:44380/ReportFiles/CommonReportViewer",

    isLogin: false,
    userInfo: {},
    programNm: 'Main',
    isLoading: false,
    cacaoMapSrc: "https://dapi.kakao.com/v2/maps/sdk.js?appkey=96e119e78db5be3e2df42170a552651f&autoload=false",
    getParsedDate: (strDate, gb) => {
        return fnGetParsedDate(strDate, gb);
    },
    getParsedTime: (strDate, gb) => {
        return fnGetParsedTime(strDate, gb);
    },
    axiosGet: (url, gParam) => {
        return fnAxiosGet(url, gParam);
    },
    axiosPost: (url, gParam) => {
        return fnAxiosPost(url, gParam);
    }
} 
function reducer(state = initState, action) {
    if (action.type === 'ISLOADING_TRUE')
    {
        return { ...state, isLoading: true };
    }
    if (action.type === 'ISLOADING_FALSE')
    {
        return { ...state, isLoading: false };
    }
    if (action.type === 'LOGOUT')
    {
        return { ...state, isLogin: false, userInfo: {} };
    }
    if (action.type === 'LOGIN_SUCCESS')
    {
        return { ...state, isLogin: true, userInfo: action.userInfo };
    }
    if (action.type === 'MENU_CLICK')
    {
        return { ...state, programNm: action.programNm };
    }
    return state;
}
export default createStore(
    reducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);