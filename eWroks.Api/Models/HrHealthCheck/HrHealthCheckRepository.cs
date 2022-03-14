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

namespace eWroks.Api.Models.HrHealthCheck
{
    public class HrHealthCheckRepository: IHrHealthCheckRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public HrHealthCheckRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(HrHealthCheckRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrHealthCheckDto>> GetHrHealCheckList(string startDt, string endDt, string userId)
        {
            string sql = "USP_HrHealthCheck_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrHealthCheckDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<HrHealthCheckGroupDto> GetHrHealthCheckDetail(int HealthId)
        {
            HrHealthCheckGroupDto hrHealthCheckGroupDto = new HrHealthCheckGroupDto();

            string sql = "USP_HrHealthCheck_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@HealthId", HealthId);

            // [1]
            var result = await _db.QueryAsync<HrHealthCheckDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            hrHealthCheckGroupDto.HrHealthCheckDto = result.SingleOrDefault();

            sql = "USP_HrHealthCheck_R03";

            // [2]
            var result2 = await _db.QueryAsync<HrHealthCheckItemDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            hrHealthCheckGroupDto.HrHealthCheckItemDtos = result2.ToList();

            return hrHealthCheckGroupDto;
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveHealthCheck(HrHealthCheckGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrHealthCheck_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@HealthId", model.HrHealthCheckDto.HealthId);
                    Gparam.Add("@RegisterDt", model.HrHealthCheckDto.RegisterDt);
                    Gparam.Add("@AgreeYn", model.HrHealthCheckDto.AgreeYn);
                    Gparam.Add("@TemperatureVal", model.HrHealthCheckDto.TemperatureVal);
                    Gparam.Add("@ConfirmerContactCd", model.HrHealthCheckDto.ConfirmerContactCd);
                    Gparam.Add("@ConfirmerContactReason", model.HrHealthCheckDto.ConfirmerContactReason);
                    Gparam.Add("@InfectedCd", model.HrHealthCheckDto.InfectedCd);
                    Gparam.Add("@ETCReason", model.HrHealthCheckDto.ETCReason);

                    Gparam.Add("@RegId", model.HrHealthCheckDto.RegId);
                    Gparam.Add("@UpdId", model.HrHealthCheckDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] 시간 저장
                    for (int i = 0; i < model.HrHealthCheckItemDtos.Count; i++)
                    {
                        var dr = model.HrHealthCheckItemDtos[i];

                        sql = "USP_HrHealthCheck_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@HealthId", id);
                        Gparam.Add("@ItemId", dr.ItemId);
                        Gparam.Add("@ItemType", dr.ItemType);
                        Gparam.Add("@ItemCd", dr.ItemCd);
                        Gparam.Add("@ItemDtlCd", dr.ItemDtlCd);
                        Gparam.Add("@ItemDtlReason", dr.ItemDtlReason);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }


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

        #region Response
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrHealthCheckDto>> GetResponseHrHealCheckList(string startDt, string surveyYn, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            string sql = "USP_Response_HrHealthCheck_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@SurveyYn", surveyYn);
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrHealthCheckDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 통계 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrHealthCheckDashboardDto>> GetResponseHrHealCheckDashboardList(string startDt, string endDt, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            string sql = "USP_Response_HrHealthCheck_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrHealthCheckDashboardDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 유저리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrHealthCheckDto>> GetModalUserList(string clickDt, decimal clickVal, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            string sql = "USP_Response_HrHealthCheck_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ClickDt", clickDt);
            Gparam.Add("@ClickVal", clickVal);
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrHealthCheckDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 유저리스트
        /// </summary>
        /// <returns></returns>
        public async Task<HrHealthCheckDto> GetResponseHrHealCheckExcelList(string clickDt, string userId)
        {
            string sql = "USP_Response_HrHealthCheck_R04";

            var Gparam = new DynamicParameters();

            Gparam.Add("@ClickDt", clickDt);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrHealthCheckDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }
        #endregion

    }
}
