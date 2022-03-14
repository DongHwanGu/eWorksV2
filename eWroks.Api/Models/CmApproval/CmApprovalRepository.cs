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

namespace eWroks.Api.Models.CmApproval
{
    public class CmApprovalRepository : ICmApprovalRepository
    {
        private readonly IConfiguration _config;
        private readonly string _sqlConnectionString;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        /// <summary>
        /// 생성자
        /// </summary>
        /// <param name="config"></param>
        /// <param name="loggerFactory"></param>
        public CmApprovalRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _sqlConnectionString = _config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value;
            _db = new SqlConnection(_sqlConnectionString);
            _logger = loggerFactory.CreateLogger(nameof(CmApprovalRepository));
        }

        /// <summary>
        /// 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmApprovalDto>> GetApprovalUserList(int deptCd1
                                                                 , int deptCd2
                                                                 , int deptCd3
                                                                 , string approvalGb
                                                                 , string approvalCd
        ) {
            string sql = "USP_CmApproval_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@ApprovalGb", approvalGb);
            Gparam.Add("@ApprovalCd", approvalCd);

            var result = await _db.QueryAsync<CmApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 모달 유저 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmApprovalModalDto>> GetModalApprovalUserList(int deptCd1, int deptCd2, int deptCd3)
        {
            string sql = "USP_CmApproval_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);

            var result = await _db.QueryAsync<CmApprovalModalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveModalUserList(CmApprovalModalDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_CmApproval_U01";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@DeptCd1", model.SaveDeptCd1);
                        Gparam.Add("@DeptCd2", model.SaveDeptCd2);
                        Gparam.Add("@DeptCd3", model.SaveDeptCd3);
                        Gparam.Add("@ApprovalCd", model.SaveApprovalCd);
                        Gparam.Add("@ApprovalGb", model.SaveApprovalGb);
                        Gparam.Add("@UserId", model.UserId);
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
        /// 삭제
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteUserList(CmApprovalDto[] models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Length; i++)
                    {
                        string sql = "USP_CmApproval_U02";

                        var model = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@ApprovalId", model.ApprovalId);
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
