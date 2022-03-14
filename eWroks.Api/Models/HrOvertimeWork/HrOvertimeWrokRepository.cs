using Dapper;
using eWroks.Api.Models.CmUser;
using eWroks.Api.Models.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.HrOvertimeWork
{
    public class HrOvertimeWrokRepository : IHrOvertimeWrokRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public HrOvertimeWrokRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(HrOvertimeWrokRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrOvertimeWorkDto>> GetOvertimeWorkList(string startDt, string endDt, string statusCd, string userId)
        {
            string sql = "USP_HrOvertimeWork_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@StatusCd", statusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <returns></returns>
        public async Task<HrOvertimeWorkGroupDto> GetOvertimeWorkDetail(int otId)
        {
            HrOvertimeWorkGroupDto _group = new HrOvertimeWorkGroupDto();
            
            var Gparam = new DynamicParameters();
            Gparam.Add("@OtId", otId);

            string sql = "USP_HrOvertimeWork_R02";
            var result = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            _group.HrOvertimeWorkDto = result.SingleOrDefault();

            sql = "USP_HrOvertimeWork_R03";
            var result2 = await _db.QueryAsync<HrOvertimeWorkDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            _group.HrOvertimeWorkDateDto = result2.SingleOrDefault();

            sql = "USP_HrOvertimeWork_R04";
            var result3 = await _db.QueryAsync<HrOvertimeWorkDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            _group.HrOvertimeWorkDateDtos = result3.ToList();

            sql = "USP_HrOvertimeWork_R05";
            var result4 = await _db.QueryAsync<HrOvertimeWorkApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            _group.HrOvertimeWorkApprovalDtos = result4.ToList();

            return _group;
        }

        /// <summary>
        /// 주 토탈
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetWeeklyTimeTotal(string startDt,string userId)
        {
            string sql = "USP_HrOvertimeWork_R07";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<string>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveOvertimeWork(HrOvertimeWorkGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrOvertimeWork_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", model.HrOvertimeWorkDto.OtId);
                    Gparam.Add("@Reason", model.HrOvertimeWorkDto.Reason);
                    Gparam.Add("@StatusCd", model.HrOvertimeWorkDto.StatusCd);
                    Gparam.Add("@Remark", model.HrOvertimeWorkDto.Remark);
                    Gparam.Add("@FileNm", model.HrOvertimeWorkDto.FileNm);
                    Gparam.Add("@FileUrl", model.HrOvertimeWorkDto.FileUrl);
                    Gparam.Add("@RegId", model.HrOvertimeWorkDto.RegId);
                    Gparam.Add("@UpdId", model.HrOvertimeWorkDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] 시간 저장
                    sql = "USP_HrOvertimeWork_U02";

                    Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", id);
                    Gparam.Add("@StatusCd", model.HrOvertimeWorkDateDto.StatusCd);
                    Gparam.Add("@StartDt", model.HrOvertimeWorkDateDto.StartDt);
                    Gparam.Add("@StartTime", model.HrOvertimeWorkDateDto.StartTime);
                    Gparam.Add("@EndDt", model.HrOvertimeWorkDateDto.EndDt);
                    Gparam.Add("@EndTime", model.HrOvertimeWorkDateDto.EndTime);
                    Gparam.Add("@RecogTime", model.HrOvertimeWorkDateDto.RecogTime);
                    Gparam.Add("@DinnerTime", model.HrOvertimeWorkDateDto.DinnerTime);
                    Gparam.Add("@RegId", model.HrOvertimeWorkDateDto.RegId);
                    Gparam.Add("@UpdId", model.HrOvertimeWorkDateDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 1단계 진행일때만 저장
                    if (!model.HrOvertimeWorkDto.StatusCd.Equals("05"))
                    {
                        //[3] 승인자 저장
                        for (int i = 0; i < model.HrOvertimeWorkApprovalDtos.Count; i++)
                        {
                            var dr = model.HrOvertimeWorkApprovalDtos[i];

                            sql = "USP_HrOvertimeWork_U03";

                            Gparam = new DynamicParameters();
                            Gparam.Add("@OtId", id);
                            Gparam.Add("@ApprId", dr.ApprId);
                            Gparam.Add("@ApprCd", dr.ApprCd);
                            Gparam.Add("@ApprUserId", dr.ApprUserId);
                            Gparam.Add("@StatusCd", dr.StatusCd);
                            Gparam.Add("@MailYn", dr.MailYn);
                            Gparam.Add("@DeleApprUserId", dr.DeleApprUserId);
                            Gparam.Add("@DeleReason", dr.DeleReason);
                            Gparam.Add("@Remark", dr.Remark);
                            Gparam.Add("@RegId", dr.RegId);
                            Gparam.Add("@UpdId", dr.UpdId);
                            Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                            Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                            var process3 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                            result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                            result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                            if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                        }
                    }

                    // [4] 승인요청
                    if (!model.HrOvertimeWorkDto.StatusCd.Equals("01"))
                    {
                        sql = "USP_HrOvertimeWork_U04";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@OtId", id);
                        Gparam.Add("@RegId", model.HrOvertimeWorkDto.RegId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process4 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                        // 커밋
                        scope.Complete();
                        // Note - 트렌젝션을 닫는다.
                        if (scope != null) scope.Dispose();

                        // 메일전송
                        Gparam = new DynamicParameters();
                        Gparam.Add("@OtId", id);
                        Gparam.Add("@RegId", model.HrOvertimeWorkDto.RegId);

                        SendMail(Gparam);
                    }
                    else
                    {
                        // 커밋
                        scope.Complete();
                    }
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
        /// 메일 전송
        /// </summary>
        /// <param name="gparam"></param>
        private async void SendMail(DynamicParameters Gparam)
        {
            try
            {
                var sql = "USP_HrOvertimeWork_R06";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr);
                    string mailBody = MailReplace(dr.MailBody, dr);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , ""
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "07";
                    string mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);
                }
            }
            catch (Exception ex)
            {
            }
        }
        #endregion

        #region Tasking

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrOvertimeWorkDto>> GetTaskingOvertimeWorkOneList(string userId)
        {
            string sql = "USP_Tasking_HrOvertimeWork_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrOvertimeWorkDto>> GetTaskingOvertimeWorkTwoList(string userId)
        {
            string sql = "USP_Tasking_HrOvertimeWork_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
        /// <summary>
        /// 승인내역  리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrOvertimeWorkDto>> GetTaskingOvertimeWorkApprovedList(string startDt, string endDt, string userId)
        {
            string sql = "USP_Tasking_HrOvertimeWork_R05";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 승인내역  리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrOvertimeWorkStatisticsDto>> GetTaskingOvertimeWorkStatistics(string startDt, string endDt, string useOvertimeYn, string hrStatusCd
            , int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            string sql = "USP_Tasking_HrOvertimeWork_R06";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@UseOvertimeYn", useOvertimeYn);
            Gparam.Add("@HrStatusCd", hrStatusCd);
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrOvertimeWorkStatisticsDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingOvertimeWork(int otId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Tasking_HrOvertimeWork_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", otId);
                    Gparam.Add("@ApprId", apprId);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@StatusCd", statusCd);
                    Gparam.Add("@UpdId", updId);
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

                    // 메일전송
                    if (!string.IsNullOrEmpty(result.OV_RTN_MSG))
                    {
                        SendMailTaskingOvertime(otId, updId, remark, result.OV_RTN_MSG);
                    }
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
        /// Tasking 메일 전송
        /// </summary>
        /// <param name="travelId"></param>
        /// <param name="updId"></param>
        /// <param name="oV_RTN_MSG"></param>
        private async void SendMailTaskingOvertime(int otId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@OtId", otId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Tasking_HrOvertimeWork_R02";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr, remark);
                    string mailBody = MailReplace(dr.MailBody, dr, remark);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , dr.EmailCCList == null ? "" : dr.EmailCCList
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "07";
                    string mailCd = "";
                    if (apprCd == "99") mailCd = "A2";
                    else if (apprCd == "10" || apprCd == "05") mailCd = "A3";
                    else mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);

                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingOvertimeWorkTwo(int otId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Tasking_HrOvertimeWork_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", otId);
                    Gparam.Add("@ApprId", apprId);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@StatusCd", statusCd);
                    Gparam.Add("@UpdId", updId);
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

                    // 메일전송
                    if (!string.IsNullOrEmpty(result.OV_RTN_MSG))
                    {
                        SendMailTaskingOvertimeTwo(otId, updId, remark, result.OV_RTN_MSG);
                    }
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
        /// Tasking 메일 전송
        /// </summary>
        /// <param name="travelId"></param>
        /// <param name="updId"></param>
        /// <param name="oV_RTN_MSG"></param>
        private async void SendMailTaskingOvertimeTwo(int otId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@OtId", otId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Tasking_HrOvertimeWork_R04";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr, remark);
                    string mailBody = MailReplace(dr.MailBody, dr, remark);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , dr.EmailCCList == null ? "" : dr.EmailCCList
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "07";
                    string mailCd = "";
                    if (apprCd == "99") mailCd = "A2";
                    else if (apprCd == "10") mailCd = "A3";
                    else mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);

                }
            }
            catch (Exception ex)
            {
            }
        }
        #endregion

        #region Response
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrOvertimeWorkDto>> GetResponseOvertimeWorkList(string startDt, string endDt, string statusCd, string userId)
        {
            string sql = "USP_Response_HrOvertimeWork_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@StatusCd", statusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
        /// <summary>
        /// Excel 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<HrOvertimeWorkExcelDto> GetResponseOvertimeWorkExcelList(int otId)
        {
            string sql = "USP_Response_HrOvertimeWork_R04";

            var Gparam = new DynamicParameters();
            Gparam.Add("@OtId", otId);

            var result = await _db.QueryAsync<HrOvertimeWorkExcelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// HR 리스트 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseOvertimeWorkList(List<HrOvertimeWorkHrSaveParamDto> models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    for (int i = 0; i < models.Count; i++)
                    {
                        HrOvertimeWorkGroupDto model = new HrOvertimeWorkGroupDto();

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@OtId", models[i].OtId);

                        string sql = "USP_HrOvertimeWork_R02";
                        var getResult = await _db.QueryAsync<HrOvertimeWorkDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                        model.HrOvertimeWorkDto = getResult.SingleOrDefault();

                        sql = "USP_HrOvertimeWork_R03";
                        var getResult2 = await _db.QueryAsync<HrOvertimeWorkDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                        model.HrOvertimeWorkDateDto = getResult2.SingleOrDefault();

                        // [1] 마스터 저장
                        sql = "USP_Response_HrOvertimeWork_U01";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@OtId", models[i].OtId);
                        Gparam.Add("@Reason", model.HrOvertimeWorkDto.Reason);
                        Gparam.Add("@StatusCd", models[i].StatusCd);
                        Gparam.Add("@Remark", models[i].Remark);
                        Gparam.Add("@FileNm", model.HrOvertimeWorkDto.FileNm);
                        Gparam.Add("@FileUrl", model.HrOvertimeWorkDto.FileUrl);
                        Gparam.Add("@RegId", model.HrOvertimeWorkDto.RegId);
                        Gparam.Add("@UpdId", models[i].UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                        int id = Convert.ToInt32(result.OV_RTN_MSG);

                        // 승인 일때만 시간저장
                        if (models[i].StatusCd.Equals("10"))
                        {
                            //[2] 시간 저장
                            sql = "USP_Response_HrOvertimeWork_U02";

                            Gparam = new DynamicParameters();
                            Gparam.Add("@OtId", id);
                            Gparam.Add("@StatusCd", model.HrOvertimeWorkDateDto.StatusCd);
                            Gparam.Add("@StartDt", model.HrOvertimeWorkDateDto.StartDt.Replace("-", ""));
                            Gparam.Add("@StartTime", model.HrOvertimeWorkDateDto.StartTime);
                            Gparam.Add("@EndDt", model.HrOvertimeWorkDateDto.EndDt.Replace("-", ""));
                            Gparam.Add("@EndTime", model.HrOvertimeWorkDateDto.EndTime);
                            Gparam.Add("@RecogTime", model.HrOvertimeWorkDateDto.RecogTime);
                            Gparam.Add("@DinnerTime", model.HrOvertimeWorkDateDto.DinnerTime);
                            Gparam.Add("@RegId", model.HrOvertimeWorkDateDto.RegId);
                            Gparam.Add("@UpdId", model.HrOvertimeWorkDateDto.UpdId);
                            Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                            Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                            var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                            result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                            result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                            if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                        }

                        // 커밋
                        scope.Complete();
                        // Note - 트렌젝션을 닫는다.
                        if (scope != null) scope.Dispose();

                        // 메일전송
                        if (!string.IsNullOrEmpty(models[i].StatusCd))
                        {
                            SendMailResponseOvertimeWork(
                                  models[i].OtId
                                , models[i].UpdId
                                , models[i].Remark
                                , models[i].StatusCd
                            );
                        }
                    }
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
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseOvertimeWork(HrOvertimeWorkGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_HrOvertimeWork_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", model.HrOvertimeWorkDto.OtId);
                    Gparam.Add("@Reason", model.HrOvertimeWorkDto.Reason);
                    Gparam.Add("@StatusCd", model.HrOvertimeWorkDto.StatusCd);
                    Gparam.Add("@Remark", model.HrOvertimeWorkDto.Remark);
                    Gparam.Add("@FileNm", model.HrOvertimeWorkDto.FileNm);
                    Gparam.Add("@FileUrl", model.HrOvertimeWorkDto.FileUrl);
                    Gparam.Add("@RegId", model.HrOvertimeWorkDto.RegId);
                    Gparam.Add("@UpdId", model.HrOvertimeWorkDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    // 승인 일때만 시간저장
                    if (model.HrOvertimeWorkDto.StatusCd.Equals("10"))
                    {
                        //[2] 시간 저장
                        sql = "USP_Response_HrOvertimeWork_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@OtId", id);
                        Gparam.Add("@StatusCd", model.HrOvertimeWorkDateDto.StatusCd);
                        Gparam.Add("@StartDt", model.HrOvertimeWorkDateDto.StartDt);
                        Gparam.Add("@StartTime", model.HrOvertimeWorkDateDto.StartTime);
                        Gparam.Add("@EndDt", model.HrOvertimeWorkDateDto.EndDt);
                        Gparam.Add("@EndTime", model.HrOvertimeWorkDateDto.EndTime);
                        Gparam.Add("@RecogTime", model.HrOvertimeWorkDateDto.RecogTime);
                        Gparam.Add("@DinnerTime", model.HrOvertimeWorkDateDto.DinnerTime);
                        Gparam.Add("@RegId", model.HrOvertimeWorkDateDto.RegId);
                        Gparam.Add("@UpdId", model.HrOvertimeWorkDateDto.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                    // 메일전송
                    if (!string.IsNullOrEmpty(model.HrOvertimeWorkDto.StatusCd))
                    {
                        SendMailResponseOvertimeWork(
                              model.HrOvertimeWorkDto.OtId
                            , model.HrOvertimeWorkDto.UpdId
                            , model.HrOvertimeWorkDto.Remark
                            , model.HrOvertimeWorkDto.StatusCd
                        );
                    }

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
        /// 메일 전송
        /// </summary>
        /// <param name="gparam"></param>
        private async void SendMailResponseOvertimeWork(int otId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@OtId", otId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Response_HrOvertimeWork_R02";
                var result = await _db.QueryAsync<CmMailUserListDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                var mailList = result.ToList();

                // 메일 보내기 / 로그
                for (int i = 0; i < mailList.Count; i++)
                {
                    var dr = mailList[i];
                    string mailSubject = MailReplace(dr.MailSubject, dr, remark);
                    string mailBody = MailReplace(dr.MailBody, dr, remark);

                    var mailResult = eWorksFunction.SendMail(dr.SendUserEmail
                                                             , dr.ReceiveUserEmail
                                                             , ""
                                                             , ""
                                                             , mailSubject
                                                             , mailBody
                                                             , "");

                    string mailGb = "07";
                    string mailCd = "";
                    if (apprCd == "99") mailCd = "A2";
                    else if (apprCd == "10") mailCd = "A3";
                    else mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);

                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseOvertimeWorkExcelUpload(List<HrOvertimeWorkExcelUploadDto> models)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 시간 변경및 상태변경
                    string sql = "USP_Response_HrOvertimeWork_U05";
                    int errorCode = 0;
                    string errorMsg = "";

                    for (int i = 0; i < models.Count; i++)
                    {
                        var dr = models[i];

                        var Gparam = new DynamicParameters();
                        Gparam.Add("@OtId", dr.OtId);
                        Gparam.Add("@DinnerTime", dr.DinnerTime);
                        Gparam.Add("@RequestDate", dr.RequestDate);
                        Gparam.Add("@Remark", dr.Remark);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) {
                            errorCode = -99;
                            errorMsg += result.OV_RTN_MSG + "|";
                        }
                    }

                    result.OV_RTN_CODE = errorCode == -99 ? -99 : 0;
                    result.OV_RTN_MSG = errorCode == -99 ? errorMsg : "성공";

                    // 커밋
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

        #region OnBehalf
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmUserDto>> GetOnBehalfUserList(string userId)
        {
            string sql = "USP_Response_HrOvertimeWork_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmUserDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseOvertimeWorkOnBehalf(HrOvertimeWorkGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_HrOvertimeWork_U03";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", model.HrOvertimeWorkDto.OtId);
                    Gparam.Add("@Reason", model.HrOvertimeWorkDto.Reason);
                    Gparam.Add("@StatusCd", model.HrOvertimeWorkDto.StatusCd);
                    Gparam.Add("@Remark", model.HrOvertimeWorkDto.Remark);
                    Gparam.Add("@FileNm", model.HrOvertimeWorkDto.FileNm);
                    Gparam.Add("@FileUrl", model.HrOvertimeWorkDto.FileUrl);
                    Gparam.Add("@RegId", model.HrOvertimeWorkDto.RegId);
                    Gparam.Add("@UpdId", model.HrOvertimeWorkDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] 시간 저장
                    sql = "USP_Response_HrOvertimeWork_U04";

                    Gparam = new DynamicParameters();
                    Gparam.Add("@OtId", id);
                    Gparam.Add("@StatusCd", model.HrOvertimeWorkDateDto.StatusCd);
                    Gparam.Add("@StartDt", model.HrOvertimeWorkDateDto.StartDt);
                    Gparam.Add("@StartTime", model.HrOvertimeWorkDateDto.StartTime);
                    Gparam.Add("@EndDt", model.HrOvertimeWorkDateDto.EndDt);
                    Gparam.Add("@EndTime", model.HrOvertimeWorkDateDto.EndTime);
                    Gparam.Add("@RecogTime", model.HrOvertimeWorkDateDto.RecogTime);
                    Gparam.Add("@DinnerTime", model.HrOvertimeWorkDateDto.DinnerTime);
                    Gparam.Add("@RegId", model.HrOvertimeWorkDateDto.RegId);
                    Gparam.Add("@UpdId", model.HrOvertimeWorkDateDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    // 커밋
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

        #region Common
        /// <summary>
        ///  메일내용 변경하기.
        /// </summary>
        /// <param name="p"></param>
        /// <param name="dr"></param>
        /// <returns></returns>
        private string MailReplace(string desc, CmMailUserListDto dr, string remark = "")
        {
            desc = desc.Replace("[보내는사람]", dr.SendUserNm);
            desc = desc.Replace("[보내는사람직함]", dr.SendDutyCdKorNm);
            desc = desc.Replace("[받는사람]", dr.ReceiveUserNm);
            desc = desc.Replace("[받는사람직함]", dr.ReceiveDutyCdKorNm);
            desc = desc.Replace("[링크]", "<a href='" + eWorksConfig.GetERPLinkPath() + "'> 여기 </a>");

            desc = desc.Replace("[결제자코멘트]", remark);
            desc = desc.Replace("[HR코멘트]", remark);
            desc = desc.Replace("[상태]", dr.StatusCdNm);

            desc = desc.Replace("[폼타입]", dr.LeaveHolidayGbNm);

            desc = desc.Replace("[구분]", "(" + dr.OvertimeWrokFormGb + ")");
            desc = desc.Replace("[요청시간]", "(" + dr.OvertimeWrokReqTime + ")");
            desc = desc.Replace("[연장근무초과]", dr.OvertimeWrokTimeOverYn.Equals("Y") ? " ▶ 연장근무 최대 근로시간(12시간)이 초과되었습니다." : "");

            return desc;
        }
        /// <summary>
        /// 메일전송
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="mailGb"></param>
        /// <param name="mailCd"></param>
        /// <param name="mailSubject"></param>
        /// <param name="mailBody"></param>
        /// <param name="mailResult"></param>
        private void SendMailLog(CmMailUserListDto dr, string mailGb, string mailCd, string mailSubject, string mailBody, eWorksResult mailResult)
        {
            try
            {
                // 메일 로그 남기기 
                string sql = "USP_Common_SaveMailLog";

                var mailParam = new DynamicParameters();
                mailParam.Add("@UserId", dr.SendUserId);
                mailParam.Add("@MailGb", mailGb);
                mailParam.Add("@MailCd", mailCd);
                mailParam.Add("@SendUserId", dr.SendUserId);
                mailParam.Add("@SendUserNm", dr.SendUserNm);
                mailParam.Add("@SendUserEmail", dr.SendUserEmail);
                mailParam.Add("@ReceiveUserId", dr.ReceiveUserId);
                mailParam.Add("@ReceiveUserNm", dr.ReceiveUserNm);
                mailParam.Add("@ReceiveUserEmail", dr.ReceiveUserEmail);
                mailParam.Add("@MailSubject", mailSubject);
                mailParam.Add("@MailBody", mailBody);
                mailParam.Add("@MailKeys", dr.MailKeys);
                mailParam.Add("@ReMailCnt", 0);
                mailParam.Add("@RegId", dr.SendUserId);
                mailParam.Add("@UpdId", dr.SendUserId);
                mailParam.Add("@ReturnCode", mailResult.OV_RTN_CODE);
                mailParam.Add("@ReturnMsg", mailResult.OV_RTN_MSG);
                mailParam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                mailParam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                var process1 = _db.ExecuteAsync(sql, mailParam, commandType: CommandType.StoredProcedure);

            }
            catch (Exception ex)
            {
            }
        }
        #endregion
    }
}
