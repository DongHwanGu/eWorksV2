using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.ItAcountAssets;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ItAcountAssetsServiceController : ControllerBase
    {
        private IItAcountAssetsRepository _repository;
        private ILogger _logger;

        public ItAcountAssetsServiceController(IItAcountAssetsRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(ItAcountAssetsServiceController));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetAcountUserList()
        {
            try
            {
                var result = await _repository.GetAcountUserList();

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 유저 상세
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetAcountAssetsDetailData(string userId)
        {
            try
            {
                var result = await _repository.GetAcountAssetsDetailData(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 아이템 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetAcountAssetsList(string userId, string assetsGb)
        {
            try
            {
                var result = await _repository.GetAcountAssetsList(userId, assetsGb);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 모달 아이템 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetModalAcountAssetsList(string userId, int assetsId)
        {
            try
            {
                var result = await _repository.GetModalAcountAssetsList(userId, assetsId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 모달 아이템 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetModalAssetsNmList(string assetsGb)
        {
            try
            {
                var result = await _repository.GetModalAssetsNmList(assetsGb);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 모달 아이템 리스트 NM (hardware)
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetHardwareNmList(string userId)
        {
            try
            {
                var result = await _repository.GetHardwareNmList(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 모달 아이템 리스트 (hardware)
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetModalHardwareSoftwareList(string userId, int pAssetsId, int pItemId, int cAssetsId)
        {
            try
            {
                var result = await _repository.GetModalHardwareSoftwareList(userId, pAssetsId, pItemId, cAssetsId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 모달 아이템 리스트 (hardware)
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetAcountAssetsToAssetsList(string userId, string assetsGb)
        {
            try
            {
                var result = await _repository.GetAcountAssetsToAssetsList(userId, assetsGb);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 마스터 리스트 EXCEL
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetAcountExcelUserList(string typeGb, string itStatusCd, int deptCd1, int deptCd2, int deptCd3)
        {
            try
            {
                var result = await _repository.GetAcountExcelUserList(typeGb, itStatusCd, deptCd1, deptCd2, deptCd3);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }


        /// <summary>
        /// 모달 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveModalItemData(ItAcountAssetsDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveModalItemData(models);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }


        /// <summary>
        /// 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveAssetsItemData(ItAcountAssetsDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveAssetsItemData(models);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }

        /// <summary>
        /// 삭제
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteAssetsItemData(ItAcountAssetsDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteAssetsItemData(models);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }

        /// <summary>
        /// 모달 저장 assetstoassets
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveModalAssetsToAssetsData(ItAcountAssetsToAssetsDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveModalAssetsToAssetsData(models);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }

        /// <summary>
        /// 저장 assetstoassets
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveAssetsToAssetsItemData(ItAcountAssetsToAssetsDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveAssetsToAssetsItemData(models);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }

        /// <summary>
        /// 저장 UserInfo
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveUserInfoData(ItAcountUserDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveUserInfoData(model);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }


        /// <summary>
        /// QnA
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetQnAData(string userId)
        {
            try
            {
                var result = await _repository.GetQnAData(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// QnA 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveQnAData(ItAcountQnA model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveQnAData(model);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                result.OV_RTN_CODE = -1;
                result.OV_RTN_MSG = e.Message;
                return Ok(result);
            }
        }


        /// <summary>
        /// Excel 다운
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetAcountExcelDownload(string typeGb, string strUserId)
        {
            try
            {
                var result = await _repository.GetAcountExcelDownload(typeGb, strUserId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }


    }
}
