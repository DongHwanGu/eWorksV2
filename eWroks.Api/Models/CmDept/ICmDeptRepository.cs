using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmDept
{
    public interface ICmDeptRepository
    {
        // Dept Master
        Task<List<CmDeptDto>> GetDeptMasterList();
        // Dept Sub
        Task<List<CmDeptDto>> GetDeptSubList(int deptId);
        // Dept Options
        Task<List<CmDeptDto>> GetDeptOptions(int deptId);

        // Role 저장
        Task<eWorksResult> SaveDeptData(CmDeptDto model);
    }
}
