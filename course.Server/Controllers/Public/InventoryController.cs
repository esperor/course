using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Models;

namespace course.Server.Controllers.Public
{
    [Route("api/public/inventory-record")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/public/inventory-record/5
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
    }
}
