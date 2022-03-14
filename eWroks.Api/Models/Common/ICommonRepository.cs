using eWroks.Api.Models.CmCode;
using eWroks.Api.Models.CmProgram;
using eWroks.Api.Models.CmRoleProgram;
using eWroks.Api.Models.CmUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.Common
{
    public interface ICommonRepository
    {
        // 옵션 공통
        Task<List<CmCodeDto>> GetCodeOpions(string cdMajor, string userId);
        // Program List
        Task<List<CmRoleProgramDto>> GetProgramList(string roleId);
        // Login Log
        Task<List<CmLoginLogDto>> GetLoginLogList(string startDt, string endDt);

        // Approval User List
        Task<List<CmApprovalUserDto>> GetApprovalUserList(string userId, string approvalGb, string approvalCd);

        // 옵션 공통
        Task<List<CmUserDelegateApproval>> GetDelegateList(string userId);
        // 대리자 저장
        Task<eWorksResult> SaveDelegateData(CmUserDelegateApproval model);
        // 대리자 삭제
        Task<eWorksResult> DeleteDelegateData(int deleId);


        // 디렉토리
        Task<CmDirectoryGroupDto> GetDirectoryList(string userId);

        // 휴일 카운트
        Task<CmHolidayCnt> GetHolidayCnt(string startDt, string endDt);
    }
    
}
