using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmHoliDay
{
    public class CmHoliDayDto
    {
        public string Id { get; set; }
        public string CalendarId { get; set; }
        public string category { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string State { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }
    }
}
