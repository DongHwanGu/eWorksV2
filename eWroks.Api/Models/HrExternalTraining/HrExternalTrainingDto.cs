using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrExternalTraining
{
    public class HrExternalTrainingGroupDto
    {
        public HrExternalTrainingDto HrExternalTrainingDto { get; set; }
        public List<HrExternalTrainingDateDto> HrExternalTrainingDateDtos { get; set; }
        public List<HrExternalTrainingApprovalDto> HrExternalTrainingApprovalDtos { get; set; }
    }
    public class HrExternalTrainingDto
    {
        public int TrainingId { get; set; }
        public string UserId { get; set; }
        public string TrainingGb { get; set; }
        public string TrainingNm { get; set; }
        public string Subject { get; set; }
        public string Institution { get; set; }
        public string Reason { get; set; }
        public string PaymentDt { get; set; }
        public string PaymentMethod { get; set; }
        public int TrainingAmt { get; set; }
        public string InsReturnYn { get; set; }
        public int ReturnAmt { get; set; }
        public string BankCd { get; set; }
        public string PaymentRegDt { get; set; }
        public string AccountNo { get; set; }
        public string StatusCd { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
        
        public string DtlFileNm { get; set; }
        public string DtlFileUrl { get; set; }
        public string ListFileNm { get; set; }
        public string ListFileUrl { get; set; }
        
        
        public string StatusCdNm { get; set; }
        public string TrainingGbNm { get; set; }
        public string TrainingAmtNm { get; set; }
        public string ReturnAmtNm { get; set; }
        public string PaymentMethodNm { get; set; }
        public string BankCdNm { get; set; }

        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string RegIdDeptFullNm { get; set; }
        public string CertiTitleGb { get; set; }

        public int ApprId { get; set; }

    }

    public class HrExternalTrainingDateDto
    {
        public int TrainingId { get; set; }
        public int DateId { get; set; }
        public string StartDt { get; set; }
        public string StartTime { get; set; }
        public string EndDt { get; set; }
        public string EndTime { get; set; }
        public string TotalHours { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    public class HrExternalTrainingApprovalDto
    {
        public int TrainingId { get; set; }
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
