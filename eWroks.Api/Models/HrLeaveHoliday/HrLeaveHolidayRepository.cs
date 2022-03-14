using Dapper;
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

namespace eWroks.Api.Models.HrLeaveHoliday
{
    public class HrLeaveHolidayRepository : IHrLeaveHolidayRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public HrLeaveHolidayRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(HrLeaveHolidayRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrLeaveHolidayDto>> GetLeaveHolidayList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_HrLeaveHoliday_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrLeaveHolidayDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <returns></returns>
        public async Task<HrLeaveHolidayGroupDto> GetLeaveHolidayDetail(int leaveHoliId)
        {
            HrLeaveHolidayGroupDto groupDto = new HrLeaveHolidayGroupDto();

            // [1] 마스터 조회
            string sql = "USP_HrLeaveHoliday_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@LeaveHoliId", leaveHoliId);

            var result = await _db.QueryAsync<HrLeaveHolidayDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.HrLeaveHolidayDto = result.SingleOrDefault();

            // [2] 시간 조회
            sql = "USP_HrLeaveHoliday_R03";

            var result2 = await _db.QueryAsync<HrLeaveHolidayDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.HrLeaveHolidayDateDtos = result2.ToList();

            // [3] 승인자 조회
            sql = "USP_HrLeaveHoliday_R04";

            var result3 = await _db.QueryAsync<HrLeaveHolidayApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.HrLeaveHolidayApprovalDtos = result3.ToList();

            return groupDto;
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveLeaveHolidayData(HrLeaveHolidayGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrLeaveHoliday_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@LeaveHoliId", model.HrLeaveHolidayDto.LeaveHoliId);
                    Gparam.Add("@Reason", model.HrLeaveHolidayDto.Reason);
                    Gparam.Add("@StatusCd", model.HrLeaveHolidayDto.StatusCd);
                    Gparam.Add("@Remark", model.HrLeaveHolidayDto.Remark);
                    Gparam.Add("@FileNm", model.HrLeaveHolidayDto.FileNm);
                    Gparam.Add("@FileUrl", model.HrLeaveHolidayDto.FileUrl);
                    Gparam.Add("@LeaveYear", model.HrLeaveHolidayDto.LeaveYear);
                    Gparam.Add("@RegId", model.HrLeaveHolidayDto.RegId);
                    Gparam.Add("@UpdId", model.HrLeaveHolidayDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] 시간 저장
                    for (int i = 0; i < model.HrLeaveHolidayDateDtos.Count; i++)
                    {
                        var dr = model.HrLeaveHolidayDateDtos[i];

                        sql = "USP_HrLeaveHoliday_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@LeaveHoliId", id);
                        Gparam.Add("@DateId", dr.DateId);
                        Gparam.Add("@LeaveTypeCd", dr.LeaveTypeCd);
                        Gparam.Add("@LeaveTypeDetailCd", dr.LeaveTypeDetailCd);
                        Gparam.Add("@StartDt", dr.StartDt);
                        Gparam.Add("@StartTime", dr.StartTime);
                        Gparam.Add("@EndDt", dr.EndDt);
                        Gparam.Add("@EndTime", dr.EndTime);
                        Gparam.Add("@RecogDay", dr.RecogDay);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        var process2 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                        result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                        result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                        if (result.OV_RTN_CODE.Equals(-1)) { return result; }
                    }

                    //[3] 승인자 저장
                    for (int i = 0; i < model.HrLeaveHolidayApprovalDtos.Count; i++)
                    {
                        var dr = model.HrLeaveHolidayApprovalDtos[i];

                        sql = "USP_HrLeaveHoliday_U03";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@LeaveHoliId", id);
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

                    // [4] 승인요청
                    if (!model.HrLeaveHolidayDto.StatusCd.Equals("01"))
                    {
                        sql = "USP_HrLeaveHoliday_U04";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@LeaveHoliId", id);
                        Gparam.Add("@RegId", model.HrLeaveHolidayDto.RegId);
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
                        Gparam.Add("@LeaveHoliId", id);
                        Gparam.Add("@RegId", model.HrLeaveHolidayDto.RegId);

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
                var sql = "USP_HrLeaveHoliday_R05";
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

                    string mailGb = "01";
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
        public async Task<List<HrLeaveHolidayDto>> GetTaskingLeaveHolidayList(string userId)
        {
            string sql = "USP_Taking_HrLeaveHoliday_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrLeaveHolidayDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingLeaveHolidayApproval(int leaveHoliId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Taking_HrLeaveHoliday_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@LeaveHoliId", leaveHoliId);
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
                        SendMailTaskingLeaveHoliday(leaveHoliId, updId, remark, result.OV_RTN_MSG);
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
        private async void SendMailTaskingLeaveHoliday(int leaveHoliId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@LeaveHoliId", leaveHoliId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Taking_HrLeaveHoliday_R02";
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

                    string mailGb = "01";
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
        public async Task<List<HrLeaveHolidayDto>> GetResponseLeaveHolidayList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_Response_LeaveHoliday_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrLeaveHolidayDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseLeaveHolidayApproval(
            int leaveHoliId, string remark, string reason, string leaveYear, string statusCd, string updId, List<HrLeaveHolidayDateDto> hrLeaveHolidayDateDtos)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_LeaveHoliday_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@LeaveHoliId", leaveHoliId);
                    Gparam.Add("@Remark", remark);
                    Gparam.Add("@Reason", reason);
                    Gparam.Add("@LeaveYear", leaveYear);
                    Gparam.Add("@StatusCd", statusCd);
                    Gparam.Add("@UpdId", updId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    string rejectGb = result.OV_RTN_MSG;

                    // 반려의 경우 시간데이터 기존꺼 가져오기.
                    if (statusCd.Equals("99")) 
                    {
                        // [2] 시간 조회
                        sql = "USP_HrLeaveHoliday_R03";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@LeaveHoliId", leaveHoliId);

                        var result2 = await _db.QueryAsync<HrLeaveHolidayDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
                        hrLeaveHolidayDateDtos = result2.ToList();
                    }

                    //[2] 시간 저장
                    for (int i = 0; i < hrLeaveHolidayDateDtos.Count; i++)
                    {
                        var dr = hrLeaveHolidayDateDtos[i];

                        sql = "USP_Response_LeaveHoliday_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@LeaveYear", leaveYear);
                        Gparam.Add("@StatusCd", statusCd);
                        Gparam.Add("@RejectGb", rejectGb);

                        Gparam.Add("@LeaveHoliId", leaveHoliId);
                        Gparam.Add("@DateId", dr.DateId);
                        Gparam.Add("@LeaveTypeCd", dr.LeaveTypeCd);
                        Gparam.Add("@LeaveTypeDetailCd", dr.LeaveTypeDetailCd);
                        Gparam.Add("@StartDt", dr.StartDt);
                        Gparam.Add("@StartTime", dr.StartTime);
                        Gparam.Add("@EndDt", dr.EndDt);
                        Gparam.Add("@EndTime", dr.EndTime);
                        Gparam.Add("@RecogDay", dr.RecogDay);
                        Gparam.Add("@RegId", dr.RegId);
                        Gparam.Add("@UpdId", dr.UpdId);
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
                    if (!string.IsNullOrEmpty(result.OV_RTN_MSG))
                    {
                        SendMailResponseLeaveHoliday(leaveHoliId, updId, remark, result.OV_RTN_MSG);
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
        /// <param name="travelId"></param>
        /// <param name="updId"></param>
        /// <param name="oV_RTN_MSG"></param>
        private async void SendMailResponseLeaveHoliday(int leaveHoliId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@LeaveHoliId", leaveHoliId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Response_LeaveHoliday_R02";
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

                    string mailGb = "01";
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
