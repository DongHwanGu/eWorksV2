using eWorks.Webform.Common;
using eWorks.Webform.DataAccess;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace eWorks.Webform.ReportFiles
{
    public partial class CommonReportViewer : System.Web.UI.Page
    {
        string page = "";
        string key = "";
        string userId = "";

        List<string> listKey = new List<string>();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                userId = Request.QueryString["userId"];
                page = Request.QueryString["page"];
                key = Request.QueryString["key"];

                listKey = key.ToString().Split(',').ToList();

                if (string.IsNullOrEmpty(userId))
                {
                    ShowMessage.AlertMessage("로그인 후 이용바랍니다.");
                    return;
                }

                InitControls();
            }
        }

        /// <summary>
        /// 페이지 초기 가져오기
        /// </summary>
        private void InitControls()
        {
            try
            {
                string path = "";
                switch (page)
                {
                    case "TravelReport":
                        path = "ReportFiles/Travel/" + page + ".rdlc";
                        SetTravelReport(path);
                        break;
                    case "CertificateReport":
                        path = "ReportFiles/Certificate/" + page + ".rdlc";
                        SetCertificateReport(path);
                        break;
                    case "ExternalTrainingReport":
                        path = "ReportFiles/ExternalTraining/" + page + ".rdlc";
                        SetExternalTrainingReport(path);
                        break;
                    case "ExternalTrainingVoucherReport":
                        path = "ReportFiles/ExternalTraining/" + page + ".rdlc";
                        SetExternalTrainingVoucherReport(path);
                        break;
                    case "VacationReport":
                        path = "ReportFiles/Vacation/" + page + ".rdlc";
                        SetVacationReport(path);
                        break;
                    case "Purchase_PR_ETL_Report" :
                    case "Purchase_PR_Kimsco_Report" :
                    case "Purchase_PR_Testing_Report":
                        path = "ReportFiles/Purchase/" + page + ".rdlc";
                        SetPurchaseReport(path, page);
                        break;
                    case "Purchase_OP_ETL_Report":
                    case "Purchase_OP_Kimsco_Report":
                    case "Purchase_OP_Testing_Report":
                        path = "ReportFiles/Purchase/Product/" + page + ".rdlc";
                        SetPurchaseOPReport(path);
                        break;
                    case "Purchase_VC_Report":
                        path = "ReportFiles/Purchase/" + page + ".rdlc";
                        SetPurchaseVCReport(path);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception ex)
            {
                ShowMessage.AlertMessage(ex.Message);
            }
        }

        #region 구매건의서
        /// <summary>
        /// 구매건의서 PR
        /// </summary>
        /// <param name="path"></param>
        private void SetPurchaseReport(string path, string page)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("PurchaseId", listKey[0]);
            dicParam.Add("PageGb", page);


            DataSet DS = new DataSet();
            string sql = "USP_Report_Purchase_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);
            ReportDataSource RDS2 = new ReportDataSource("DataSet2", DS.Tables[1]);
            ReportDataSource RDS3 = new ReportDataSource("DataSet3", DS.Tables[2]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS2);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS3);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }

        /// <summary>
        /// 구매건의서 OP
        /// </summary>
        /// <param name="path"></param>
        private void SetPurchaseOPReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("PurchaseId", listKey[0]);
            dicParam.Add("PartialId", listKey[1]);

            DataSet DS = new DataSet();
            string sql = "USP_Report_Purchase_R02";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }

        /// <summary>
        /// 구매건의서 VC
        /// </summary>
        /// <param name="path"></param>
        private void SetPurchaseVCReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("PurchaseId", listKey[0]);
            dicParam.Add("PartialId", listKey[1]);

            DataSet DS = new DataSet();
            string sql = "USP_Report_Purchase_R03";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);
            ReportDataSource RDS2 = new ReportDataSource("DataSet2", DS.Tables[1]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS2);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }
        #endregion

        #region 휴가계
        /// <summary>
        /// 사외교육 바우처
        /// </summary>
        /// <param name="path"></param>
        private void SetVacationReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("LeaveHoliId", listKey[0]);


            DataSet DS = new DataSet();
            string sql = "USP_Report_HrLeaveHoliday_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);
            ReportDataSource RDS2 = new ReportDataSource("DataSet2", DS.Tables[1]);
            ReportDataSource RDS3 = new ReportDataSource("DataSet3", DS.Tables[2]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS2);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS3);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }
        #endregion

        #region 사외교육
        /// <summary>
        /// 사외교육 바우처
        /// </summary>
        /// <param name="path"></param>
        private void SetExternalTrainingVoucherReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("TrainingId", listKey[0]);


            DataSet DS = new DataSet();
            string sql = "USP_Report_ExternalTraining_R02";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);
            ReportDataSource RDS2 = new ReportDataSource("DataSet2", DS.Tables[1]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS2);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }

        /// <summary>
        /// 사외교육 기본
        /// </summary>
        /// <param name="path"></param>
        private void SetExternalTrainingReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("TrainingId", listKey[0]);

            DataSet DS = new DataSet();
            string sql = "USP_Report_ExternalTraining_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);
            ReportDataSource RDS2 = new ReportDataSource("DataSet2", DS.Tables[1]);
            ReportDataSource RDS3 = new ReportDataSource("DataSet3", DS.Tables[2]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(subreportExternalTraining);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS2);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS3);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }
        public void subreportExternalTraining(object sender, SubreportProcessingEventArgs e)
        {
            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("TrainingId", listKey[0]);

            DataSet DS = new DataSet();
            string sql = "USP_Report_ExternalTraining_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            e.DataSources.Add(new ReportDataSource("DataSet1", DS.Tables[1]));

            DS.Dispose();
        }
        #endregion

        #region 증명서
        private void SetCertificateReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("CertiId", listKey[0]);

            DataSet DS = new DataSet();
            string sql = "USP_Report_Certificate_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(subreport);
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        }

        public void subreport(object sender, SubreportProcessingEventArgs e)
        {
            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("CertiId", listKey[0]);

            DataSet DS = new DataSet();
            string sql = "USP_Report_Certificate_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            e.DataSources.Add(new ReportDataSource("DataSet1", DS.Tables[1]));

            DS.Dispose();
        }
        #endregion

        #region 출장
        /// <summary>
        /// 출장 보고서
        /// </summary>
        /// <param name="path"></param>
        private void SetTravelReport(string path)
        {
            ReportCommonViewer.PageCountMode = PageCountMode.Actual;
            ReportCommonViewer.LocalReport.EnableExternalImages = true;
            ReportCommonViewer.LocalReport.ReportPath = path;

            Dictionary<string, object> dicParam = new Dictionary<string, object>();
            dicParam.Add("TravelId", listKey[0]);


            DataSet DS = new DataSet();
            string sql = "USP_Report_Travel_R01";

            using (MSsqlAccess db = new MSsqlAccess())
            {
                DS = db.DB_ExcuteSelect(dicParam, sql, CommandType.StoredProcedure);
            }

            ReportDataSource RDS1 = new ReportDataSource("DataSet1", DS.Tables[0]);

            ReportCommonViewer.LocalReport.DataSources.Clear();
            ReportCommonViewer.LocalReport.DataSources.Add(RDS1);
            ReportCommonViewer.LocalReport.Refresh();

            DS.Dispose();
        } 
        #endregion
    }
}