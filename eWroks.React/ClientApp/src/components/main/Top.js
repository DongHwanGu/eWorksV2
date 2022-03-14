import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table, Alert, Dropdown } from 'react-bootstrap';

import axios from 'axios';
import { Link } from 'react-router-dom';
import CommutePopup from './CommutePopup';

function Top(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['eWroks_LoginInfo', 'eWroks_UserId']);
    const [modalCommuteShow, setmodalCommuteShow] = useState(false);
    const [commutePopupObj, setcommutePopupObj] = useState(<CommutePopup />);

    return (<>
        <nav className="navbar navbar-expand navbar-light topbar mb-4 static-top shadow" style={{ backgroundColor: 'black' }}>

            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>

            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                {/* <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                        aria-label="Search" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-warning" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div> */}
                <div style={{ fontWeight: 'bold', fontSize: 13 }}>
                    <span style={{ color: '#f0ad4e' }}>TOTAL QUALITY.</span><span style={{ color: '#fafafa' }}>ASSURED.</span>
                </div>
            </form>

            <ul className="navbar-nav ml-auto">

                <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                        aria-labelledby="searchDropdown">
                        <form className="form-inline mr-auto w-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    placeholder="Search for..." aria-label="Search"
                                    aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-warning" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>

                <li>
                    <table className='navMobileTop'>
                        <tbody>
                            <tr>
                                <td>
                                    <Link to='/Directory' onClick={function (e) {
                                        props.onMenuClick("Directory")
                                    }.bind(this)}>
                                        <Button variant="light">Directory</Button>
                                    </Link>
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="warning" id="dropdown-basic">info</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <div style={{ borderBottom: '1px double #000', paddingBottom: 8, paddingTop: 8 }}>
                                                <Dropdown.Item>
                                                    <button style={{ width: '100%', height: '100%' }} onClick={function (e) {
                                                        setmodalCommuteShow(true);
                                                    }.bind(this)}>
                                                        <i className="fas fa-fw fa-cog"></i> 출퇴근 관리
                                                    </button>
                                                </Dropdown.Item>
                                            </div>
                                            <div style={{ borderBottom: '1px double #000', paddingBottom: 8, paddingTop: 8 }}>
                                                <Dropdown.Item>
                                                    <Link to='/UserProfile' onClick={function (e) {
                                                        props.onMenuClick("User Profile")
                                                    }.bind(this)}>
                                                        <i className="fas fa-fw fa-cog"></i> User Profile
                                                    </Link>
                                                </Dropdown.Item>
                                            </div>
                                            <div style={{ paddingTop: 8 }}>
                                                <Dropdown.Item>
                                                    <Link to='/' onClick={function (e) {
                                                        e.preventDefault();
                                                        removeCookie('eWroks_UserId');
                                                        props.onLogoutClick();
                                                        window.location.href = "/";
                                                    }.bind(this)}>
                                                        <i className="fas fa-fw fa-cog"></i> Logout
                                                    </Link>
                                                </Dropdown.Item>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </li>
            </ul>
        </nav>

        {/* Modal */}
        <Modal show={modalCommuteShow} backdrop="static" size="md">
            <Modal.Header className="text-right">
                <div className="col-md-12 text-rigth">
                    <Button variant="secondary" onClick={function () {
                        setcommutePopupObj(null);
                        setTimeout(() => {
                            setcommutePopupObj(<CommutePopup />);
                        }, 100);
                    }.bind(this)}>Refresh</Button> {' '}

                    <Button variant="secondary" onClick={function () {
                        setmodalCommuteShow(false);
                    }.bind(this)}>Close</Button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Row>
                        {commutePopupObj}
                    </Form.Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    </>);
}
export default connect(
    null,
    function (dispatch) {
        return {
            onLogoutClick: function() {
                dispatch({ type: "LOGOUT" })
            },
            onMenuClick: function(programNm) {
                dispatch({ type: 'MENU_CLICK', programNm })
            }
        }
    }
)(Top);