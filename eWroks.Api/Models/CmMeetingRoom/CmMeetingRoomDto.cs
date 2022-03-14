using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eWroks.Api.Models.CmMeetingRoom
{
    public class CmMeetingRoomDto
    {
        public int MeetingId { get; set; }
        public string MeetingGb { get; set; }
        public string RoomGb { get; set; }
        public string RoomSubject { get; set; }
        public string StartDt { get; set; }
        public string StartTime { get; set; }
        public string EndDt { get; set; }
        public string EndTime { get; set; }
        public string ContentDesc { get; set; }
        public string RegId { get; set; }
        public string UpdId { get; set; }

        public string RoomGbNm { get; set; }
        public string StartDtNm { get; set; }
        public string EndDtNm { get; set; }

        public string RegIdNm { get; set; }
        public string RegDtNm { get; set; }
    }

}
