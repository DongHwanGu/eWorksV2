import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal } from 'react-bootstrap';


function Login(props) {
    const [login_email, setEmail] = useState("");
    const [login_password, setPassword] = useState("");
    const [login_isRemember, setIsRemember] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['eWroks_LoginInfo', 'eWroks_UserId']);

    useEffect(() => {
        if (cookies.eWroks_UserId !== undefined) {
            axios.get(props.storeState.serviceUrl + "/CmLoginService/Login", {
                params: {
                    loginId: login_email,
                    loginPassword: login_password,
                    userId: cookies.eWroks_UserId
                }
            }).then(r => {
                var data = r.data;
                if (data === '') {
                    alert('로그인 정보가 없습니다.');
                    return;
                }
                props.onLogin(data);
            }).catch(function (error) {
                alert(error);
            });
        }

        if (cookies.eWroks_LoginInfo !== undefined) {
            var cookiesloginInfo = cookies.eWroks_LoginInfo;
            if (cookiesloginInfo.isRemember) {
                setEmail(cookiesloginInfo.email);
                // setPassword(cookiesloginInfo.password);
                setIsRemember(true);
            }
        }

    }, []);

    const handleCheck = (e) => {
        setIsRemember(e.target.checked);
    }
    const handleOnLogin = (e) => {
        e.preventDefault();
        if (login_isRemember) {
            var cookiesloginInfo = {
                email: login_email,
                // password: login_password,
                isRemember: login_isRemember
            }
            setCookie('eWroks_LoginInfo', JSON.stringify(cookiesloginInfo));
        } else {
            removeCookie('eWroks_LoginInfo');
        }

        axios.get(props.storeState.serviceUrl + "/CmLoginService/Login", {
            params: {
                loginId: login_email,
                loginPassword: login_password,
                userId: ''
            }
        }).then(r => {
            var data = r.data;
            if (data === '') {
                alert('로그인 정보가 존재하지 않습니다.');
                return;
            }
            setCookie('eWroks_UserId', data.userId);
            props.onLogin(data);
        }).catch(function (error) {
            alert(error);
        });
    } 

    return (<>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-gradient-primary"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">eWorks ver 2.0</h1>
                                        </div>
                                        <form className="user">
                                            <div className="form-group">
                                                <Form.Control type="text" size="sm" className="form-control"
                                                    value={login_email} onChange={function (e) {
                                                        setEmail(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <Form.Control type="password" size="sm" className="form-control"
                                                    value={login_password} onChange={function (e) {
                                                        setPassword(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <div className="custom-control custom-checkbox small">
                                                    <input type="checkbox" className="custom-control-input" id="customCheck" name="customCheck" checked={login_isRemember}
                                                        onChange={handleCheck} />
                                                    <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary btn-user btn-block" onClick={handleOnLogin}>
                                                Login</button>    
                                            <hr />
                                            {/* <a href="index.html" className="btn btn-google btn-user btn-block">
                                                    <i className="fab fa-google fa-fw"></i> Login with Google</a>
                                                <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                                    <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook</a> */}
                                        </form>
                                        {/* <hr />
                                            <div className="text-center">
                                                <a className="small" href="forgot-password.html">Forgot Password?</a>
                                            </div>
                                            <div className="text-center">
                                                <a className="small" href="register.html">Create an Account!</a>
                                            </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
export default connect(
    function (state) {
        return { storeState: state }
    },
    function (dispatch) {
        return {
            onLogin: function (userInfo) {
                dispatch({ type: 'LOGIN_SUCCESS', userInfo })
            }
        }
    }
)(Login);