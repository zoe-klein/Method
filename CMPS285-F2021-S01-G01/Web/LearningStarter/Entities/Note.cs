using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public string Content { get; set; }

        public int UserLectureId { get; set; }
        public UserLecture UserLecture { get; set; }
    }

    public class NoteCreateDto
    {
        public string Title { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public string Content { get; set; }

        public int UserLectureId { get; set; }
    }

    public class NoteEditDto
    {
        public string Title { get; set; }
        public string Content { get; set; }

        public int UserLectureId { get; set; }
    }

    public class NoteGetDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public string Content { get; set; }

        public int UserLectureId { get; set; }
    }
}
