using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.ItBackupRecord
{
    public class ItBackupRecordDto
    {
        public string BackupGb { get; set; }
        public string BackupDt { get; set; }
        public string MonDay { get; set; }
        public string TuesDay { get; set; }
        public string WednesDay { get; set; }
        public string ThursDay { get; set; }
        public string Weekly { get; set; }
        public string Monthly { get; set; }
        public string Yearly { get; set; }
        public string Cleaning { get; set; }
        public string RemarkGb { get; set; }
        public string Remark { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
        public string DateGb { get; set; }
    }

    public class ItBackupRecordTotalDto
    {
        public string LastWeekly { get; set; }
        public string LastMonthly { get; set; }
        public string LastYearly { get; set; }
        public string SuccessRate { get; set; }
    }
}
