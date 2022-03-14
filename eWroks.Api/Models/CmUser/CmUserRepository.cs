using Dapper;
using eWroks.Api.Models.CmCode;
using eWroks.Api.Models.CmDept;
using eWroks.Api.Models.CmRoleProgram;
using eWroks.Api.Models.CmVendor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.CmUser
{
    public class CmUserRepository : ICmUserRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        /// <summary>
        /// 생성자
        /// </summary>
        /// <param name="loggerFactory"></param>
        public CmUserRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmUserRepository));
        }

        /// <summary>
        /// 유저가져오기
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public async Task<List<CmUserDto>> GetUserList(string it_status_cd, string hr_status_cd)
        {
            string sql = "USP_CmUser_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@IT_StatusCd", it_status_cd);
            Gparam.Add("@HR_StatusCd", hr_status_cd);


            var result = await _db.QueryAsync<CmUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 유저 상세
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<CmUserGroupDto> GetUserDetailData(string userId)
        {
            CmUserGroupDto CmUserGroupDto = new CmUserGroupDto();


            // [1] User
            string sql = "USP_CmUser_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            CmUserGroupDto.CmUserDto = result.SingleOrDefault();

            // [2] Moves
            sql = "USP_CmUser_R07";

            var result2 = await _db.QueryAsync<CmUserDeptMoveDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            CmUserGroupDto.CmUserDeptMoveDtos = result2.ToList();


            return CmUserGroupDto;
        }

        /// <summary>
        /// RoleList
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public async Task<List<CmRoleDto>> GetRoleList()
        {
            string sql = "USP_CmUser_R03";

            var Gparam = new DynamicParameters();

            var result = await _db.QueryAsync<CmRoleDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Office List
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmVendorDto>> GetOfficeList()
        {
            string sql = "USP_CmUser_R04";

            var Gparam = new DynamicParameters();

            var result = await _db.QueryAsync<CmVendorDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Dept List
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmDeptDto>> GetDeptList(int deptId)
        {
            string sql = "USP_CmUser_R05";

            var Gparam = new DynamicParameters();
            Gparam.Add("@DeptId", deptId);

            var result = await _db.QueryAsync<CmDeptDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Duty List
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        public async Task<List<CmCodeDto>> GetDutyEngList(string cdMinor)
        {
            string sql = "USP_CmUser_R06";

            var Gparam = new DynamicParameters();
            Gparam.Add("@CdMinor", cdMinor);

            var result = await _db.QueryAsync<CmCodeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 유저가져오기
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public async Task<List<CmUserLeaveCnt>> GetLeaveCntList(string userId)
        {
            string sql = "USP_CmUser_R08";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmUserLeaveCnt>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 휴가내역 상세
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public async Task<List<CmUserLeaveCntItem>> GetLeaveCntItemList(string userId, string leaveYear)
        {
            string sql = "USP_CmUser_R09";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);
            Gparam.Add("@LeaveYear", leaveYear);

            var result = await _db.QueryAsync<CmUserLeaveCntItem>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveUserMgmtData(CmUserGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmUser_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@UserId", model.CmUserDto.UserId);
                    Gparam.Add("@UserNm", model.CmUserDto.UserNm);
                    Gparam.Add("@UserEnm", model.CmUserDto.UserEnm);
                    Gparam.Add("@LoginId", model.CmUserDto.LoginId);
                    Gparam.Add("@LoginPassword", string.IsNullOrWhiteSpace(model.CmUserDto.LoginPassword) ? "" : eWorksFunction.GetHashCode(model.CmUserDto.LoginPassword));
                    Gparam.Add("@WorkerId", model.CmUserDto.WorkerId);
                    Gparam.Add("@Email", model.CmUserDto.Email);
                    Gparam.Add("@Tel", model.CmUserDto.Tel);
                    Gparam.Add("@MobileTel", model.CmUserDto.MobileTel);
                    Gparam.Add("@EnterDt", model.CmUserDto.EnterDt);
                    Gparam.Add("@EntireDt", model.CmUserDto.EntireDt);
                    Gparam.Add("@EntireGb", model.CmUserDto.EntireGb);
                    Gparam.Add("@UserGb", model.CmUserDto.UserGb);
                    Gparam.Add("@DeptCd1", model.CmUserDto.DeptCd1);
                    Gparam.Add("@DeptCd2", model.CmUserDto.DeptCd2);
                    Gparam.Add("@DeptCd3", model.CmUserDto.DeptCd3);
                    Gparam.Add("@DeptCd4", model.CmUserDto.DeptCd4);
                    Gparam.Add("@DeptCdKor", model.CmUserDto.DeptCdKor);
                    Gparam.Add("@DutyCdKor", model.CmUserDto.DutyCdKor);
                    Gparam.Add("@DutyCdEng", model.CmUserDto.DutyCdEng);
                    Gparam.Add("@PreLeaveCnt", model.CmUserDto.PreLeaveCnt);
                    Gparam.Add("@OrgLeaveCnt", model.CmUserDto.OrgLeaveCnt);
                    Gparam.Add("@UserPic", model.CmUserDto.UserPic);
                    Gparam.Add("@BirthDay", model.CmUserDto.BirthDay);
                    Gparam.Add("@AddressKor", model.CmUserDto.AddressKor);
                    Gparam.Add("@GenderGb", model.CmUserDto.GenderGb);
                    Gparam.Add("@CtsTypeId", model.CmUserDto.CtsTypeId);
                    Gparam.Add("@MasYn", model.CmUserDto.MasYn);
                    Gparam.Add("@ExtNum", model.CmUserDto.ExtNum);
                    Gparam.Add("@IT_StatusCd", model.CmUserDto.IT_StatusCd);
                    Gparam.Add("@HR_StatusCd", model.CmUserDto.HR_StatusCd);
                    Gparam.Add("@HR_Remark", model.CmUserDto.HR_Remark);
                    Gparam.Add("@Remark", model.CmUserDto.Remark);
                    Gparam.Add("@RoleId", model.CmUserDto.RoleId);
                    Gparam.Add("@OfficeId", model.CmUserDto.OfficeId);
                    Gparam.Add("@CertiTitleGb", model.CmUserDto.CertiTitleGb);


                    Gparam.Add("@RegId", model.CmUserDto.RegId);
                    Gparam.Add("@UpdId", model.CmUserDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    string userId = result.OV_RTN_MSG;

                    //[2] Move 저장
                    for (int i = 0; i < model.CmUserDeptMoveDtos.Count; i++)
                    {
                        var dr = model.CmUserDeptMoveDtos[i];

                        sql = "USP_CmUser_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@MoveId", dr.MoveId);
                        Gparam.Add("@UserId", dr.UserId);
                        Gparam.Add("@DeptCd1", dr.DeptCd1);
                        Gparam.Add("@DeptCd2", dr.DeptCd2);
                        Gparam.Add("@DeptCd3", dr.DeptCd3);
                        Gparam.Add("@DeptCd4", dr.DeptCd4);
                        Gparam.Add("@EnterDt", dr.EnterDt);
                        Gparam.Add("@EntireDt", dr.EntireDt);
                        Gparam.Add("@PreTmNm", dr.PreTmNm);
                        Gparam.Add("@UserGb", dr.UserGb);
                        Gparam.Add("@DutyCdKor", dr.DutyCdKor);
                        Gparam.Add("@DeptCdKor", dr.DeptCdKor);
                        Gparam.Add("@Remark", dr.Remark);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

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
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="cdMinor"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveModalLeaveCnt(CmUserLeaveCnt model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmUser_U03";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@UserId", model.UserId);
                    Gparam.Add("@LeaveYear", model.LeaveYear);
                    Gparam.Add("@OrgLeaveCnt", model.OrgLeaveCnt);
                    Gparam.Add("@PreLeaveCnt", model.PreLeaveCnt);
                    Gparam.Add("@OrgCompLeaveCnt", model.OrgCompLeaveCnt);
                    Gparam.Add("@PreCompLeaveCnt", model.PreCompLeaveCnt);
                    Gparam.Add("@Remark", model.Remark);
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


        #region 출퇴근 관리
        /// <summary>
        /// 유저가져오기
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public async Task<CmUserCommuteBtnInfo> GetUserCommuteBtnInfo(string thisDt, string userId)
        {
            string sql = "USP_CmUser_R10";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ThisDt", thisDt);
            Gparam.Add("@UserId", userId);


            var result = await _db.QueryAsync<CmUserCommuteBtnInfo>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 출퇴근 토탈리스트
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public async Task<List<CmUserCommuteTotalDto>> GetUserCommuteList(string thisDt, string userId)
        {
            string sql = "USP_CmUser_R11";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ThisDt", thisDt);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmUserCommuteTotalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="cdMinor"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveUserCommuteData(string btnGb, string comStartDt, string outStartDt, string lat, string lng, string addrName, string remark, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmUser_U04";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@BtnGb", btnGb);
                    Gparam.Add("@ComStartDt", comStartDt);
                    Gparam.Add("@OutStartDt", outStartDt);
                    Gparam.Add("@Lat", lat);
                    Gparam.Add("@Lng", lng);
                    Gparam.Add("@AddrName", addrName);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@RegId", userId);
                    Gparam.Add("@UegId", userId);
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
        #endregion

    }
}
