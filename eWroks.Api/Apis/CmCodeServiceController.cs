using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmCode;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmCodeServiceController : ControllerBase
    {
        private ICmCodeRepository _repository;
        private ILogger _logger;

        public CmCodeServiceController(ICmCodeRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmCodeServiceController));
        }

        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCmCodeMasterList()
        {
            try
            {
                var result = await _repository.GetCmCodeMasterList();

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 서브리스트
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCmCodeSubList(string cdMajor)
        {
            try
            {
                var result = await _repository.GetCmCodeSubList(cdMajor);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 상세
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCmCodeDetailData(string cdMajor, string cdMinor)
        {
            try
            {
                var result = await _repository.GetCmCodeDetailData(cdMajor, cdMinor);

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
        public async Task<IActionResult> SaveCmCodeData(CmCodeDto cmCodeDto)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveCmCodeData(cmCodeDto);

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
