using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CbTimeSheet
{
    public class CbTimeSheetGroupDto
    {
        public CbTimeSheetDto CbTimeSheetDto { get; set; }
        public List<CbTimeSheetApprovalDto> CbTimeSheetApprovalDtos { get; set; }
    }
    public class CbTimeSheetDto
    {
        public int TimeId { get; set; }
        public string RegisterDt { get; set; }
        public string CommuteStartDt { get; set; }
        public string CommuteStartTime { get; set; }
        public string CommuteEndDt { get; set; }
        public string CommuteEndTime { get; set; }
        public string RestTime { get; set; }
        public string NightRestTime { get; set; }
        public string HiTime { get; set; }
        public string MsTankTime { get; set; }
        public string IrtTime { get; set; }
        public string AaTime { get; set; }
        public string AgriTime { get; set; }
        public string MinTime { get; set; }
        public string RohsTime { get; set; }
        public string WorkTime { get; set; }
        public int WorkRate { get; set; }
        public string StatusCd { get; set; }
        public string Reason { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string RegIdNm { get; set; }
        public string RegIdDeptFullNm { get; set; }
        public string StatusCdNm { get; set; }
        public string CommuteStartDtFullNm { get; set; }
        public string CommuteEndDtFullNm { get; set; }
        public string ApprUserIdNm { get; set; }

        public int ApprId { get; set; }

        public string WeeklyWorkTime { get; set; }
        public string MonthWorkTime { get; set; }
    }

    public class CbTimeSheetApprovalDto
    {
        public int TimeId { get; set; }
        public int ApprId { get; set; }
        public string ApprCd { get; set; }
        public string ApprUserId { get; set; }
        public string StatusCd { get; set; }
        public string MailYn { get; set; }
        public string DeleApprUserId { get; set; }
        public string DeleReason { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string ApprUserIdNm { get; set; }
    }

    public class CbTimeSheetWeeklyDto
    {
        public string Todate { get; set; }
        public string WorkTimeNm { get; set; }
        public string WorkTimeTotalNm { get; set; }
    }

    public class CbTimeSheetDepartmentDto
    {
        public string UserId { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string DeptFullNm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string ComStartDtNm { get; set; }
        public string ComEndDtNm { get; set; }
        public string LeaveTypeCdNm { get; set; }
        public string WeeklyWorkTime { get; set; }
        public string MonthWorkTime { get; set; }
        public string MonthHolidayWrokTime { get; set; }
        public string FnMonthWorkTime { get; set; }
        public string FnMonthOverTime { get; set; }
        public string FnMonthVacationTime { get; set; }
        public string FnMonthTotalTime { get; set; }
        public string FnMonthNightTime { get; set; }
        public string FnMonthExcessOverTime { get; set; }
        public string FnMonthOffTime { get; set; }
    }

    public class CbTimeSheetHrExcelDto
    {
        public string UserNm { get; set; }
        public string DeptCd3Nm { get; set; }
        public string HiTime { get; set; }
        public string MsTankTime { get; set; }
        public string IrtTime { get; set; }
        public string AaTime { get; set; }
        public string AgriTime { get; set; }
        public string MinTim { get; set; }
        public string RohsTime { get; set; }
        public string FnMonthWorkTime { get; set; }
        public string FnMonthOverTime { get; set; }
        public string FnMonthVacationTime { get; set; }
        public string FnMonthTotalTime { get; set; }
        public string FnMonthNightTime { get; set; }
        public string FnMonthExcessOverTime { get; set; }
        public string FnMonthOffTime { get; set; }

        public string MonthHolidayWrokTime { get; set; }
    }

    public class CbTimeSheetExcelDto
    {
        public string UserNm { get; set; }
        public string MonthDate { get; set; }
        public string MonthDateNm { get; set; }
        public string ComStartDt { get; set; }
        public string ComEndDt { get; set; }
        public string VacationCnt { get; set; }
        public string HiTime { get; set; }
        public string MsTankTime { get; set; }
        public string IrtTime { get; set; }
        public string AaTime { get; set; }
        public string AgriTime { get; set; }
        public string MinTime { get; set; }
        public string RohsTime { get; set; }
        public string WorkTime { get; set; }
        public string NightTime { get; set; }
        public string EtcHoliCnt { get; set; }
        public string Reason { get; set; }
        public string MonthHolidayWrokTime { get; set; }

        public int TimeId { get; set; }
    }

    public class CbTimeSheetOfficeDto
    {
        public string UserId { get; set; }
        public string UserNm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string DeptFullNm { get; set; }
        public string AgoWeekDt { get; set; }
        public string AgoWeekWorkTimeNm { get; set; }
        public string ThisWeekDt { get; set; }
        public string ThisLastDt { get; set; }
        public string ThisWeekWorksTimeNm { get; set; }
        public string FnMonthWorkTime { get; set; }
        public string FnMonthOverTime { get; set; }
        public string FnMonthNightTime { get; set; }
        public string FnMonthVacationTime { get; set; }
        public string FnMonthTotalTime { get; set; }
    }



}
