using eWroks.Api.Models.CmDept;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CbSchedule
{
    public interface ICbScheduleRepository
    {
        // 마스터리스트
        Task<List<CbScheduleDto>> GetScheduleList(string sStartDt, string sEndDt, string sTeamCd, string sStatusCd, string inCludeYn, string userId);

        // 마스터 상세
        Task<CbScheduleDto> GetScheduleDetail(int schId);

        // Dept3 List
        Task<List<CmDeptDto>> GetDept3List(string userId);

        // 마스터리스트
        Task<List<CbScheduleDto>> GetScheduleStatisticsList(string sStartDt, string sEndDt, string sTeamCd, string sStatusCd, string inCludeYn, int deptCd3, string userId);

        // PIC LIST
        Task<List<PICUserDto>> GetPICUserList(string date, string userId);

        // 저장
        Task<eWorksResult> SaveCbScheduleData(CbScheduleDto model);
    }
}
