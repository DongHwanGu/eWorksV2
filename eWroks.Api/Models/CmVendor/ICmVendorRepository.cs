using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmVendor
{
    public interface ICmVendorRepository
    {
        // Master
        Task<List<CmVendorDto>> GetVendorList();
        // Detail
        Task<CmVendorDto> GetVendorDetailData(int vendorId);

        // Vendor 저장
        Task<eWorksResult> SaveVendorData(CmVendorDto model);
    }
}
