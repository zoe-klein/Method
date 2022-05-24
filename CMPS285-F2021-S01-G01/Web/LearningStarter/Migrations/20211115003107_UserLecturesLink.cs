using Microsoft.EntityFrameworkCore.Migrations;

namespace LearningStarter.Migrations
{
    public partial class UserLecturesLink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserLectureId",
                table: "Notes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserLectures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LectureId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLectures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLectures_Lectures_LectureId",
                        column: x => x.LectureId,
                        principalTable: "Lectures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLectures_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notes_UserLectureId",
                table: "Notes",
                column: "UserLectureId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLectures_LectureId",
                table: "UserLectures",
                column: "LectureId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLectures_UserId",
                table: "UserLectures",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_UserLectures_UserLectureId",
                table: "Notes",
                column: "UserLectureId",
                principalTable: "UserLectures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_UserLectures_UserLectureId",
                table: "Notes");

            migrationBuilder.DropTable(
                name: "UserLectures");

            migrationBuilder.DropIndex(
                name: "IX_Notes_UserLectureId",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "UserLectureId",
                table: "Notes");
        }
    }
}
