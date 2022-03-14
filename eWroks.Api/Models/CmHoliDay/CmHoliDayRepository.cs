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

namespace eWroks.Api.Models.CmHoliDay
{
    public class CmHoliDayRepository : ICmHoliDayRepository
    {

        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmHoliDayRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmHoliDayRepository));
        }


        /// <summary>
        /// 휴일 가져오기.
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmHoliDayDto>> GetHoliDayList()
        {
            string sql = "USP_CmHoliDay_R01";

            var result = await _db.QueryAsync<CmHoliDayDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveHoliDayData(CmHoliDayDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_CmHoliDay_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@HoliDt", model.Start);
                    Gparam.Add("@HoliType", model.CalendarId);
                    Gparam.Add("@HoliTitle", model.Title);
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
        /// 삭제
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteScheduleData(CmHoliDayDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_CmHoliDay_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@HoliDt", model.Start);
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
