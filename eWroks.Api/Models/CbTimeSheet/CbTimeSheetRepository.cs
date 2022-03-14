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

namespace eWroks.Api.Models.CbTimeSheet
{
    public class CbTimeSheetRepository : ICbTimeSheetRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CbTimeSheetRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CbTimeSheetRepository));
        }

        #region Request
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbTimeSheetDto>> GetCbTimeSheetList(string registerDt, string statusCd, string userId)
        {
            string sql = "USP_CbTimeSheet_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@RegisterDt", registerDt);
            Gparam.Add("@StatusCd", statusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbTimeSheetDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }


        /// <summary>
        /// 마스터 리스트 상세
        /// </summary>
        /// <returns></returns>
        public async Task<CbTimeSheetGroupDto> GetCbTimeSheetDetail(int timeId)
        {
            CbTimeSheetGroupDto groupDto = new CbTimeSheetGroupDto();
            var Gparam = new DynamicParameters();
            Gparam.Add("@TimeId", timeId);

            string sql = "USP_CbTimeSheet_R02";
            var result = await _db.QueryAsync<CbTimeSheetDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.CbTimeSheetDto = result.SingleOrDefault();

            sql = "USP_CbTimeSheet_R03";
            var result2 = await _db.QueryAsync<CbTimeSheetApprovalDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            groupDto.CbTimeSheetApprovalDtos = result2.ToList();

            return groupDto;
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveCbTimeSheet(CbTimeSheetGroupDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_CbTimeSheet_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TimeId", model.CbTimeSheetDto.TimeId);
                    Gparam.Add("@RegisterDt", model.CbTimeSheetDto.RegisterDt);
                    Gparam.Add("@CommuteStartDt", model.CbTimeSheetDto.CommuteStartDt);
                    Gparam.Add("@CommuteStartTime", model.CbTimeSheetDto.CommuteStartTime);
                    Gparam.Add("@CommuteEndDt", model.CbTimeSheetDto.CommuteEndDt);
                    Gparam.Add("@CommuteEndTime", model.CbTimeSheetDto.CommuteEndTime);
                    Gparam.Add("@RestTime", model.CbTimeSheetDto.RestTime);
                    Gparam.Add("@NightRestTime", model.CbTimeSheetDto.NightRestTime);
                    Gparam.Add("@HiTime", model.CbTimeSheetDto.HiTime);
                    Gparam.Add("@MsTankTime", model.CbTimeSheetDto.MsTankTime);
                    Gparam.Add("@IrtTime", model.CbTimeSheetDto.IrtTime);
                    Gparam.Add("@AaTime", model.CbTimeSheetDto.AaTime);
                    Gparam.Add("@AgriTime", model.CbTimeSheetDto.AgriTime);
                    Gparam.Add("@MinTime", model.CbTimeSheetDto.MinTime);
                    Gparam.Add("@RohsTime", model.CbTimeSheetDto.RohsTime);
                    Gparam.Add("@WorkTime", model.CbTimeSheetDto.WorkTime);
                    Gparam.Add("@WorkRate", model.CbTimeSheetDto.WorkRate);
                    Gparam.Add("@StatusCd", model.CbTimeSheetDto.StatusCd);
                    Gparam.Add("@Reason", model.CbTimeSheetDto.Reason);
                    Gparam.Add("@Remark", model.CbTimeSheetDto.Remark);
                    Gparam.Add("@RegId", model.CbTimeSheetDto.RegId);
                    Gparam.Add("@UpdId", model.CbTimeSheetDto.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    var process1 = await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");

                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int id = Convert.ToInt32(result.OV_RTN_MSG);

                    //[3] 승인자 저장
                    for (int i = 0; i < model.CbTimeSheetApprovalDtos.Count; i++)
                    {
                        var dr = model.CbTimeSheetApprovalDtos[i];

                        sql = "USP_CbTimeSheet_U02";

                        Gparam = new DynamicParameters();
                        Gparam.Add("@TimeId", id);
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

                    // 커밋
                    scope.Complete();
                    // Note - 트렌젝션을 닫는다.
                    if (scope != null) scope.Dispose();

                    // 메일전송
                    Gparam = new DynamicParameters();
                    Gparam.Add("@TimeId", id);
                    Gparam.Add("@RegId", model.CbTimeSheetDto.RegId);

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
                var sql = "USP_CbTimeSheet_R04";
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

        #region Response
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbTimeSheetDto>> GetCbTimeSheetApprovalList(string startDt, string endDt, string statusCd, string userId)
        {
            string sql = "USP_Response_CbTimeSheet_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@EndDt", endDt);
            Gparam.Add("@StatusCd", statusCd);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbTimeSheetDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 주간 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbTimeSheetWeeklyDto>> GetCbTimeSheetWeeklyList(int timeId, string userId)
        {
            string sql = "USP_Response_CbTimeSheet_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@TimeId", timeId);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbTimeSheetWeeklyDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// Department
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbTimeSheetDepartmentDto>> GetCbTimeSheetDepartmentList(string startDt, string retirementYn, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            List<CbTimeSheetDepartmentDto> dto = new List<CbTimeSheetDepartmentDto>();

            string sql = "USP_Response_CbTimeSheet_R04";

            var Gparam = new DynamicParameters();
            Gparam.Add("@StartDt", startDt);
            Gparam.Add("@RetirementYn", retirementYn);
            Gparam.Add("@DeptCd1", deptCd1);
            Gparam.Add("@DeptCd2", deptCd2);
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbTimeSheetDepartmentDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            dto = result.ToList();

            for (int i = 0; i < dto.Count; i++)
            {
                var dr = dto[i];

                sql = "USP_Response_CbTimeSheet_R05";

                var Gparam2 = new DynamicParameters();
                Gparam2.Add("@TimeId", 0);
                Gparam2.Add("@StartDt", startDt);
                Gparam2.Add("@UserId", dr.UserId);
                
                var totalsec = 0;
                var nightsec = 0;
                var overtimesec = 0;
                var overtimedefaultsec = (287 * 3600);

                var result2 = await _db.QueryAsync<int>(sql, Gparam2, commandType: CommandType.StoredProcedure);
                var nightdt = result2.SingleOrDefault();

                totalsec = Convert.ToInt32(dr.FnMonthTotalTime);

                nightsec = Convert.ToInt32(nightdt);
                totalsec = totalsec + (nightsec / 2);
                overtimesec = totalsec > overtimedefaultsec ? (totalsec - overtimedefaultsec) : 0;

                if (nightsec != 0)
                {
                    dr.FnMonthNightTime = ((int)(Math.Floor((double)(nightsec / 3600)))).ToString()
                        + ":" + ((int)(Math.Floor((double)((nightsec % 3600) / 60)))).ToString().PadLeft(2, '0');
                }
                if (totalsec != 0)
                {
                    dr.FnMonthTotalTime = ((int)(Math.Floor((double)(totalsec / 3600)))).ToString()
                        + ":" + ((int)(Math.Floor((double)((totalsec % 3600) / 60)))).ToString().PadLeft(2, '0');
                }
                if (overtimesec != 0)
                {
                    dr.FnMonthExcessOverTime = ((int)(Math.Floor((double)(overtimesec / 3600)))).ToString()
                        + ":" + ((int)(Math.Floor((double)((overtimesec % 3600) / 60)))).ToString().PadLeft(2, '0');
                }

                dr.FnMonthOverTime = dr.FnMonthOverTime.Equals("0:00") ? "" : dr.FnMonthOverTime;

            }

            return dto;
        }

        /// <summary>
        /// Hr Excel
        /// </summary>
        /// <returns></returns>
        public async Task<CbTimeSheetHrExcelDto> GetResponseHRExcelDownload(string clickDt, string userId)
        {
            string sql = "USP_Response_CbTimeSheet_R06";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ClickDt", clickDt);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbTimeSheetHrExcelDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            var dto = result.SingleOrDefault();

            if (dto != null)
            {
                sql = "USP_Response_CbTimeSheet_R05";

                var Gparam2 = new DynamicParameters();
                Gparam2.Add("@TimeId", 0);
                Gparam2.Add("@StartDt", clickDt);
                Gparam2.Add("@UserId", userId);

                var totalsec = 0;
                var nightsec = 0;
                var overtimesec = 0;
                var overtimedefaultsec = (287 * 3600);

                var result2 = await _db.QueryAsync<int>(sql, Gparam2, commandType: CommandType.StoredProcedure);
                var nightdt = result2.SingleOrDefault();

                totalsec = Convert.ToInt32(dto.FnMonthTotalTime);

                nightsec = Convert.ToInt32(nightdt);
                totalsec = totalsec + (nightsec / 2);
                overtimesec = totalsec > overtimedefaultsec ? (totalsec - overtimedefaultsec) : 0;

                if (nightsec != 0)
                {
                    dto.FnMonthNightTime = ((int)(Math.Floor((double)(nightsec / 3600)))).ToString()
                        + ":" + ((int)(Math.Floor((double)((nightsec % 3600) / 60)))).ToString().PadLeft(2, '0');
                }
                if (totalsec != 0)
                {
                    dto.FnMonthTotalTime = ((int)(Math.Floor((double)(totalsec / 3600)))).ToString()
                        + ":" + ((int)(Math.Floor((double)((totalsec % 3600) / 60)))).ToString().PadLeft(2, '0');
                }
                if (overtimesec != 0)
                {
                    dto.FnMonthExcessOverTime = ((int)(Math.Floor((double)(overtimesec / 3600)))).ToString()
                        + ":" + ((int)(Math.Floor((double)((overtimesec % 3600) / 60)))).ToString().PadLeft(2, '0');
                }

                dto.FnMonthOverTime = dto.FnMonthOverTime.Equals("0:00") ? "" : dto.FnMonthOverTime;
            }

            return dto;
        }

        /// <summary>
        /// Excel
        /// </summary>
        /// <returns></returns>
        public async Task<DataSet> GetResponseExcelDownload(string clickDt, string strUserId)
        {
            string sql = "USP_Response_CbTimeSheet_R07";

            DataSet ds = new DataSet();

            var arrUserId = strUserId.Split(',');

            for (int i = 0; i < arrUserId.Length; i++)
            {
                var userId = arrUserId[i];

                if (!string.IsNullOrEmpty(userId))
                {
                    DataTable dt = new DataTable();

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@ClickDt", clickDt);
                    Gparam.Add("@UserId", userId);

                    var result = await _db.ExecuteReaderAsync(sql, Gparam, commandType: CommandType.StoredProcedure);

                    dt.Load(result);

                    for (int j = 0; j < dt.Rows.Count; j++)
                    {
                        DataRow dr = dt.Rows[j];

                        var sql2 = "USP_Response_CbTimeSheet_R05";

                        var Gparam2 = new DynamicParameters();
                        Gparam2.Add("@TimeId", dr["TimeId"]);
                        Gparam2.Add("@StartDt", "");
                        Gparam2.Add("@UserId", "");

                        var nightsec = 0;
                        var result2 = await _db.QueryAsync<int>(sql2, Gparam2, commandType: CommandType.StoredProcedure);
                        var nightdt = result2.SingleOrDefault();

                        nightsec = Convert.ToInt32(nightdt);

                        if (nightsec != 0)
                        {
                            dr["NightTime"] = ((int)(Math.Floor((double)(nightsec / 3600)))).ToString()
                                + ":" + ((int)(Math.Floor((double)((nightsec % 3600) / 60)))).ToString().PadLeft(2, '0');
                        }
                    }

                    string userNm = dt.Rows[0]["UserNm"].ToString();

                    dt.Columns.Remove("TimeId");
                    dt.Columns.Remove("UserNm");
                    
                    dt.Columns["MonthDate"].ColumnName = "날짜";
                    dt.Columns["MonthDateNm"].ColumnName = "요일";
                    dt.Columns["ComStartDt"].ColumnName = "출근";
                    dt.Columns["ComEndDt"].ColumnName = "퇴근";
                    dt.Columns["VacationCnt"].ColumnName = "휴가";
                    dt.Columns["HiTime"].ColumnName = "HI";
                    dt.Columns["MsTankTime"].ColumnName = "MS/Tank";
                    dt.Columns["IrtTime"].ColumnName = "IRT";
                    dt.Columns["AaTime"].ColumnName = "AA";
                    dt.Columns["AgriTime"].ColumnName = "Agri";
                    dt.Columns["MinTime"].ColumnName = "Min";
                    dt.Columns["RohsTime"].ColumnName = "RoHS";
                    dt.Columns["WorkTime"].ColumnName = "실근로시간";
                    dt.Columns["MonthHolidayWrokTime"].ColumnName = "휴일특근시간";
                    dt.Columns["NightTime"].ColumnName = "야간근로시간";
                    dt.Columns["EtcHoliCnt"].ColumnName = "약정";
                    dt.Columns["Reason"].ColumnName = "작업내역";

                    dt.AcceptChanges();

                    if (dt != null && dt.Rows.Count > 0)
                    {
                        ds.Tables.Add(dt.DefaultView.ToTable());
                        ds.Tables[i].TableName = userNm;
                    }
                }
            }

            return ds;
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveCbTimeSheetApproval(int timeId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_Response_CbTimeSheet_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@TimeId", timeId);
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
                        SendMailResponseCbTimeSheet(timeId, updId, remark, result.OV_RTN_MSG);
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
        /// 메일전송
        /// </summary>
        /// <param name="timeId"></param>
        /// <param name="updId"></param>
        /// <param name="remark"></param>
        /// <param name="oV_RTN_MSG"></param>
        private async void SendMailResponseCbTimeSheet(int timeId, string updId, string remark, string apprCd)
        {
            try
            {
                var Gparam = new DynamicParameters();
                Gparam.Add("@TimeId", timeId);
                Gparam.Add("@UpdId", updId);
                Gparam.Add("@ApprCd", apprCd);

                var sql = "USP_Response_CbTimeSheet_R03";
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

                    string mailGb = "10";
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


        #region Dashboard
        /// <summary>
        /// Week Select box
        /// </summary>
        /// <returns></returns>
        public async Task<List<CommonSelectDto>> GetOfficeWeekList(string year)
        {
            string sql = "USP_Dashboard_CbTimeSheet_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@Year", year);

            var result = await _db.QueryAsync<CommonSelectDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CbTimeSheetOfficeDto>> GetDashboardOfficeList(int deptCd3, string overtimeYn, string officeYear, string officeWeek, string userId)
        {
            string sql = "USP_Dashboard_CbTimeSheet_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@DeptCd3", deptCd3);
            Gparam.Add("@OvertimeYn", overtimeYn);
            Gparam.Add("@OfficeYear", officeYear);
            Gparam.Add("@OfficeWeek", officeWeek);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CbTimeSheetOfficeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
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
