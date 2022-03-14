import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';

import './custom.css'
import Login from './components/Login';
import Main from './components/Main';

class App extends Component {
  static displayName = App.name;

  render() {
    return (<>
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
)(App)
 
