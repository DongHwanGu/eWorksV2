<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CommonReportViewer.aspx.cs" Inherits="eWorks.Webform.ReportFiles.CommonReportViewer"  %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=15.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager runat="server"></asp:ScriptManager>        
        <rsweb:ReportViewer ID="ReportCommonViewer" runat="server" Width="100%" Height="100%" 
                SizeToReportContent="true" 
                ShowPrintButton="true"
                KeepSessionAlive="false"
                AsyncRendering="false"
            >
                <LocalReport ReportPath="ReportFiles\Travel\TravelReport.rdlc">
                </LocalReport>
            </rsweb:ReportViewer>
    </form>
</body>
</html>


