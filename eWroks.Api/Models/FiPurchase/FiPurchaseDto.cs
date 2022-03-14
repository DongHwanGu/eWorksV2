using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.FiPurchase
{
    public class FiPurchaseGroupDto
    {
        public FiPurchaseDto FiPurchaseDto { get; set; }
        public List<FiPurchaseDivisionDto> FiPurchaseDivisionDtos { get; set; }
        public List<FiPurchaseFileDto> FiPurchaseFileDtos { get; set; }
        public List<FiPurchaseApprovalDto> FiPurchaseApprovalDtos { get; set; }
    }

    public class FiPurchaseDto
    {
        public int id { get; set; }                         
        public int PurchaseId { get; set; }                 
        public string StatusCd { get; set; }                
        public string EntityCd { get; set; }                
        public string BranchCd { get; set; }                
        public string PurchaseReqDt { get; set; }           
        public string PurchaseRefNo { get; set; }           
        public string AssetNo { get; set; }                 
        public string CategoryCd { get; set; }              
        public string CategoryDtlCd { get; set; }           
        public string CategoryDtlReason { get; set; }       
        public string GrowthYn { get; set; }                
        public string MaintenanceYn { get; set; }           
        public string MaintenanceAssetNo { get; set; }      
        public string MaintenanceEqId { get; set; }         
        public string BudgetYn { get; set; }                
        public string ProductNm { get; set; }               
        public int ProductQty { get; set; }                 
        public int VendorId { get; set; }                   
        public string Manufaturer { get; set; }             
        public string EvidenceCd { get; set; }              
        public string EvidenceReason { get; set; }          
        public string CurrencyCd { get; set; }              
        public decimal CurrencyAmt { get; set; }            
        public int CurrencyVatAmt { get; set; }             
        public decimal ExchangeRate { get; set; }           
        public int ExchangeKRW { get; set; }                
        public decimal CarRate { get; set; }                
        public decimal CarGBP { get; set; }                 
        public string DocQtyCd { get; set; }                
        public string DocQtyReason { get; set; }            
        public int TermsDays { get; set; }                  
        public string TermsChangeYn { get; set; }           
        public string TermsReason { get; set; }             
        public string Reason { get; set; }                  
        public string Remark { get; set; }                  
        public string DEBIT { get; set; }                   
        public string CREDIT { get; set; }                  
        public string ProductRefNo { get; set; }            
        public string VoucherRefNo { get; set; }            
        public decimal FixCurrencyAmt { get; set; }         
        public int FixCurrencyVatAmt { get; set; }          
        public int PartialCnt { get; set; }                 
        public string RegId { get; set; }                   
        public string UpdId { get; set; }                   
                                                            
        public string StatusCdNm { get; set; }              
        public string EntityCdNm { get; set; }              
        public string BranchCdNm { get; set; }              
        public string VendorNm { get; set; }                
        public string VendorTermsDaysOld { get; set; }      
        public string RegIdNm { get; set; }                 
        public string RegDtNm { get; set; }                 
        public string UpdIdNm { get; set; }                 
        public string UpdDtNm { get; set; }                 
        public string RegIdDeptFullNm { get; set; }         
        public string SubOpenYn { get; set; }               
                                                            
        public string CurrencyCdNm { get; set; }            
        public string CategoryCdNm { get; set; }            
        public string CategoryDtlCdNm { get; set; }         
        public string DocQtyCdNm { get; set; }              
        public string EvidenceCdNm { get; set; }            

        public decimal PartialTotalAmount { get; set; }

        public int ApprId { get; set; }
    }

    public class FiPurchaseDivisionDto
    {
        public int PurchaseId { get; set; }
        public string DivisionCd { get; set; }
        public string RegId { get; set;}
        public string UpdId { get; set; }

        public string DivisionCdNm { get; set; }
    }

    public class FiPurchaseFileDto
    {
        public int PurchaseId { get; set; }
        public int FileSeq { get; set; }
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
        public string RegId { get; set;}
        public string UpdId { get; set; }
    }

    public class FiPurchaseOrderDto
    {
        public int PurchaseId { get; set; }
        public string EndDt { get; set; }
        public string StartDt { get; set; }
        public string StatusCd { get; set; }
        public string StatusDt { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    public class FiPurchaseApprovalDto
    {
        public int PurchaseId { get; set; }
        public int ApprId { get; set; }
        public int LevelSeq { get; set; }
        public string ApprCd { get; set; }
        public string ApprUserId { get; set; }
        public string StatusCd { get; set; }
        public string MailYn { get; set; }
        public string DeleApprUserId { get; set; }
        public string DeleReason { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }
        public string UserNm { get; set; }
        public string UpdDtNm { get; set; }
        public string TaskingUserNm { get; set; }
        public string ApprCdNm { get; set; }
    }

    public class FiPurchasePartialDto
    {
        public int PurchaseId { get; set; }
        public int PartialId { get; set; }
        public string StatusCd { get; set; }
        public string BankNm { get; set; }
        public string BankAccNo { get; set; }
        public int TermsDays { get; set; }
        public decimal PartialAmt { get; set; }
        public int PartialVatAmt { get; set; }
        public string PartialReqDt { get; set; }
        public string TermsScheduledDt { get; set; }
        public string PartialVoucherRefNo { get; set; }
        public string AssetNo { get; set; }
        public string VerificationDt { get; set; }
        public string InvoiceDt { get; set; }
        public string FileNm { get; set; }
        public string FileUrl { get; set; }
        public string Reason { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
        public string RegDt { get; set; }
        public string UpdDt { get; set; }

        public string StatusCdNm { get; set; }
    }

    public class FiPurchasePartialApprovalDto
    {
        public int PurchaseId { get; set; }             
        public int PartialId { get; set; }
        public int ApprId { get; set; }
        public int LevelSeq { get; set; }
        public string ApprCd { get; set; }
        public string ApprUserId { get; set; }
        public string StatusCd { get; set; }
        public string MailYn { get; set; }
        public string DeleApprUserId { get; set; }
        public string DeleReason { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string StatusCdNm { get; set; }
        public string UserNm { get; set; }
        public string UpdDtNm { get; set; }
        public string TaskingUserNm { get; set; }
        public string ApprCdNm { get; set; }
    }

    public class FiPurchaseProductOrderEmailGroup
    {
        public FiPurchaseProductOrderEmail FiPurchaseProductOrderEmail { get; set; }
        public List<FiPurchaseFileDto> FiPurchaseProductOrderEmailFileDtos { get; set; }
    }
    public class FiPurchaseProductOrderEmail
    {
        public int PurchaseId { get; set; }
        public string FromEmail { get; set; }
        public string ToEmail { get; set; }
        public string CcEmail { get; set; }
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public string UpdId { get; set; }

        // Purchase
        public string PurchaseBusinessNm { get; set; }
        public string PurchaseBranchNm { get; set; }
        public string PurchasePRNo { get; set; }
        public string PurchaseDivisionNm { get; set; }
        public string PurchaseAssetTypeNm { get; set; }
        public string PurchaseGrowthYn { get; set; }
        public string PurchaseMaintenanceYn { get; set; }
        public string PurchaseCapexYn { get; set; }
        public string PurchaseProductNm { get; set; }
        public string PurchaseProductQty { get; set; }
        public string PurchaseVendorNm { get; set; }
        public string PurchaseSubTotalIn { get; set; }
        public string PurchaseSubTotalInAmt { get; set; }
        public string PurchaseVatAmt { get; set; }
        public string PurchaseTotalAmt { get; set; }
        public string PurchaseComments { get; set; }
        public string PurchaseOwner { get; set; }
        public string PurchaseOwnerTel { get; set; }
        public string PurchaseTermsDays { get; set; }
        public string PurchaseTermsChangeYn { get; set; }
    }
}
