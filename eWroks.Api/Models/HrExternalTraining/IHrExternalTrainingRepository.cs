using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrExternalTraining
{
    public interface IHrExternalTrainingRepository
    {
        // 마스터리스트
        Task<List<HrExternalTrainingDto>> GetExternalTrainingList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // 상세
        Task<HrExternalTrainingGroupDto> GetExternalTrainingDetail(int trainingId);
        //저장
        Task<eWorksResult> SaveExternalTraining(HrExternalTrainingGroupDto model);
        //리스트 파일 저장
        Task<eWorksResult> OnfileUploadClickSave(int trainingId, string fileNm, string fileUrl);
        //리스트 파일 삭제
        Task<eWorksResult> OnfileUploadClickDelete(int trainingId);


        // Tasking List
        Task<List<HrExternalTrainingDto>> GetTaskingExternalTrainingList(string userId);
        // 저장
        Task<eWorksResult> SaveTaskingExternalTrainingApproval(int trainingId, int apprId, string remark, string statusCd, string updId);


        // 마스터리스트
        Task<List<HrExternalTrainingDto>> GetResponseExternalTrainingList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // 저장
        Task<eWorksResult> SaveResponseExternalTrainingApproval(int trainingId, string remark, string statusCd, string updId);
        // Update
        Task<eWorksResult> UpdateResponseExternalTraingData(string updateGb, int trainingId, int returnAmt, string paymentRegDt, string updId);
    }
}
