using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmCode
{
    public interface ICmCodeRepository
    {
        // 마스터 리스트
        Task<List<CmCodeDto>> GetCmCodeMasterList();
        // 서브 리스트
        Task<List<CmCodeDto>> GetCmCodeSubList(string cdMajor);
        // 상세
        Task<CmCodeDto> GetCmCodeDetailData(string cdMajor, string cdMinor);
        // 저장
        Task<eWorksResult> SaveCmCodeData(CmCodeDto cmCodeDto);

    }
}
