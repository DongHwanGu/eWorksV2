using eWroks.Api.Models.HrOvertimeWork;
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
    public class HrOvertimeWorkServiceController : ControllerBase
    {
        private IHrOvertimeWrokRepository _repository;
        private ILogger _logger;

        public HrOvertimeWorkServiceController(IHrOvertimeWrokRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(HrOvertimeWorkServiceController));
        }

        #region Request
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetOvertimeWorkList(string startDt, string endDt, string statusCd, string userId)
        {
            try
            {
                var result = await _repository.GetOvertimeWorkList(startDt, endDt, statusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Master 상세조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetOvertimeWorkDetail(int otId)
        {
            try
            {
                var result = await _repository.GetOvertimeWorkDetail(otId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }


        /// <summary>
        /// 주 토탈
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetWeeklyTimeTotal(string startDt, string userId)
        {
            try
            {
                var result = await _repository.GetWeeklyTimeTotal(startDt, userId);

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
        public async Task<IActionResult> SaveOvertimeWork(HrOvertimeWorkGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveOvertimeWork(model);

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
        public async Task<IActionResult> GetTaskingOvertimeWorkOneList(string userId)
        {
            try
            {
                var result = await _repository.GetTaskingOvertimeWorkOneList(userId);

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
        public async Task<IActionResult> GetTaskingOvertimeWorkTwoList(string userId)
        {
            try
            {
                var result = await _repository.GetTaskingOvertimeWorkTwoList(userId);

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
        public async Task<IActionResult> GetTaskingOvertimeWorkApprovedList(string startDt, string endDt, string userId)
        {
            try
            {
                var result = await _repository.GetTaskingOvertimeWorkApprovedList(startDt, endDt, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 통ㄱ계 List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetTaskingOvertimeWorkStatistics(string startDt, string endDt, string useOvertimeYn, string hrStatusCd
            , int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            try
            {
                var result = await _repository.GetTaskingOvertimeWorkStatistics(startDt, endDt, useOvertimeYn, hrStatusCd, deptCd1, deptCd2, deptCd3, userId); 

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
        public async Task<IActionResult> SaveTaskingOvertimeWork(int otId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingOvertimeWork(otId, apprId, remark, statusCd, updId);

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
        /// 마스터 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveTaskingOvertimeWorkTwo(int otId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingOvertimeWorkTwo(otId, apprId, remark, statusCd, updId);

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
        public async Task<IActionResult> GetResponseOvertimeWorkList(string startDt, string endDt, string statusCd, string userId)
        {
            try
            {
                var result = await _repository.GetResponseOvertimeWorkList(startDt, endDt, statusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Excel 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponseOvertimeWorkExcelList(int otId)
        {
            try
            {
                var result = await _repository.GetResponseOvertimeWorkExcelList(otId);

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
        public async Task<IActionResult> SaveResponseOvertimeWork(HrOvertimeWorkGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseOvertimeWork(model);

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
        /// 마스터 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveResponseOvertimeWorkList(List<HrOvertimeWorkHrSaveParamDto> models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseOvertimeWorkList(models);

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
        /// File Upload 
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveResponseOvertimeWorkExcelUpload(List<HrOvertimeWorkExcelUploadDto> models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseOvertimeWorkExcelUpload(models);

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

        #region OnBehalf
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetOnBehalfUserList(string userId)
        {
            try
            {
                var result = await _repository.GetOnBehalfUserList(userId);

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
        public async Task<IActionResult> SaveResponseOvertimeWorkOnBehalf(HrOvertimeWorkGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseOvertimeWorkOnBehalf(model);

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
