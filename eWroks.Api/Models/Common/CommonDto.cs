using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.Common
{
    public class CmHolidayCnt
    {
        public int HolidayCnt { get; set; }
    }

    /// <summary>
    /// 로그인 정보
    /// </summary>
    public class CmLoginLogDto
    {
        public string LoginDt { get; set; }
        public string UserNm { get; set; }
        public string LoginIp { get; set; }
        public string BrowserType { get; set; }
        public string BrowserVer { get; set; }
        public string TotalInfo { get; set; }
        public string Dept1 { get; set; }
        public string Dept2 { get; set; }
        public string Dept3 { get; set; }
        public string Dept4 { get; set; }
        

    }

    /// <summary>
    /// 파일정보
    /// </summary>
    public class CmFileDto
    {
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
    }
    
    /// <summary>
    /// 파일업로드 정보
    /// </summary>
    public class CmFileUploadDto
    {
        public List<IFormFile> Files { get; set; }
        public string FilePath { get; set; }
        public string UserId { get; set; }
    }

    /// <summary>
    /// 승인자
    /// </summary>
    public class CmApprovalUserDto
    {
        public string ApprovalGb { get; set; }
        public string ApprovalCd { get; set; }
        public string ApprovalUserId { get; set; }
        public string UserNm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string DeptFullNm { get; set; }
    }

    /// <summary>
    /// 메일 전송 유저 정보
    /// </summary>
    public class CmMailUserListDto
    {
        public string SendUserEmail { get; set; }
        public string SendUserEnm { get; set; }
        public string SendUserNm { get; set; }
        public string SendUserId { get; set; }
        public string SendDutyCdKorNm { get; set; }
        public string ReceiveUserEmail { get; set; }
        public string ReceiveUserEnm { get; set; }
        public string ReceiveUserNm { get; set; }
        public string ReceiveUserId { get; set; }
        public string ReceiveDutyCdKorNm { get; set; }
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public string MailKeys { get; set; }
        public string StatusCdNm { get; set; }
        public string EmailCCList { get; set; }

        // 휴가계
        public string LeaveHolidayGbNm { get; set; }
        // 증명서
        public string CertiGbNm { get; set; }

        // OvertimeWork
        public string OvertimeWrokFormGb { get; set; }
        public string OvertimeWrokTimeOverYn { get; set; }
        public string OvertimeWrokReqTime { get; set; }

        // Purchase
        public string PurchaseBusinessNm { get; set; }
        public string PurchaseBranchNm { get; set; }
        public string PurchasePRNo { get; set; }
        public string PurchaseDivisionNm { get; set; }
        public string PurchaseAssetTypeNm { get; set; }
        public string PurchaseGrowthYn { get; set; }
        public string PurchaseMaintenanceYn { get; set; }
        public string PurchaseCapexYn { get; set; }
        public string PurchaseProductNm { get; set; }
        public string PurchaseProductQty { get; set; }
        public string PurchaseVendorNm { get; set; }
        public string PurchaseSubTotalIn { get; set; }
        public string PurchaseSubTotalInAmt { get; set; }
        public string PurchaseVatAmt { get; set; }
        public string PurchaseTotalAmt { get; set; }
        public string PurchaseComments { get; set; }
        public string PurchaseOwner { get; set; }
        public string PurchaseOwnerTel { get; set; }
        public string PurchaseTermsDays { get; set; }
        public string PurchaseTermsChangeYn { get; set; }
    }
    /// <summary>
    /// 메일 전송 로그
    /// </summary>
    public class CmMailLogDto
    {
        public string UserId { get; set; }
        public string MailGb { get; set; }
        public string MailCd { get; set; }
        public string SendUserId { get; set; }
        public string SendUserNm { get; set; }
        public string SendUserEmail { get; set; }
        public string ReceiveUserId { get; set; }
        public string ReceiveUserNm { get; set; }
        public string ReceiveUserEmail { get; set; }
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public string MailKeys { get; set; }
        public string ReMailCnt { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
        public string ReturnCode { get; set; }
        public string ReturnMsg { get; set; }
    }

    /// <summary>
    /// 대리자 설정
    /// </summary>
    public class CmUserDelegateApproval
    {
        public int DeleId { get; set; }
        public string UserId { get; set; }
        public string DeleApprUserId { get; set; }
        public string DeleReason { get; set; }
        public string StartDt { get; set; }
        public string EndDt { get; set; }
        public string UseYn { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string DeleApprUserIdNm { get; set; }
        public string StartDtNm { get; set; }
        public string EndDtNm { get; set; }

    }

    public class CmDirectoryGroupDto
    {
        public List<CmDirectoryDeptDto> DeptDtos { get; set; }
        public List<CmDirectoryUserDto> UserDtos { get; set; }

    }
    public class CmDirectoryDeptDto
    {
        public int DeptId { get; set; }
        public int UpDeptId { get; set; }
        public int DeptLevel { get; set; }
        public string DeptNm { get; set; }
    }
    public class CmDirectoryUserDto
    {
        public int DeptCd1 { get; set; }
        public int DeptCd2 { get; set; }
        public int DeptCd3 { get; set; }
        public int DeptCd4 { get; set; }
        public string UserId { get; set; }

        public string UserNm { get; set; }
    }

    public class CommonDto
    {
    }

    public class CommonSelectDto
    {
        public string StrText { get; set; }
        public string StrValue { get; set; }
    }
}
