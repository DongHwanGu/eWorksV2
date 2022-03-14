using Dapper;
using eWroks.Api.Models.CmVendor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.FiPurchaseSetting
{
    public class FiPurchaseSettingRepositry : IFiPurchaseSettingRepositry
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public FiPurchaseSettingRepositry(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(FiPurchaseSettingRepositry));
        }

        #region Currency
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiCurrencyDto>> GetCurrencyList(string currencyYear, string currencyMonth)
        {
            string sql = "USP_FiPurchaseSettingCurrency_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@CurrencyYear", currencyYear);
            Gparam.Add("@CurrencyMonth", currencyMonth);

            var result = await _db.QueryAsync<FiCurrencyDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveCurrencyData(FiCurrencyDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingCurrency_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@CurrencyYear", model.CurrencyYear);
                    Gparam.Add("@CurrencyMonth", model.CurrencyMonth);
                    Gparam.Add("@CurrencyCd", model.CurrencyCd);
                    Gparam.Add("@CurrencyAmt", model.CurrencyAmt);
                    Gparam.Add("@Remark", model.Remark);
                    Gparam.Add("@UseYn", model.UseYn);

                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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

        #region Vendor
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmVendorDto>> GetVendorList(string entityCd)
        {
            string sql = "USP_FiPurchaseSettingVendor_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@EntityCd", entityCd);

            var result = await _db.QueryAsync<CmVendorDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmVendorContactDto>> GetVendorContactList(int vendorId)
        {
            string sql = "USP_FiPurchaseSettingVendor_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@VendorId", vendorId);

            var result = await _db.QueryAsync<CmVendorContactDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveVendorData(CmVendorGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingVendor_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@VendorId", model.CmVendorDto.VendorId);
                    Gparam.Add("@VendorGb", model.CmVendorDto.VendorGb);
                    Gparam.Add("@VendorNm", model.CmVendorDto.VendorNm);
                    Gparam.Add("@VendorEnm", model.CmVendorDto.VendorEnm);
                    Gparam.Add("@ZipCode", model.CmVendorDto.ZipCode);
                    Gparam.Add("@AddrKr", model.CmVendorDto.AddrKr);
                    Gparam.Add("@AddrEn", model.CmVendorDto.AddrEn);
                    Gparam.Add("@Country", model.CmVendorDto.Country);
                    Gparam.Add("@Tel", model.CmVendorDto.Tel);
                    Gparam.Add("@Fax", model.CmVendorDto.Fax);
                    Gparam.Add("@CdRef1", model.CmVendorDto.CdRef1);
                    Gparam.Add("@CdRef2", model.CmVendorDto.CdRef2);
                    Gparam.Add("@CdRef3", model.CmVendorDto.CdRef3);
                    Gparam.Add("@UseYn", model.CmVendorDto.UseYn);
                    Gparam.Add("@BusinessNo", model.CmVendorDto.BusinessNo);
                    Gparam.Add("@Remark", model.CmVendorDto.Remark);
                    Gparam.Add("@RegId", model.CmVendorDto.RegId);
                    Gparam.Add("@UpdId", model.CmVendorDto.UpdId);
                    Gparam.Add("@FI_BankAccNo", model.CmVendorDto.FI_BankAccNo);
                    Gparam.Add("@FI_VendorId", model.CmVendorDto.FI_VendorId);
                    Gparam.Add("@FI_BankNm", model.CmVendorDto.FI_BankNm);
                    Gparam.Add("@FI_BankCd", model.CmVendorDto.FI_BankCd);
                    Gparam.Add("@FI_FileNm", model.CmVendorDto.FI_FileNm);
                    Gparam.Add("@FI_FileUrl", model.CmVendorDto.FI_FileUrl);

                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] Contact 저장
                    for (int i = 0; i < model.CmVendorContactDtos.Count; i++)
                    {
                        var dr = model.CmVendorContactDtos[i];

                        sql = "USP_FiPurchaseSettingVendor_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@VendorId", id);
                        Gparam.Add("@ContactId", dr.ContactId);
                        Gparam.Add("@ContactNm", dr.ContactNm);
                        Gparam.Add("@ContactPhone", dr.ContactPhone);
                        Gparam.Add("@ContactEmail", dr.ContactEmail);
                        Gparam.Add("@MailSendYn", dr.MailSendYn);
                        Gparam.Add("@UseYn", dr.UseYn);
                        Gparam.Add("@Remark", dr.Remark);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

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

        #region Amount Policy
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyDto>> GetPolicyList(string processGb, string userId)
        {
            string sql = "USP_FiPurchaseSettingPolicy_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ProcessGb", processGb);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SavePolicyData(FiApprovalPolicyDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicy_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", model.PolicyId);
                    Gparam.Add("@PolicyNm", model.PolicyNm);
                    Gparam.Add("@ProcessGb", model.ProcessGb);
                    Gparam.Add("@Remark", model.Remark);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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

        #region Policy Purchase
        /// <summary>
        /// Purchase policy 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyPurchaseDto>> GetApprovalPurchaseList(int policyId, string userId)
        {
            string sql = "USP_FiPurchaseSettingPolicyPurchase_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PolicyId", policyId);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyPurchaseDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 유저 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyUserDto>> GetApprovalPolicyUserList(int policyId, string userId)
        {
            string sql = "USP_FiPurchaseSettingPolicyPurchase_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PolicyId", policyId);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 정책 Level 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyPurchaseLevelDto>> GetApprovalPurchaseLevelList(int policyId, int itemId)
        {
            string sql = "USP_FiPurchaseSettingPolicyPurchase_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PolicyId", policyId);
            Gparam.Add("@ItemId", itemId);

            var result = await _db.QueryAsync<FiApprovalPolicyPurchaseLevelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 유저 CC 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyUserCCDto>> GetApprovalPolicyUserCCList(int policyId, string apprCd, string userId)
        {
            string sql = "USP_FiPurchaseSettingPolicyPurchase_R04";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PolicyId", policyId);
            Gparam.Add("@ApprCd", apprCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyUserCCDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Branch 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiApprovalPolicyBranchDto>> GetApprovalPolicyBranchList(int policyId, string userId)
        {
            string sql = "USP_FiPurchaseSettingPolicyPurchase_R05";

            var Gparam = new DynamicParameters();
            Gparam.Add("@PolicyId", policyId);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiApprovalPolicyBranchDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveApprovalPurchaseData(FiApprovalPolicyPurchaseDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", model.PolicyId);
                    Gparam.Add("@ItemId", model.ItemId);
                    Gparam.Add("@CategoryCd", model.CategoryCd);
                    Gparam.Add("@MinAmount", model.MinAmount);
                    Gparam.Add("@MaxAmount", model.MaxAmount);
                    Gparam.Add("@DocQty", model.DocQty);
                    Gparam.Add("@Remark", model.Remark);

                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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
        /// 유저 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveApprovalPolicyUserData(List<FiApprovalPolicyUserDto> models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U02";

                    for (int i = 0; i < models.Count; i++)
                    {
                        var dr = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PolicyId", dr.PolicyId);
                        Gparam.Add("@ApprCd", dr.ApprCd);
                        Gparam.Add("@UserId", dr.UserId);
                        Gparam.Add("@Remark", dr.Remark);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                        
                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                     
                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }
                    

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
        /// 정책 Level 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveApprovalPurchaseLevelData(List<FiApprovalPolicyPurchaseLevelDto> models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U03";

                    for (int i = 0; i < models.Count; i++)
                    {
                        var dr = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PolicyId", dr.PolicyId);
                        Gparam.Add("@ItemId", dr.ItemId);
                        Gparam.Add("@LevelSeq", (i + 1));
                        Gparam.Add("@ApprCd", dr.ApprCd);
                        Gparam.Add("@Remark", dr.Remark);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }


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
        /// 유저 CC 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveApprovalPolicyUserCCData(List<FiApprovalPolicyUserCCDto> models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U04";

                    for (int i = 0; i < models.Count; i++)
                    {
                        var dr = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PolicyId", dr.PolicyId);
                        Gparam.Add("@ApprCd", dr.ApprCd);
                        Gparam.Add("@UserId", dr.UserId);
                        Gparam.Add("@CCUserId", dr.CCUserId);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }


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
        /// 유저 삭제
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteApprovalPolicyUserData(int policyId, string apprCd, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U05";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", policyId);
                    Gparam.Add("@ApprCd", apprCd);
                    Gparam.Add("@UserId", userId);

                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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
        /// 유저 CC 삭제
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteApprovalPolicyUserCCData(int policyId, string apprCd, string userId, string ccUserId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U06";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", policyId);
                    Gparam.Add("@ApprCd", apprCd);
                    Gparam.Add("@UserId", userId);
                    Gparam.Add("@CCUserId", ccUserId);

                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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
        /// BraNCH 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveApprovalPolicyBranchData(FiApprovalPolicyBranchDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U07";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", model.PolicyId);
                    Gparam.Add("@BranchCd", model.BranchCd);
                    Gparam.Add("@EntityCd", model.EntityCd);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);


                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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
        /// BraNCH 삭제
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteApprovalPolicyBranchData(int policyId, string branchCd)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U08";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", policyId);
                    Gparam.Add("@BranchCd", branchCd);

                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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
        /// Policy 삭제
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteApprovalPurchaseData(int policyId, int itemId, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_FiPurchaseSettingPolicyPurchase_U09";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@PolicyId", policyId);
                    Gparam.Add("@ItemId", itemId);
                    Gparam.Add("@UserId", userId);

                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

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
    }

}
