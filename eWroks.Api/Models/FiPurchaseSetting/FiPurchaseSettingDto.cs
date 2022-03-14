using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.FiPurchaseSetting
{
    public class FiCurrencyDto
    {
        public string CurrencyYear { get; set; }
        public string CurrencyMonth { get; set; }
        public string CurrencyCd { get; set; }
        public decimal CurrencyAmt { get; set; }
        public string Remark { get; set; }
        public string UseYn { get; set; }
        public string RegId { get; set;}
        public string UpdId { get; set; }

		public string CurrencyNm { get; set; }
        public string UpdIdNm { get; set; }
        public string UpdDtNm { get; set; }
    }

    public class FiApprovalPolicyDto
    {
        public int PolicyId { get; set; }
        public string PolicyNm { get; set; }
        public string ProcessGb { get; set; }
        public string Remark { get; set; }
        public string UseYn { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string ProcessGbNm { get; set; }
    }

    public class FiApprovalPolicyPurchaseDto
    {
        public int PolicyId { get; set; }
        public int ItemId { get; set; }
        public string CategoryCd { get; set; }
        public int MinAmount { get; set; }
        public int MaxAmount { get; set; }
        public int DocQty { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string CategoryCdNm { get; set; }
        public string PolicyNm { get; set; }
        public string AmountNm { get; set; }
        
    }

    public class FiApprovalPolicyUserDto
    {
        public int PolicyId { get; set; }
        public string ApprCd { get; set; }
        public string UserId { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string ApprCdNm { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string DeptFullNm { get; set; }
        public string HR_StatusCdNm { get; set; }
    }

    public class FiApprovalPolicyPurchaseLevelDto
    {
        public int PolicyId { get; set; }
        public int ItemId { get; set; }
        public int LevelSeq { get; set; }

        public string ApprCd { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string ApprCdNm { get; set; }
    }

    public class FiApprovalPolicyUserCCDto
    {
        public int PolicyId { get; set; }
        public string ApprCd { get; set; }
        public string UserId { get; set; }
        public string CCUserId { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string ApprCdNm { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string DeptFullNm { get; set; }
        public string HR_StatusCdNm { get; set; }
    }

    public class FiApprovalPolicyBranchDto
    {
        public int PolicyId { get; set; }
        public string BranchCd { get; set; }
        public string EntityCd { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string PolicyNm { get; set; }
        public string EntityCdNm { get; set; }
        public string BranchCdNm { get; set; }

    }
}
