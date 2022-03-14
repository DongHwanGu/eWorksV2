using ClosedXML.Excel;
using eWroks.Api.Models.CbTimeSheet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CbTimeSheetServiceController : ControllerBase
    {
        private ICbTimeSheetRepository _repository;
        private ILogger _logger;

        public CbTimeSheetServiceController(ICbTimeSheetRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CbTimeSheetServiceController));
        }

        #region Request
        /// <summary>
        /// 마스터 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCbTimeSheetList(string registerDt, string statusCd, string userId)
        {
            try
            {
                var result = await _repository.GetCbTimeSheetList(registerDt, statusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 마스터 조회 상세
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCbTimeSheetDetail(int timeId)
        {
            try
            {
                var result = await _repository.GetCbTimeSheetDetail(timeId);

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
        public async Task<IActionResult> SaveCbTimeSheet(CbTimeSheetGroupDto model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveCbTimeSheet(model);

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
        public async Task<IActionResult> GetCbTimeSheetApprovalList(string startDt, string endDt, string statusCd, string userId)
        {
            try
            {
                var result = await _repository.GetCbTimeSheetApprovalList(startDt, endDt, statusCd, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 주간 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCbTimeSheetWeeklyList(int timeId, string userId)
        {
            try
            {
                var result = await _repository.GetCbTimeSheetWeeklyList(timeId, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// 부서 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCbTimeSheetDepartmentList(string startDt, string retirementYn, int deptCd1, int deptCd2, int deptCd3, string userId)
        {
            try
            {
                var result = await _repository.GetCbTimeSheetDepartmentList(startDt, retirementYn, deptCd1, deptCd2, deptCd3, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Hr Excel
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponseHRExcelDownload(string clickDt, string userId)
        {
            try
            {
                var result = await _repository.GetResponseHRExcelDownload(clickDt, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// Excel
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetResponseExcelDownload(string clickDt, string strUserId)
        {
            try
            {
                var result = await _repository.GetResponseExcelDownload(clickDt, strUserId);

                string title = "UserList";

                string fileName = string.Format("{0}({1})", title, DateTime.Now.ToString("yyyyMMddHHmmss"));

                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(result);
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "UserList.xlsx");
                    }
                }
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
        public async Task<IActionResult> SaveCbTimeSheetApproval(int timeId, int apprId, string remark, string statusCd, string updId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveCbTimeSheetApproval(timeId, apprId, remark, statusCd, updId);

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

        #region Dashboard
        /// <summary>
        /// WeekList
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetOfficeWeekList(string year)
        {
            try
            {
                var result = await _repository.GetOfficeWeekList(year);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }

        /// <summary>
        /// WeekList
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDashboardOfficeList(int deptCd3, string overtimeYn, string officeYear, string officeWeek, string userId)
        {
            try
            {
                var result = await _repository.GetDashboardOfficeList(deptCd3, overtimeYn, officeYear, officeWeek, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
        #endregion

    }
}
