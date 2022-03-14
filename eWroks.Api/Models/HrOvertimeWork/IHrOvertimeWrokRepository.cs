using eWroks.Api.Models.CmUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrOvertimeWork
{
    public interface IHrOvertimeWrokRepository
    {
        // 마스터리스트
        Task<List<HrOvertimeWorkDto>> GetOvertimeWorkList(string startDt, string endDt, string statusCd, string userId);
        // 상세
        Task<HrOvertimeWorkGroupDto> GetOvertimeWorkDetail(int otId);
        // 상세
        Task<string> GetWeeklyTimeTotal(string startDt, string userId);
        //저장
        Task<eWorksResult> SaveOvertimeWork(HrOvertimeWorkGroupDto model);

        // 마스터리스트 One
        Task<List<HrOvertimeWorkDto>> GetTaskingOvertimeWorkOneList(string userId);
        // 마스터리스트 Two
        Task<List<HrOvertimeWorkDto>> GetTaskingOvertimeWorkTwoList(string userId);
        // 마스터리스트
        Task<List<HrOvertimeWorkDto>> GetTaskingOvertimeWorkApprovedList(string startDt, string endDt, string userId);
        // 통계 리스트
        Task<List<HrOvertimeWorkStatisticsDto>> GetTaskingOvertimeWorkStatistics(string startDt, string endDt, string useOvertimeYn, string hrStatusCd, int deptCd1, int deptCd2, int deptCd3, string userId);
        //저장
        Task<eWorksResult> SaveTaskingOvertimeWork(int otId, int apprId, string remark, string statusCd, string updId);
        //저장
        Task<eWorksResult> SaveTaskingOvertimeWorkTwo(int otId, int apprId, string remark, string statusCd, string updId);


        // 마스터리스트
        Task<List<HrOvertimeWorkDto>> GetResponseOvertimeWorkList(string startDt, string endDt, string statusCd, string userId);
        // 마스터리스트
        Task<HrOvertimeWorkExcelDto> GetResponseOvertimeWorkExcelList(int otId);
        //저장
        Task<eWorksResult> SaveResponseOvertimeWork(HrOvertimeWorkGroupDto model);
        // HR 리스트 저장
        Task<eWorksResult> SaveResponseOvertimeWorkList(List<HrOvertimeWorkHrSaveParamDto> models);
        // Excel File Upload
        Task<eWorksResult> SaveResponseOvertimeWorkExcelUpload(List<HrOvertimeWorkExcelUploadDto> models);

        // 마스터리스트
        Task<List<CmUserDto>> GetOnBehalfUserList(string userId);
        //저장
        Task<eWorksResult> SaveResponseOvertimeWorkOnBehalf(HrOvertimeWorkGroupDto model);
    }
}
