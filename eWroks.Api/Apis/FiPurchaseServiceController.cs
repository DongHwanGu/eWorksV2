using eWroks.Api.Models.FiPurchase;
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
    public class FiPurchaseServiceController : ControllerBase
    {
        private IFiPurchaseRepository _repository;
        private ILogger _logger;

        public FiPurchaseServiceController(IFiPurchaseRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(FiPurchaseServiceController));
        }

        #region Request
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPurchaseList(string startDt, string endDt, string entityCd, string statusCd, string userId)
        {
            try
            {
                var result = await _repository.GetPurchaseList(startDt, endDt, entityCd, statusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// Approval List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalList(string entityCd, string branchCd, string categoryCd, int exchangeKRW, string userId)
        {
            try
            {
                var result = await _repository.GetApprovalList(entityCd, branchCd, categoryCd, exchangeKRW, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Approval User List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalUserList(int policyId, string apprCd, string userId)
        {
            try
            {
                var result = await _repository.GetApprovalUserList(policyId, apprCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Approval User List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPurchaseDetailData(int purchaseId, string userId)
        {
            try
            {
                var result = await _repository.GetPurchaseDetailData(purchaseId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Product Order Email 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPurchaseProductOrderEmail(int purchaseId, string userId)
        {
            try
            {
                var result = await _repository.GetPurchaseProductOrderEmail(purchaseId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Voucher List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPurchaseVoucherList(int purchaseId, string userId)
        {
            try
            {
                var result = await _repository.GetPurchaseVoucherList(purchaseId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Voucher Approval List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPurchaseVoucherApprovalList(int purchaseId,int partialId, string userId)
        {
            try
            {
                var result = await _repository.GetPurchaseVoucherApprovalList(purchaseId, partialId, userId);

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
        public async Task<IActionResult> SaveFiPurchase(FiPurchaseGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveFiPurchase(model);

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
        /// 메일보내기
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> MailSendProductOrder(FiPurchaseProductOrderEmailGroup model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.MailSendProductOrder(model);

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
        /// Partial 나누기
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveVoucherPartialCnt(int purchaseId, int patialCnt, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveVoucherPartialCnt(purchaseId, patialCnt, userId);

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
        /// OP Verification 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveOPVerificationData(int purchaseId, int partialId, string verificationDt, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveOPVerificationData(purchaseId, partialId, verificationDt, userId);

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
        /// Tax Invoice 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveTaxInvoiceData(int purchaseId, int partialId, string invoiceDt, string fileNm, string fileUrl, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaxInvoiceData(purchaseId, partialId, invoiceDt, fileNm, fileUrl, userId);

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
        // Voucher Partial 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveVoucherPartialData(int purchaseId, int partialId, string bankNm, string bankAccNo, int termsDays, decimal partialAmt, int partialVatAmt, string reason, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveVoucherPartialData(purchaseId, partialId, bankNm, bankAccNo, termsDays, partialAmt, partialVatAmt, reason, userId);

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
        // Voucher Partial Add End 저장
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveVoucherPartialAddEnd(int purchaseId, string btnGb, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveVoucherPartialAddEnd(purchaseId, btnGb, userId);

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
        // Voucher Partial 삭제
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteVoucherPartial(int purchaseId, int partialId, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteVoucherPartial(purchaseId, partialId, userId);

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

        #region Tasking
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetTaskingPurchaseList(string userId)
        {
            try
            {
                var result = await _repository.GetTaskingPurchaseList(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 마스터 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveTaskingPurchaseApproval(int purchaseId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingPurchaseApproval(purchaseId, apprId, remark, statusCd, updId);

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
        /// Partial 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveTaskingPurchasePartialApproval(int purchaseId, int partialId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingPurchasePartialApproval(purchaseId, partialId, apprId, remark, statusCd, updId);

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

        #region Response
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponsePurchaseList(string startDt, string endDt, string entityCd, string statusCd, string userId)
        {
            try
            {
                var result = await _repository.GetResponsePurchaseList(startDt, endDt, entityCd, statusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 마스터 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveResponsePurchaseClose(int purchaseId, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponsePurchaseClose(purchaseId, updId);

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
        /// 마스터 Update
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> UpdateResponsePurchase(int purchaseId, string assetNo, string remark, string fileNm4, string fileUrl4, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.UpdateResponsePurchase(purchaseId, assetNo, remark, fileNm4, fileUrl4, updId);

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
        /// Partial Update
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> UpdateResponsePurchasePartial(int purchaseId, int partialId, string assetNo, string remark, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.UpdateResponsePurchasePartial(purchaseId, partialId, assetNo, remark, updId);

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
        /// Partial Update
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveResponsePurchasePaid(int purchaseId, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponsePurchasePaid(purchaseId, updId);

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
