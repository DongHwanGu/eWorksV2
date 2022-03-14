using eWroks.Api.Models.CmVendor;
using eWroks.Api.Models.FiPurchaseSetting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FiPurchaseSettingServeiceController : ControllerBase
    {
        private IFiPurchaseSettingRepositry _repository;
        private ILogger _logger;

        public FiPurchaseSettingServeiceController(IFiPurchaseSettingRepositry repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(FiPurchaseSettingServeiceController));
        }

        #region Currency
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCurrencyList(string currencyYear, string currencyMonth)
        {
            try
            {
                var result = await _repository.GetCurrencyList(currencyYear, currencyMonth);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveCurrencyData(FiCurrencyDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveCurrencyData(model);

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

        #endregion

        #region Vendor
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetVendorList(string entityCd)
        {
            try
            {
                var result = await _repository.GetVendorList(entityCd);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// Vendor List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetVendorContactList(int vendorId)
        {
            try
            {
                var result = await _repository.GetVendorContactList(vendorId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveVendorData(CmVendorGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveVendorData(model);

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
        #endregion

        #region Policy
        /// <summary>
        /// Vendor List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPolicyList(string processGb, string userId)
        {
            try
            {
                var result = await _repository.GetPolicyList(processGb, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SavePolicyData(FiApprovalPolicyDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SavePolicyData(model);

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
        #endregion

        #region Policy Purchase
        /// <summary>
        /// purchase List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalPurchaseList(int policyId, string userId)
        {
            try
            {
                var result = await _repository.GetApprovalPurchaseList(policyId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// user List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalPolicyUserList(int policyId, string userId)
        {
            try
            {
                var result = await _repository.GetApprovalPolicyUserList(policyId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// 정책 level List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalPurchaseLevelList(int policyId, int itemId)
        {
            try
            {
                var result = await _repository.GetApprovalPurchaseLevelList(policyId, itemId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// User CC 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalPolicyUserCCList(int policyId, string apprCd, string userId)
        {
            try
            {
                var result = await _repository.GetApprovalPolicyUserCCList(policyId, apprCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Branch 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalPolicyBranchList(int policyId, string userId)
        {
            try
            {
                var result = await _repository.GetApprovalPolicyBranchList(policyId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveApprovalPurchaseData(FiApprovalPolicyPurchaseDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveApprovalPurchaseData(model);

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
        /// 유저 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveApprovalPolicyUserData(List<FiApprovalPolicyUserDto> models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveApprovalPolicyUserData(models);

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
        /// 정책 leve 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveApprovalPurchaseLevelData(List<FiApprovalPolicyPurchaseLevelDto> models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveApprovalPurchaseLevelData(models);

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
        /// 유저  CC 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveApprovalPolicyUserCCData(List<FiApprovalPolicyUserCCDto> models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveApprovalPolicyUserCCData(models);

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
        /// 유저 삭제
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteApprovalPolicyUserData(int policyId, string apprCd, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteApprovalPolicyUserData(policyId, apprCd, userId);

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
        /// 유저 CC 삭제
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteApprovalPolicyUserCCData(int policyId, string apprCd, string userId, string ccUserId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteApprovalPolicyUserCCData(policyId, apprCd, userId, ccUserId);

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
        /// Branch Save
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveApprovalPolicyBranchData(FiApprovalPolicyBranchDto modal)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveApprovalPolicyBranchData(modal);

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
        /// Branch 삭제
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteApprovalPolicyBranchData(int policyId, string branchCd)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteApprovalPolicyBranchData(policyId, branchCd);

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
        /// 정책 삭제
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteApprovalPurchaseData(int policyId, int itemId, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteApprovalPurchaseData(policyId, itemId, userId);

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
        #endregion
    }
}
