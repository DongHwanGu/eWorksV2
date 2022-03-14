using eWroks.Api.Models.HrLeaveHoliday;
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
    public class HrLeaveHolidayServiceController : ControllerBase
    {
        private IHrLeaveHolidayRepository _repository;
        private ILogger _logger;

        public HrLeaveHolidayServiceController(IHrLeaveHolidayRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(HrLeaveHolidayServiceController));
        }

        #region Request
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetLeaveHolidayList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetLeaveHolidayList(sStartDt, sEndDt, sStatusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 마스터 상세
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetLeaveHolidayDetail(int leaveHoliId)
        {
            try
            {
                var result = await _repository.GetLeaveHolidayDetail(leaveHoliId);

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
        public async Task<IActionResult> SaveLeaveHolidayData(HrLeaveHolidayGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveLeaveHolidayData(model);

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
        public async Task<IActionResult> GetTaskingLeaveHolidayList(string userId)
        {
            try
            {
                var result = await _repository.GetTaskingLeaveHolidayList(userId);

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
        public async Task<IActionResult> SaveTaskingLeaveHolidayApproval(int leaveHoliId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingLeaveHolidayApproval(leaveHoliId, apprId, remark, statusCd, updId);

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
        public async Task<IActionResult> GetResponseLeaveHolidayList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetResponseLeaveHolidayList(sStartDt, sEndDt, sStatusCd, userId);

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
        public async Task<IActionResult> SaveResponseLeaveHolidayApproval(int leaveHoliId, string remark, string reason, string leaveYear, string statusCd, string updId, [FromBody] List<HrLeaveHolidayDateDto> hrLeaveHolidayDateDtos)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseLeaveHolidayApproval(leaveHoliId, remark, reason, leaveYear, statusCd, updId, hrLeaveHolidayDateDtos);

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
