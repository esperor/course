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

        // GET: api/public/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductInfoModel>>> GetProducts(
            string? searchString,
            [FromQuery] EProductOrdering orderBy = EProductOrdering.None,
            int offset = 0,
            int limit = 10)
        {
            var set = _context.Products
                .GroupJoin(
                    _context.InventoryRecords,
                    p => p.Id,
                    r => r.ProductId,
                    (product, records) => new { Product = product, Records = records })
                .SelectMany(
                    records => records.Records.DefaultIfEmpty(),
                    (a, record) => new { a.Product, Record = record })
                .GroupBy(
                    a => new { a.Product.Id, a.Product.StoreId, a.Product.Title, a.Product.Description, },
                    a => a.Record)
                .Select(
                    b => new ProductOrderingModel
                    {
                        Id = b.Key.Id,
                        StoreId = b.Key.StoreId,
                        Title = b.Key.Title,
                        Description = b.Key.Description,
                        Quantity = b.Sum(record => record != null ? record.Quantity : 0),
                        Price = b.Max(record => record != null ? record.Price : 0)
                    });

            if (searchString != null && !searchString.IsNullOrEmpty())
                set = from p in set
                      where p.Title.Contains(searchString) || p.Description.Contains(searchString)
                      select p;

            if (orderBy != EProductOrdering.None)
                switch (orderBy)
                {
                    case EProductOrdering.TitleAsc:
                        set = set.OrderBy(p => p.Title);
                        break;
                    case EProductOrdering.TitleDesc:
                        set = set.OrderByDescending(p => p.Title);
                        break;
                    case EProductOrdering.PriceAsc:
                        set = set.OrderBy((p) => p.Price);
                        break;
                    case EProductOrdering.PriceDesc:
                        set = set.OrderByDescending((p) => p.Price);
                        break;
                }

            return await set
                .Skip(offset)
                .Take(limit)
                .GroupJoin(
                    _context.InventoryRecords,
                    p => p.Id,
                    r => r.ProductId,
                    (p, records) => new
                    {
                        Product = p,
                        Records = records
                    })
                .Join(_context.Stores, a => a.Product.StoreId, v => v.Id, (a, v) => new ProductInfoModel
                { 
                    Id = a.Product.Id,
                    StoreId = a.Product.StoreId,
                    Store = v.Name,
                    Title = a.Product.Title,
                    Description = a.Product.Description,
                    Records = a.Records.Select(r => new InventoryRecordInfoModel
                    {
                        Id = r.Id,
                        Price = r.Price,
                        Image = r.Image,
                        Quantity = r.Quantity,
                        PropertiesJson = r.PropertiesJson,
                        Size = r.Size,
                        Variation = r.Variation,
                    }).ToArray(),
                })
                .ToListAsync();
        }

        // GET: api/public/product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductInfoModel>> GetProduct(int id)
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

            return new ProductInfoModel(product, records);
        }
    }
}
