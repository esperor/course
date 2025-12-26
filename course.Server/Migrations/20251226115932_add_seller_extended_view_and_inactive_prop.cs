using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_seller_extended_view_and_inactive_prop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Freezed",
                table: "sellers",
                type: "boolean",
                defaultValue: false,
                nullable: false);

            migrationBuilder.AddColumn<bool>(
                name: "Suspended",
                table: "sellers",
                type: "boolean",
                defaultValue: false,
                nullable: false);

            migrationBuilder.Sql(@"
CREATE VIEW seller_extended AS
SELECT 
    sellers.""UserId"",
    users.""Name"",
    users.""Phone"",
    sellers.""Email"",
    sellers.""ContractNumber"",
    COALESCE(NOT (sellers.""Freezed"" = true OR sellers.""Suspended"" = true), true) as ""Active"",
    sellers.""Freezed"",
    sellers.""Suspended""
FROM sellers
LEFT JOIN users ON users.""Id"" = sellers.""UserId"";
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DROP VIEW seller_extended;
");

            migrationBuilder.DropColumn(
                name: "Freezed",
                table: "sellers");

            migrationBuilder.DropColumn(
                name: "Suspended",
                table: "sellers");
        }
    }
}
