using eWroks.Api.Models.FiPurchaseSetting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.FiPurchase
{
    public interface IFiPurchaseRepository
    {
        // 마스터리스트
        Task<List<FiPurchaseDto>> GetPurchaseList(string startDt, string endDt, string entityCd, string statusCd, string userId);
        // Approval List
        Task<List<FiApprovalPolicyPurchaseLevelDto>> GetApprovalList(string entityCd, string branchCd, string categoryCd, int exchangeKRW, string userId);
        // Approval User List
        Task<List<FiApprovalPolicyUserDto>> GetApprovalUserList(int policyId, string apprCd, string userId);
        // 마스터 상세
        Task<FiPurchaseGroupDto> GetPurchaseDetailData(int purchaseId, string userId);
        // Product Order Email 정보
        Task<FiPurchaseProductOrderEmailGroup> GetPurchaseProductOrderEmail(int purchaseId, string userId);
        // Voucher List
        Task<List<FiPurchasePartialDto>> GetPurchaseVoucherList(int purchaseId, string userId);
        // Voucher ApprovalList
        Task<List<FiPurchasePartialApprovalDto>> GetPurchaseVoucherApprovalList(int purchaseId, int partialId, string userId);

        // 저장
        Task<eWorksResult> SaveFiPurchase(FiPurchaseGroupDto model);
        // 저장
        Task<eWorksResult> MailSendProductOrder(FiPurchaseProductOrderEmailGroup model);
        // Partial 나누기
        Task<eWorksResult> SaveVoucherPartialCnt(int purchaseId, int patialCnt, string userId);
        // OP Verification 저장
        Task<eWorksResult> SaveOPVerificationData(int purchaseId, int partialId, string verificationDt, string userId);
        // Tax Invoice 저장
        Task<eWorksResult> SaveTaxInvoiceData(int purchaseId, int partialId, string invoiceDt, string fileNm, string fileUrl, string userId);
        // Voucher Partial 저장
        Task<eWorksResult> SaveVoucherPartialData(int purchaseId, int partialId, string bankNm, string bankAccNo, int termsDays, decimal partialAmt, int partialVatAmt, string reason, string userId);
        // Partial Add End
        Task<eWorksResult> SaveVoucherPartialAddEnd(int purchaseId, string btnGb, string userId);
        // Partial 삭제
        Task<eWorksResult> DeleteVoucherPartial(int purchaseId, int partialId, string userId);

        
        
        // 마스터리스트
        Task<List<FiPurchaseDto>> GetTaskingPurchaseList(string userId);
        // 저장
        Task<eWorksResult> SaveTaskingPurchaseApproval(int purchaseId, int apprId, string remark, string statusCd, string updId);
        // Partial 저장
        Task<eWorksResult> SaveTaskingPurchasePartialApproval(int purchaseId, int partialId, int apprId, string remark, string statusCd, string updId);




        // 마스터리스트
        Task<List<FiPurchaseDto>> GetResponsePurchaseList(string startDt, string endDt, string entityCd, string statusCd, string userId);
        // 저장
        Task<eWorksResult> SaveResponsePurchaseClose(int purchaseId, string updId);
        // Update
        Task<eWorksResult> UpdateResponsePurchase(int purchaseId, string assetNo, string remark, string fileNm4, string fileUrl4, string updId);
        // Update Partial
        Task<eWorksResult> UpdateResponsePurchasePartial(int purchaseId, int partialId, string assetNo, string remark, string updId);
        // Paid
        Task<eWorksResult> SaveResponsePurchasePaid(int purchaseId, string updId);
    }
}
