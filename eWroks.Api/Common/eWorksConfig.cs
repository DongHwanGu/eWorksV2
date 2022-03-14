using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace eWroks.Api
{
    public class eWorksConfig
    {
        /// <summary>
        /// 커넥션 
        /// </summary>
        /// <returns></returns>
        public static string GetConnectionString()
        {
            string _connectionString = "";

            _connectionString = "TestConnection"; DB_CONNECT = DB_CONNECT_ENUM.Test;
            //_connectionString = "RealConnection"; DB_CONNECT = DB_CONNECT_ENUM.Real;

            return _connectionString;
        }
        // DB 커넥션 정보
        public static DB_CONNECT_ENUM DB_CONNECT { get; set; }

        #region Mail Seting
        public static string smtpServer = "10.64.50.17";
        //public static string smtpServer = "172.17.92.13";
        public static int smtpPort = 25;
        public static string GetERPLinkPath()
        {
            string path = "";
            switch (DB_CONNECT)
            {
                case DB_CONNECT_ENUM.Local:
                    path = "http://172.17.92.251:9191/";
                    break;
                case DB_CONNECT_ENUM.Test:
                    path = "http://172.17.92.251:9191/";
                    break;
                case DB_CONNECT_ENUM.Real:
                    path = "https://eworks.Intertek.co.kr/";
                    break;
                default:
                    break;
            }
            return path;
        }
        #endregion
        #region 파일업로드 Local Path
        // 파일 위치 관련
        public static string Local_Path()
        {
            string Local_Path = "";
            switch (DB_CONNECT)
            {
                case DB_CONNECT_ENUM.Local:
                    Local_Path = @"\\172.17.92.15\eWorksV2\Test\";
                    break;
                case DB_CONNECT_ENUM.Test:
                    Local_Path = @"\\172.17.92.15\eWorksV2\Test\";
                    break;
                case DB_CONNECT_ENUM.Real:
                    Local_Path = @"\\172.17.92.15\eWorksV2\Real\";
                    break;
                default:
                    break;
            }
            return Local_Path;
        }
        #endregion
        public static string Server_Path_Test = "http://172.17.92.251:9191/Upload/";
        public static string Server_Path_Real = "https://eworks.Intertek.co.kr/Upload/";

        public static string UploadLocal_Path(string pagenm)
        {
            return Local_Path() + pagenm + @"\";
        }
        public static string UploadServer_Path(string pagenm)
        {
            string path = "";

            switch (DB_CONNECT)
            {
                case DB_CONNECT_ENUM.Local:
                    path = Server_Path_Test + pagenm + "/";
                    break;
                case DB_CONNECT_ENUM.Test:
                    path = Server_Path_Test + pagenm + "/";
                    break;
                case DB_CONNECT_ENUM.Real:
                    path = Server_Path_Real + pagenm + "/";
                    break;
                default:
                    break;
            }

            return path;
        }

        public static string UploadLocal_MonthPath(string pagenm)
        {
            // 폴더 경로
            string year = DateTime.Now.Year.ToString();
            string month = DateTime.Now.Month.ToString().PadLeft(2, '0');
            string yearmonth = year + @"\" + month + @"\";

            DirectoryInfo di = new DirectoryInfo(UploadLocal_Path(pagenm) + year);
            if (di.Exists == false)
            {
                di.Create();
            }
            DirectoryInfo di2 = new DirectoryInfo(UploadLocal_Path(pagenm) + year + @"\" + month);
            if (di2.Exists == false)
            {
                di2.Create();
            }

            return Local_Path() + pagenm + @"\" + yearmonth;
        }
        public static string UploadServer_MonthPath(string pagenm)
        {
            // 폴더 경로
            string year = DateTime.Now.Year.ToString();
            string month = DateTime.Now.Month.ToString().PadLeft(2, '0');
            string yearmonth = year + "/" + month + "/";

            string path = "";

            switch (DB_CONNECT)
            {
                case DB_CONNECT_ENUM.Local:
                    path = Server_Path_Test + pagenm + "/";
                    break;
                case DB_CONNECT_ENUM.Test:
                    path = Server_Path_Test + pagenm + "/";
                    break;
                case DB_CONNECT_ENUM.Real:
                    path = Server_Path_Real + pagenm + "/";
                    break;
                default:
                    break;
            }

            return path + yearmonth;
        }
    }

    /// <summary>
    /// DB ENUM
    /// </summary>
    public enum DB_CONNECT_ENUM
    {
        Local = 0,
        Test = 1,
        Real = 2,
    }

}
