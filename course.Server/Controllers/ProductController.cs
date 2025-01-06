using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Models;
using Microsoft.IdentityModel.Tokens;

namespace course.Server.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/product
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
                    a => new { a.Product.Id, a.Product.VendorId, a.Product.Title, a.Product.Description, },
                    a => a.Record)
                .Select(
                    b => new ProductOrderingModel
                    {
                        Id = b.Key.Id,
                        VendorId = b.Key.VendorId,
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
                .Join(_context.Vendors, a => a.Product.VendorId, v => v.Id, (a, v) => new ProductInfoModel
                { 
                    Id = a.Product.Id,
                    VendorId = a.Product.VendorId,
                    Vendor = v.Name,
                    Title = a.Product.Title,
                    Description = a.Product.Description,
                    Records = a.Records.Select(r => new InventoryRecordInfoModel
                    {
                        Id = r.Id,
                        Price = r.Price,
                        Image = r.Image,
                        Quantity = r.Quantity,
                        PropertiesJson = r.PropertiesJson,
                    }).ToArray(),
                })
                .ToListAsync();
        }

        // GET: api/product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductInfoModel>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Vendor)
                .Where(p => p.Id == id)
                .SingleAsync();
            var records = await _context.InventoryRecords.Where(r => r.ProductId == id).ToListAsync();

            if (product == null)
            {
                return NotFound();
            }

            return new ProductInfoModel(product, records);
        }

        // PUT: api/product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Editor)]
        public async Task<IActionResult> PutProduct(int id, ProductPutModel model)
        {
            if (id != model.Id) return BadRequest();

            try
            {
                _context.Entry(model.ToEntity()).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/product
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<Product>> PostProduct(ProductPostModel product)
        {
            var entry = _context.Products.Add(product.ToEntity());
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = entry.Entity.Id }, new ProductInfoModel(entry.Entity));
        }

        // DELETE: api/product/5
        [HttpDelete("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
