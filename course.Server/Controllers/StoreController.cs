using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Configs.Enums;
using course.Server.Configs;
using course.Server.Models;

namespace course.Server.Controllers
{
    [Route("api/store")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StoreController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/store
        [HttpGet]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<IEnumerable<Store>>> GetStores(
            string? searchName,
            int offset = 0, 
            int limit = 10)
        {
            IQueryable<Store> set = _context.Stores;

            if (searchName != null)
                set = set.Where(v => v.Name.Contains(searchName));

            return await set
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        // GET: api/store/5
        [HttpGet("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<Store>> GetStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);

            if (store == null)
            {
                return NotFound();
            }

            return store;
        }

        // PUT: api/store/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<IActionResult> PutStore(int id, Store store)
        {
            if (id != store.Id)
            {
                return BadRequest();
            }

            _context.Entry(store).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/store
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<Store>> PostStore(StorePostModel model)
        {
            var entry = _context.Stores.Add(model.ToEntity());
            await _context.SaveChangesAsync();
            
            return CreatedAtAction("GetStore", new { id = entry.Entity.Id }, entry.Entity);
        }

        // DELETE: api/store/5
        [HttpDelete("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<IActionResult> DeleteStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return NotFound();
            }

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StoreExists(int id)
        {
            return _context.Stores.Any(e => e.Id == id);
        }
    }
}
