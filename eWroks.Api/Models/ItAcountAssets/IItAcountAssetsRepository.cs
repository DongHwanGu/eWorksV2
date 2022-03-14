using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.ItAcountAssets
{
    public interface IItAcountAssetsRepository
    {
        // 마스터 리스트
        Task<List<ItAcountUserDto>> GetAcountUserList();
        // 상세
        Task<ItAcountUserDto> GetAcountAssetsDetailData(string userId);
        // 상세
        Task<List<ItAcountAssetsDto>> GetAcountAssetsList(string userId, string assetsGb);
        // 팝업
        Task<List<ItAcountAssetsDto>> GetModalAcountAssetsList(string userId, int assetsId);
        // 팝업 Nm LIst
        Task<List<ItAcountAssetsDto>> GetModalAssetsNmList(string assetsGb);
        // 팝업 Nm LIst
        Task<List<object>> GetHardwareNmList(string userId);
        // 팝업 Hardware Nm LIst
        Task<List<ItAcountAssetsToAssetsDto>> GetModalHardwareSoftwareList(string userId, int pAssetsId, int pItemId, int cAssetsId);
        // 마스터 리스트 AssetsToAssets
        Task<List<ItAcountAssetsToAssetsDto>> GetAcountAssetsToAssetsList(string userId, string assetsGb);


        // Assets 모달 저장
        Task<eWorksResult> SaveModalItemData(ItAcountAssetsDto[] models);
        // Assets 저장
        Task<eWorksResult> SaveAssetsItemData(ItAcountAssetsDto[] models);
        // Assets 삭제
        Task<eWorksResult> DeleteAssetsItemData(ItAcountAssetsDto[] models);


        // Assets 모달 저장 AssetToAsset
        Task<eWorksResult> SaveModalAssetsToAssetsData(ItAcountAssetsToAssetsDto[] models);
        // Assets 저장 AssetToAsset
        Task<eWorksResult> SaveAssetsToAssetsItemData(ItAcountAssetsToAssetsDto[] models);

        // IT 상태 변경
        Task<eWorksResult> SaveUserInfoData(ItAcountUserDto model);

        // QNA 상세
        Task<ItAcountQnA> GetQnAData(string userId);
        // QnA 저장
        Task<eWorksResult> SaveQnAData(ItAcountQnA model);

        // Excel : 마스터 리스트
        Task<List<ItAcountUserDto>> GetAcountExcelUserList(string typeGb, string itStatusCd, int deptCd1, int deptCd2, int deptCd3);
        // Excel : 조회
        Task<ExcelDownloadGroupDto> GetAcountExcelDownload(string typeGb, string strUserId);

    }
}
