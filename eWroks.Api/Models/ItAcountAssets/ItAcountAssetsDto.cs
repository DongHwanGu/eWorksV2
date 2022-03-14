using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.ItAcountAssets
{
    public class ItAcountUserDto
    {
        public string UserId { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string LoginId { get; set; }
        public string LoginPassword { get; set; }
        public string WorkerId { get; set; }
        public string Email { get; set; }
        public string Tel { get; set; }
        public string MobileTel { get; set; }
        public string EnterDt { get; set; }
        public string EntireDt { get; set; }
        public string EntireGb { get; set; }
        public string UserGb { get; set; }
        public string DeptCd1 { get; set; }
        public string DeptCd2 { get; set; }
        public string DeptCd3 { get; set; }
        public string DeptCd4 { get; set; }
        public string DeptCdKor { get; set; }
        public string DutyCdKor { get; set; }
        public string UpDutyCdEng { get; set; }
        public string DutyCdEng { get; set; }
        public string PreLeaveCnt { get; set; }
        public string OrgLeaveCnt { get; set; }
        public string UserPic { get; set; }
        public string BirthDay { get; set; }
        public string AddressKor { get; set; }
        public string GenderGb { get; set; }
        public string CtsTypeId { get; set; }
        public string MasYn { get; set; }
        public string ExtNum { get; set; }
        public string IT_StatusCd { get; set; }
        public string HR_StatusCd { get; set; }
        public string HR_Remark { get; set; }
        public string Remark { get; set; }
        public string RoleId { get; set; }
        public string OfficeId { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string AlertNm { get; set; }
        public string HostNm { get; set; }
        public string ControlNm { get; set; }

    }

    public class ItAcountAssetsDto
    {
        // 현재 테이블
        public string UserId { get; set; }
        public int AssetsId { get; set; }
        public int ItemId { get; set; }
        public string AssetsGb { get; set; }
        public int UseItemCnt { get; set; }
        public int ReCnt { get; set; }

        // Assets Item 쪽
        public string AssetsNm { get; set; }
        public string ItemNm { get; set; }
        public int ItemCnt { get; set; }
        public string PurchaseDt { get; set; }
        public string ControlNo { get; set; }
        public string Manufacture { get; set; }
        public string SerialNo { get; set; }
        public string ReplaceDt { get; set; }
        public string BusinessLine { get; set; }
        public string HostNm { get; set; }
        public string DisposalDt { get; set; }
        public string StockYn { get; set; }
        public string UseYn { get; set; }
        public string CdRef1 { get; set; }
        public string CdRef2 { get; set; }
        public string CdRef3 { get; set; }
        public string CdRef4 { get; set; }
        public string CdRef5 { get; set; }
        public string CdRef6 { get; set; }
        public string CdRef7 { get; set; }
        public string CdRef8 { get; set; }
        public string CdRef9 { get; set; }
        public string CdRef10 { get; set; }

        // 현재 테이블
        public string ItemStatus { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    public class ItAcountAssetsToAssetsDto
    {
        public int PAssetsId { get; set; }
        public string PHostNm { get; set; }
        public int PItemId { get; set; }
        public string PItemNm { get; set; }

        public int CAssetsId { get; set; }
        public string CAssetsNm { get; set; }
        public int CItemId { get; set; }
        public string CItemNm { get; set; }
        public int CItemCnt { get; set; }
        public int CUseItemCnt { get; set; }
        public int CReCnt { get; set; }
        public string CStockYn { get; set; }
        public string CPurchaseDt { get; set; }
        public string CSerialNo { get; set; }
        public string CControlNo { get; set; }
        public string CRemark { get; set; }

        public string RegId { get; set; }
        public string UpdId { get; set; }
    }

    /// <summary>
    /// QnA
    /// </summary>
    public class ItAcountQnA
    {
        public int QnAId { get; set; }
        public string QnADesc { get; set; }
        public string StatusCd { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string UpdDtNm { get; set; }
    }

    public class ExcelDownloadGroupDto
    {
        public ApplicationExcelDto applicationExcelDtos { get; set; }
        public SoftwareExcelDtos softwareExcelDtos { get; set; }
        public HardwareExcelDto hardwareExcelDtos { get; set; }
        public NetworkExcelDto networkExcelDtos { get; set; }
    }

    /// <summary>
    /// 엑셀 다운 : Application
    /// </summary>
    public class ApplicationExcelDto
    {
        public string Position { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string Dept1 { get; set; }
        public string Dept2 { get; set; }
        public string Dept3 { get; set; }
        public string Dept4 { get; set; }
        public string ITStatus { get; set; }
        public string AD { get; set; }
        public string EmailE3 { get; set; }
        public string EmailF3 { get; set; }
        public string ASTRA { get; set; }
        public string AuditTool { get; set; }
        public string Cognos { get; set; }
        public string Datalink { get; set; }
        public string Evolution { get; set; }
        public string GSCC { get; set; }
        public string iConnect { get; set; }
        public string InfoLink { get; set; }
        public string PeopleSoft { get; set; }
        public string Phoenix { get; set; }
        public string TIPS { get; set; }
        public string Getinfo { get; set; }
        public string Homepage { get; set; }
        public string IntertekeWorks { get; set; }
        public string KDTS { get; set; }
        public string QRCode { get; set; }
        public string SolidWorks { get; set; }
        public string SUN_CE { get; set; }
        public string Vision_CE { get; set; }
        public string Worldquest { get; set; }
        public string SUN_CG { get; set; }
        public string Vision_CG { get; set; }
        public string Autobill { get; set; }
        public string NewAutobill { get; set; }
        public string TwoDbarcode { get; set; }
        public string SUN_Web { get; set; }
        public string Douzone_iCube { get; set; }

    }

    /// <summary>
    /// 엑셀 다운 : SoftWare
    /// </summary>
    public class SoftwareExcelDtos
    {
        public string Position { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string Dept1 { get; set; }
        public string Dept2 { get; set; }
        public string Dept3 { get; set; }
        public string Dept4 { get; set; }
        public string ITStatus { get; set; }
        public string Office { get; set; }
        public string Visio { get; set; }
        public string Acrobat { get; set; }
        public string Photoshop { get; set; }
        public string Illustrator { get; set; }
        public string PDFPro { get; set; }
        public string PhantomPDF { get; set; }
        public string Hangul { get; set; }
        public string Cylance { get; set; }
        public string Optics { get; set; }
        public string Zscaler { get; set; }
        public string Sophos { get; set; }
        public string SCCM { get; set; }
        public string Bandizip { get; set; }
        public string WinZip { get; set; }
        public string Pkzip { get; set; }
        public string NewAutobill { get; set; }
        public string Autobill { get; set; }
        public string SolidWorks { get; set; }
        public string Remark { get; set; }
    }

    /// <summary>
    /// 엑셀 다운 : Hardware
    /// </summary>
    public class HardwareExcelDto
    {
        public string Position { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string Dept1 { get; set; }
        public string Dept2 { get; set; }
        public string Dept3 { get; set; }
        public string Dept4 { get; set; }
        public string ITStatus { get; set; }
        public string Type { get; set; }
        public string ControlNo { get; set; }
        public string HostName { get; set; }
        public string Manufacture { get; set; }
        public string Model { get; set; }
        public string Cpu { get; set; }
        public string Ram { get; set; }
        public string HDD { get; set; }
        public string SerialNo { get; set; }
        public string PurchaseDate { get; set; }
        public string ReplaceDate { get; set; }
        public string StockYn { get; set; }
        public string UseCnt { get; set; }
        public string Remark { get; set; }
    }

    /// <summary>
    /// 엑셀 다운 : Network
    /// </summary>
    public class NetworkExcelDto
    {
        public string Position { get; set; }
        public string UserNm { get; set; }
        public string UserEnm { get; set; }
        public string Dept1 { get; set; }
        public string Dept2 { get; set; }
        public string Dept3 { get; set; }
        public string Dept4 { get; set; }
        public string ITStatus { get; set; }
        public string ADEmail { get; set; }
        public string NetworkType { get; set; }
        public string NetworkName { get; set; }
        public string Remark { get; set; }
    }
}



















