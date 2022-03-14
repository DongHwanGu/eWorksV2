using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmMeetingRoom
{
    public interface ICmMeetingRoomRepository
    {
        // 마스터 카렌다
        Task<List<CmMeetingRoomDto>> GetMeetingRoomList(string thisDt, string meetingGb, string userId);
        // 마스터 리스트
        Task<List<CmMeetingRoomDto>> GetMeetingRoomSelectList(string selectDt, string meetingGb, string userId);

        // 저장
        Task<eWorksResult> SaveMeetRoomData(CmMeetingRoomDto model);
        // 삭제
        Task<eWorksResult> DeleteMeetRoomData(int meetingId, string userId);
    }
}
