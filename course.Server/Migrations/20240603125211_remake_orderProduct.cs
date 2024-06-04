using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class remake_orderProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "order_product");

            migrationBuilder.CreateTable(
                name: "order_record",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    InventoryRecordId = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_order_record", x => new { x.OrderId, x.InventoryRecordId });
                    table.ForeignKey(
                        name: "FK_order_record_inventory_InventoryRecordId",
                        column: x => x.InventoryRecordId,
                        principalTable: "inventory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_order_record_orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_order_record_InventoryRecordId",
                table: "order_record",
                column: "InventoryRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "order_record");

            migrationBuilder.CreateTable(
                name: "order_product",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    ProductId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_order_product", x => new { x.OrderId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_order_product_orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_order_product_products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_order_product_ProductId",
                table: "order_product",
                column: "ProductId");
        }
    }
}
