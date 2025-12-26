using course.Server.Configs;
using course.Server.Data;
using course.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Controllers.Business
{
    [Route("api/business/product")]
    [ApiController]
    [AuthorizeAccessLevel(Configs.Enums.EAccessLevel.Client)]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductPutModel model)
        {
            throw new NotImplementedException();
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
        public async Task<ActionResult<Product>> PostProduct(ProductPostModel product)
        {
            throw new NotImplementedException();
            var entry = _context.Products.Add(product.ToEntity());
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = entry.Entity.Id }, new ProductInfoModel(entry.Entity));
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
