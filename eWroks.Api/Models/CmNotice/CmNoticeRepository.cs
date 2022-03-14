using Dapper;
using eWroks.Api.Models.CmDept;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace eWroks.Api.Models.CmNotice
{
    public class CmNoticeRepository : ICmNoticeRepository
    {

        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmNoticeRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmNoticeRepository));
        }

        
        /// <summary>
        /// 조회
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmNoticeDto>> GetNoticeList()
        {
            string sql = "USP_CmNotice_R01";

            var result = await _db.QueryAsync<CmNoticeDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <param name="noticeId"></param>
        /// <returns></returns>
        public async Task<CmNoticeDto> GetNoticeDetailData(int noticeId)
        {
            string sql = "USP_CmNotice_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@NoticeId", noticeId);

            // [1] 마스터
            var result = await _db.QueryAsync<CmNoticeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            // [2] 파일
            sql = "USP_CmNotice_R04";
            var resultFile = await _db.QueryAsync<CmNoticeFileDto>(sql, Gparam, commandType: CommandType.StoredProcedure);
            result.SingleOrDefault().NoticeFiles = resultFile.ToList();

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 부서 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmDeptDto>> GetDeptList()
        {
            string sql = "USP_CmNotice_R03";

            var result = await _db.QueryAsync<CmDeptDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveNoticeData(CmNoticeDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    // [1] 마스터 저장
                    string sql = "USP_CmNotice_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@NoticeId", model.NoticeId);
                    Gparam.Add("@NoticeTitle", model.NoticeTitle);
                    Gparam.Add("@NoticeDesc", model.NoticeDesc);
                    Gparam.Add("@AlertGb", model.AlertGb);
                    Gparam.Add("@DeptList", model.DeptList);
                    Gparam.Add("@StartDt", model.StartDt);
                    Gparam.Add("@EndDt", model.EndDt);
                    Gparam.Add("@ClickCnt", model.ClickCnt);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@RegId", model.RegId);
                    Gparam.Add("@UpdId", model.UpdId);
                    Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                    Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                    await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
                    result.OV_RTN_CODE = Gparam.Get<int>("@OV_RTN_CODE");
                    result.OV_RTN_MSG = Gparam.Get<string>("@OV_RTN_MSG");
                    if (result.OV_RTN_CODE.Equals(-1)) { return result; }

                    int noticeId = Int32.Parse(result.OV_RTN_MSG);

                    // [2] File 저장
                    for (int i = 0; i < model.NoticeFiles.Count; i++)
                    {
                        var fileModel = model.NoticeFiles[i];

                        sql = "USP_CmNotice_U02";

                        Gparam = new DynamicParameters();

                        Gparam.Add("@NoticeId", noticeId);
                        Gparam.Add("@FileSeq", fileModel.FileSeq);
                        Gparam.Add("@FileNm", fileModel.FileNm);
                        Gparam.Add("@FileUrl", fileModel.FileUrl);
                        Gparam.Add("@RegId", fileModel.RegId);
                        Gparam.Add("@UpdId", fileModel.UpdId);
                        Gparam.Add("@OV_RTN_CODE", dbType: DbType.Int32, direction: ParameterDirection.Output, size: 5);
                        Gparam.Add("@OV_RTN_MSG", dbType: DbType.String, direction: ParameterDirection.Output, size: 1000);

                        await _db.ExecuteAsync(sql, Gparam, commandType: CommandType.StoredProcedure);
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
