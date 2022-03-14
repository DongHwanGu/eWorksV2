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

namespace eWroks.Api.Models.CmDept
{
    public class CmDeptRepository : ICmDeptRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmDeptRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmDeptRepository));
        }
        /// <summary>
        /// Dept 1
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmDeptDto>> GetDeptMasterList()
        {
            string sql = "USP_CmDept_R01";

            var result = await _db.QueryAsync<CmDeptDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// Dept 2 3 4
        /// </summary>
        /// <param name="deptId"></param>
        /// <returns></returns>
        public async Task<List<CmDeptDto>> GetDeptSubList(int deptId)
        {
            string sql = "USP_CmDept_R02";
            
            var Gparam = new DynamicParameters();
            Gparam.Add("@DeptId", deptId);

            var result = await _db.QueryAsync<CmDeptDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Options
        /// </summary>
        /// <param name="deptId"></param>
        /// <returns></returns>
        public async Task<List<CmDeptDto>> GetDeptOptions(int deptId)
        {
            string sql = "USP_CmDept_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@DeptId", deptId);

            var result = await _db.QueryAsync<CmDeptDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Dept 저장
        /// </summary>
        /// <param name="model"></param>
        /// <param name="deptCd1"></param>
        /// <param name="deptCd2"></param>
        /// <param name="deptCd3"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveDeptData(CmDeptDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmDept_U01";

                    model.UpDeptId = 0;
                    model.DeptLevel = 1;

                    if (model.DeptCd1 > 0 && model.DeptCd2 == 0 && model.DeptCd3 == 0)
                    {
                        model.UpDeptId = model.DeptCd1;
                        model.DeptLevel = 2;
                    }
                    if (model.DeptCd1 > 0 && model.DeptCd2 > 0 && model.DeptCd3 == 0)
                    {
                        model.UpDeptId = model.DeptCd2;
                        model.DeptLevel = 3;
                    }
                    if (model.DeptCd1 > 0 && model.DeptCd2 > 0 && model.DeptCd3 > 0)
                    {
                        model.UpDeptId = model.DeptCd3;
                        model.DeptLevel = 4;
                    }

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@DeptId", model.DeptId);
                    Gparam.Add("@DeptNm", model.DeptNm);
                    Gparam.Add("@UpDeptId", model.UpDeptId);
                    Gparam.Add("@DispSeq", model.DispSeq);
                    Gparam.Add("@DeptLevel", model.DeptLevel);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@DeptRef1", model.DeptRef1);
                    Gparam.Add("@DeptRef2", model.DeptRef2);
                    Gparam.Add("@DeptRef3", model.DeptRef3);
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
