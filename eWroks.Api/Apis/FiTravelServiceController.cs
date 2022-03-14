using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.FiTravel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FiTravelServiceController : ControllerBase
    {
        private IFiTravelRepository _repository;
        private ILogger _logger;

        public FiTravelServiceController(IFiTravelRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(FiTravelServiceController));
        }

        #region Request
        /// <summary>
        /// 마스터 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetTravelList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetTravelList(sStartDt, sEndDt, sStatusCd, userId);

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
        public async Task<IActionResult> GetTravelDetail(int travelId)
        {
            try
            {
                var result = await _repository.GetTravelDetail(travelId);

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
        public async Task<IActionResult> SaveTravelData(FiTravelGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTravelData(model);

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
        /// Tasking 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetTaskingTravelList(string userId)
        {
            try
            {
                var result = await _repository.GetTaskingTravelList(userId);

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
        public async Task<IActionResult> SaveTaskingApproval(int travelId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingApproval(travelId, apprId, remark, statusCd, updId);

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
        /// 마스터 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponseTravelList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetResponseTravelList(sStartDt, sEndDt, sStatusCd, userId);

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
        public async Task<IActionResult> SaveResponseApproval(int travelId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseApproval(travelId, remark, statusCd, updId);

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
