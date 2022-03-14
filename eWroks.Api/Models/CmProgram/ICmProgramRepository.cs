using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmProgram
{
    public interface ICmProgramRepository
    {
        // 마스터 리스트
        Task<List<CmProgramDto>> GetProgramMasterList();
        // 상세
        Task<CmProgramDto> GetProgramDetailData(string programId);
        // 상위 프로그램 ID
        Task<List<CmProgramDto>> GetUpProgramIdOptions();


        // 저장
        Task<eWorksResult> SaveProgramData(CmProgramDto model);
    }
}
