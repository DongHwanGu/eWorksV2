using System;
using System.Collections.Generic;
using System.Text;

namespace eWroks.Api.Models.CmUser
{
    public class CmUserGroupDto
    {
		public CmUserDto CmUserDto { get; set; }
		public List<CmUserDeptMoveDto> CmUserDeptMoveDtos { get; set; }
    }
    public class CmUserDto
    {
        public string UserId { get; set; }
		public string UserNm { get; set; }
		public string UserEnm { get; set; }
		public string LoginId { get; set; }
		public string LoginPassword { get; set; }
		public string WorkerId { get; set; }
		public string Email { get; set; }
		public string Tel { get; set; }
		public string MobileTel { get; set; }
		public string EnterDt { get; set; }
		public string EntireDt { get; set; }
		public string EntireGb { get; set; }
		public string UserGb { get; set; }
		public int DeptCd1 { get; set; }
		public int DeptCd2 { get; set; }
		public int DeptCd3 { get; set; }
		public int DeptCd4 { get; set; }
		public string DeptCdKor { get; set; }
		public string DutyCdKor { get; set; }
		public string UpDutyCdEng { get; set; }
		public string DutyCdEng { get; set; }
		public decimal PreLeaveCnt { get; set; }
		public decimal OrgLeaveCnt { get; set; }
		public string UserPic { get; set; }
		public string BirthDay { get; set; }
		public string AddressKor { get; set; }
		public string GenderGb { get; set; }
		public int CtsTypeId { get; set; }
		public string MasYn { get; set; }
		public string ExtNum { get; set; }
		public string IT_StatusCd { get; set; }
		public string HR_StatusCd { get; set; }
		public string HR_Remark { get; set; }
		public string Remark { get; set; }
		public string RoleId { get; set; }
		public int OfficeId { get; set; }
		public string RegId { get; set; }
		public string UpdId { get; set; }
		public string CertiTitleGb { get; set; }

		public string DeptFullNm { get; set; }
		public string DutyCdKorNm { get; set; }
	}

    public class CmUserDeptMoveDto
	{
		public int MoveId { get; set; }
        public string UserId { get; set; }
		public int DeptCd1 { get; set; }
        public int DeptCd2 { get; set; }
        public int DeptCd3 { get; set; }
        public int DeptCd4 { get; set; }
        public string EnterDt { get; set; }
		public string EntireDt { get; set; }
		public string PreTmNm { get; set; }
		public string UserGb { get; set; }
		public string DutyCdKor { get; set; }
        public string DeptCdKor { get; set; }
		public string Remark { get; set; }
		public string RegId { get; set; }
		public string UpdId { get; set; }

        public string DeptCd1Nm { get; set; }
		public string DeptCd2Nm { get; set; }
		public string DeptCd3Nm { get; set; }
		public string DeptCd4Nm { get; set; }
		public string UserGbNm { get; set; }
		public string DutyCdKorNm { get; set; }
		public string DeptCdKorNm { get; set; }

		// 증명서에서 필요한 명칭
		public string MoveNm { get; set; }
	}

	/// <summary>
	/// 휴가 일수 관리
	/// </summary>
    public class CmUserLeaveCnt
    {
        public string UserId { get; set; }
        public string LeaveYear { get; set; }
        public decimal OrgLeaveCnt { get; set; }
        public decimal PreLeaveCnt { get; set; }
		public decimal OrgCompLeaveCnt { get; set; }
		public decimal PreCompLeaveCnt { get; set; }
		public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    public class CmUserLeaveCntItem
	{
        public string UserId { get; set; }
        public string LeaveYear { get; set; }
        public int ItemId { get; set; }
        public string IssueGb { get; set; }
        public decimal IssueCnt { get; set; }
		public decimal OrgLeaveCnt { get; set; }
		public decimal PreLeaveCnt { get; set; }
		public decimal OrgCompLeaveCnt { get; set; }
		public decimal PreCompLeaveCnt { get; set; }
		public string Remark { get; set; }
		public int LeaveHoliId { get; set; }
		public string RegId { get; set; }
        public string UpdId { get; set; }

		public string IssueGbNm { get; set; }
		public string LeaveTypeCdNm { get; set; }
		public string LeaveTypeDetailCdNm { get; set; }
		public string RegIdNm { get; set; }
		public string RegDtNm { get; set; }

	}

	/// <summary>
	/// 출퇴근 버튼 정보
	/// </summary>
    public class CmUserCommuteBtnInfo
    {
        public string ComStartBtn { get; set; }
        public string OutStartBtn { get; set; }
        public string OutEndBtn { get; set; }
		public string ComEndBtn { get; set; }
		public string ComStartDt { get; set; }
		public string OutStartDt { get; set; }
	}
	/// <summary>
	/// 출퇴근관리
	/// </summary>
    public class CmUserCommuteDto
    {
        public string UserId { get; set; }
        public string ComStartDt { get; set; }
        public string ComStartLat { get; set; }
        public string ComStartLng { get; set; }
        public string ComStartAddr { get; set; }
        public string ComEndDt { get; set; }
        public string ComEndLat { get; set; }
        public string ComEndLng { get; set; }
        public string ComEndAddr { get; set; }
        public string RegId { get;set;}
		public string UpdId { get; set; }
	}
	/// <summary>
	/// 출퇴근관리 - OUT
	/// </summary>
    public class CmUserCommuteOutDto
    {
        public string UserId { get; set; }
        public string ComStartDt { get; set; }
        public string OutStartDt { get; set; }
        public string OutStartLat { get; set; }
        public string OutStartLng { get; set; }
        public string OutStartAddr { get; set; }
        public string OutEndDt { get; set; }
        public string OutEndLat { get; set; }
        public string OutEndLng { get; set; }
        public string OutEndAddr { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
    public class CmUserCommuteTotalDto
    {
        public string StatusCdNm { get; set; }
        public string StartDtNm { get; set; }
        public string LatNm { get; set; }
        public string LngNm { get; set; }
        public string AddrNm { get; set; }
	}
}
