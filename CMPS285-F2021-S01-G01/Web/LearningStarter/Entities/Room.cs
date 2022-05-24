using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningStarter.Entities
{

    //when a room is created, want to be able to select/create the building as well
    public class Room
    {
        public int Id { get; set; }
        public int RoomNumber { get; set; }
        public Building Building { get; set; }
        public int BuildingId { get; set; } //which building the room belongs to
        public List<Lecture> Lectures { get; set; } = new List<Lecture>(); //can have many lectures, makes rooms aware of lecture
    }

    public class RoomGetDto
    {
        public int Id { get; set; }
        public int RoomNumber { get; set; }
        public int BuildingId { get; set; }
        //public List<int> BuildingIds { get; set; } //list of building Ids
    }

    public class RoomCreateDto
    {
        public int RoomNumber { get; set; }
        public int BuildingId { get; set; }
    }

    public class RoomEditDto
    {
        public int RoomNumber { get; set; }
        public int BuildingId { get; set; }
    }

}
