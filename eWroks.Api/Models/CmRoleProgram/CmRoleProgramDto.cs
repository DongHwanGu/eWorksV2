using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmRoleProgram
{
    public class CmRoleDto
    {
        public string RoleId { get; set; }
        public string RoleNm { get; set; }
        public string RoleDesc { get; set; }
        public string UseYn { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
    public class CmRoleProgramDto
    {
        public string RoleId { get; set; }
        public string ProgramId { get; set; }
        public string ProgramNm { get; set; }
        public int ProgramLevel { get; set; }
        public string UpProgramId { get; set; }
        public string ProgramUrl { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
}
