using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmNotice
{
    public class CmNoticeDto
    {
        public int NoticeId { get; set; }
        public string NoticeTitle { get; set; }
        public string NoticeDesc { get; set; }
        public string AlertGb { get; set; }
        public string DeptList { get; set; }
        public string StartDt { get; set; }
        public string EndDt { get; set; }
        public int ClickCnt { get; set; }
        public string UseYn { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public List<CmNoticeFileDto> NoticeFiles { get; set; }
    }

    public class CmNoticeFileDto
    {
        public int NoticeId { get; set; }
        public int FileSeq { get; set; }
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
    
}
