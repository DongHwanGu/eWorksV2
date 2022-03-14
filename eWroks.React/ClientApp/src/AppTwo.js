import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import './custom.css'
import Login from './components/Login';
import Main from './components/Main';

import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

class AppTwo extends Component {
  componentDidMount() {
     
  }
  render() {
    var isLogin = this.props.isLogin;
    var article;
    if (isLogin) {
      article = <Main />
    } else {
      article = <Login />
    }
    return (<>
      {article}
    </>);
  }
}
export default connect(
  function (state) {
    return {
      isLogin: state.isLogin
    }
  },
  null
)(AppTwo)