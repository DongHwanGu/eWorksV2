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

namespace eWroks.Api.Models.CmMeetingRoom
{
    public class CmMeetingRoomRepository : ICmMeetingRoomRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmMeetingRoomRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmMeetingRoomRepository));
        }

        /// <summary>
        /// 메인
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmMeetingRoomDto>> GetMeetingRoomList(string thisDt, string meetingGb, string userId)
        {
            string sql = "USP_CmMeetingRoom_R01";

            var Gparam = new DynamicParameters();
            Gparam.Add("@ThisDt", thisDt);
            Gparam.Add("@MeetingGb", meetingGb);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmMeetingRoomDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 메인
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmMeetingRoomDto>> GetMeetingRoomSelectList(string selectDt, string meetingGb, string userId)
        {
            string sql = "USP_CmMeetingRoom_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@SelectDt", selectDt);
            Gparam.Add("@MeetingGb", meetingGb);
            Gparam.Add("@UserId", userId);

            var result = await _db.QueryAsync<CmMeetingRoomDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="cdMinor"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveMeetRoomData(CmMeetingRoomDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmMeetingRoom_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@MeetingId", model.MeetingId);
                    Gparam.Add("@MeetingGb", model.MeetingGb);
                    Gparam.Add("@RoomGb", model.RoomGb);
                    Gparam.Add("@RoomSubject", model.RoomSubject);
                    Gparam.Add("@StartDt", model.StartDt);
                    Gparam.Add("@StartTime", model.StartTime);
                    Gparam.Add("@EndDt", model.EndDt);
                    Gparam.Add("@EndTime", model.EndTime);
                    Gparam.Add("@ContentDesc", model.ContentDesc);
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
        /// 삭제
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="cdMinor"></param>
        /// <returns></returns>
        public async Task<eWorksResult> DeleteMeetRoomData(int meetingId, string userId)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmMeetingRoom_U02";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@MeetingId", meetingId);
                    Gparam.Add("@UserId", userId);
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


    }
}
