using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Models;
using course.Server.Configs;

namespace course.Server.Controllers
{
    [Route("api/inventory-record")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/inventory-record/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryRecordInfoModel>> GetRecord(int id)
        {
            var inventoryRecord = await _context.InventoryRecords
                .Include(ir => ir.Product)
                .Where(ir => ir.Id == id)
                .SingleOrDefaultAsync();

            if (inventoryRecord == null)
            {
                return NotFound();
            }

            return new InventoryRecordInfoModel(inventoryRecord);
        }

        // DELETE: api/inventory-record/5
        [HttpDelete("{id}")]
        [AuthorizeAccessLevel(Configs.Enums.EAccessLevel.Editor)]
        public async Task<IActionResult> DeleteInventoryRecord(int id)
        {
            var inventoryRecord = await _context.InventoryRecords.FindAsync(id);

            if (inventoryRecord == null)
            {
                return NotFound();
            }

            _context.InventoryRecords.Remove(inventoryRecord);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/inventory-record/product/1
        // Both inserts new records and updates existing ones
        [HttpPost]
        [Route("product/{productId}")]
        [AuthorizeAccessLevel(Configs.Enums.EAccessLevel.Editor)]
        public async Task<IActionResult> PostInventoryRecords(
            [FromRoute] int productId, 
            [FromBody] InventoryRecordInputModel[] models)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product is null)
                return NotFound();

            IEnumerable<InventoryRecord> entities;
            try
            {
                entities = models.Select(m => {
                    if (m.ProductId != productId)
                        throw new ArgumentException("Record's productId doesn't match provided productId");
                    var entity = m.ToEntity();
                    entity.Product = product;
                    return entity;
                });
            } catch (ArgumentException)
            {
                return BadRequest();
            }

            foreach (var entity in entities)
            {
                _context.Entry(entity).State = 
                    entity.Id != 0 ? EntityState.Modified : EntityState.Added;
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
