import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { ProgressBar, Form, Col, Card, Button, Breadcrumb, DropdownButton, InputGroup, FormControl, Dropdown, Spinner } from 'react-bootstrap';

import Layout from './main/Layout';
import Sidebar from './main/Sidebar';
import Top from './main/Top';

class Main extends Component {    
    render() {
        return (<>
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Top />
                        <div className="container-fluid">
                            <div style={{ textAlign: 'center', marginBottom: 15, fontFamily:'"Neo Sans W01", Calibri, "Lucida Grande", Arial' }}>
                                <h1 className="h3 mb-0 text-gray-800"><i className="fas fa-fw fa-cog"></i> {this.props.storeState.programNm.toUpperCase()}</h1>
                            </div>
                            <Layout />
                        </div>
                    </div>

                    <footer className="sticky-footer" style={{ marginTop: 15, backgroundColor: 'black', color: 'white' }}>
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright &copy; Your Website 2020</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up"></i>
            </a>

            {
                this.props.storeState.isLoading ? <div className="wrap-loading" style={{ zIndex: 10000 }}>
                    <Spinner animation="border" variant="warning" style={{ width: '100px', height: '100px' }} />
                </div> : <div></div>
            }
            
            
        </>);
    }
}
export default connect(
    function (state) {
        return { storeState: state }
      },
      function (dispatch) {
        return {
        }
      }
)(Main);