using eWroks.Api.Models.HrHealthCheck;
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
    public class HrHealthCheckServiceController : ControllerBase
    {
        private IHrHealthCheckRepository _repository;
        private ILogger _logger;

        public HrHealthCheckServiceController(IHrHealthCheckRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(HrHealthCheckServiceController));
        }

        #region Request
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetHrHealCheckList(string startDt, string endDt, string userId)
        {
            try
            {
                var result = await _repository.GetHrHealCheckList(startDt, endDt, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Master 상세
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetHrHealthCheckDetail(int healthId)
        {
            try
            {
                var result = await _repository.GetHrHealthCheckDetail(healthId);

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
        public async Task<IActionResult> SaveHealthCheck(HrHealthCheckGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveHealthCheck(model);

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
        public async Task<IActionResult> GetResponseHrHealCheckList(string startDt, string surveyYn, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            try
            {
                var result = await _repository.GetResponseHrHealCheckList(startDt, surveyYn, deptCd1, deptCd2, deptCd3, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponseHrHealCheckDashboardList(string startDt, string endDt, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            try
            {
                var result = await _repository.GetResponseHrHealCheckDashboardList(startDt, endDt, deptCd1, deptCd2, deptCd3, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetModalUserList(string clickDt, decimal clickVal, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            try
            {
                var result = await _repository.GetModalUserList(clickDt, clickVal, deptCd1, deptCd2, deptCd3, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponseHrHealCheckExcelList(string clickDt, string userId)
        {
            try
            {
                var result = await _repository.GetResponseHrHealCheckExcelList(clickDt, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        #endregion

    }
}
