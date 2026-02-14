using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
using course.Server.Models;
using course.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Controllers.Business
{
    [Route("api/business/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IdentityService _identityService;
        private readonly BusinessService _businessService;

        public ProductController(ApplicationDbContext context,
            IdentityService identityService,
            BusinessService businessService)
        {
            _context = context;
            _identityService = identityService;
            _businessService = businessService;
        }

        // PUT: api/business/product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [AuthorizeAccessTrait(EAccessTrait.Seller)]
        public async Task<IActionResult> PutProduct(int id, ProductAggregatedInfoModel model)
        {
            if (id != model.Id) return BadRequest();

            if (await _businessService.UpdateProduct(id, model))
                return NoContent();
            else
                return NotFound();
        }

        

        // POST: api/product
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessTrait(EAccessTrait.Seller)]
        public async Task<ActionResult<Product>> PostProduct(ProductPostModel product)
        {
            var user = await _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();

            var isStoreIdValid = await _context.Stores
                .AnyAsync(s => s.OwnerId == user.Id && product.StoreId == s.Id);

            if (!isStoreIdValid) return Unauthorized("Permission denied");

            var entry = _context.Products.Add(product.ToEntity());
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = entry.Entity.Id }, new ProductAggregatedInfoModel(entry.Entity));
        }

        // DELETE: api/product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            throw new NotImplementedException();
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
