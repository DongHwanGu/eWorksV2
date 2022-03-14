using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.HrExternalTraining;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HrExternalTrainingServiceController : ControllerBase
    {
        private IHrExternalTrainingRepository _repository;
        private ILogger _logger;

        public HrExternalTrainingServiceController(IHrExternalTrainingRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(HrExternalTrainingServiceController));
        }

        #region Request
        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetExternalTrainingList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetExternalTrainingList(sStartDt, sEndDt, sStatusCd, userId);

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
        public async Task<IActionResult> GetExternalTrainingDetail(int trainingId)
        {
            try
            {
                var result = await _repository.GetExternalTrainingDetail(trainingId);

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
        public async Task<IActionResult> SaveExternalTraining(HrExternalTrainingGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveExternalTraining(model);

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
        /// 리스트 파일 업로드
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> OnfileUploadClickSave(int trainingId, string fileNm, string fileUrl)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.OnfileUploadClickSave(trainingId, fileNm, fileUrl);

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
        /// 리스트 파일 삭제
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> OnfileUploadClickDelete(int trainingId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.OnfileUploadClickDelete(trainingId);

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
        public async Task<IActionResult> GetTaskingExternalTrainingList(string userId)
        {
            try
            {
                var result = await _repository.GetTaskingExternalTrainingList(userId);

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
        public async Task<IActionResult> SaveTaskingExternalTrainingApproval(int trainingId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveTaskingExternalTrainingApproval(trainingId, apprId, remark, statusCd, updId);

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
        public async Task<IActionResult> GetResponseExternalTrainingList(string sStartDt, string sEndDt, string sStatusCd, string userId)
        {
            try
            {
                var result = await _repository.GetResponseExternalTrainingList(sStartDt, sEndDt, sStatusCd, userId);

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
        public async Task<IActionResult> SaveResponseExternalTrainingApproval(int trainingId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveResponseExternalTrainingApproval(trainingId, remark, statusCd, updId);

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
        /// 마스터 Update
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> UpdateResponseExternalTraingData(string updateGb, int trainingId, int returnAmt, string paymentRegDt, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.UpdateResponseExternalTraingData(updateGb, trainingId, returnAmt, paymentRegDt, updId);

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
