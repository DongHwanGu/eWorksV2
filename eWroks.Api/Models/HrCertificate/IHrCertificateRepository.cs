using eWroks.Api.Models.CmUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.HrCertificate
{
    public interface IHrCertificateRepository
    {
        // Mster
        Task<List<HrCertificateDto>> GetCertificateList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // Move
        Task<List<CmUserDeptMoveDto>> GetMoveList(string userId);
        // Save
        Task<eWorksResult> SaveCertificateData(HrCertificateDto model);

        // Hr Master
        Task<List<HrCertificateDto>> GetResponseCertificateList(string sStartDt, string sEndDt, string sStatusCd, string userId);
        // Save
        Task<eWorksResult> SaveResponseCertificate(HrCertificateDto model);



    }
}
