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

namespace eWroks.Api.Models.CmVendor
{
    public class CmVendorRepository : ICmVendorRepository
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _db;
        private readonly ILogger _logger;

        public CmVendorRepository(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(eWorksConfig.GetConnectionString()).Value);
            _logger = loggerFactory.CreateLogger(nameof(CmVendorRepository));
        }

      
        /// <summary>
        /// 벤더 정보
        /// </summary>
        /// <returns></returns>
        public async Task<List<CmVendorDto>> GetVendorList()
        {
            string sql = "USP_CmVendor_R01";

            var result = await _db.QueryAsync<CmVendorDto>(sql, null, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }

        /// <summary>
        /// 벤더 상세
        /// </summary>
        /// <param name="vendorId"></param>
        /// <returns></returns>
        public async Task<CmVendorDto> GetVendorDetailData(int vendorId)
        {
            string sql = "USP_CmVendor_R02";

            var Gparam = new DynamicParameters();
            Gparam.Add("@VendorId", vendorId);

            var result = await _db.QueryAsync<CmVendorDto>(sql, Gparam, commandType: CommandType.StoredProcedure);

            return result.SingleOrDefault();
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<eWorksResult> SaveVendorData(CmVendorDto model)
        {
            var result = new eWorksResult();

            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    string sql = "USP_CmVendor_U01";

                    var Gparam = new DynamicParameters();
                    Gparam.Add("@VendorId", model.VendorId);
                    Gparam.Add("@VendorGb", model.VendorGb);
                    Gparam.Add("@VendorNm", model.VendorNm);
                    Gparam.Add("@VendorEnm", model.VendorEnm);
                    Gparam.Add("@ZipCode", model.ZipCode);
                    Gparam.Add("@AddrKr", model.AddrKr);
                    Gparam.Add("@AddrEn", model.AddrEn);
                    Gparam.Add("@Country", model.Country);
                    Gparam.Add("@Tel", model.Tel);
                    Gparam.Add("@Fax", model.Fax);
                    Gparam.Add("@CdRef1", model.CdRef1);
                    Gparam.Add("@CdRef2", model.CdRef2);
                    Gparam.Add("@CdRef3", model.CdRef3);
                    Gparam.Add("@UseYn", model.UseYn);
                    Gparam.Add("@BusinessNo", model.BusinessNo);
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
    }
}
