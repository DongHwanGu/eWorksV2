using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmRoleProgram
{
    public interface ICmRoleProgramRepository
    {
        // Role 리스트
        Task<List<CmRoleDto>> GetRoleList();
        // RoleProgram 리스트
        Task<List<CmRoleProgramDto>> GetRoleProgramList(string roleId);
        // RoleProgram 리스트
        Task<List<CmRoleProgramDto>> GetModalRoleProgramList(string roleId);

        // Role 저장
        Task<eWorksResult> SaveRoleData(CmRoleDto model);
        // Role Program 저장
        Task<eWorksResult> SaveRoleProgramData(CmRoleProgramDto[] models);
        // Role Program 삭제
        Task<eWorksResult> DeleteRoleProgramData(CmRoleProgramDto[] models);
    }
}
