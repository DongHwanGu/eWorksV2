import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { connect } from 'react-redux';
import {Dropdown, Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Accordion, Image  } from 'react-bootstrap';
import axios from 'axios';

class Sidebar extends Component {
  /*==========================================================*/
  /* State   */
  /*==========================================================*/
  state = {
    programList: [],
    menuObject: null,
    selectMenu: '',
  }

  /*==========================================================*/
  /* 페이지 로드    */
  /*==========================================================*/
  componentDidMount() {
    // if(this.isMobile()) {
    //   $(".sidebar").toggleClass("toggled");
    // }
    
    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
      };
    });

    this.getProgramList();
  }
  /*==========================================================*/
  /* 프로그램 리스트 조회    */
  /*==========================================================*/
  getProgramList() {
    axios.get(this.props.storeState.serviceUrl + "/CommonService/GetProgramList", {
      params: {
        roleId: this.props.storeState.userInfo.roleId
      }
    }).then(r => {
      var data = r.data;
      this.setState({
        programList: data
      }, () => {
        var aa = [];
          for (var i = 0; i < this.state.programList.length; i++)
          {
            var bb = this.state.programList[i];
            if (bb.programLevel === 0) {
              aa.push(this.menuSetting(bb));
            }  
          }
          this.setState({
            menuObject: aa
          })
      })
    }).catch(function (error) {
      alert(error);
    });
  }

  setCollapse(prNm) {
    var orgPrNm = this.state.selectMenu;
    var selectPrNm = $("." + prNm)[0].id;

    if (orgPrNm === selectPrNm) {
      if ($("." + prNm).hasClass('show')) {
        $("." + prNm).removeClass("show");
      } else {
        $("." + prNm).addClass("show");
      }
    }
    else {
      this.setState({
        selectMenu: selectPrNm
      })
      $(".collapse").removeClass("show");
      if ($("." + prNm).hasClass('show')) {
        $("." + prNm).removeClass("show");
      } else {
        $("." + prNm).addClass("show");
      }
    }
  }
  replaceProgramNm(programNm) {
    if (this.props.storeState.userInfo.certiTitleGb !== '03') {
      programNm = programNm.replace("Vacation", "Vacation / Holiday");
    }
    return programNm;
  }
  menuSetting(masterRow) {
    let subMenu = [];

    for (var i = 0; i < this.state.programList.length; i++) {
      var subRow = this.state.programList[i];
      if (subRow.programLevel !== 0 && masterRow.programId === subRow.upProgramId) {
        subMenu.push(
          <Link key={subRow.programId} to={subRow.programUrl} className="collapse-item" onClick={function (e) {
            this.props.onMenuClick(e.target.innerText.replace('┖ ', ''))
          }.bind(this)}>
            <span >{ this.replaceProgramNm(subRow.programNm) }</span>
          </Link>
        )
      }
    }
    return (<React.Fragment key={masterRow.programId}>
      <hr className="sidebar-divider" style={{ marginBottom: 0 }} />
      <li className="nav-item">
        <a className="nav-link collapsed" href="#" data-toggle="collapse"
          // data-target={"#" + masterRow.programNm}
          onClick={() => {
           this.setCollapse(masterRow.programNm)
          }}
            aria-expanded="true" aria-controls={masterRow.programNm}
          >
          <i className="fas fa-fw fa-cog"></i>
          <span>{masterRow.programNm}</span>
        </a>
        <div id={masterRow.programNm} className={'collapse ' + masterRow.programNm} aria-labelledby="headingTwo" data-parent="#accordionSidebar">
          <div key={masterRow.programId}  className="bg-white py-2 collapse-inner rounded">
            {subMenu}
          </div>
        </div>
      </li>
    </React.Fragment>)
  }
  render() {

    return (<div id="wrapper">
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar" style={{ borderBottom: '77px solid black' }}>
        {/* <!-- Sidebar - Brand --> */}
        <Link to="/"  onClick={function (e) { this.props.onMenuClick("Main") }.bind(this)}>
          <div className="sidebar-brand d-flex align-items-center justify-content-center" style={{ backgroundColor: 'black' }}>
            <div className="sidebar-brand-icon">
              <Image src={'/images/roundRogo.png'} fluid />
            </div>
            <div className="sidebar-brand-text mx-3" style={{ color: '#fafafa', fontSize: 20 }}>e-Works</div>
          </div>
        </Link>
        {/* <!-- Divider --> */}
        <div className="sidebar-heading" style={{ marginTop: 15, marginBottom: 15, color: 'white', fontSize: 13, backgroundColor: '#21B6D7', paddingTop: 15, paddingBottom: 15 }}>
          Welcome! {this.props.storeState.userInfo.userEnm}.
        </div>

        {this.state.menuObject}
        
        {/* <!-- Divider --> */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* <!-- Sidebar Toggler (Sidebar) --> */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
        
      </ul>
    </div>);
  }
}
export default connect(
  function (state) {
    return { storeState: state }
  },
  function (dispatch) {
    return {
      onMenuClick: function(programNm) {
        dispatch({ type: 'MENU_CLICK', programNm })
      }
    }
  }
)(Sidebar);