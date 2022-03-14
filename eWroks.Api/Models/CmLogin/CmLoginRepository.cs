using Dapper;
using eWroks.Api.Models.CmUser;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.CmLogin
{
    public class CmLoginRepository : ICmLoginRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        /// <summary>
        /// 생성자
        /// </summary>
        /// <param name="loggerFactory"></param>
        public CmLoginRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmUserRepository));
        }

        public async Task<CmUserDto> GetUserInfo(string loginId, string loginPassword, string userId)
        {
            string sql = "USP_CmLoginInfo_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@LoginId", loginId);
            Gparam.Add("@LoginPassword", loginPassword);
            Gparam.Add("@UserId", userId);
            //Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output);
            //Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output);
            //int ov_rtn_code = Gparam.Get<int>("@OV_RTN_CODE");
            //string ov_rtn_msg = Gparam.Get<string>("@OV_RTN_MSG");

            var result = await _db.QueryAsync<CmUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            if (result.Count() > 0)
            {
                try
                {
                    var resultSave = SaveLoginLog(result.SingleOrDefault());
                }
                catch (Exception)
                {
                }
            }

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 로그인정보 저장
        /// </summary>
        /// <param name="cmUserDto"></param>
        private async Task<eWorksResult> SaveLoginLog(CmUserDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_CmLoginInfo_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@UserId", model.UserId);
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
