using Dapper;
using eWroks.Api.Models.CmNotice;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmMain
{
    public class CmMainRepository : ICmMainRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmMainRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmMainRepository));
        }

        /// <summary>
        /// 메인 공지사항
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmMainNoticeDto>> GetMainNoticeList(string userId)
        {
            string sql = "USP_CmMain_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            //Gparam.Add("@sEndDt", sEndDt);
            //Gparam.Add("@sStatusCd", sStatusCd);

            var result = await _db.QueryAsync<CmMainNoticeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 메인 승인
        /// </summary>
        /// <returns></returns>
        public async Task<CmMainApprovalData> GetMainApprovalData(string userId)
        {
            string sql = "USP_CmMain_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            //Gparam.Add("@sEndDt", sEndDt);
            //Gparam.Add("@sStatusCd", sStatusCd);

            var result = await _db.QueryAsync<CmMainApprovalData>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }


    }
}
