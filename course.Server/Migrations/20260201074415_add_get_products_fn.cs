using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_get_products_fn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
CREATE OR REPLACE FUNCTION FN_GetProducts(
    searchString varchar(100) DEFAULT NULL,
    storeId integer DEFAULT NULL,
    orderBy integer DEFAULT 0,
    ""offset"" integer DEFAULT 0,
    ""limit"" integer DEFAULT 10
)
RETURNS TABLE(
    ""Id"" int,
    ""StoreId"" int,
    ""Title"" text,
    ""Description"" text,
    ""RecordId"" int,
    ""Quantity"" int,
    ""Price"" int,
    ""Image"" bytea,
    ""PropertiesJson"" text,
    ""Size"" text,
    ""Variation"" text,
    ""StoreName"" text
)
LANGUAGE sql
AS $$
SELECT
    p.""Id"",
    p.""StoreId"",
    p.""Title"",
    p.""Description"",
    i.""Id"" as ""RecordId"",
    i.""Quantity"",
    i.""Price"",
    i.""Image"",
    i.""PropertiesJson"",
    i.""Size"",
    i.""Variation"",
	s.""Name"" as ""StoreName""
FROM products p
LEFT JOIN inventory i ON i.""ProductId"" = p.""Id""
LEFT JOIN stores s ON p.""StoreId"" = s.""Id""
WHERE
    (searchString IS NULL OR p.""Title"" ILIKE '%' || searchString || '%')
AND (storeId IS NULL OR p.""StoreId"" = storeId)
ORDER BY
    CASE WHEN orderBy = 0 THEN p.""Id"" END ASC,
    CASE WHEN orderBy = 1 THEN p.""Title"" END ASC,
    CASE WHEN orderBy = 2 THEN p.""Title"" END DESC,
    CASE WHEN orderBy = 3 THEN i.""Price"" END ASC,
    CASE WHEN orderBy = 4 THEN i.""Price"" END DESC
LIMIT ""limit""
OFFSET ""offset"";
$$;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP FUNCTION IF EXISTS FN_GetProducts;");
        }
    }
}
