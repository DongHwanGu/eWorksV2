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

namespace eWroks.Api.Models.HrExternalTraining
{
    public class HrExternalTrainingRepository : IHrExternalTrainingRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public HrExternalTrainingRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(HrExternalTrainingRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrExternalTrainingDto>> GetExternalTrainingList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_HrExternalTraining_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrExternalTrainingDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <returns></returns>
        public async Task<HrExternalTrainingGroupDto> GetExternalTrainingDetail(int trainingId)
        {
            HrExternalTrainingGroupDto groupDto = new HrExternalTrainingGroupDto();

            // [1] 마스터 조회
            string sql = "USP_HrExternalTraining_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@TrainingId", trainingId);

            var result = await _db.QueryAsync<HrExternalTrainingDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.HrExternalTrainingDto = result.SingleOrDefault();

            // [2] 시간 조회
            sql = "USP_HrExternalTraining_R03";

            var result2 = await _db.QueryAsync<HrExternalTrainingDateDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.HrExternalTrainingDateDtos = result2.ToList();

            // [3] 승인자 조회
            sql = "USP_HrExternalTraining_R04";

            var result3 = await _db.QueryAsync<HrExternalTrainingApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.HrExternalTrainingApprovalDtos = result3.ToList();

            return groupDto;
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveExternalTraining(HrExternalTrainingGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrExternalTraining_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TrainingId", model.HrExternalTrainingDto.TrainingId);
                    Gparam.Add("@UserId", model.HrExternalTrainingDto.UserId);
                    Gparam.Add("@TrainingGb", model.HrExternalTrainingDto.TrainingGb);
                    Gparam.Add("@TrainingNm", model.HrExternalTrainingDto.TrainingNm);
                    Gparam.Add("@Subject", model.HrExternalTrainingDto.Subject);
                    Gparam.Add("@Institution", model.HrExternalTrainingDto.Institution);
                    Gparam.Add("@Reason", model.HrExternalTrainingDto.Reason);
                    Gparam.Add("@PaymentDt", model.HrExternalTrainingDto.PaymentDt);
                    Gparam.Add("@PaymentMethod", model.HrExternalTrainingDto.PaymentMethod);
                    Gparam.Add("@TrainingAmt", model.HrExternalTrainingDto.TrainingAmt);
                    Gparam.Add("@InsReturnYn", model.HrExternalTrainingDto.InsReturnYn);
                    Gparam.Add("@ReturnAmt", model.HrExternalTrainingDto.ReturnAmt);
                    Gparam.Add("@BankCd", model.HrExternalTrainingDto.BankCd);
                    Gparam.Add("@PaymentRegDt", model.HrExternalTrainingDto.PaymentRegDt);
                    Gparam.Add("@AccountNo", model.HrExternalTrainingDto.AccountNo);
                    Gparam.Add("@StatusCd", model.HrExternalTrainingDto.StatusCd);
                    Gparam.Add("@Remark", model.HrExternalTrainingDto.Remark);
                    Gparam.Add("@RegId", model.HrExternalTrainingDto.RegId);
                    Gparam.Add("@UpdId", model.HrExternalTrainingDto.UpdId);
                    Gparam.Add("@DtlFileNm", model.HrExternalTrainingDto.DtlFileNm);
                    Gparam.Add("@DtlFileUrl", model.HrExternalTrainingDto.DtlFileUrl);
                    Gparam.Add("@ListFileNm", model.HrExternalTrainingDto.ListFileNm);
                    Gparam.Add("@ListFileUrl", model.HrExternalTrainingDto.ListFileUrl);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[2] 시간 저장
                    for (int i = 0; i < model.HrExternalTrainingDateDtos.Count; i++)
                    {
                        var dr = model.HrExternalTrainingDateDtos[i];

                        sql = "USP_HrExternalTraining_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TrainingId", id);
                        Gparam.Add("@DateId", dr.DateId);
                        Gparam.Add("@StartDt", dr.StartDt);
                        Gparam.Add("@StartTime", dr.StartTime);
                        Gparam.Add("@EndDt", dr.EndDt);
                        Gparam.Add("@EndTime", dr.EndTime);
                        Gparam.Add("@TotalHours", dr.TotalHours);
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
                    for (int i = 0; i < model.HrExternalTrainingApprovalDtos.Count; i++)
                    {
                        var dr = model.HrExternalTrainingApprovalDtos[i];

                        sql = "USP_HrExternalTraining_U03";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TrainingId", id);
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
                    if (!model.HrExternalTrainingDto.StatusCd.Equals("01"))
                    {
                        sql = "USP_HrExternalTraining_U04";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TrainingId", id);
                        Gparam.Add("@RegId", model.HrExternalTrainingDto.RegId);
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
                        Gparam.Add("@TrainingId", id);
                        Gparam.Add("@RegId", model.HrExternalTrainingDto.RegId);

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
                var sql = "USP_HrExternalTraining_R05";
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

                    string mailGb = "04";
                    string mailCd = "A1";

                    SendMailLog(dr, mailGb, mailCd, mailSubject, mailBody, mailResult);
                }
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 리스트 파일 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> OnfileUploadClickSave(int trainingId, string fileNm, string fileUrl)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrExternalTraining_U05";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TrainingId", trainingId);
                    Gparam.Add("@FileNm", fileNm);
                    Gparam.Add("@FileUrl", fileUrl);
                    
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
        /// 리스트 파일 삭제
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> OnfileUploadClickDelete(int trainingId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_HrExternalTraining_U06";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TrainingId", trainingId);

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

        #region Tasking
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<HrExternalTrainingDto>> GetTaskingExternalTrainingList(string userId)
        {
            string sql = "USP_Taking_HrExternalTraining_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrExternalTrainingDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveTaskingExternalTrainingApproval(int trainingId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Taking_HrExternalTraining_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TrainingId", trainingId);
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
                        SendMailTaskingExternalTraining(trainingId, updId, remark, result.OV_RTN_MSG);
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
        private async void SendMailTaskingExternalTraining(int trainingId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@TrainingId", trainingId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Taking_HrExternalTraining_R02";
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

                    string mailGb = "04";
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
        public async Task<List<HrExternalTrainingDto>> GetResponseExternalTrainingList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            string sql = "USP_Response_HrExternalTraining_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@sStartDt", sStartDt);
            Gparam.Add("@sEndDt", sEndDt);
            Gparam.Add("@sStatusCd", sStatusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<HrExternalTrainingDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveResponseExternalTrainingApproval(int trainingId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_HrExternalTraining_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TrainingId", trainingId);
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
                        SendMailResponseExternalTraining(trainingId, updId, remark, result.OV_RTN_MSG);
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
        private async void SendMailResponseExternalTraining(int trainingId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@TrainingId", trainingId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Response_HrExternalTraining_R02";
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

                    string mailGb = "04";
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
        /// Update
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> UpdateResponseExternalTraingData(string updateGb, int trainingId, int returnAmt, string paymentRegDt, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_HrExternalTraining_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@UpdateGb", updateGb);
                    Gparam.Add("@TrainingId", trainingId);
                    Gparam.Add("@ReturnAmt", returnAmt);
                    Gparam.Add("@PaymentRegDt", paymentRegDt);
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
