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

namespace eWroks.Api.Models.FiTravel
{
    public class FiTravelRepository : IFiTravelRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public FiTravelRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(FiTravelRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<FiTravelDto>> GetTravelList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_FiTravel_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiTravelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <returns></returns>
        public async Task<FiTravelGroupDto> GetTravelDetail(int travelId)
        {
            FiTravelGroupDto groupDto = new FiTravelGroupDto();

            // [1] 마스터 조회
            string sql = "USP_FiTravel_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@TravelId", travelId);

            var result = await _db.QueryAsync<FiTravelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiTravelDto = result.SingleOrDefault();

            // [2] 시간 조회
            sql = "USP_FiTravel_R03";

            var result2 = await _db.QueryAsync<FiTravelDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiTravelDateDtos = result2.ToList();

            // [3] 승인자 조회
            sql = "USP_FiTravel_R04";

            var result3 = await _db.QueryAsync<FiTravelApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.FiTravelApprovalDtos = result3.ToList();

            return groupDto;
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTravelData(FiTravelGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_FiTravel_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TravelId", model.FiTravelDto.TravelId);
                    Gparam.Add("@TravelGb", model.FiTravelDto.TravelGb);
                    Gparam.Add("@Destination", model.FiTravelDto.Destination);
                    Gparam.Add("@Customer", model.FiTravelDto.Customer);
                    Gparam.Add("@EstRevAmt", model.FiTravelDto.EstRevAmt);
                    Gparam.Add("@EstCostAmt", model.FiTravelDto.EstCostAmt);
                    Gparam.Add("@Purpose", model.FiTravelDto.Purpose);
                    Gparam.Add("@Remark", model.FiTravelDto.Remark);
                    Gparam.Add("@StatusCd", model.FiTravelDto.StatusCd);
                    Gparam.Add("@RegId", model.FiTravelDto.RegId);
                    Gparam.Add("@UpdId", model.FiTravelDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int travelId = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] 시간 저장
                    for (int i = 0; i < model.FiTravelDateDtos.Count; i++)
                    {
                        var dr = model.FiTravelDateDtos[i];

                        sql = "USP_FiTravel_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TravelId", travelId);
                        Gparam.Add("@DateId", dr.DateId);
                        Gparam.Add("@StartDt", dr.StartDt);
                        Gparam.Add("@EndDt", dr.EndDt);
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

                    //[3] 승인자 저장
                    for (int i = 0; i < model.FiTravelApprovalDtos.Count; i++)
                    {
                        var dr = model.FiTravelApprovalDtos[i];

                        sql = "USP_FiTravel_U03";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TravelId", travelId);
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
                    if (!model.FiTravelDto.StatusCd.Equals("01"))
                    {
                        sql = "USP_FiTravel_U04";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TravelId", travelId);
                        Gparam.Add("@RegId", model.FiTravelDto.RegId);
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
                        Gparam.Add("@TravelId", travelId);
                        Gparam.Add("@RegId", model.FiTravelDto.RegId);

                        SendMailTravel(Gparam);
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
        private async void SendMailTravel(DynamicParameters Gparam)
        {
            try
            {
                var sql = "USP_FiTravel_R05";
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

                    string mailGb = "05";
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
        public async Task<List<FiTravelDto>> GetTaskingTravelList(string userId)
        {
            string sql = "USP_Tasking_FiTravel_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiTravelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingApproval(int travelId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Tasking_FiTravel_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TravelId", travelId);
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
                        SendMailTaskingTravel(travelId, updId, remark, result.OV_RTN_MSG);
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
        private async void SendMailTaskingTravel(int travelId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@TravelId", travelId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Tasking_FiTravel_R02";
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
                    
                    string mailGb = "05";
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
        public async Task<List<FiTravelDto>> GetResponseTravelList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_Response_FiTravel_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<FiTravelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseApproval(int travelId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_FiTravel_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TravelId", travelId);
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
                        SendMailResponseTravel(travelId, updId, remark, result.OV_RTN_MSG);
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
        private async void SendMailResponseTravel(int travelId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@TravelId", travelId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Response_FiTravel_R02";
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

                    string mailGb = "05";
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
            desc = desc.Replace("[상태]", dr.StatusCdNm);

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
