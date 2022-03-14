using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CbSchedule
{
    public class CbScheduleDto
    {
        public int SchId { get; set; }
        public string StatusCd { get; set; }
        public string WorkingDt { get; set; }
        public string TeamCd { get; set; }
        public string Terminal { get; set; }
        public string Vessel { get; set; }
        public string Customer { get; set; }
        public string Product { get; set; }
        public string ETADt { get; set; }
        public string ETATime { get; set; }
        public string ETBDt { get; set; }
        public string ETBTime { get; set; }
        public string ETCDt { get; set; }
        public string ETCTime { get; set; }
        public string PIC { get; set; }
        public string PICTime { get; set; }
        public string PIC2 { get; set; }
        public string OPS { get; set; }
        public string BL { get; set; }
        public string VesselYn { get; set; }
        public string LineYn { get; set; }
        public string OneStFootYn { get; set; }
        public string ShoreYn { get; set; }
        public string WWTYn { get; set; }
        public string Agent { get; set; }
        public string Remark { get; set; }
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }
        public string TeamCdNm { get; set; }
        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
        public string UpdIdNm { get; set; }
        public string UpdDtNm { get; set; }
        public string ETAFullDtNm { get; set; }
        public string ETBFullDtNm { get; set; }
        public string ETCFullDtNm { get; set; }
        public string PICNm { get; set; }
        public string DeptCd3Nm { get; set; }
    }

    public class PICUserDto
    {
        public string UserId { get; set; }
        public string UserNm { get; set; }
        public string UserTime { get; set; }
    }
}
