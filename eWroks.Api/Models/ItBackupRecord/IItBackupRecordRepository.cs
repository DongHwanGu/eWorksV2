using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.ItBackupRecord
{
    public interface IItBackupRecordRepository
    {
        // 마스터 리스트
        Task<List<ItBackupRecordDto>> GetBackupRecordList(string backupGb, string backupDt);
        // 토탈
        Task<ItBackupRecordTotalDto> GetBackupRecordTotalData(string backupGb, string backupDt);

        // 저장
        Task<eWorksResult> SaveBackupRecord(ItBackupRecordDto[] models);
    }
}
