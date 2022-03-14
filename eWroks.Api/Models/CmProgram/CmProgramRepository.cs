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

namespace eWroks.Api.Models.CmProgram
{
    public class CmProgramRepository : ICmProgramRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmProgramRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value); 
            _logger = loggerFactory.CreateLogger(nameof(CmProgramRepository));
        }
       
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmProgramDto>> GetProgramMasterList()
        {
            string sql = "USP_CmProgram_R01";

            var result = await _db.QueryAsync<CmProgramDto>(sql, null, commandType: CommandType.StoredProcedure);

            var newResult = result.ToList();

            if (newResult.Count() > 0)
            {
                var parentResult = newResult.Where(r => r.ProgramLevel.Equals(0)).Select(r => r).ToList();
                var childResult = newResult.Where(r => !r.ProgramLevel.Equals(0)).Select(r => r).ToList();

                var sortResult = new List<CmProgramDto>();

                for (int i = 0; i < parentResult.Count(); i++)
                {
                    sortResult.Add(parentResult[i]);

                    for (int j = 0; j < childResult.Count(); j++)
                    {
                        if (parentResult[i].ProgramId == childResult[j].UpProgramId)
                        {
                            sortResult.Add(childResult[j]);
                        }
                    }
                }
                newResult = sortResult;
            }

            return newResult;
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <param name="programId"></param>
        /// <returns></returns>
        public async Task<CmProgramDto> GetProgramDetailData(string programId)
        {
            string sql = "USP_CmProgram_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ProgramId", programId);

            var result = await _db.QueryAsync<CmProgramDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 상위 프로그램 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmProgramDto>> GetUpProgramIdOptions()
        {
            string sql = "USP_CmProgram_R03";

            var result = await _db.QueryAsync<CmProgramDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }




        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveProgramData(CmProgramDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmProgram_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@ProgramId", model.ProgramId);
                    Gparam.Add("@ProgramNm", model.ProgramNm);
                    Gparam.Add("@ProgramUrl", model.ProgramUrl);
                    Gparam.Add("@UpProgramId", model.UpProgramId);
                    Gparam.Add("@DispSeq", model.DispSeq);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@ProgramIcon", model.ProgramIcon);
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
