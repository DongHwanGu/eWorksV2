using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrHealthCheck
{
    public interface IHrHealthCheckRepository
    {
        // 마스터리스트
        Task<List<HrHealthCheckDto>> GetHrHealCheckList(string startDt, string endDt, string userId);
        // 마스터리스트 상세
        Task<HrHealthCheckGroupDto> GetHrHealthCheckDetail(int HealthId);
        //저장
        Task<eWorksResult> SaveHealthCheck(HrHealthCheckGroupDto model);


        // 마스터리스트
        Task<List<HrHealthCheckDto>> GetResponseHrHealCheckList(string startDt, string surveyYn, int deptCd1, int deptCd2, int deptCd3, string userId);
        // Dashboard
        Task<List<HrHealthCheckDashboardDto>> GetResponseHrHealCheckDashboardList(string startDt, string endDt, int deptCd1, int deptCd2, int deptCd3, string userId);
        // Dashboard User List
        Task<List<HrHealthCheckDto>> GetModalUserList(string clickDt, decimal clickVal, int deptCd1, int deptCd2, int deptCd3, string userId);

        // 마스터리스트
        Task<HrHealthCheckDto> GetResponseHrHealCheckExcelList(string clickDt, string userId);

    }
}
