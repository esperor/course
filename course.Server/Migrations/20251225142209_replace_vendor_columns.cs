using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class replace_vendor_columns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_products_vendors_VendorId",
                table: "products");

            migrationBuilder.RenameColumn(
                name: "VendorId",
                table: "products",
                newName: "StoreId");

            migrationBuilder.RenameIndex(
                name: "IX_products_VendorId",
                table: "products",
                newName: "IX_products_StoreId");

            migrationBuilder.AddForeignKey(
                name: "FK_products_stores_StoreId",
                table: "products",
                column: "StoreId",
                principalTable: "stores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_products_stores_StoreId",
                table: "products");

            migrationBuilder.RenameColumn(
                name: "StoreId",
                table: "products",
                newName: "VendorId");

            migrationBuilder.RenameIndex(
                name: "IX_products_StoreId",
                table: "products",
                newName: "IX_products_VendorId");

            migrationBuilder.AddForeignKey(
                name: "FK_products_vendors_VendorId",
                table: "products",
                column: "VendorId",
                principalTable: "vendors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
