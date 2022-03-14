using eWroks.Api.Models.CmUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmLogin
{
    public interface ICmLoginRepository
    {
        /// <summary>
        /// 유저 가져오기
        /// </summary>
        /// <param name="Gparam"></param>
        /// <returns></returns>
        Task<CmUserDto> GetUserInfo(string loginId, string loginPassword, string userId);
    }
}
