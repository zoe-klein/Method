using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{
    public class Teacher
    {
        public int Id { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String PhoneNumber { get; set; }
        public List<Lecture> Lectures { get; set; } = new List<Lecture>(); //can have many lectures, makes teachers aware of lecture
    }

    public class TeacherPostDto
    {
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String PhoneNumber { get; set; }
    }

    public class TeacherGetDto
    {
        public int Id { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String PhoneNumber { get; set; }
    }

    public class TeacherPutDto
    {
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String PhoneNumber { get; set; }
    }
}
