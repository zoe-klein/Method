using Microsoft.EntityFrameworkCore.Migrations;

namespace LearningStarter.Migrations
{
    public partial class AddingForeignKeysIntoLectures : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "Lectures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TeacherId",
                table: "Lectures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_RoomId",
                table: "Lectures",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_TeacherId",
                table: "Lectures",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lectures_Rooms_RoomId",
                table: "Lectures",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lectures_Teachers_TeacherId",
                table: "Lectures",
                column: "TeacherId",
                principalTable: "Teachers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lectures_Rooms_RoomId",
                table: "Lectures");

            migrationBuilder.DropForeignKey(
                name: "FK_Lectures_Teachers_TeacherId",
                table: "Lectures");

            migrationBuilder.DropIndex(
                name: "IX_Lectures_RoomId",
                table: "Lectures");

            migrationBuilder.DropIndex(
                name: "IX_Lectures_TeacherId",
                table: "Lectures");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Lectures");

            migrationBuilder.DropColumn(
                name: "TeacherId",
                table: "Lectures");
        }
    }
}
