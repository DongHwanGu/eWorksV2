using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrOvertimeWork
{
    public class HrOvertimeWorkGroupDto
    {
        public HrOvertimeWorkDto HrOvertimeWorkDto { get; set; }
        public HrOvertimeWorkDateDto HrOvertimeWorkDateDto { get; set; }
        public List<HrOvertimeWorkDateDto> HrOvertimeWorkDateDtos { get; set; }
        public List<HrOvertimeWorkApprovalDto> HrOvertimeWorkApprovalDtos { get; set; }

    }
    public class HrOvertimeWorkDto
    {
        public int OtId { get; set; }
        public string Reason { get; set; }
        public string StatusCd { get; set; }
        public string Remark { get; set; }
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string RegIdDeptFullNm { get; set; }

        public string StatusCdNm { get; set; }
        public string OneStepDateNm { get; set; }
        public string TwoStepDateNm { get; set; }
        public string HrStepDateNm { get; set; }

        public int ApprId { get; set; }
    }

    public class HrOvertimeWorkDateDto
    {
        public int OtId { get; set; }
        public string StatusCd { get; set; }
        public string StartDt { get; set; }
        public string StartTime { get; set; }
        public string EndDt { get; set; }
        public string EndTime { get; set; }
        public decimal RecogTime { get; set; }
        public string DinnerTime { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }
        public string StartDtFullNm { get; set; }
        public string EndDtFullNm { get; set; }
        public string RecogTimeNm { get; set; }
    }

    public class HrOvertimeWorkApprovalDto
    {
        public int OtId { get; set; }
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

    public class HrOvertimeWorkHrSaveParamDto
    {
        public int OtId { get; set; }
        public string Remark { get; set; }
        public string StatusCd { get; set; }
        public string UpdId { get; set; }
    }

    public class HrOvertimeWorkStatisticsDto
    {
        public string UserId { get; set; }
        public string UserNm { get; set; }
        public string DeptCdKorNm { get; set; }
        public string HR_StatusCdNm { get; set; }
        public string DeptFullNm { get; set; }
        public int TotalCnt { get; set; }
        public string TotalTime { get; set; }
        public int RejectCnt { get; set; }
    }

    public class HrOvertimeWorkExcelDto
    {
        public int OtId { get; set; }
        public string StatusCdNm { get; set; }
        public string StartDt { get; set; }
        public string UserNm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string DutyCdEngNm { get; set; }
        public string DeptFullNm { get; set; }
        public string DinnerTime { get; set; }
        public string RequestDate { get; set; }
        public string RequestTime { get; set; }
        public string RequestMinutes { get; set; }
        public string RequestNightTime { get; set; }
        public string RequestNighttMinutes { get; set; }
        public string RequestTotalTime { get; set; }
        public string RequestTotalMinutes { get; set; }
        public string Remark { get; set; }
    }

    public class HrOvertimeWorkExcelUploadDto
    {
        public int OtId { get; set; }
        public string UserNm { get; set; }
        public string DeptFullNm { get; set; }
        public string DinnerTime { get; set; }
        public string RequestDate { get; set; }
        public string Remark { get; set; }
        public string ErrorRemark { get; set; }
        public string UpdId { get; set; }
    }
}
