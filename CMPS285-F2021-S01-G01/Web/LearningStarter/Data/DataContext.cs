using LearningStarter.Entities;
using LearningStarterServer.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Lecture> Lectures { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<UserLecture> UserLectures { get; set; }
        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(x => x.FirstName)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(x => x.LastName)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(x => x.Username)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(x => x.Password)
                .IsRequired();

            modelBuilder.Entity<Class>()
                .Property(x => x.Capacity)
                .IsRequired();

            modelBuilder.Entity<Class>()
                .Property(x => x.Subject)
                .IsRequired();

            modelBuilder.Entity<Class>()
                .Property(x => x.UserId)
                .IsRequired();

        }
    }
}
