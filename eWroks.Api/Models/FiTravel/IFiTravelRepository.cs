using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.FiTravel
{
    public interface IFiTravelRepository
    {
        // 마스터리스트
        Task<List<FiTravelDto>> GetTravelList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // 상세
        Task<FiTravelGroupDto> GetTravelDetail(int travelId);
        // 저장
        Task<eWorksResult> SaveTravelData(FiTravelGroupDto model);


        // Tasking List
        Task<List<FiTravelDto>> GetTaskingTravelList(string userId);
        // 저장
        Task<eWorksResult> SaveTaskingApproval(int travelId, int apprId, string remark, string statusCd, string updId);

        // Response List
        Task<List<FiTravelDto>> GetResponseTravelList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // 저장
        Task<eWorksResult> SaveResponseApproval(int travelId, string remark, string statusCd, string updId);
    }
}
