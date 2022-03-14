using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using eWroks.Api.Models.CmUser;
using eWroks.Api.Models.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CommonServiceController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private ICommonRepository _repository;
        private ILogger _logger;

        public CommonServiceController(ICommonRepository repository, ILoggerFactory loggerFactory, IWebHostEnvironment environment)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmUserServiceController));
            _environment = environment;


        }

        #region 파일 업로드
        [HttpPost]
        [Consumes("application/json", "multipart/form-data")]
        public async Task<IActionResult> UploadFiels([FromForm] CmFileUploadDto cmFileUploadDto)
        {
            try
            {
                string org_file_name, ext, new_file_name = "";
                List<CmFileDto> cmFileDto = new List<CmFileDto>();

                for (int i = 0; i < cmFileUploadDto.Files.Count; i++)
                {
                    var uploadFolder = UploadLocalPath(cmFileUploadDto.FilePath);
                    // 파일명 
                    org_file_name = cmFileUploadDto.Files[i].FileName;
                    ext = org_file_name.Substring(org_file_name.LastIndexOf('.'));
                    new_file_name = cmFileUploadDto.UserId + "_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ext;

                    using (var fileStream = new FileStream(
                        Path.Combine(uploadFolder, new_file_name), FileMode.Create))
                    {
                        await cmFileUploadDto.Files[i].CopyToAsync(fileStream);
                    }

                    cmFileDto.Add(
                        new CmFileDto()
                        {
                            FileNm = org_file_name,
                            FileUrl = UploadServerPath(cmFileUploadDto.FilePath) + new_file_name
                        });
                }

                return Ok(cmFileDto.ToList());
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }




        #region Test 파일업로드

        [HttpPost]
        [Consumes("application/json", "multipart/form-data")]
        public async Task<IActionResult> UploadFielsTwo([FromForm] IFormFile file)
        {
            if (file.Length > 0) // 파일사이즈가 0이면 처리하지 않는다.
            {
                //var path = UploadLocalPath("OvertimeWork");

                var path = Path.Combine(@"Upload\OvertimeWork");
                var targetPath = @"W:\Test\OvertimeWork";

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path); // 웹 서비스 내 업로드폴더가 없을 경우 자동생성을 위한 처리
                }
                var filename = DateTime.Now.ToString("yyyyMMddHHmmss_") + file.FileName; // 동일한 파일명이 있으면 덮어쓰거나, 오류가 날 수 있으므로 파일명을 바꾼다.

                path = Path.Combine(path, filename);
                targetPath = Path.Combine(targetPath, filename);

                using (var stream = System.IO.File.Create(path))
                {
                    await file.CopyToAsync(stream);
                }

                System.IO.File.Move(path, targetPath);
            }
            return Ok(new { count = file.Length });
        }

        //[HttpPost]
        //[Consumes("application/json", "multipart/form-data")]
        //public async Task<IActionResult> OnPostUploadAsync([FromForm] List<IFormFile> files)
        //{
        //    long size = files.Sum(f => f.Length);

        //    foreach (var formFile in files)
        //    {
        //        if (formFile.Length > 0)
        //        {
        //            var filePath = Path.GetTempFileName();

        //            using (var stream = System.IO.File.Create(filePath))
        //            {
        //                await formFile.CopyToAsync(stream);
        //            }
        //        }
        //    }

        //    // Process uploaded files
        //    // Don't rely on or trust the FileName property without validation.

        //    return Ok(new { count = files.Count, size });
        //}

        #endregion

        /// <summary>
        /// 업로드 서버 경로 가져오기
        /// </summary>
        /// <param name="pageName"></param>
        /// <returns></returns>
        private string UploadServerPath(string pageName)
        {
            string ServerPath = "";
            switch (eWorksConfig.DB_CONNECT)
            {
                case DB_CONNECT_ENUM.Local:
                    ServerPath = "http://172.17.92.251:9191/Upload/";
                    break;
                case DB_CONNECT_ENUM.Test:
                    ServerPath = "http://172.17.92.251:9191/Upload/";
                    break;
                case DB_CONNECT_ENUM.Real:
                    ServerPath = "http://eworks.Intertek.co.kr/Upload/";
                    break;
                default:
                    break;
            }

            // 폴더 경로
            string year = DateTime.Now.Year.ToString();
            string month = DateTime.Now.Month.ToString().PadLeft(2, '0');
            string yearmonth = year + "/" + month + "/";

            string path = ServerPath + pageName + "/";

            return path + yearmonth;
        }

        /// <summary>
        /// 업로드 경로 가져오기
        /// </summary>
        /// <param name="pageName"></param>
        /// <returns></returns>
        private string UploadLocalPath(string pageName)
        {
            string Local_Path = "";
            switch (eWorksConfig.DB_CONNECT)
            {
                case DB_CONNECT_ENUM.Local:
                    Local_Path = @"\\172.17.92.15\eWorksV2\Test\";
                    break;
                case DB_CONNECT_ENUM.Test:
                    Local_Path = @"\\172.17.92.15\eWorksV2\Test\";
                    break;
                case DB_CONNECT_ENUM.Real:
                    Local_Path = @"\\172.17.92.15\eWorksV2\Real\";
                    break;
                default:
                    break;
            }

            // 폴더 경로
            string year = DateTime.Now.Year.ToString();
            string month = DateTime.Now.Month.ToString().PadLeft(2, '0');
            string yearmonth = year + @"\" + month + @"\";

            DirectoryInfo di = new DirectoryInfo(Local_Path + pageName + @"\" + year);
            if (di.Exists == false)
            {
                di.Create();
            }
            DirectoryInfo di2 = new DirectoryInfo(Local_Path + pageName + @"\" + year + @"\" + month);
            if (di2.Exists == false)
            {
                di2.Create();
            }

            return Local_Path + pageName + @"\" + yearmonth;
        } 
        #endregion

        /// <summary>
        /// 공통 옵션
        /// </summary>
        /// <param name="cdMajor"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetCodeOpions(string cdMajor, string userId)
        {
            try
            {
                var result = await _repository.GetCodeOpions(cdMajor, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// 공통 프로그램 조회
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetProgramList(string roleId)
        {
            try
            {
                var result = await _repository.GetProgramList(roleId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// 로그인로그
        /// </summary>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetLoginLogList(string startDt, string endDt)
        {
            try
            {
                var result = await _repository.GetLoginLogList(startDt, endDt);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// 공통 설정승인자 가져오기.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="approvalGb"></param>
        /// <param name="approvalCd"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetApprovalUserList(string userId, string approvalGb, string approvalCd)
        {
            try
            {
                var result = await _repository.GetApprovalUserList(userId, approvalGb, approvalCd);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }

        #region 대리자
        /// <summary>
        /// 대리자 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDelegateList(string userId)
        {
            try
            {
                var result = await _repository.GetDelegateList(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// 대리자 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> SaveDelegateData(CmUserDelegateApproval model)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.SaveDelegateData(model);

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
        /// 대리자 저장
        /// </summary>
        /// <returns></returns>
        [HttpPost] // [HttpGet("[action]")]
        public async Task<IActionResult> DeleteDelegateData(int deleId)
        {
            var result = new eWorksResult();

            try
            {
                result = await _repository.DeleteDelegateData(deleId);

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

        #region 디렉토리
        /// <summary>
        /// Dept, User 가져오기
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetDirectoryList(string userId)
        {
            try
            {
                var result = await _repository.GetDirectoryList(userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }
        #endregion

        #region 휴일 카운트
        /// <summary>
        /// 휴일 카우늩
        /// </summary>
        /// <param name="startDt"></param>
        /// <param name="endDt"></param>
        /// <returns></returns>
        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> GetHolidayCnt(string startDt, string endDt)
        {
            try
            {
                var result = await _repository.GetHolidayCnt(startDt, endDt);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest(e.Message);
            }
        }
        #endregion
    }
}
