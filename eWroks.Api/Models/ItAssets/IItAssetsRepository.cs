using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.ItAssets
{
    public interface IItAssetsRepository
    {
        // 마스터 리스트
        Task<List<ItAsstesDto>> GetAssetsList(string assetsGb);

        // 마스터 저장
        Task<eWorksResult> SaveAssetsData(ItAsstesDto model);

        // ITem 리스트
        Task<List<ItAsstesItemDto>> GetAssetsItemList(int assetsId);

        // Item 저장
        Task<eWorksResult> SaveAssetsItemData(ItAsstesItemDto model);

    }
}
