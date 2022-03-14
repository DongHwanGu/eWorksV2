using Dapper;
using eWroks.Api.Models.Common;
using eWroks.Api.Models.FiPurchaseSetting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.FiPurchase
{
    public class FiPurchaseRepository : IFiPurchaseRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public FiPurchaseRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(FiPurchaseRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiPurchaseDto>> GetPurchaseList(string startDt, string endDt, string entityCd, string statusCd, string userId)
        {
            string sql = "USP_FiPurchase_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@EntityCd", entityCd);
            Gparam.Add("@StatusCd", statusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiPurchaseDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Approval 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyPurchaseLevelDto>> GetApprovalList(string entityCd, string branchCd, string categoryCd, int exchangeKRW, string userId)
        {
            string sql = "USP_FiPurchase_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@EntityCd", entityCd);
            Gparam.Add("@BranchCd", branchCd);
            Gparam.Add("@CategoryCd", categoryCd);
            Gparam.Add("@ExchangeKRW", exchangeKRW);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyPurchaseLevelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Approval User 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyUserDto>> GetApprovalUserList(int policyId, string apprCd, string userId)
        {
            string sql = "USP_FiPurchase_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PolicyId", policyId);
            Gparam.Add("@ApprCd", apprCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 마스터 상세
        /// </summary>
        /// <returns></returns>
        public async Task<FiPurchaseGroupDto> GetPurchaseDetailData(int purchaseId, string userId)
        {
            FiPurchaseGroupDto groupDto = new FiPurchaseGroupDto();

            var Gparam = new DynamicParameters();
            Gparam.Add("@PurchaseId", purchaseId);
            Gparam.Add("@UserId", userId);

            string sql = "USP_FiPurchase_R04";
            var result1 = await _db.QueryAsync<FiPurchaseDivisionDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiPurchaseDivisionDtos = result1.ToList();

            sql = "USP_FiPurchase_R05";
            var result2 = await _db.QueryAsync<FiPurchaseFileDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiPurchaseFileDtos = result2.ToList();

            sql = "USP_FiPurchase_R06";
            var result3 = await _db.QueryAsync<FiPurchaseApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiPurchaseApprovalDtos = result3.ToList();

            return groupDto;
        }

        /// <summary>
        /// 마스터 상세
        /// </summary>
        /// <returns></returns>
        public async Task<FiPurchaseProductOrderEmailGroup> GetPurchaseProductOrderEmail(int purchaseId, string userId)
        {
            FiPurchaseProductOrderEmailGroup groupDto = new FiPurchaseProductOrderEmailGroup();

            var Gparam = new DynamicParameters();
            Gparam.Add("@PurchaseId", purchaseId);
            Gparam.Add("@UserId", userId);

            var sql = "USP_FiPurchase_R05";
            var result1 = await _db.QueryAsync<FiPurchaseFileDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiPurchaseProductOrderEmailFileDtos = result1.ToList();

            sql = "USP_FiPurchase_R08";
            var result2 = await _db.QueryAsync<FiPurchaseProductOrderEmail>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiPurchaseProductOrderEmail = result2.SingleOrDefault();

            CmMailUserListDto dr = new CmMailUserListDto();
            dr.MailSubject = groupDto.FiPurchaseProductOrderEmail.MailSubject;
            dr.MailBody = groupDto.FiPurchaseProductOrderEmail.MailBody;
            dr.PurchaseBusinessNm = groupDto.FiPurchaseProductOrderEmail.PurchaseBusinessNm;
            dr.PurchaseBranchNm = groupDto.FiPurchaseProductOrderEmail.PurchaseBranchNm;
            dr.PurchasePRNo = groupDto.FiPurchaseProductOrderEmail.PurchasePRNo;
            dr.PurchaseDivisionNm = groupDto.FiPurchaseProductOrderEmail.PurchaseDivisionNm;
            dr.PurchaseAssetTypeNm = groupDto.FiPurchaseProductOrderEmail.PurchaseAssetTypeNm;
            dr.PurchaseGrowthYn = groupDto.FiPurchaseProductOrderEmail.PurchaseGrowthYn;
            dr.PurchaseMaintenanceYn = groupDto.FiPurchaseProductOrderEmail.PurchaseMaintenanceYn;
            dr.PurchaseCapexYn = groupDto.FiPurchaseProductOrderEmail.PurchaseCapexYn;
            dr.PurchaseProductNm = groupDto.FiPurchaseProductOrderEmail.PurchaseProductNm;
            dr.PurchaseProductQty = groupDto.FiPurchaseProductOrderEmail.PurchaseProductQty;
            dr.PurchaseVendorNm = groupDto.FiPurchaseProductOrderEmail.PurchaseVendorNm;
            dr.PurchaseSubTotalIn = groupDto.FiPurchaseProductOrderEmail.PurchaseSubTotalIn;
            dr.PurchaseSubTotalInAmt = groupDto.FiPurchaseProductOrderEmail.PurchaseSubTotalInAmt;
            dr.PurchaseVatAmt = groupDto.FiPurchaseProductOrderEmail.PurchaseVatAmt;
            dr.PurchaseTotalAmt = groupDto.FiPurchaseProductOrderEmail.PurchaseTotalAmt;
            dr.PurchaseComments = groupDto.FiPurchaseProductOrderEmail.PurchaseComments;
            dr.PurchaseOwner = groupDto.FiPurchaseProductOrderEmail.PurchaseOwner;
            dr.PurchaseOwnerTel = groupDto.FiPurchaseProductOrderEmail.PurchaseOwnerTel;
            dr.PurchaseTermsDays = groupDto.FiPurchaseProductOrderEmail.PurchaseTermsDays;
            dr.PurchaseTermsChangeYn = groupDto.FiPurchaseProductOrderEmail.PurchaseTermsChangeYn;

            groupDto.FiPurchaseProductOrderEmail.MailSubject = MailReplace(dr.MailSubject, dr);
            groupDto.FiPurchaseProductOrderEmail.MailBody = MailReplace(dr.MailBody, dr);

            return groupDto;
        }

        /// <summary>
        /// Voucher 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiPurchasePartialDto>> GetPurchaseVoucherList(int purchaseId, string userId)
        {
            string sql = "USP_FiPurchase_R09";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PurchaseId", purchaseId);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiPurchasePartialDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Voucher Approval 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiPurchasePartialApprovalDto>> GetPurchaseVoucherApprovalList(int purchaseId, int partialId, string userId)
        {
            string sql = "USP_FiPurchase_R11";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PurchaseId", purchaseId);
            Gparam.Add("@PartialId", partialId);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiPurchasePartialApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveFiPurchase(FiPurchaseGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchase_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", model.FiPurchaseDto.PurchaseId);
                    Gparam.Add("@StatusCd", model.FiPurchaseDto.StatusCd);
                    Gparam.Add("@EntityCd", model.FiPurchaseDto.EntityCd);
                    Gparam.Add("@BranchCd", model.FiPurchaseDto.BranchCd);
                    Gparam.Add("@PurchaseReqDt", model.FiPurchaseDto.PurchaseReqDt);
                    Gparam.Add("@PurchaseRefNo", model.FiPurchaseDto.PurchaseRefNo);
                    Gparam.Add("@AssetNo", model.FiPurchaseDto.AssetNo);
                    Gparam.Add("@CategoryCd", model.FiPurchaseDto.CategoryCd);
                    Gparam.Add("@CategoryDtlCd", model.FiPurchaseDto.CategoryDtlCd);
                    Gparam.Add("@CategoryDtlReason", model.FiPurchaseDto.CategoryDtlReason);
                    Gparam.Add("@GrowthYn", model.FiPurchaseDto.GrowthYn);
                    Gparam.Add("@MaintenanceYn", model.FiPurchaseDto.MaintenanceYn);
                    Gparam.Add("@MaintenanceAssetNo", model.FiPurchaseDto.MaintenanceAssetNo);
                    Gparam.Add("@MaintenanceEqId", model.FiPurchaseDto.MaintenanceEqId);
                    Gparam.Add("@BudgetYn", model.FiPurchaseDto.BudgetYn);
                    Gparam.Add("@ProductNm", model.FiPurchaseDto.ProductNm);
                    Gparam.Add("@ProductQty", model.FiPurchaseDto.ProductQty);
                    Gparam.Add("@VendorId", model.FiPurchaseDto.VendorId);
                    Gparam.Add("@Manufaturer", model.FiPurchaseDto.Manufaturer);
                    Gparam.Add("@EvidenceCd", model.FiPurchaseDto.EvidenceCd);
                    Gparam.Add("@EvidenceReason", model.FiPurchaseDto.EvidenceReason);
                    Gparam.Add("@CurrencyCd", model.FiPurchaseDto.CurrencyCd);
                    Gparam.Add("@CurrencyAmt", model.FiPurchaseDto.CurrencyAmt);
                    Gparam.Add("@CurrencyVatAmt", model.FiPurchaseDto.CurrencyVatAmt);
                    Gparam.Add("@ExchangeRate", model.FiPurchaseDto.ExchangeRate);
                    Gparam.Add("@ExchangeKRW", model.FiPurchaseDto.ExchangeKRW);
                    Gparam.Add("@CarRate", model.FiPurchaseDto.CarRate);
                    Gparam.Add("@CarGBP", model.FiPurchaseDto.CarGBP);
                    Gparam.Add("@DocQtyCd", model.FiPurchaseDto.DocQtyCd);
                    Gparam.Add("@DocQtyReason", model.FiPurchaseDto.DocQtyReason);
                    Gparam.Add("@TermsDays", model.FiPurchaseDto.TermsDays);
                    Gparam.Add("@TermsChangeYn", model.FiPurchaseDto.TermsChangeYn);
                    Gparam.Add("@TermsReason", model.FiPurchaseDto.TermsReason);
                    Gparam.Add("@Reason", model.FiPurchaseDto.Reason);
                    Gparam.Add("@Remark", model.FiPurchaseDto.Remark);
                    Gparam.Add("@DEBIT", model.FiPurchaseDto.DEBIT);
                    Gparam.Add("@CREDIT", model.FiPurchaseDto.CREDIT);
                    Gparam.Add("@ProductRefNo", model.FiPurchaseDto.ProductRefNo);
                    Gparam.Add("@VoucherRefNo", model.FiPurchaseDto.VoucherRefNo);
                    Gparam.Add("@FixCurrencyAmt", model.FiPurchaseDto.FixCurrencyAmt);
                    Gparam.Add("@FixCurrencyVatAmt", model.FiPurchaseDto.FixCurrencyVatAmt);
                    Gparam.Add("@PartialCnt", model.FiPurchaseDto.PartialCnt);
                    Gparam.Add("@RegId", model.FiPurchaseDto.RegId);
                    Gparam.Add("@UpdId", model.FiPurchaseDto.UpdId);

                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] Division 저장
                    for (int i = 0; i < model.FiPurchaseDivisionDtos.Count; i++)
                    {
                        var dr = model.FiPurchaseDivisionDtos[i];

                        sql = "USP_FiPurchase_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", id);
                        Gparam.Add("@DivisionCd", dr.DivisionCd);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }
                    //[3] File 저장
                    for (int i = 0; i < model.FiPurchaseFileDtos.Count; i++)
                    {
                        var dr = model.FiPurchaseFileDtos[i];

                        sql = "USP_FiPurchase_U03";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", id);
                        Gparam.Add("@FileSeq", dr.FileSeq);
                        Gparam.Add("@FileNm", dr.FileNm);
                        Gparam.Add("@FileUrl", dr.FileUrl);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process3 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

                    //[4] Approval 저장
                    for (int i = 0; i < model.FiPurchaseApprovalDtos.Count; i++)
                    {
                        var dr = model.FiPurchaseApprovalDtos[i];

                        sql = "USP_FiPurchase_U04";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", id);
                        Gparam.Add("@ApprId", dr.ApprId);
                        Gparam.Add("@LevelSeq", dr.LevelSeq);
                        Gparam.Add("@ApprCd", dr.ApprCd);
                        Gparam.Add("@ApprUserId", dr.ApprUserId);
                        Gparam.Add("@StatusCd", dr.StatusCd);
                        Gparam.Add("@MailYn", dr.MailYn);
                        Gparam.Add("@DeleApprUserId", dr.DeleApprUserId);
                        Gparam.Add("@DeleReason", dr.DeleReason);
                        Gparam.Add("@Remark", dr.Remark);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

                    // [5] 승인요청
                    if (!model.FiPurchaseDto.StatusCd.Equals("01"))
                    {
                        sql = "USP_FiPurchase_U05";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", id);
                        Gparam.Add("@RegId", model.FiPurchaseDto.RegId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                        // 커밋
                        scope.Complete();
                        // Note - 트렌젝션을 닫는다.
                        if (scope != null) scope.Dispose();

                        // 메일전송
                        Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", id);
                        Gparam.Add("@UserId", model.FiPurchaseDto.RegId);

                        SendMail(Gparam);
                    }
                    else
                    {
                        // 커밋
                        scope.Complete();
                    }
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// 메일 전송
        /// </summary>
        /// <param name="gparam"></param>
        private async void SendMail(DynamicParameters Gparam)
        {
            try
            {
                var sql = "USP_FiPurchase_R07";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr);
                    string mailBody = MailReplace(dr.MailBody, dr);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , string.IsNullOrEmpty(dr.EmailCCList) ? "" : dr.EmailCCList
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "06";
                    string mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> MailSendProductOrder(FiPurchaseProductOrderEmailGroup model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {

                    // Product Order 는 상시로 이루어 지므로 상태값 없애고 메일전송 기능만 넣는다.

                    //string sql = "USP_FiPurchase_U06";

                    //var Gparam = new DynamicParameters();
                    //Gparam.Add("@PurchaseId", model.FiPurchaseProductOrderEmail.PurchaseId);
                    //Gparam.Add("@RegId", model.FiPurchaseProductOrderEmail.UpdId);
                    //Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    //Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    //var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    //result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    //result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    //if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    //// 커밋
                    //scope.Complete();
                    //// Note - 트렌젝션을 닫는다.
                    //if (scope != null) scope.Dispose();

                    // 메일전송
                    string mailSubject = model.FiPurchaseProductOrderEmail.MailSubject;
                    string mailBody = model.FiPurchaseProductOrderEmail.MailBody;
                    Attachment[] oAttachments = null;
                    // 첨부파일 가져오기.
                    oAttachments = GetUploadFileInfoList(model.FiPurchaseProductOrderEmailFileDtos);

                    result = eWorksFunction.SendMail_AttachFile(model.FiPurchaseProductOrderEmail.FromEmail
                                                            , model.FiPurchaseProductOrderEmail.ToEmail
                                                            , model.FiPurchaseProductOrderEmail.CcEmail
                                                            , ""
                                                            , mailSubject
                                                            , mailBody
                                                            , oAttachments);

                    string mailGb = "06";
                    string mailCd = "B1";

                    CmMailUserListDto dr = new CmMailUserListDto();
                    dr.SendUserId = model.FiPurchaseProductOrderEmail.UpdId;
                    dr.SendUserId = model.FiPurchaseProductOrderEmail.UpdId;
                    dr.SendUserNm = model.FiPurchaseProductOrderEmail.UpdId;
                    dr.SendUserEmail = model.FiPurchaseProductOrderEmail.FromEmail;
                    dr.ReceiveUserId = model.FiPurchaseProductOrderEmail.UpdId;
                    dr.ReceiveUserNm = model.FiPurchaseProductOrderEmail.UpdId;
                    dr.ReceiveUserEmail = model.FiPurchaseProductOrderEmail.ToEmail;
                    dr.MailKeys = model.FiPurchaseProductOrderEmail.PurchaseId.ToString();
                    dr.SendUserId = model.FiPurchaseProductOrderEmail.UpdId;
                    dr.SendUserId = model.FiPurchaseProductOrderEmail.UpdId;

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, result);

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Partial 나누기
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveVoucherPartialCnt(int purchaseId, int patialCnt, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchase_U07";

                    for (int i = 0; i < patialCnt; i++)
                    {
                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", purchaseId);
                        Gparam.Add("@PatialCnt", patialCnt);
                        Gparam.Add("@Cnt", i);
                        Gparam.Add("@UserId", userId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// OP Verification 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveOPVerificationData(int purchaseId, int partialId, string verificationDt, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchase_U08";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@VerificationDt", verificationDt);
                    Gparam.Add("@UserId", userId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// OP Verification 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaxInvoiceData(int purchaseId, int partialId, string invoiceDt, string fileNm, string fileUrl, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchase_U09";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@InvoiceDt", invoiceDt);
                    Gparam.Add("@FileNm", fileNm);
                    Gparam.Add("@FileUrl", fileUrl);
                    Gparam.Add("@UserId", userId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        // Voucher Partial 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveVoucherPartialData(int purchaseId, int partialId, string bankNm, string bankAccNo, int termsDays, decimal partialAmt, int partialVatAmt, string reason, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchase_U10";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@BankNm", bankNm);
                    Gparam.Add("@BankAccNo", bankAccNo);
                    Gparam.Add("@TermsDays", termsDays);
                    Gparam.Add("@PartialAmt", partialAmt);
                    Gparam.Add("@PartialVatAmt", partialVatAmt);
                    Gparam.Add("@Reason", reason);
                    Gparam.Add("@UserId", userId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                    // 메일전송
                    Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@UserId", userId);

                    SendMailPartial(Gparam);

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }
        /// <summary>
        /// 메일 전송
        /// </summary>
        /// <param name="gparam"></param>
        private async void SendMailPartial(DynamicParameters Gparam)
        {
            try
            {
                var sql = "USP_FiPurchase_R10";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr);
                    string mailBody = MailReplace(dr.MailBody, dr);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , string.IsNullOrEmpty(dr.EmailCCList) ? "" : dr.EmailCCList
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "06";
                    string mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// Partial 나누기
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveVoucherPartialAddEnd(int purchaseId, string btnGb, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    if (btnGb.Equals("01"))
                    {
                        string sql = "USP_FiPurchase_U07";

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", purchaseId);
                        Gparam.Add("@PatialCnt", 999);
                        Gparam.Add("@Cnt", 999);
                        Gparam.Add("@UserId", userId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }
                    else
                    {
                        string sql = "USP_FiPurchase_U11";

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PurchaseId", purchaseId);
                        Gparam.Add("@StatusCd", "25");
                        Gparam.Add("@UserId", userId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Partial 나누기
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteVoucherPartial(int purchaseId, int partialId, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchase_U12";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@UserId", userId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }
        #endregion

        #region Tasking
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiPurchaseDto>> GetTaskingPurchaseList(string userId)
        {
            string sql = "USP_Tasking_FiPurchase_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiPurchaseDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingPurchaseApproval(int purchaseId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Tasking_FiPurchase_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@ApprId", apprId);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@StatusCd", statusCd);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                    // 메일전송
                    if (!string.IsNullOrEmpty(result.OV_RTN_MSG))
                    {
                        SendMailTasking(purchaseId, updId, remark, result.OV_RTN_MSG);
                    }
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Tasking 메일 전송
        /// </summary>
        /// <param name="travelId"></param>
        /// <param name="updId"></param>
        /// <param name="oV_RTN_MSG"></param>
        private async void SendMailTasking(int purchaseId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@PurchaseId", purchaseId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Tasking_FiPurchase_R02";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr, remark);
                    string mailBody = MailReplace(dr.MailBody, dr, remark);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , dr.EmailCCList == null ? "" : dr.EmailCCList
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "06";
                    string mailCd = "";
                    if (apprCd == "99") mailCd = "A2";
                    else if (apprCd == "10") mailCd = "A3";
                    else mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);

                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// Partial 승인 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingPurchasePartialApproval(int purchaseId, int partialId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Tasking_FiPurchase_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@ApprId", apprId);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@StatusCd", statusCd);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                    // 메일전송
                    if (!string.IsNullOrEmpty(result.OV_RTN_MSG))
                    {
                        SendMailTasking2(purchaseId, partialId, updId, remark, result.OV_RTN_MSG);
                    }
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Tasking 메일 전송
        /// </summary>
        /// <param name="travelId"></param>
        /// <param name="updId"></param>
        /// <param name="oV_RTN_MSG"></param>
        private async void SendMailTasking2(int purchaseId, int partialId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@PurchaseId", purchaseId);
                Gparam.Add("@PartialId", partialId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Tasking_FiPurchase_R03";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr, remark);
                    string mailBody = MailReplace(dr.MailBody, dr, remark);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , dr.EmailCCList == null ? "" : dr.EmailCCList
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "06";
                    string mailCd = "";
                    if (apprCd == "99") mailCd = "A2";
                    else if (apprCd == "10") mailCd = "A3";
                    else mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);

                }
            }
            catch (Exception ex)
            {
            }
        }
        #endregion

        #region Response
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiPurchaseDto>> GetResponsePurchaseList(string startDt, string endDt, string entityCd, string statusCd, string userId)
        {
            string sql = "USP_Response_FiPurchase_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@EntityCd", entityCd);
            Gparam.Add("@StatusCd", statusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiPurchaseDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponsePurchaseClose(int purchaseId, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_FiPurchase_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Update
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> UpdateResponsePurchase(int purchaseId, string assetNo, string remark, string fileNm4, string fileUrl4, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 Update
                    string sql = "USP_Response_FiPurchase_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@AssetNo", assetNo);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@FileNm4", fileNm4);
                    Gparam.Add("@FileUrl4", fileUrl4);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Update Partial
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> UpdateResponsePurchasePartial(int purchaseId, int partialId, string assetNo, string remark, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 Update
                    string sql = "USP_Response_FiPurchase_U03";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@PartialId", partialId);
                    Gparam.Add("@AssetNo", assetNo);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }

        /// <summary>
        /// Paid
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponsePurchasePaid(int purchaseId, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_FiPurchase_U04";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PurchaseId", purchaseId);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                }
                catch (Exception ex)
                {
                    // roll the transaction back
                    result.OV_RTN_CODE = -1;
                    result.OV_RTN_MSG = ex.Message;
                }
                finally
                {
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
                }
            }

            return result;
        }
        #endregion

        #region Common
        /// <summary>
        ///  메일내용 변경하기.
        /// </summary>
        /// <param name="p"></param>
        /// <param name="dr"></param>
        /// <returns></returns>
        private string MailReplace(string desc, CmMailUserListDto dr, string remark = "")
        {
            desc = desc.Replace("[보내는사람]", dr.SendUserNm);
            desc = desc.Replace("[보내는사람직함]", dr.SendDutyCdKorNm);
            desc = desc.Replace("[받는사람]", dr.ReceiveUserNm);
            desc = desc.Replace("[받는사람직함]", dr.ReceiveDutyCdKorNm);
            desc = desc.Replace("[링크]", "<a href='" + eWorksConfig.GetERPLinkPath() + "'> 여기 </a>");

            desc = desc.Replace("[결제자코멘트]", remark);
            desc = desc.Replace("[HR코멘트]", remark);
            desc = desc.Replace("[상태]", dr.StatusCdNm);

            desc = desc.Replace("[제품]", dr.PurchaseProductNm);
            desc = desc.Replace("[Business]", dr.PurchaseBusinessNm);
            desc = desc.Replace("[Branch]", dr.PurchaseBranchNm);
            desc = desc.Replace("[PR No]", dr.PurchasePRNo);
            desc = desc.Replace("[Division]", dr.PurchaseDivisionNm);
            desc = desc.Replace("[Asset Type]", dr.PurchaseAssetTypeNm);
            desc = desc.Replace("[Growth]", dr.PurchaseGrowthYn);
            desc = desc.Replace("[Maintenance]", dr.PurchaseMaintenanceYn);
            desc = desc.Replace("[CAPEX Budget]", dr.PurchaseCapexYn);
            desc = desc.Replace("[Product Nm]", dr.PurchaseProductNm);
            desc = desc.Replace("[Product Qty]", dr.PurchaseProductQty);
            desc = desc.Replace("[Vendor]", dr.PurchaseVendorNm);
            desc = desc.Replace("[SubTOTAL In]", dr.PurchaseSubTotalIn);
            desc = desc.Replace("[SubTOTAL In AMT]", dr.PurchaseSubTotalInAmt);
            desc = desc.Replace("[VAT (10%)]", dr.PurchaseVatAmt);
            desc = desc.Replace("[Total in KRW]", dr.PurchaseTotalAmt);
            desc = desc.Replace("[comments]", dr.PurchaseComments);
            desc = desc.Replace("[Owner]", dr.PurchaseOwner);
            desc = desc.Replace("[Owner Tel]", dr.PurchaseOwnerTel);

            if (dr.PurchaseTermsChangeYn != null)
            {
                if (dr.PurchaseTermsChangeYn.Equals("Y"))
                {
                    desc = desc.Replace("[Payment Term]", "<span style='color:red'>" + dr.PurchaseTermsDays + "</span>");
                }
                else
                {
                    desc = desc.Replace("[Payment Term]", dr.PurchaseTermsDays);
                }
            }

            return desc;
        }
        /// <summary>
        /// 메일전송
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="mailGb"></param>
        /// <param name="mailCd"></param>
        /// <param name="mailSubject"></param>
        /// <param name="mailBody"></param>
        /// <param name="mailResult"></param>
        private void SendMailLog(CmMailUserListDto dr, string mailGb, string mailCd, string mailSubject, string mailBody, eWorksResult mailResult)
        {
            try
            {
                // 메일 로그 남기기 
                string sql = "USP_Common_SaveMailLog";

                var mailParam = new DynamicParameters();
                mailParam.Add("@UserId", dr.SendUserId);
                mailParam.Add("@MailGb", mailGb);
                mailParam.Add("@MailCd", mailCd);
                mailParam.Add("@SendUserId", dr.SendUserId);
                mailParam.Add("@SendUserNm", dr.SendUserNm);
                mailParam.Add("@SendUserEmail", dr.SendUserEmail);
                mailParam.Add("@ReceiveUserId", dr.ReceiveUserId);
                mailParam.Add("@ReceiveUserNm", dr.ReceiveUserNm);
                mailParam.Add("@ReceiveUserEmail", dr.ReceiveUserEmail);
                mailParam.Add("@MailSubject", mailSubject);
                mailParam.Add("@MailBody", mailBody);
                mailParam.Add("@MailKeys", dr.MailKeys);
                mailParam.Add("@ReMailCnt", 0);
                mailParam.Add("@RegId", dr.SendUserId);
                mailParam.Add("@UpdId", dr.SendUserId);
                mailParam.Add("@ReturnCode", mailResult.OV_RTN_CODE);
                mailParam.Add("@ReturnMsg", mailResult.OV_RTN_MSG);
                mailParam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                mailParam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                var process1 = _db.ExecuteAsync(sql, mailParam, commandType: CommandType.StoredProcedure);

            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// [ 공통 ]업로드 파일정보 가져오기.
        /// </summary>
        /// <returns></returns>
        private Attachment[] GetUploadFileInfoList(List<FiPurchaseFileDto> files)
        {
            List<Attachment> oAttachments = new List<Attachment>();

            for (int i = 0; i < files.Count; i++)
            {
                //IntertekConfig.Local_Path;
                string sFilePath = files[i].FileUrl
                    .Replace(eWorksConfig.Server_Path_Test.ToString(), eWorksConfig.Local_Path().ToString())
                    .Replace(eWorksConfig.Server_Path_Real.ToString(), eWorksConfig.Local_Path().ToString()).Replace("/", @"\");

                FileInfo fFile = new FileInfo(sFilePath);

                if (fFile.Exists)
                {
                    string strFullfileName = sFilePath;
                    string strFileName = Path.GetFileName(sFilePath);
                    oAttachments.Add(new Attachment(strFullfileName) { Name = strFileName });
                }
            }

            return oAttachments.ToArray();
        }
        #endregion
    }
}
