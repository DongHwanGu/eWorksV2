using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmHoliDay
{
    public interface ICmHoliDayRepository
    {
        // Notice 리스트
        Task<List<CmHoliDayDto>> GetHoliDayList();

        // 저장
        Task<eWorksResult> SaveHoliDayData(CmHoliDayDto model);
        // 삭제
        Task<eWorksResult> DeleteScheduleData(CmHoliDayDto model);
    }
}
