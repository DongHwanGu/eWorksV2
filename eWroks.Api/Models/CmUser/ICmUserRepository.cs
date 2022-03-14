using eWroks.Api.Models.CmCode;
using eWroks.Api.Models.CmDept;
using eWroks.Api.Models.CmRoleProgram;
using eWroks.Api.Models.CmVendor;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmUser
{
    public interface ICmUserRepository
    {
        /// <summary>
        /// 유저 가져오기
        /// </summary>
        /// <returns></returns>
        Task<List<CmUserDto>> GetUserList(string it_status_cd, string hr_status_cd);
        // 상세 
        Task<CmUserGroupDto> GetUserDetailData(string userId);
        // Role List
        Task<List<CmRoleDto>> GetRoleList();
        // Office List
        Task<List<CmVendorDto>> GetOfficeList();
        // Dept List
        Task<List<CmDeptDto>> GetDeptList(int deptId);
        // Duty List
        Task<List<CmCodeDto>> GetDutyEngList(string cdMinor);


        // User 저장
        Task<eWorksResult> SaveUserMgmtData(CmUserGroupDto model);

        // 휴가 일수 조회
        Task<List<CmUserLeaveCnt>> GetLeaveCntList(string userId);
        // 휴가 일수 상세 조회
        Task<List<CmUserLeaveCntItem>> GetLeaveCntItemList(string userId, string leaveYear);
        // 휴가 일수 저장
        Task<eWorksResult> SaveModalLeaveCnt(CmUserLeaveCnt model);

        // 출퇴근 현재 정보
        Task<CmUserCommuteBtnInfo> GetUserCommuteBtnInfo(string thisDt, string userId);
        // 출퇴근 현재 정보 Total
        Task<List<CmUserCommuteTotalDto>> GetUserCommuteList(string thisDt, string userId);
        // User 저장
        Task<eWorksResult> SaveUserCommuteData(string btnGb, string comStartDt, string outStartDt, string lat, string lng, string addrName, string remark, string userId);
    }
}
