using eWroks.Api.Models.CmNotice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmMain
{
    public interface ICmMainRepository
    {
        // 마스터 메인 공지사항 
        Task<List<CmMainNoticeDto>> GetMainNoticeList(string userId);

        // 마스터 메인 승인
        Task<CmMainApprovalData> GetMainApprovalData(string userId);
    }
}
