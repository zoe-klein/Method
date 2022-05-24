using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearningStarterServer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities
{
    public class Lecture
    {
        public int Id { get; set; }
        public string LectureName { get; set; }
        public int SectionNumber { get; set; }
        public DateTimeOffset ClassTime { get; set; }
        public Room Room { get; set; }
        public int RoomId { get; set; }
        public Teacher Teacher { get; set; }
        public int TeacherId { get; set; }

        public List<UserLecture> UserLectures { get; set; }
    }

    public class LectureGetDto
    {
        public int Id { get; set; }
        public string LectureName { get; set; }
        public int SectionNumber { get; set; }
        public DateTimeOffset ClassTime { get; set; }
        public int RoomId { get; set; }
        public int TeacherId { get; set; }
    }

    public class LectureCreateDto
    {
        public string LectureName { get; set; }
        public int SectionNumber { get; set; }
        public DateTimeOffset ClassTime { get; set; }
        public int RoomId { get; set; }
        public int TeacherId { get; set; }
    }

    public class LectureEditDto
    {
        public string LectureName { get; set; }
        public int SectionNumber { get; set; }
        public DateTimeOffset ClassTime { get; set; }
        public int RoomId { get; set; }
        public int TeacherId { get; set; }
    }

}
