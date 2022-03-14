using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmVendor
{
    public class CmVendorGroupDto
    {
        public CmVendorDto CmVendorDto { get; set; }
        public List<CmVendorContactDto> CmVendorContactDtos { get; set; }
    }
    public class CmVendorDto
    {
        public int VendorId { get; set; }
        public string VendorGb { get; set; }
        public string VendorNm { get; set; }
        public string VendorEnm { get; set; }
        public string ZipCode { get; set; }
        public string AddrKr { get; set; }
        public string AddrEn { get; set; }
        public string Country { get; set; }
        public string Tel { get; set; }
        public string Fax { get; set; }
        public string CdRef1 { get; set; }
        public string CdRef2 { get; set; }
        public string CdRef3 { get; set; }
        public string UseYn { get; set; }
        public string BusinessNo { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }


        public string FI_BankAccNo { get; set; }
        public string FI_VendorId { get; set; }
        public string FI_BankNm { get; set; }
        public string FI_BankCd { get; set; }
        public string FI_FileNm { get; set; }
        public string FI_FileUrl { get; set; }

        public string ContactNm { get; set; }
        public string ContactEmail { get; set; }
        public string EntityNm { get; set; }
        public string UpdIdNm { get; set; }
        public string UpdDtNm { get; set; }
    }

    public class CmVendorContactDto
    {
        public int VendorId { get; set; }
        public int ContactId { get; set; }
        public string ContactNm { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public string MailSendYn { get; set; }
        public string UseYn { get; set; }
        public string Remark { get; set; }
        public string RegId { get;set;}
        public string UpdId { get; set; }
    }
}
