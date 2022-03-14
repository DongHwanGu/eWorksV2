using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmApproval
{
    public interface ICmApprovalRepository
    {
        // 메인 리스트
        Task<List<CmApprovalDto>> GetApprovalUserList(int deptCd1
                                                    , int deptCd2
                                                    , int deptCd3
                                                    , string approvalGb
                                                    , string approvalCd
        );

        // 모달 유저 리스트
        Task<List<CmApprovalModalDto>> GetModalApprovalUserList(int deptCd1, int deptCd2, int deptCd3);

        // 마스터 저장
        Task<eWorksResult> SaveModalUserList(CmApprovalModalDto[] models);
        // 마스터 삭제
        Task<eWorksResult> DeleteUserList(CmApprovalDto[] models);
    }
}
