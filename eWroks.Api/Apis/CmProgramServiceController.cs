using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmProgram;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmProgramServiceController : ControllerBase
    {
        private ICmProgramRepository _repository;
        private ILogger _logger;

        public CmProgramServiceController(ICmProgramRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmCodeServiceController));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetProgramMasterList()
        {
            try
            {
                var result = await _repository.GetProgramMasterList();

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 상세조회
        /// </summary>
        /// <param name="programId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetProgramDetailData(string programId)
        {
            try
            {
                var result = await _repository.GetProgramDetailData(programId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 상세조회
        /// </summary>
        /// <param name="programId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetUpProgramIdOptions()
        {
            try
            {
                var result = await _repository.GetUpProgramIdOptions();

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
        public async Task<IActionResult> SaveProgramData(CmProgramDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveProgramData(model);

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
