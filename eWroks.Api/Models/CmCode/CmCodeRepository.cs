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

namespace eWroks.Api.Models.CmCode
{
    public class CmCodeRepository : ICmCodeRepository
    {
        private readonly IConfiguration _config;
        private readonly string _sqlConnectionString;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        /// <summary>
        /// 생성자
        /// </summary>
        /// <param name="loggerFactory"></param>
        public CmCodeRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _sqlConnectionString = _config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value;
            _db = new SqlConnection(_sqlConnectionString);
            _logger = loggerFactory.CreateLogger(nameof(CmCodeRepository));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmCodeDto>> GetCmCodeMasterList()
        {
            string sql = "USP_CmCode_R01";

            //var result = await _db.QueryMultipleAsync(sql, null, commandType: CommandType.StoredProcedure);
            //var CategoryOneList = reader.Read<CategoryOne>().ToList();
            //var CategoryTwoList = reader.Read<CategoryTwo>().ToList();
            var result = await _db.QueryAsync<CmCodeDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 서브 리스트
        /// </summary>
        /// <param name="cd_major"></param>
        /// <returns></returns>
        public async Task<List<CmCodeDto>> GetCmCodeSubList(string cdMajor)
        {
            string sql = "USP_CmCode_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@CdMajor", cdMajor);

            var result = await _db.QueryAsync<CmCodeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="cdMinor"></param>
        /// <returns></returns>
        public async Task<CmCodeDto> GetCmCodeDetailData(string cdMajor, string cdMinor)
        {
            string sql = "USP_CmCode_R03";

            var Gparam = new DynamicParameters();
            Gparam.Add("@CdMajor", cdMajor);
            Gparam.Add("@CdMinor", cdMinor);

            var result = await _db.QueryAsync<CmCodeDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="cdMinor"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveCmCodeData(CmCodeDto cmCodeDto)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmCode_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@CdMajor", cmCodeDto.CdMajor);
                    Gparam.Add("@CdMinor", cmCodeDto.CdMinor);
                    Gparam.Add("@UseYn", cmCodeDto.UseYn);
                    Gparam.Add("@FullName", cmCodeDto.FullName);
                    Gparam.Add("@SmallName", cmCodeDto.SmallName);
                    Gparam.Add("@FrCdMinor", cmCodeDto.FrCdMinor);
                    Gparam.Add("@SeCdMinor", cmCodeDto.SeCdMinor);
                    Gparam.Add("@CdLevel", cmCodeDto.CdLevel);
                    Gparam.Add("@CdOrder", cmCodeDto.CdOrder);
                    Gparam.Add("@CdRef1", cmCodeDto.CdRef1);
                    Gparam.Add("@CdRef2", cmCodeDto.CdRef2);
                    Gparam.Add("@CdRef3", cmCodeDto.CdRef3);
                    Gparam.Add("@CdRef4", cmCodeDto.CdRef4);
                    Gparam.Add("@CdRef5", cmCodeDto.CdRef5);
                    Gparam.Add("@CdProperty", cmCodeDto.CdProperty);
                    Gparam.Add("@RegId", cmCodeDto.RegId);
                    Gparam.Add("@UpdId", cmCodeDto.UpdId);
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
