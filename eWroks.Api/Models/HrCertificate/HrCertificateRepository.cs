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

namespace eWroks.Api.Models.HrCertificate
{
    public class HrCertificateRepository : IHrCertificateRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        /// <summary>
        /// 생성자
        /// </summary>
        /// <param name="loggerFactory"></param>
        public HrCertificateRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(HrCertificateRepository));
        }

        #region Request
        /// <summary>
        /// Mater List 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<HrCertificateDto>> GetCertificateList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_HrCertificate_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrCertificateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Move List 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<CmUserDeptMoveDto>> GetMoveList(string userId)
        {
            string sql = "USP_HrCertificate_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmUserDeptMoveDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveCertificateData(HrCertificateDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrCertificate_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@CertiId", model.CertiId);
                    Gparam.Add("@UserId", model.UserId);
                    Gparam.Add("@CertiGb", model.CertiGb);
                    Gparam.Add("@LangGb", model.LangGb);
                    Gparam.Add("@DocNo", model.DocNo);
                    Gparam.Add("@ReasonGb", model.ReasonGb);
                    Gparam.Add("@Remark", model.Remark);
                    Gparam.Add("@DocUrl", model.DocUrl);
                    Gparam.Add("@IssueDt", model.IssueDt);
                    Gparam.Add("@StatusCd", model.StatusCd);
                    Gparam.Add("@MailYn", model.MailYn);
                    Gparam.Add("@PrintTitle", model.PrintTitle);
                    Gparam.Add("@PrintReason", model.PrintReason);
                    Gparam.Add("@PrintYn", model.PrintYn);
                    Gparam.Add("@MoveId", model.MoveId);
                    Gparam.Add("@InMoveYn", model.InMoveYn);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int certiId = Convert.ToInt32(result.OV_RTN_MSG);

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                    // 메일전송
                    Gparam = new DynamicParameters();
                    Gparam.Add("@CertiId", certiId);
                    Gparam.Add("@RegId", model.RegId);


                    SendMail(Gparam);
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
                var sql = "USP_HrCertificate_R03";
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

                    string mailGb = "02";
                    string mailCd = "A2";

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
        /// Mater List 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<HrCertificateDto>> GetResponseCertificateList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_Response_HrCertificate_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrCertificateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseCertificate(HrCertificateDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_HrCertificate_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@CertiId", model.CertiId);
                    Gparam.Add("@UserId", model.UserId);
                    Gparam.Add("@StatusCd", model.StatusCd);
                    Gparam.Add("@PrintTitle", model.PrintTitle);
                    Gparam.Add("@PrintReason", model.PrintReason);
                    Gparam.Add("@PrintYn", model.PrintYn);
                    Gparam.Add("@Remark", model.Remark);
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

                    // 메일전송
                    Gparam = new DynamicParameters();
                    Gparam.Add("@CertiId", model.CertiId);
                    Gparam.Add("@UpdId", model.UpdId);


                    ResponseSendMail(Gparam, model.Remark);
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
        private async void ResponseSendMail(DynamicParameters Gparam, string remark)
        {
            try
            {
                var sql = "USP_Response_HrCertificate_R02";
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

                    string mailGb = "02";
                    string mailCd = "A1";

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
            desc = desc.Replace("[증명서타입]", dr.CertiGbNm);

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
