using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmProgram
{
    public class CmProgramDto
    {
        public string ProgramId { get; set; }
        public string ProgramNm { get; set; }
        public string ProgramUrl { get; set; }
        public string UpProgramId { get; set; }
        public int DispSeq { get; set; }
        public int ProgramLevel { get; set; }
        public string UseYn { get; set; }
        public string ProgramIcon { get; set; }

        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string UpProgramId_Nm { get; set; }
    }
}
