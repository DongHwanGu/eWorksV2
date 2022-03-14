using Dapper;
using eWroks.Api.Models.CmDept;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.CbSchedule
{
    public class CbScheduleRepository: ICbScheduleRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CbScheduleRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CbScheduleRepository));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbScheduleDto>> GetScheduleList(string sStartDt, string sEndDt, string sTeamCd, string sStatusCd, string inCludeYn, string userId)
        {
            string sql = "USP_CbSchedule_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", sStartDt);
            Gparam.Add("@EndDt", sEndDt);
            Gparam.Add("@TeamCd", sTeamCd);
            Gparam.Add("@StatusCd", sStatusCd);
            Gparam.Add("@InCludeYn", inCludeYn);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbScheduleDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 마스터 상세
        /// </summary>
        /// <returns></returns>
        public async Task<CbScheduleDto> GetScheduleDetail(int schId)
        {
            string sql = "USP_CbSchedule_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@SchId", schId);

            var result = await _db.QueryAsync<CbScheduleDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// PIC 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<PICUserDto>> GetPICUserList(string date, string userId)
        {
            string sql = "USP_CbSchedule_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@Date", date);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<PICUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Dept3 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmDeptDto>> GetDept3List(string userId)
        {
            string sql = "USP_CbSchedule_R04";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmDeptDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 통계 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbScheduleDto>> GetScheduleStatisticsList(string sStartDt, string sEndDt, string sTeamCd, string sStatusCd, string inCludeYn, int deptCd3, string userId)
        {
            string sql = "USP_CbSchedule_R05";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", sStartDt);
            Gparam.Add("@EndDt", sEndDt);
            Gparam.Add("@TeamCd", sTeamCd);
            Gparam.Add("@StatusCd", sStatusCd);
            Gparam.Add("@InCludeYn", inCludeYn);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbScheduleDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveCbScheduleData(CbScheduleDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_CbSchedule_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@SchId", model.SchId);
                    Gparam.Add("@StatusCd", model.StatusCd);
                    Gparam.Add("@WorkingDt", model.WorkingDt);
                    Gparam.Add("@TeamCd", model.TeamCd);
                    Gparam.Add("@Terminal", model.Terminal);
                    Gparam.Add("@Vessel", model.Vessel);
                    Gparam.Add("@Customer", model.Customer);
                    Gparam.Add("@Product", model.Product);
                    Gparam.Add("@ETADt", model.ETADt);
                    Gparam.Add("@ETATime", model.ETATime);
                    Gparam.Add("@ETBDt", model.ETBDt);
                    Gparam.Add("@ETBTime", model.ETBTime);
                    Gparam.Add("@ETCDt", model.ETCDt);
                    Gparam.Add("@ETCTime", model.ETCTime);
                    Gparam.Add("@PIC", model.PIC);
                    Gparam.Add("@PICTime", model.PICTime);
                    Gparam.Add("@PIC2", model.PIC2);
                    Gparam.Add("@OPS", model.OPS);
                    Gparam.Add("@BL", model.BL);
                    Gparam.Add("@VesselYn", model.VesselYn);
                    Gparam.Add("@LineYn", model.LineYn);
                    Gparam.Add("@OneStFootYn", model.OneStFootYn);
                    Gparam.Add("@ShoreYn", model.ShoreYn);
                    Gparam.Add("@WWTYn", model.WWTYn);
                    Gparam.Add("@Agent", model.Agent);
                    Gparam.Add("@Remark", model.Remark);
                    Gparam.Add("@FileNm", model.FileNm);
                    Gparam.Add("@FileUrl", model.FileUrl);
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
    }
}
