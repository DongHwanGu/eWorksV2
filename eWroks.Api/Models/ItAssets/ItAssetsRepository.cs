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

namespace eWroks.Api.Models.ItAssets
{
    public class ItAssetsRepository : IItAssetsRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public ItAssetsRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(ItAssetsRepository));
        }

        
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<ItAsstesDto>> GetAssetsList(string assetsGb)
        {
            string sql = "USP_ItAssets_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@AssetsGb", assetsGb);


            var result = await _db.QueryAsync<ItAsstesDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 마스터 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveAssetsData(ItAsstesDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_ItAssets_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@AssetsId", model.AssetsId);
                    Gparam.Add("@AssetsGb", model.AssetsGb);
                    Gparam.Add("@AssetsNm", model.AssetsNm);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@Remark", model.Remark);
                    Gparam.Add("@CdRef1", model.CdRef1);
                    Gparam.Add("@CdRef2", model.CdRef2);
                    Gparam.Add("@CdRef3", model.CdRef3);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
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
        /// 아이템리스트
        /// </summary>
        /// <param name="assetsId"></param>
        /// <returns></returns>
        public async Task<List<ItAsstesItemDto>> GetAssetsItemList(int assetsId)
        {
            string sql = "USP_ItAssets_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@AssetsId", assetsId);


            var result = await _db.QueryAsync<ItAsstesItemDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Item 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveAssetsItemData(ItAsstesItemDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_ItAssets_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@AssetsId", model.AssetsId);
                    Gparam.Add("@ItemId", model.ItemId);
                    Gparam.Add("@ItemNm", model.ItemNm);
                    Gparam.Add("@ItemCnt", model.ItemCnt);
                    Gparam.Add("@PurchaseDt", model.PurchaseDt);
                    Gparam.Add("@ControlNo", model.ControlNo);
                    Gparam.Add("@Manufacture", model.Manufacture);
                    Gparam.Add("@SerialNo", model.SerialNo);
                    Gparam.Add("@ReplaceDt", model.ReplaceDt);
                    Gparam.Add("@BusinessLine", model.BusinessLine);
                    Gparam.Add("@HostNm", model.HostNm);
                    Gparam.Add("@DisposalDt", model.DisposalDt);
                    Gparam.Add("@StockYn", model.StockYn);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@Remark", model.Remark);
                    Gparam.Add("@CdRef1", model.CdRef1);
                    Gparam.Add("@CdRef2", model.CdRef2);
                    Gparam.Add("@CdRef3", model.CdRef3);
                    Gparam.Add("@CdRef4", model.CdRef4);
                    Gparam.Add("@CdRef5", model.CdRef5);
                    Gparam.Add("@CdRef6", model.CdRef6);
                    Gparam.Add("@CdRef7", model.CdRef7);
                    Gparam.Add("@CdRef8", model.CdRef8);
                    Gparam.Add("@CdRef9", model.CdRef9);
                    Gparam.Add("@CdRef10", model.CdRef10);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
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
    }
}
