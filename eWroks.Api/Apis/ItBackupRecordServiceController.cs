using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.ItBackupRecord;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ItBackupRecordServiceController : ControllerBase
    {
        private IItBackupRecordRepository _repository;
        private ILogger _logger;

        public ItBackupRecordServiceController(IItBackupRecordRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(ItBackupRecordServiceController));
        }


        /// <summary>
        /// 마스터 리스트
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetBackupRecordList(string backupGb, string backupDt)
        {
            try
            {
                var result = await _repository.GetBackupRecordList(backupGb, backupDt);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 토탈
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetBackupRecordTotalData(string backupGb, string backupDt)
        {
            try
            {
                var result = await _repository.GetBackupRecordTotalData(backupGb, backupDt);

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
        public async Task<IActionResult> SaveBackupRecord(ItBackupRecordDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveBackupRecord(models);

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
