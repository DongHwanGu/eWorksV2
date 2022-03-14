using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmApproval
{
    public class CmApprovalDto
    {
        public int ApprovalId { get; set; }
        public string DeptCd1Nm { get; set; }
        public string DeptCd2Nm { get; set; }
        public string DeptCd3Nm { get; set; }
        public string ApprovalCdNm { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string DutyCdKorNm { get; set; }
        public string UserDeptFullNm { get; set; }
        public string HR_StatusCdNm { get; set; }
    }

    public class CmApprovalModalDto
    {
        public int UserId { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string DeptCd1Nm { get; set; }
        public string DeptCd2Nm { get; set; }
        public string DeptCd3Nm { get; set; }
        public string DutyCdKorNm { get; set; }
        public int SaveDeptCd1 { get; set; }
        public int SaveDeptCd2 { get; set; }
        public int SaveDeptCd3 { get; set; }
        public string SaveApprovalCd { get; set; }
        public string SaveApprovalGb { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
}
