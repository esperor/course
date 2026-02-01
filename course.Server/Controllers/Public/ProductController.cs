using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Configs.Enums;
using course.Server.Models;
using Microsoft.IdentityModel.Tokens;

namespace course.Server.Controllers.Public
{
    [Route("api/public/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        class PModel
        {
            public int Id { get; set; }
            public int StoreId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public int? RecordId { get; set; }
            public int? Quantity { get; set; }
            public int? Price { get; set; }
            public byte[]? Image { get; set; }
            public string? PropertiesJson { get; set; }
            public string? Size { get; set; }
            public string? Variation { get; set; }
            public string StoreName { get; set; }
        }

        // GET: api/public/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductRecordInfoModel>>> GetProducts(
            string? searchString,
            int? storeId,
            [FromQuery] EProductOrdering orderBy = EProductOrdering.None,
            int offset = 0,
            int limit = 10)
        {

            var sqlResult = _context.Database.SqlQuery<PModel>(
                $"select * from FN_GetProducts({searchString}, {storeId}, {orderBy}, {offset}, {limit})");

            return await sqlResult
                .Select(item => new ProductRecordInfoModel
                {
                    Id = item.Id,
                    StoreId = item.StoreId,
                    Store = item.StoreName,
                    Title = item.Title,
                    Description = item.Description,
                    Record = item.Quantity == null
                        ? null
                        : new InventoryRecordInfoModel
                        {
                            Id = (int)item.RecordId!,
                            Price = (int)item.Price!,
                            Image = item.Image,
                            Quantity = (int)item.Quantity!,
                            PropertiesJson = item.PropertiesJson,
                            Size = item.Size,
                            Variation = item.Variation!,
                        }
                }).ToListAsync();
        }

        // GET: api/public/product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductAggregatedInfoModel>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Store)
                .Where(p => p.Id == id)
                .SingleOrDefaultAsync();
            if (product is null) return NotFound();

            var records = await _context.InventoryRecords.Where(r => r.ProductId == id).ToListAsync();

            if (product == null)
            {
                return NotFound();
            }

            return new ProductAggregatedInfoModel(product, records);
        }
    }
}
