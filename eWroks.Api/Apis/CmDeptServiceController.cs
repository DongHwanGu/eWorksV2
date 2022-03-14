using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmDept;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmDeptServiceController : ControllerBase
    {
        private ICmDeptRepository _repository;
        private ILogger _logger;

        public CmDeptServiceController(ICmDeptRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmDeptServiceController));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDeptMasterList()
        {
            try
            {
                var result = await _repository.GetDeptMasterList();

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 서브 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDeptSubList(int deptId)
        {
            try
            {
                var result = await _repository.GetDeptSubList(deptId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Optios
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDeptOptions(int deptId)
        {
            try
            {
                var result = await _repository.GetDeptOptions(deptId);

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
        public async Task<IActionResult> SaveDeptData(CmDeptDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveDeptData(model);

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
