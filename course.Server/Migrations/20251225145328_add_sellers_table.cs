using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_sellers_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactInfo",
                table: "stores");

            migrationBuilder.DropColumn(
                name: "ContractNumber",
                table: "stores");

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "stores",
                type: "integer",
                nullable: true,
                defaultValue: null);

            migrationBuilder.CreateTable(
                name: "sellers",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    ContractNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sellers", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_sellers_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_stores_OwnerId",
                table: "stores",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_stores_sellers_OwnerId",
                table: "stores",
                column: "OwnerId",
                principalTable: "sellers",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_stores_sellers_OwnerId",
                table: "stores");

            migrationBuilder.DropTable(
                name: "sellers");

            migrationBuilder.DropIndex(
                name: "IX_stores_OwnerId",
                table: "stores");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "stores");

            migrationBuilder.AddColumn<string>(
                name: "ContactInfo",
                table: "stores",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContractNumber",
                table: "stores",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
