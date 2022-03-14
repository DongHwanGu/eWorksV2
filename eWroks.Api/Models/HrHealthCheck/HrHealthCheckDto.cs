using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrHealthCheck
{
    public class HrHealthCheckGroupDto
    {
        public HrHealthCheckDto HrHealthCheckDto { get; set; }
        public List<HrHealthCheckItemDto> HrHealthCheckItemDtos { get; set; }
    }

    public class HrHealthCheckDto
    {
        public int HealthId { get; set; }
        public string RegisterDt { get; set; }
        public string AgreeYn { get; set; }
        public decimal TemperatureVal { get; set; }
        public string ConfirmerContactCd { get; set; }
        public string ConfirmerContactReason { get; set; }
        public string InfectedCd { get; set; }
        public string ETCReason { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string SymptomCdNm { get; set; }
        public string DeptCd1Nm { get; set; }
        public string DeptCd2Nm { get; set; }
        public string DeptCd3Nm { get; set; }
        public string DeptCd4Nm { get; set; }
        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string DeptFullNm { get; set; }
        public string InfectedCdNm { get; set; }
        public string ConfirmerContactCdNm { get; set; }
        public string DutyCdKorNm { get; set; }
    }

    public class HrHealthCheckItemDto
    {
        public int HealthId { get; set; }
        public int ItemId { get; set; }
        public string ItemType { get; set; }
        public string ItemCd { get; set; }
        public string ItemDtlCd { get; set; }
        public string ItemDtlReason { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    public class HrHealthCheckDashboardDto
    {
        public string ToDate { get; set; }
        public string Col35 { get; set; }
        public string Col35Dot { get; set; }
        public string Col36 { get; set; }
        public string Col36Dot { get; set; }
        public string Col37 { get; set; }
        public string Col37Dot { get; set; }
        public string Col38 { get; set; }
        public string Col38Dot { get; set; }
        public string Col39 { get; set; }
        public string UserTotal { get; set; }
    }
}
