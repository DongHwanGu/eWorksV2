using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrCertificate
{
    public class HrCertificateDto
    {
        public int CertiId { get; set; }
        public string UserId { get; set; }
        public string CertiGb { get; set; }
        public string LangGb { get; set; }
        public string DocNo { get; set; }
        public string ReasonGb { get; set; }
        public string Remark { get; set; }
        public string DocUrl { get; set; }
        public string IssueDt { get; set; }
        public string StatusCd { get; set; }
        public string MailYn { get; set; }
        public string PrintTitle { get; set; }
        public string PrintReason { get; set; }
        public string PrintYn { get; set; }
        public int MoveId { get; set; }
        public string InMoveYn { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }
        public string CertiGbNm { get; set; }
        public string LangGbNm { get; set; }
        public string ReasonGbNm { get; set; }

        public string MoveIdNm { get; set; }
        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string RegIdDeptFullNm { get; set; }
    }
}
