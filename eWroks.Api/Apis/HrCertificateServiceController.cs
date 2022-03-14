using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.HrCertificate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HrCertificateServiceController : ControllerBase
    {
        private IHrCertificateRepository _repository;
        private ILogger _logger;

        public HrCertificateServiceController(IHrCertificateRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(HrCertificateServiceController));
        }

        #region Request
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCertificateList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetCertificateList(sStartDt, sEndDt, sStatusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Move List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetMoveList(string userId)
        {
            try
            {
                var result = await _repository.GetMoveList(userId);

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
        public async Task<IActionResult> SaveCertificateData(HrCertificateDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveCertificateData(model);

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
        public async Task<IActionResult> GetResponseCertificateList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetResponseCertificateList(sStartDt, sEndDt, sStatusCd, userId);

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
        public async Task<IActionResult> SaveResponseCertificate(HrCertificateDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseCertificate(model);

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
