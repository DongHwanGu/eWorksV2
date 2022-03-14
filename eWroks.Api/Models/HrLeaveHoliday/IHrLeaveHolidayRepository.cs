using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrLeaveHoliday
{
    public interface IHrLeaveHolidayRepository
    {
        // 마스터리스트
        Task<List<HrLeaveHolidayDto>> GetLeaveHolidayList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // 상세
        Task<HrLeaveHolidayGroupDto> GetLeaveHolidayDetail(int leaveHoliId);
        //저장
        Task<eWorksResult> SaveLeaveHolidayData(HrLeaveHolidayGroupDto model);

        // Tasking List
        Task<List<HrLeaveHolidayDto>> GetTaskingLeaveHolidayList(string userId);
        // 저장
        Task<eWorksResult> SaveTaskingLeaveHolidayApproval(int leaveHoliId, int apprId, string remark, string statusCd, string updId);

        // 마스터리스트
        Task<List<HrLeaveHolidayDto>> GetResponseLeaveHolidayList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // 저장
        Task<eWorksResult> SaveResponseLeaveHolidayApproval(int leaveHoliId, string remark, string reason, string leaveYear, string statusCd, string updId, List<HrLeaveHolidayDateDto> hrLeaveHolidayDateDtos);

    }
}
