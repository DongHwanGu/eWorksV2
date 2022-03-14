using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrLeaveHoliday
{

    public class HrLeaveHolidayGroupDto
    {
        public HrLeaveHolidayDto HrLeaveHolidayDto { get; set; }
        public List<HrLeaveHolidayDateDto> HrLeaveHolidayDateDtos { get; set; }
        public List<HrLeaveHolidayApprovalDto> HrLeaveHolidayApprovalDtos { get; set; }
    }
    /// <summary>
    /// HrLeaveHolidayDto
    /// </summary>
    public class HrLeaveHolidayDto
    {
        public int LeaveHoliId { get; set; }
        public string Reason { get; set; }
        public string StatusCd { get; set; }
        public string Remark { get; set; }
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
        public string LeaveYear { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }

        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string RegIdDeptFullNm { get; set; }
        public string CertiTitleGb { get; set; }

        public int ApprId { get; set; }
    }

    /// <summary>
    /// HrLeaveHolidayDateDto
    /// </summary>
    public class HrLeaveHolidayDateDto
    {
        public int LeaveHoliId { get; set; }
        public int DateId { get; set; }
        public string LeaveTypeCd { get; set; }
        public string LeaveTypeDetailCd { get; set; }
        public string StartDt { get; set; }
        public string StartTime { get; set; }
        public string EndDt { get; set; }
        public string EndTime { get; set; }
        public decimal RecogDay { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string LeaveTypeCdNm { get; set; }
        public string LeaveTypeDetailCdNm { get; set; }
    }

    /// <summary>
    /// HrLeaveHolidayApprovalDto
    /// </summary>
    public class HrLeaveHolidayApprovalDto
    {
        public int LeaveHoliId { get; set; }
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

        public string StatusCdNm { get; set; }
        public string UserNm { get; set; }
        public string UpdDtNm { get; set; }
        public string TaskingUserNm { get; set; }
    }


}
