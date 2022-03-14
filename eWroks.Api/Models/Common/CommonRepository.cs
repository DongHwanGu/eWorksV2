using Dapper;
using eWroks.Api.Models.CmCode;
using eWroks.Api.Models.CmProgram;
using eWroks.Api.Models.CmRoleProgram;
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

namespace eWroks.Api.Models.Common
{
    public class CommonRepository : ICommonRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        /// <summary>
        /// 생성자
        /// </summary>
        /// <param name="loggerFactory"></param>
        public CommonRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmUserRepository));
        }

        /// <summary>
        /// 옵션 가져오기 공통
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<CmCodeDto>> GetCodeOpions(string cdMajor, string userId)
        {
            string sql = "USP_Common_GetCodeText";

            var Gparam = new DynamicParameters();
            Gparam.Add("@CdMajor", cdMajor);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmCodeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 로그인 로그 가져오기
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public async Task<List<CmLoginLogDto>> GetLoginLogList(string startDt, string endDt)
        {
            string sql = "USP_Common_GetLoginLog";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);

            var result = await _db.QueryAsync<CmLoginLogDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 프로그램 가져오기
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public async Task<List<CmRoleProgramDto>> GetProgramList(string roleId)
        {
            string sql = "USP_Common_GetProgramList";

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
        /// 설정 승인자 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="approvalGb"></param>
        /// <param name="approvalCd"></param>
        /// <returns></returns>
        public async Task<List<CmApprovalUserDto>> GetApprovalUserList(string userId, string approvalGb, string approvalCd)
        {
            string sql = "USP_Common_GetApprovalUserList";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            Gparam.Add("@ApprovalGb", approvalGb);
            Gparam.Add("@ApprovalCd", approvalCd);

            var result = await _db.QueryAsync<CmApprovalUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        #region 대리자
        /// <summary>
        /// 대리자 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="approvalGb"></param>
        /// <param name="approvalCd"></param>
        /// <returns></returns>
        public async Task<List<CmUserDelegateApproval>> GetDelegateList(string userId)
        {
            string sql = "USP_Common_GetDelegateList";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmUserDelegateApproval>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 대리자 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveDelegateData(CmUserDelegateApproval model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Common_SaveDelegateData";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@DeleId", model.DeleId);
                    Gparam.Add("@UserId", model.UserId);
                    Gparam.Add("@DeleApprUserId", model.DeleApprUserId);
                    Gparam.Add("@DeleReason", model.DeleReason);
                    Gparam.Add("@StartDt", model.StartDt);
                    Gparam.Add("@EndDt", model.EndDt);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
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
        /// 대리자 삭제
        /// </summary>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteDelegateData(int deleId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Common_DeleteDelegateData";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@DeleId", deleId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();
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

        #region 디렉토리
        /// <summary>
        /// 디렉토리 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="approvalGb"></param>
        /// <param name="approvalCd"></param>
        /// <returns></returns>
        public async Task<CmDirectoryGroupDto> GetDirectoryList(string userId)
        {
            CmDirectoryGroupDto groupDto = new CmDirectoryGroupDto();


            // 부서 조회
            string sql = "USP_Common_GetDirectoryDeptList";
            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result1 = await _db.QueryAsync<CmDirectoryDeptDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.DeptDtos = result1.ToList();


            // 유저 조회
            sql = "USP_Common_GetDirectoryUserList";
            
            var result5 = await _db.QueryAsync<CmDirectoryUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.UserDtos = result5.ToList();

            return groupDto;
        }
        #endregion

        #region 휴일 카운트
        /// <summary>
        /// 로그인 로그 가져오기
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public async Task<CmHolidayCnt> GetHolidayCnt(string startDt, string endDt)
        {
            string sql = "UPS_Common_GetReturnHoliday";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);

            var result = await _db.QueryAsync<CmHolidayCnt>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        #endregion
    }
}
