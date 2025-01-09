using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_size_variation_to_record : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PropertiesJson",
                table: "inventory",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "inventory",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Variation",
                table: "inventory",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "inventory");

            migrationBuilder.DropColumn(
                name: "Variation",
                table: "inventory");

            migrationBuilder.AlterColumn<string>(
                name: "PropertiesJson",
                table: "inventory",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
