using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmHoliDay;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmHoliDayServiceController : ControllerBase
    {
        private ICmHoliDayRepository _repository;
        private ILogger _logger;

        public CmHoliDayServiceController(ICmHoliDayRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmHoliDayServiceController));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetHoliDayList()
        {
            try
            {
                var result = await _repository.GetHoliDayList();

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
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveHoliDayData(CmHoliDayDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveHoliDayData(model);

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
        public async Task<IActionResult> DeleteScheduleData(CmHoliDayDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteScheduleData(model);

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


    }
}
