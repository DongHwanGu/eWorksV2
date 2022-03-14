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

namespace eWroks.Api.Models.CmRoleProgram
{
    public class CmRoleProgramRepository : ICmRoleProgramRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmRoleProgramRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmRoleProgramRepository));
        }

        /// <summary>
        /// Role 마스터 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmRoleDto>> GetRoleList()
        {
            string sql = "USP_CmRoleProgram_R01";

            var result = await _db.QueryAsync<CmRoleDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Role Program 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmRoleProgramDto>> GetRoleProgramList(string roleId)
        {
            string sql = "USP_CmRoleProgram_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@RoleId", roleId);

            var result = await _db.QueryAsync<CmRoleProgramDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            var newResult = result.ToList();

            if (newResult.Count() > 0)
            {
                var parentResult = newResult.Where(r => r.ProgramLevel.Equals(0)).Select(r => r).ToList();
                var childResult = newResult.Where(r => !r.ProgramLevel.Equals(0)).Select(r => r).ToList();

                var sortResult = new List<CmRoleProgramDto>();

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
        /// Role Program 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmRoleProgramDto>> GetModalRoleProgramList(string roleId)
        {
            string sql = "USP_CmRoleProgram_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@RoleId", roleId);

            var result = await _db.QueryAsync<CmRoleProgramDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            var newResult = result.ToList();

            //if (newResult.Count() > 0)
            //{
            //    var parentResult = newResult.Where(r => r.ProgramLevel.Equals(0)).Select(r => r).ToList();
            //    var childResult = newResult.Where(r => !r.ProgramLevel.Equals(0)).Select(r => r).ToList();

            //    var sortResult = new List<CmRoleProgramDto>();

            //    for (int i = 0; i < parentResult.Count(); i++)
            //    {
            //        sortResult.Add(parentResult[i]);

            //        for (int j = 0; j < childResult.Count(); j++)
            //        {
            //            if (parentResult[i].ProgramId == childResult[j].UpProgramId)
            //            {
            //                sortResult.Add(childResult[j]);
            //            }
            //        }
            //    }
            //    newResult = sortResult;
            //}

            return newResult;
        }

        /// <summary>
        /// Role 마스터 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveRoleData(CmRoleDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmRoleProgram_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@RoleId", model.RoleId);
                    Gparam.Add("@RoleNm", model.RoleNm);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@RoleDesc", model.RoleDesc);
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

        /// <summary>
        /// Role Program 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveRoleProgramData(CmRoleProgramDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_CmRoleProgram_U02";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@RoleId", model.RoleId);
                        Gparam.Add("@ProgramId", model.ProgramId);
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
        /// Role Program delete
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteRoleProgramData(CmRoleProgramDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_CmRoleProgram_U03";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@RoleId", model.RoleId);
                        Gparam.Add("@ProgramId", model.ProgramId);
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
