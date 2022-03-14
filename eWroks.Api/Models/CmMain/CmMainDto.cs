using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmMain
{
    public class CmMainDto
    {

    }


    public class CmMainNoticeDto
    {
        public string GridGb { get; set; }
        public int NoticeId { get; set; }
        public string AlertGbNm { get; set; }
        public string DeptList { get; set; }
        public string NoticeTitle { get; set; }
        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public int ClickCnt { get; set; }
    }

    public class CmMainApprovalData
    {
        public int TravelCnt { get; set; }
        public int ExternalTrainingCnt { get; set; }
        public int LeaveHolidayCnt { get; set; }
        public int OvertimeWorkOne { get; set; }
        public int OvertimeWorkTwo { get; set; }
        public int PurchaseCnt { get; set; }

    }
}
