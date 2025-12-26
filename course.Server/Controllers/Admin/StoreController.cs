using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Configs.Enums;
using course.Server.Configs;

namespace course.Server.Controllers.Admin
{
    [Route("api/admin/store")]
    [ApiController]
    [AuthorizeAccessLevel(EAccessLevel.Administrator)]
    public partial class StoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StoreController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Store>>> GetStoresAdmin(
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

        // GET: api/admin/store/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> GetStoreAdmin(int id)
        {
            var store = await _context.Stores.FindAsync(id);

            if (store == null)
            {
                return NotFound();
            }

            return store;
        }
    }
}
