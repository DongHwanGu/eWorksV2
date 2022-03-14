using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.FiTravel
{
    /// <summary>
    /// 출장 그룹
    /// </summary>
    public class FiTravelGroupDto
    {
        public FiTravelDto FiTravelDto { get; set; }
        public List<FiTravelDateDto> FiTravelDateDtos { get; set; }
        public List<FiTravelApprovalDto> FiTravelApprovalDtos { get; set; }
    }

    /// <summary>
    /// 출장 마스터
    /// </summary>
    public class FiTravelDto
    {
        public int TravelId { get; set; }
        public string TravelGb { get; set; }
        public string Destination { get; set; }
        public string Customer { get; set; }
        public int EstRevAmt { get; set; }
        public int EstCostAmt { get; set; }
        public string Purpose { get; set; }
        public string Remark { get; set; }
        public string StatusCd { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }
        public string TravelGbNm { get; set; }
        public string EstRevAmtNm { get; set; }
        public string EstCostAmtNm { get; set; }
        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string RegIdDeptFullNm { get; set; }
        public string CertiTitleGb { get; set; }


        public int ApprId { get; set; }
    }

    /// <summary>
    /// 출장 날짜
    /// </summary>
    public class FiTravelDateDto
    {
        public int TravelId { get; set; }
        public int DateId { get; set; }
        public string StartDt { get; set; }
        public string EndDt { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
    
    /// <summary>
    /// 출장 승인자
    /// </summary>
    public class FiTravelApprovalDto
    {
        public int TravelId { get; set; }
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


