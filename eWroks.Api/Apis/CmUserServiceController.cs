using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmUser;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmUserServiceController : ControllerBase
    {
        private ICmUserRepository _repository;
        private ILogger _logger;

        public CmUserServiceController(ICmUserRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmUserServiceController));
        }

        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetUserList(string it_status_cd, string hr_status_cd)
        {
            try
            {
                var result = await _repository.GetUserList(it_status_cd, hr_status_cd);

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
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetUserDetailData(string userId)
        {
            try
            {
                var result = await _repository.GetUserDetailData(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Role List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetRoleList()
        {
            try
            {
                var result = await _repository.GetRoleList();

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Office List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetOfficeList()
        {
            try
            {
                var result = await _repository.GetOfficeList();

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Dept List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDeptList(int deptId)
        {
            try
            {
                var result = await _repository.GetDeptList(deptId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Dept List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDutyEngList(string cdMinor)
        {
            try
            {
                var result = await _repository.GetDutyEngList(cdMinor);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 휴가일수 List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetLeaveCntList(string userId)
        {
            try
            {
                var result = await _repository.GetLeaveCntList(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        /// <summary>
        /// 휴가일수 아이템 List
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetLeaveCntItemList(string userId, string leaveYear)
        {
            try
            {
                var result = await _repository.GetLeaveCntItemList(userId, leaveYear);

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
        public async Task<IActionResult> SaveUserMgmtData(CmUserGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveUserMgmtData(model);

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
        /// 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveModalLeaveCnt(CmUserLeaveCnt model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveModalLeaveCnt(model);

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


        #region 출퇴근 관리
        /// <summary>
        /// 버튼정보
        /// </summary>
        /// <param name="thisDt"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetUserCommuteBtnInfo(string thisDt, string userId)
        {
            try
            {
                var result = await _repository.GetUserCommuteBtnInfo(thisDt, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 토탈정보
        /// </summary>
        /// <param name="thisDt"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetUserCommuteList(string thisDt, string userId)
        {
            try
            {
                var result = await _repository.GetUserCommuteList(thisDt, userId);

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
        public async Task<IActionResult> SaveUserCommuteData(string btnGb, string comStartDt, string outStartDt, string lat, string lng, string addrName, string remark, string userId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveUserCommuteData(btnGb, comStartDt, outStartDt, lat, lng, addrName, remark, userId);

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
