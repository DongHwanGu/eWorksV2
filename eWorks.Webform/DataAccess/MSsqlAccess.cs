using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace eWorks.Webform.DataAccess
{
    public class MSsqlAccess : IDisposable
    {
        public void Dispose()
        {
        }

        /// <summary>
        /// 세션 초
        /// </summary>
        private int CommandTimeOut = 60;
        private string ConnectionString = "";

        private string GetConnectionString()
        {
            return ConnectionString;
        }

        public MSsqlAccess()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings["eWorks_Test"].ToString();
            //ConnectionString = ConfigurationManager.ConnectionStrings["eWorks_Real"].ToString();

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
                cmd.CommandTimeout = CommandTimeOut;
                con = new SqlConnection(GetConnectionString());
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

                con = new SqlConnection(GetConnectionString());
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
                cmd.CommandTimeout = CommandTimeOut;

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
    }
}