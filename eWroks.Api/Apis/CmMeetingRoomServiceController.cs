using eWroks.Api.Models.CmMeetingRoom;
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
    public class CmMeetingRoomServiceController : ControllerBase
    {
        private ICmMeetingRoomRepository _repository;
        private ILogger _logger;

        public CmMeetingRoomServiceController(ICmMeetingRoomRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmMeetingRoomServiceController));
        }

        /// <summary>
        /// Master List 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetMeetingRoomList(string thisDt, string meetingGb, string userId)
        {
            try
            {
                var result = await _repository.GetMeetingRoomList(thisDt, meetingGb, userId);

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
        public async Task<IActionResult> GetMeetingRoomSelectList(string selectDt, string meetingGb, string userId)
        {
            try
            {
                var result = await _repository.GetMeetingRoomSelectList(selectDt, meetingGb, userId);

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
        public async Task<IActionResult> SaveMeetRoomData(CmMeetingRoomDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveMeetRoomData(model);

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
        /// <param name="cdMajor"></param>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteMeetRoomData(int meetingId, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteMeetRoomData(meetingId, userId);

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
