using eWroks.Api.Models.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CbTimeSheet
{
    public interface ICbTimeSheetRepository
    {
        // 마스터리스트
        Task<List<CbTimeSheetDto>> GetCbTimeSheetList(string registerDt, string statusCd, string userId);
        // 마스터리스트 상세
        Task<CbTimeSheetGroupDto> GetCbTimeSheetDetail(int timeId);
        //저장
        Task<eWorksResult> SaveCbTimeSheet(CbTimeSheetGroupDto model);


        // 마스터리스트
        Task<List<CbTimeSheetDto>> GetCbTimeSheetApprovalList(string startDt, string endDt, string statusCd, string userId);
        // 마스터리스트 주간
        Task<List<CbTimeSheetWeeklyDto>> GetCbTimeSheetWeeklyList(int timeId, string userId);
        // 마스터리스트
        Task<List<CbTimeSheetDepartmentDto>> GetCbTimeSheetDepartmentList(string startDt, string retirementYn, int deptCd1, int deptCd2, int deptCd3, string userId);
        // Hr Excel
        Task<CbTimeSheetHrExcelDto> GetResponseHRExcelDownload(string clickDt, string userId);
        // Excel
        Task<DataSet> GetResponseExcelDownload(string clickDt, string strUserId);

        //저장
        Task<eWorksResult> SaveCbTimeSheetApproval(int timeId, int apprId, string remark, string statusCd, string updId);


        // Week Select Box
        Task<List<CommonSelectDto>> GetOfficeWeekList(string year);
        // Office List
        Task<List<CbTimeSheetOfficeDto>> GetDashboardOfficeList(int deptCd3, string overtimeYn, string officeYear, string officeWeek, string userId);
    }
}
