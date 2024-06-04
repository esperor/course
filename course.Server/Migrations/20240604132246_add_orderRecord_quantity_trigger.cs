using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_orderRecord_quantity_trigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
CREATE FUNCTION subtract_Quantity_form_inventoryRecords()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
BEGIN
    UPDATE inventory AS i
    SET ""Quantity"" = i.""Quantity"" - NEW.""Quantity""
    WHERE ""Id"" = NEW.""InventoryRecordId"";

    RETURN NEW;
END;
$$
            ");

            migrationBuilder.Sql(@"
CREATE TRIGGER orderRecord_subtract_from_inventoryRecords 
AFTER INSERT ON order_record
FOR EACH ROW
EXECUTE PROCEDURE subtract_Quantity_form_inventoryRecords();
            ");

            migrationBuilder.Sql(@"
CREATE FUNCTION restore_Quantity_in_inventoryRecords()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
DECLARE o_record RECORD;
BEGIN
    IF (NEW.""Status"" = 3) THEN
        FOR o_record IN
            SELECT ""InventoryRecordId"", ""Quantity"" 
            FROM order_record
            WHERE ""OrderId"" = NEW.""Id""
        LOOP
            UPDATE inventory AS i
            SET ""Quantity"" = i.""Quantity"" + o_record.""Quantity""
            WHERE ""Id"" = o_record.""InventoryRecordId"";
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$
            ");

            migrationBuilder.Sql(@"
CREATE TRIGGER orders_restore_inventoryRecords_on_cancel
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE restore_Quantity_in_inventoryRecords();
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DROP TRIGGER orderRecord_subtract_from_inventoryRecords ON order_record;
DROP FUNCTION subtract_Quantity_form_inventoryRecords;
DROP TRIGGER orders_restore_inventoryRecords_on_cancel ON orders;
DROP FUNCTION restore_Quantity_in_inventoryRecords();
            ");
        }
    }
}
