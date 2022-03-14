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

namespace eWroks.Api.Models.ItBackupRecord
{
    public class ItBackupRecordRepository : IItBackupRecordRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public ItBackupRecordRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(ItBackupRecordRepository));
        }

        /// <summary>
        /// 리스트 조회
        /// </summary>
        /// <param name="backupGb"></param>
        /// <param name="backupDt"></param>
        /// <returns></returns>
        public async Task<List<ItBackupRecordDto>> GetBackupRecordList(string backupGb, string backupDt)
        {
            string sql = "USP_ItBackupRecord_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@BackupGb", backupGb);
            Gparam.Add("@BackupDt", backupDt);

            var result = await _db.QueryAsync<ItBackupRecordDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 토탈
        /// </summary>
        /// <param name="backupGb"></param>
        /// <param name="backupDt"></param>
        /// <returns></returns>
        public async Task<ItBackupRecordTotalDto> GetBackupRecordTotalData(string backupGb, string backupDt)
        {
            string sql = "USP_ItBackupRecord_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@BackupGb", backupGb);
            Gparam.Add("@BackupDt", backupDt);

            var result = await _db.QueryAsync<ItBackupRecordTotalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveBackupRecord(ItBackupRecordDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_ItBackupRecord_U01";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@BackupGb", model.BackupGb);
                        Gparam.Add("@BackupDt", model.BackupDt);
                        Gparam.Add("@MonDay", model.MonDay);
                        Gparam.Add("@TuesDay", model.TuesDay);
                        Gparam.Add("@WednesDay", model.WednesDay);
                        Gparam.Add("@ThursDay", model.ThursDay);
                        Gparam.Add("@Weekly", model.Weekly);
                        Gparam.Add("@Monthly", model.Monthly);
                        Gparam.Add("@Yearly", model.Yearly);
                        Gparam.Add("@Cleaning", model.Cleaning );
                        Gparam.Add("@RemarkGb", model.RemarkGb);
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
    }
}
