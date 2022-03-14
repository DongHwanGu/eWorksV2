using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CmLogin;
using eWroks.Api.Models.CmUser;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eWroks.Api.Apis
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CmLoginServiceController : ControllerBase
    {
        private ICmLoginRepository _repository;
        private ILogger _logger;

        public CmLoginServiceController(ICmLoginRepository repository, ILoggerFactory loggerFactory)
        {
            _repository = repository;
            _logger = loggerFactory.CreateLogger(nameof(CmUserServiceController));
        }

        [HttpGet] // [HttpGet("[action]")]
        public async Task<IActionResult> Login(string loginId, string loginPassword, string userId)
        {
            try
            {
                if (!string.IsNullOrEmpty(loginPassword))
                {
                    loginPassword = eWorksFunction.GetHashCode(loginPassword);
                }
                var result = await _repository.GetUserInfo(loginId, loginPassword, userId);

                return Ok(result); // 200 OK
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);

                return BadRequest();
            }
        }
    }
}
