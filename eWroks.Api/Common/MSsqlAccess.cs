using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace eWroks.Api.Common
{
    public class MSsqlAccess : IDisposable
    {

        public SqlConnection _db { get; set; }

        public static string _connectionString;
        private IConfiguration _config;
        private readonly ILogger _logger;

        public MSsqlAccess()
        {
            _connectionString = "TestConnection"; eWorksConfig.DB_CONNECT = DB_CONNECT_ENUM.Test;
            //_connectionString = "RealConnection"; eWroksConfig.DB_CONNECT = DB_CONNECT_ENUM.Real;
        }
        public MSsqlAccess(IConfiguration config, ILoggerFactory loggerFactory)
        {
            _config = config;
            _db = new SqlConnection(_config.GetSection("ConnectionString").GetSection(_connectionString).Value);
            _logger = loggerFactory.CreateLogger(nameof(MSsqlAccess));
        }

        #region MS SQL
        public DataSet DB_ExcuteSelect_Code(string value, string p_query, CommandType type)
        {
            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("IV_CD_MAJOR", value);

            return DB_ExcuteSelect(dicParam, p_query, type);
        }
        /// <summary>
        /// 조회
        /// </summary>
        /// <param name="dicParam"></param>
        /// <param name="p_query"></param>
        /// <returns></returns>
        public DataSet DB_ExcuteSelect(Dictionary<string, object> dicParam, string p_query, CommandType type)
        {
            DataSet ds = null;
            SqlConnection con = null;
            SqlCommand cmd = null;
            SqlDataAdapter adapter = null;

            try
            {
                string query = p_query;
                cmd = new SqlCommand(query);

                if (dicParam != null)
                {
                    foreach (var p in dicParam)
                    {
                        //cmd.Parameters.AddWithValue(p.Key, p.Value).Direction = ParameterDirection.Input;
                        //cmd.Parameters.Add(new SqlParameter(p.Key, p.Value));
                        // Set Input Parameter
                        SqlParameter oParam = new SqlParameter(p.Key, p.Value);
                        //oParam.SqlDbType = SqlDbType.NVarChar;
                        cmd.Parameters.Add(oParam);
                    }
                }

                cmd.CommandType = type;
                //if (cmd.CommandType == CommandType.Text) cmd.Prepare();
                cmd.CommandTimeout = 60;
                con = _db;
                con.Open();

                cmd.Connection = con;
                ds = new DataSet();
                adapter = new SqlDataAdapter(cmd);
                adapter.Fill(ds);

                return ds;
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                if (cmd != null) cmd.Dispose();
                if (ds != null) ds.Dispose();
                if (con != null)
                {
                    if (con.State == ConnectionState.Open) con.Close();
                    con.Dispose();
                }
                if (adapter != null) adapter.Dispose();
            }
        }

        /// <summary>
        /// 저장 / 업데이트 / 삭제
        /// </summary>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        public eWorksResult DB_ExcuteQuery(Dictionary<string, object> dicParam, string p_query, CommandType type)
        {
            SqlConnection con = null;
            SqlCommand cmd = null;
            eWorksResult myResult = new eWorksResult();

            try
            {
                string query = p_query;

                con = _db;
                con.Open();
                cmd = new SqlCommand(query);
                cmd.Connection = con;

                if (dicParam != null)
                {
                    foreach (var p in dicParam)
                    {
                        //cmd.Parameters.AddWithValue(p.Key, p.Value).Direction = ParameterDirection.Input;
                        //cmd.Parameters.Add(new SqlParameter(p.Key, p.Value));
                        SqlParameter oParam = new SqlParameter(p.Key, p.Value);
                        //oParam.SqlDbType = SqlDbType.NVarChar; // varchar는 중문이 안뎀
                        cmd.Parameters.Add(oParam);
                    }
                }

                // Set Output Paramater
                SqlParameter OV_RTN_CODE = new SqlParameter("@OV_RTN_CODE", SqlDbType.Int);
                OV_RTN_CODE.Direction = ParameterDirection.Output;
                OV_RTN_CODE.Size = 5;
                cmd.Parameters.Add(OV_RTN_CODE);

                SqlParameter OV_RTN_MSG = new SqlParameter("@OV_RTN_MSG", SqlDbType.VarChar);
                OV_RTN_MSG.Direction = ParameterDirection.Output;
                OV_RTN_MSG.Size = 1000;
                cmd.Parameters.Add(OV_RTN_MSG);

                cmd.CommandType = type;
                //if (cmd.CommandType == CommandType.Text) cmd.Prepare();
                cmd.CommandTimeout = 60;

                cmd.ExecuteNonQuery();

                if (cmd.Parameters["@OV_RTN_CODE"] != null && cmd.Parameters["@OV_RTN_CODE"].Direction == ParameterDirection.Output)
                {
                    myResult.OV_RTN_CODE = int.Parse(cmd.Parameters["@OV_RTN_CODE"].Value.ToString());
                }

                if (cmd.Parameters["@OV_RTN_MSG"] != null && cmd.Parameters["@OV_RTN_MSG"].Direction == ParameterDirection.Output)
                {
                    myResult.OV_RTN_MSG = cmd.Parameters["@OV_RTN_MSG"].Value.ToString();
                }

                return myResult;
            }
            catch (Exception ex)
            {
                myResult.OV_RTN_CODE = -1;
                myResult.OV_RTN_MSG =
                    cmd.Parameters["@OV_RTN_MSG"].Value == null ? ex.Message : cmd.Parameters["@OV_RTN_MSG"].Value.ToString();

                return myResult;
            }
            finally
            {
                if (cmd != null) cmd.Dispose();
                if (con != null)
                {
                    if (con.State == ConnectionState.Open) con.Close();
                    con.Dispose();
                }
            }
        }

        #endregion

        public void Dispose()
        {
        }
    }
}
