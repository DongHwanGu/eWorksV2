using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.ItAssets
{
    public class ItAsstesDto
    {
        public int AssetsId { get; set; }
        public string AssetsGb { get; set; }
        public string AssetsNm { get; set; }
        public string UseYn { get; set; }
        public string Remark { get; set; }
        public string CdRef1 { get; set; }
        public string CdRef2 { get; set; }
        public string CdRef3 { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    public class ItAsstesItemDto
    {
        public int AssetsId { get; set; }
        public int ItemId { get; set; }
        public string ItemNm { get; set; }
        public int ItemCnt { get; set; }
        public string PurchaseDt { get; set; }
        public string ControlNo { get; set; }
        public string Manufacture { get; set; }
        public string SerialNo { get; set; }
        public string ReplaceDt { get; set; }
        public string BusinessLine { get; set; }
        public string HostNm { get; set; }
        public string DisposalDt { get; set; }
        public string StockYn { get; set; }
        public string UseYn { get; set; }
        public string Remark { get; set; }
        public string CdRef1 { get; set; }
        public string CdRef2 { get; set; }
        public string CdRef3 { get; set; }
        public string CdRef4 { get; set; }
        public string CdRef5 { get; set; }
        public string CdRef6 { get; set; }
        public string CdRef7 { get; set; }
        public string CdRef8 { get; set; }
        public string CdRef9 { get; set; }
        public string CdRef10 { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public int ReCnt { get; set; } // itemCnt 에서 남은 수량
        public string MappingUser { get; set; }
    }
}
