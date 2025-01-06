using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class replace_size_with_json_props : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "inventory");

            migrationBuilder.AddColumn<string>(
                name: "PropertiesJson",
                table: "inventory",
                type: "text",
                nullable: true,
                defaultValue: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PropertiesJson",
                table: "inventory");

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "inventory",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
