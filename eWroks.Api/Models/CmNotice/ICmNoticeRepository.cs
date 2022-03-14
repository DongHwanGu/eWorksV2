using eWroks.Api.Models.CmDept;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmNotice
{
    public interface ICmNoticeRepository
    {
        // Notice 리스트
        Task<List<CmNoticeDto>> GetNoticeList();

        // Notice 
        Task<CmNoticeDto> GetNoticeDetailData(int noticeId);

        // Notice 리스트
        Task<List<CmDeptDto>> GetDeptList();

        // 저장
        Task<eWorksResult> SaveNoticeData(CmNoticeDto model);
    }
}
