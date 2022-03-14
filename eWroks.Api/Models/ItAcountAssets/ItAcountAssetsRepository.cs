using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.ItAcountAssets
{
    public class ItAcountAssetsRepository : IItAcountAssetsRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public ItAcountAssetsRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(ItAcountAssetsRepository));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<ItAcountUserDto>> GetAcountUserList()
        {
            string sql = "USP_ItAcountAssets_R01";

            var Gparam = new DynamicParameters();
            //Gparam.Add("@UserId", userId);


            var result = await _db.QueryAsync<ItAcountUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<ItAcountUserDto> GetAcountAssetsDetailData(string userId)
        {
            string sql = "USP_ItAcountAssets_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            
            var result = await _db.QueryAsync<ItAcountUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 아이템 리스트
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<ItAcountAssetsDto>> GetAcountAssetsList(string userId, string assetsGb)
        {
            string sql = "USP_ItAcountAssets_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            Gparam.Add("@AssetsGb", assetsGb);

            var result = await _db.QueryAsync<ItAcountAssetsDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 아이템
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="assetsGb"></param>
        /// <returns></returns>
        public async Task<List<ItAcountAssetsDto>> GetModalAcountAssetsList(string userId, int assetsId)
        {
            string sql = "USP_ItAcountAssets_R04";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            Gparam.Add("@AssetsId", assetsId);

            var result = await _db.QueryAsync<ItAcountAssetsDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 아이템 NM LIST
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="assetsGb"></param>
        /// <returns></returns>
        public async Task<List<ItAcountAssetsDto>> GetModalAssetsNmList(string assetsGb)
        {
            string sql = "USP_ItAcountAssets_R05";

            var Gparam = new DynamicParameters();
            Gparam.Add("@AssetsGb", assetsGb);

            var result = await _db.QueryAsync<ItAcountAssetsDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 아이템 NM LIST
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<object>> GetHardwareNmList(string userId)
        {
            string sql = "USP_ItAcountAssets_R06";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<object>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 모달 아이템 리스트 Hardware
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="pAssetsId"></param>
        /// <param name="pItemId"></param>
        /// <param name="cAssetsId"></param>
        /// <returns></returns>
        public async Task<List<ItAcountAssetsToAssetsDto>> GetModalHardwareSoftwareList(string userId, int pAssetsId, int pItemId, int cAssetsId)
        {
            string sql = "USP_ItAcountAssets_R07";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            Gparam.Add("@PAssetsId", pAssetsId);
            Gparam.Add("@PItemId", pItemId);
            Gparam.Add("@CAssetsId", cAssetsId);

            var result = await _db.QueryAsync<ItAcountAssetsToAssetsDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 마스터 리스트 AssetsToAssets
        /// </summary>
        /// <returns></returns>
        public async Task<List<ItAcountAssetsToAssetsDto>> GetAcountAssetsToAssetsList(string userId, string assetsGb)
        {
            string sql = "USP_ItAcountAssets_R08";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            Gparam.Add("@AssetsGb", assetsGb);
            
            var result = await _db.QueryAsync<ItAcountAssetsToAssetsDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveModalItemData(ItAcountAssetsDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_ItAcountAssets_U01";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@UserId", model.UserId);
                        Gparam.Add("@AssetsId", model.AssetsId);
                        Gparam.Add("@ItemId", model.ItemId);
                        Gparam.Add("@AssetsGb", model.AssetsGb);
                        Gparam.Add("@UseItemCnt", model.UseItemCnt);
                        Gparam.Add("@ItemStatus", model.ItemStatus);
                        Gparam.Add("@Remark", model.Remark);
                        Gparam.Add("@RegId", model.RegId);
                        Gparam.Add("@UpdId", model.UpdId);
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
        /// Assets Item 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveAssetsItemData(ItAcountAssetsDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_ItAcountAssets_U01";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@UserId", model.UserId);
                        Gparam.Add("@AssetsId", model.AssetsId);
                        Gparam.Add("@ItemId", model.ItemId);
                        Gparam.Add("@AssetsGb", model.AssetsGb);
                        Gparam.Add("@UseItemCnt", model.UseItemCnt);
                        Gparam.Add("@ItemStatus", model.ItemStatus);
                        Gparam.Add("@Remark", model.Remark);
                        Gparam.Add("@RegId", model.RegId);
                        Gparam.Add("@UpdId", model.UpdId);
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
        /// 삭제
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteAssetsItemData(ItAcountAssetsDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_ItAcountAssets_U02";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@UserId", model.UserId);
                        Gparam.Add("@AssetsId", model.AssetsId);
                        Gparam.Add("@ItemId", model.ItemId);
                        
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
        /// 모달 저장 AssetsToAssets
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveModalAssetsToAssetsData(ItAcountAssetsToAssetsDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_ItAcountAssets_U03";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PAssetsId", model.PAssetsId);
                        Gparam.Add("@PItemId", model.PItemId);
                        Gparam.Add("@CAssetsId", model.CAssetsId);
                        Gparam.Add("@CItemId", model.CItemId);
                        Gparam.Add("@CUseItemCnt", model.CUseItemCnt);
                        Gparam.Add("@CRemark", model.CRemark);
                        Gparam.Add("@RegId", model.RegId);
                        Gparam.Add("@UpdId", model.UpdId);
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
        /// 모달 저장 AssetsToAssets
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveAssetsToAssetsItemData(ItAcountAssetsToAssetsDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_ItAcountAssets_U03";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@PAssetsId", model.PAssetsId);
                        Gparam.Add("@PItemId", model.PItemId);
                        Gparam.Add("@CAssetsId", model.CAssetsId);
                        Gparam.Add("@CItemId", model.CItemId);
                        Gparam.Add("@CUseItemCnt", model.CUseItemCnt);
                        Gparam.Add("@CRemark", model.CRemark);
                        Gparam.Add("@RegId", model.RegId);
                        Gparam.Add("@UpdId", model.UpdId);
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
        /// 모달 저장 AssetsToAssets
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveUserInfoData(ItAcountUserDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_ItAcountAssets_U04";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@UserId", model.UserId);
                    Gparam.Add("@IT_StatusCd", model.IT_StatusCd);
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


        #region QnA
        /// <summary>
        /// QnA 조회
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<ItAcountQnA> GetQnAData(string userId)
        {
            string sql = "USP_ItAcountAssets_R09";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<ItAcountQnA>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// QnA 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveQnAData(ItAcountQnA model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_ItAcountAssets_U05";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@QnAId", model.QnAId);
                    Gparam.Add("@QnADesc", model.QnADesc);
                    Gparam.Add("@StatusCd", model.StatusCd);
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

        #region Excel
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<ItAcountUserDto>> GetAcountExcelUserList(string typeGb, string itStatusCd, int deptCd1, int deptCd2, int deptCd3)
        {
            string sql = "USP_ItAcountAssets_R10";

            var Gparam = new DynamicParameters();
            Gparam.Add("@TypeGb", typeGb);
            Gparam.Add("@ItStatusCd", itStatusCd);
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);

            var result = await _db.QueryAsync<ItAcountUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Excel 조회
        /// </summary>
        /// <returns></returns>
        public async Task<ExcelDownloadGroupDto> GetAcountExcelDownload(string typeGb, string strUserId)
        {
            ExcelDownloadGroupDto excelDownloadGroupDto = new ExcelDownloadGroupDto();

            string sql = "USP_ItAcountAssets_Excel_R01";
            var Gparam = new DynamicParameters();

            Gparam.Add("@TypeGb", typeGb);
            Gparam.Add("@UserId", strUserId);

            if (typeGb.Equals("A"))
            {
                var result = await _db.QueryAsync<ApplicationExcelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

                excelDownloadGroupDto.applicationExcelDtos = result.SingleOrDefault();
            }
            if (typeGb.Equals("S"))
            {
                var result = await _db.QueryAsync<SoftwareExcelDtos>(sql, Gparam, commandType: CommandType.StoredProcedure);

                excelDownloadGroupDto.softwareExcelDtos = result.SingleOrDefault();
            }
            if (typeGb.Equals("H"))
            {
                var result = await _db.QueryAsync<HardwareExcelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

                excelDownloadGroupDto.hardwareExcelDtos = result.SingleOrDefault();
            }
            if (typeGb.Equals("N"))
            {
                var result = await _db.QueryAsync<NetworkExcelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

                excelDownloadGroupDto.networkExcelDtos = result.SingleOrDefault();
            }

            return excelDownloadGroupDto;
        }
        #endregion

    }
}
