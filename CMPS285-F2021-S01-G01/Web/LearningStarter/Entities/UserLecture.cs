using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{
    public class UserLecture
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public LearningStarterServer.Entities.User User { get; set; }

        public int LectureId { get; set; }
        public Lecture Lecture { get; set; }
    }

    public class UserLectureGetDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int LectureId { get; set; }
    }

}
