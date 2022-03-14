using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmDept
{
    public class CmDeptDto
    {
        public int DeptId { get; set; }
        public string DeptNm { get; set; }
        public int UpDeptId { get; set; }
        public int DispSeq { get; set; }
        public int DeptLevel { get; set; }
        public string UseYn { get; set; }
        public string DeptRef1 { get; set; }
        public string DeptRef2 { get; set; }
        public string DeptRef3 { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public int DeptCd1 { get; set; }
        public int DeptCd2 { get; set; }
        public int DeptCd3 { get; set; }
    }
}
