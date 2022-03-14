using eWroks.Api.Models.CbSchedule;
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
    public class CbScheduleServiceController : ControllerBase
    {
        private ICbScheduleRepository _repository;
        private ILogger _logger;

        public CbScheduleServiceController(ICbScheduleRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CbScheduleServiceController));
        }

        /// <summary>
        /// 마스터 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetScheduleList(string sStartDt, string sEndDt, string sTeamCd, string sStatusCd, string inCludeYn, string userId)
        {
            try
            {
                var result = await _repository.GetScheduleList(sStartDt, sEndDt, sTeamCd, sStatusCd, inCludeYn, userId);

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
        public async Task<IActionResult> GetScheduleDetail(int schId)
        {
            try
            {
                var result = await _repository.GetScheduleDetail(schId);

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
        public async Task<IActionResult> GetDept3List(string userId)
        {
            try
            {
                var result = await _repository.GetDept3List(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// PIC 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetPICUserList(string date, string userId)
        {
            try
            {
                var result = await _repository.GetPICUserList(date, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 통계
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetScheduleStatisticsList(string sStartDt, string sEndDt, string sTeamCd, string sStatusCd, string inCludeYn, int deptCd3, string userId)
        {
            try
            {
                var result = await _repository.GetScheduleStatisticsList(sStartDt, sEndDt, sTeamCd, sStatusCd, inCludeYn, deptCd3, userId);

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
        public async Task<IActionResult> SaveCbScheduleData(CbScheduleDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveCbScheduleData(model);

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
