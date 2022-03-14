using Dapper;
using eWroks.Api.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace eWroks.Api
{
    public class eWorksFunction
    {
        #region 프로그램 리스트 소팅
        //public static DataTable ProgramListSort(DataTable dt)
        //{
        //    DataTable result = new DataTable();

        //    if (dt != null && dt.Rows.Count > 0)
        //    {
        //        for (int i = 0; i < dt.Columns.Count; i++)
        //        {
        //            result.Columns.Add(dt.Columns[i].ColumnName);
        //        }
        //        DataRow[] Rows = dt.Select("PROGRAM_LVL = 0"); // Get all parents nodes
        //        for (int i = 0; i < Rows.Length; i++)
        //        {
        //            DataRow dr = result.NewRow();


        //            for (int j = 0; j < result.Columns.Count; j++)
        //            {
        //                dr[j] = Rows[i][j].ToString();
        //            }
        //            result.Rows.Add(dr);

        //            CreateRow(dt, Rows[i]["PROGRAM_ID"].ToString(), ref result);
        //        }
        //    }

        //    return result;
        //}
        //private static void CreateRow(DataTable dt, string key, ref DataTable result)
        //{
        //    DataRow[] Rows = dt.Select("UP_PROGRAM_ID ='" + key + "'");
        //    if (Rows.Length == 0) { return; }
        //    for (int i = 0; i < Rows.Length; i++)
        //    {
        //        DataRow dr = result.NewRow();

        //        for (int j = 0; j < result.Columns.Count; j++)
        //        {
        //            dr[j] = Rows[i][j].ToString();
        //        }
        //        result.Rows.Add(dr);
        //    }
        //}
        #endregion

        #region 암호화
        public static string GetHashCode(string plainText)
        {
            //SHA256로 단방향 암호화
            byte[] clearBytes =
              System.Text.Encoding.UTF8.GetBytes(plainText);
            byte[] result;
            SHA256 shaM = new SHA256Managed();
            result = shaM.ComputeHash(clearBytes);
            return Convert.ToBase64String(result);
        }
        #endregion

        #region 메일보내기
        
        /// <summary>
        /// Biz 단에서 메일 보내기 : 구동환 1;
        /// </summary>
        /// <param name="send_mail"></param>
        /// <param name="rec_mail"></param>
        /// <param name="rec_CC"></param>
        /// <param name="rec_BCC"></param>
        /// <param name="send_subject"></param>
        /// <param name="send_contents"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public static eWorksResult SendMail(string send_mail, string rec_mail, string rec_CC, string rec_BCC, string send_subject, string send_contents, string files)
        {
            eWorksResult result = new eWorksResult();

            //if (!eWorksConfig.DB_CONNECT.Equals(DB_CONNECT_ENUM.Real))
            //{
            //    result.OV_RTN_CODE = 0;
            //    result.OV_RTN_MSG = "Test Server Return";
            //    return result;
            //}
            string strEx = string.Empty;

            MailManager mailManager = new MailManager();

            string sFrom = send_mail;   // 보내는 사람 Email 접수자로 변경
            string[] sTo = rec_mail.Split(';');
            string[] sCC = rec_CC.Split(';');
            string[] sBCC = rec_BCC.Split(';');
            string[] uploadfiles = rec_BCC.Split(';');
            string sTitle = send_subject;
            string sContents = send_contents;

            result = mailManager.SendMail(sFrom, sTo, sCC, sBCC, sTitle, sContents, MailManager.MailBodyType.Html, uploadfiles);

            return result;
        }

        /// <summary>
        /// Biz 단에서 메일 보내기 : 구동환 1;
        /// </summary>
        /// <param name="send_mail"></param>
        /// <param name="rec_mail"></param>
        /// <param name="rec_CC"></param>
        /// <param name="rec_BCC"></param>
        /// <param name="send_subject"></param>
        /// <param name="send_contents"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public static eWorksResult SendMail_AttachFile(string send_mail, string rec_mail, string rec_CC, string rec_BCC,
                                                         string send_subject, string send_contents, Attachment[] oAttachments)
        {
            eWorksResult result = new eWorksResult();
            MailManager mailManager = new MailManager();

            string strEx = string.Empty;
            string sFrom = send_mail;   // 보내는 사람 Email 접수자로 변경
            string[] sTo = rec_mail.Split(';');
            string[] sCC = rec_CC.Split(';');
            string[] sBCC = rec_BCC.Split(';');
            string sTitle = send_subject;
            string sContents = send_contents;

            result = mailManager.SendMail_AttachFile(sFrom, sTo, sCC, sBCC, sTitle, sContents, MailManager.MailBodyType.Html, oAttachments);

            return result;
        }
        #endregion
    }
}
