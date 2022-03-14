using eWroks.Api.Models.CmVendor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.FiPurchaseSetting
{
    public interface IFiPurchaseSettingRepositry
    {
        // 마스터리스트
        Task<List<FiCurrencyDto>> GetCurrencyList(string currencyYear, string currencyMonth);
        // 저장
        Task<eWorksResult> SaveCurrencyData(FiCurrencyDto model);

        // 마스터리스트
        Task<List<CmVendorDto>> GetVendorList(string entityCd);
        // 마스터리스트
        Task<List<CmVendorContactDto>> GetVendorContactList(int vendorId);
        // 저장
        Task<eWorksResult> SaveVendorData(CmVendorGroupDto model);

        // 마스터리스트
        Task<List<FiApprovalPolicyDto>> GetPolicyList(string processGb, string userId);
        // 저장
        Task<eWorksResult> SavePolicyData(FiApprovalPolicyDto model);

        // purchase 정책 리스트
        Task<List<FiApprovalPolicyPurchaseDto>> GetApprovalPurchaseList(int policyId, string userId);
        // purchase 정책 저장
        Task<eWorksResult> SaveApprovalPurchaseData(FiApprovalPolicyPurchaseDto model);
        // 유저 리스트
        Task<List<FiApprovalPolicyUserDto>> GetApprovalPolicyUserList(int policyId, string userId);
        // 유저 저장
        Task<eWorksResult> SaveApprovalPolicyUserData(List<FiApprovalPolicyUserDto> models);
        // purchase 정책 Level 리스트
        Task<List<FiApprovalPolicyPurchaseLevelDto>> GetApprovalPurchaseLevelList(int policyId, int itemId);
        // purchase 정책 Level 저장
        Task<eWorksResult> SaveApprovalPurchaseLevelData(List<FiApprovalPolicyPurchaseLevelDto> models);
        // purchase 정책 삭제
        Task<eWorksResult> DeleteApprovalPurchaseData(int policyId, int itemId, string userId);

        // 유저 CC 리스트
        Task<List<FiApprovalPolicyUserCCDto>> GetApprovalPolicyUserCCList(int policyId, string apprCd, string userId);
        // 유저 CC 저장
        Task<eWorksResult> SaveApprovalPolicyUserCCData(List<FiApprovalPolicyUserCCDto> models);
        // 유저 삭제
        Task<eWorksResult> DeleteApprovalPolicyUserData(int policyId, string apprCd, string userId);
        // 유저 삭제
        Task<eWorksResult> DeleteApprovalPolicyUserCCData(int policyId, string apprCd, string userId, string ccUserId);


        // Branch List
        Task<List<FiApprovalPolicyBranchDto>> GetApprovalPolicyBranchList(int policyId, string userId);
        // Branch Save
        Task<eWorksResult> SaveApprovalPolicyBranchData(FiApprovalPolicyBranchDto model);
        // Branch 삭제
        Task<eWorksResult> DeleteApprovalPolicyBranchData(int policyId, string branchCd);

    }
}
