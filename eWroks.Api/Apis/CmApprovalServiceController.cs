using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmApproval;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmApprovalServiceController : ControllerBase
    {
        private ICmApprovalRepository _repository;
        private ILogger _logger;

        public CmApprovalServiceController(ICmApprovalRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmApprovalServiceController));
        }

        /// <summary>
        /// 유저 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> getApprovalList(int deptCd1
                                                    , int deptCd2
                                                    , int deptCd3
                                                    , string approvalGb
                                                    , string approvalCd
        ) {
            try
            {
                var result = await _repository.GetApprovalUserList(deptCd1, deptCd2, deptCd3, approvalGb, approvalCd);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 모달 유저 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetModalApprovalUserList(int deptCd1, int deptCd2, int deptCd3)
        {
            try
            {
                var result = await _repository.GetModalApprovalUserList(deptCd1, deptCd2, deptCd3);

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
        /// <param name="models"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveModalUserList(CmApprovalModalDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveModalUserList(models);

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
        /// <param name="models"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteUserList(CmApprovalDto[] models)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteUserList(models);

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
