import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';


import MainPage from './MainPage';
import UserProfile from './UserProfile';
import Directory from './Directory';

// HR
import HrCertificateList from '../HR_Tasking/Certificate/HrCertificateList';
import HrExternalTrainingList from '../HR_Tasking/ExternalTraining/HrExternalTrainingList';
import HrLeaveHolidayList from '../HR_Tasking/LeaveHoliday/HrLeaveHolidayList';
import HrHealthCheckList from '../HR_Tasking/MyHealthCheck/HrHealthCheckList';
import HrOvertimeWorkList from '../HR_Tasking/OvertimeWork/HrOvertimeWorkList';

// IT 
import AssetsIndex from '../IT_Tasking/Assets/AssetsIndex';
import BackupRecoredIndex from '../IT_Tasking/BackupRecord/BackupRecoredIndex';
import AcountIndex from '../IT_Tasking/Account/AcountIndex';

// FI
import FITravelList from '../FI_Tasking/TravelRequest/FITravelList';
import FiPurchaseRequestList from '../FI_Tasking/PurchaseRequest/FiPurchaseRequestList';


// CB
import CbScheduleList from '../CB_Tasking/Schedule/CbScheduleList';
import CbTimeSheetRecordList from '../CB_Tasking/TimeSheetRecord/CbTimeSheetRecordList';
import CbTimeSheetApprovedList from '../CB_Tasking/TimeSheetApproved/CbTimeSheetApprovedList';

// e-Approval
import TravelList from '../e_Approval/TravelRequest/TravelList';
import CertificateList from '../e_Approval/Certificate/CertificateList';
import ExternalTrainingList from '../e_Approval/ExternalTraining/ExternalTrainingList';
import LeaveHolidayList from '../e_Approval/LeaveHoliday/LeaveHolidayList';
import OvertimeWorkList from '../e_Approval/OvertimeWork/OvertimeWorkList';
import OvertimeWorkApprovedList from '../e_Approval/OvertimeWork/OvertimeWorkApprovedList';

// Resistration
import UserMgmtIndex from '../Resistration/UserMgmt/UserMgmtIndex';
import RoleProgramIndex from '../Resistration/RoleProgram/RoleProgramIndex';
import DeptMgmtIndex from '../Resistration/DeptMgmt/DeptMgmtIndex';
import OfficeMgmtIndex from '../Resistration/OfficeMgmt/OfficeMgmtIndex';
import NoticeMgmtIndex from '../Resistration/NoticeMgmt/NoticeMgmtIndex';
import CalendarIndex from '../Resistration/CalendarMgmt/CalendarIndex';
import LoginLogList from '../Resistration/LoginLogMgmt/LoginLogList';
import MeetingRoom from '../Resistration/MeetingRoom/MeetingRoom';
import ApprovalMgmtIndex from '../Resistration/ApprovalMgmt/ApprovalMgmtIndex';

// System
import CmCodeIndex from '../System/CmCode/CmCodeIndex';
import ProgramIndex from '../System/Program/ProgramIndex';
import MyHealthCheckList from '../e_Approval/MyHealthCheck/MyHealthCheckList';
import CbTimeSheetDashboardList from '../CB_Tasking/TimeSheetDashboard/CbTimeSheetDashboardList';
import PurchaseRequestList from '../e_Approval/PurchaseRequest/PurchaseRequestList';
import PurchaseSettingList from '../Resistration/PurchaseSetting/PurchaseSettingList';
import PurchaseApprovedList from '../e_Approval/PurchaseRequest/PurchaseApprovedList';




export default class Layout extends Component {
  render() {
    return (<>
      <Route exact path={['/', '/MainPage']} component={MainPage} />
      <Route exact path='/UserProfile' component={UserProfile} />
      <Route exact path='/Directory' component={Directory} />


      {/* HR */}
      <Route exact path='/HrCertificate' component={HrCertificateList} />
      <Route exact path='/HrExternalTraining' component={HrExternalTrainingList} />
      <Route exact path='/HrVacation' component={HrLeaveHolidayList} />
      <Route exact path='/HrHealthCheck' component={HrHealthCheckList} />
      <Route exact path='/HrOvertimeWork' component={HrOvertimeWorkList} />
      
      {/* IT */}
      <Route exact path='/Assets' component={AssetsIndex} />
      <Route exact path='/AcountAssets' component={AcountIndex} />
      <Route exact path='/BackupRecord' component={BackupRecoredIndex} />

      {/* FI */}
      <Route exact path='/FITravel' component={FITravelList} />
      <Route exact path='/FiPurchaseRequest' component={FiPurchaseRequestList} />

      {/* CB */}
      <Route exact path='/CbSchedule' component={CbScheduleList} />
      <Route exact path='/CbTimeSheetRecord' component={CbTimeSheetRecordList} />
      <Route exact path='/CbTimeSheetApproved' component={CbTimeSheetApprovedList} />
      <Route exact path='/CbTimeSheetDashboard' component={CbTimeSheetDashboardList} />

      {/* e-Approval */}
      <Route exact path='/ExternalTraining' component={ExternalTrainingList} />
      <Route exact path='/Travel' component={TravelList} />
      <Route exact path='/Certificate' component={CertificateList} />
      <Route exact path='/Vacation' component={LeaveHolidayList} />
      <Route exact path='/MyHealthCheck' component={MyHealthCheckList} />
      <Route exact path='/OvertimeWork' component={OvertimeWorkList} />
      <Route exact path='/OvertimeWorkApproved' component={OvertimeWorkApprovedList} />
      <Route exact path='/PurchaseRequest' component={PurchaseRequestList} />
      <Route exact path='/PurchaseApproved' component={PurchaseApprovedList} />

      {/* Resistration */}
      <Route exact path='/RoleProgram' component={RoleProgramIndex} />
      <Route exact path='/UserMgmt' component={UserMgmtIndex} />
      <Route exact path='/DeptMgmt' component={DeptMgmtIndex} />
      <Route exact path='/OfficeMgmt' component={OfficeMgmtIndex} />
      <Route exact path='/NoticeMgmt' component={NoticeMgmtIndex} />
      <Route exact path='/CalendarMgmt' component={CalendarIndex} />
      <Route exact path='/LoginLogMgmt' component={LoginLogList} />
      <Route exact path='/ApprovalMgmt' component={ApprovalMgmtIndex} />
      <Route exact path='/MeetingRoom' component={MeetingRoom} />
      <Route exact path='/FinanceSetting' component={PurchaseSettingList} />

      {/* System */}
      <Route exact path='/CmCode' component={CmCodeIndex} />
      <Route exact path='/Program' component={ProgramIndex} />
    </>
    );
  }
}
