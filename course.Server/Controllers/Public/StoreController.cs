using course.Server.Data;
using course.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Controllers.Public
{
    [Route("api/public/store")]
    [ApiController]
    public partial class StoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StoreController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/public/store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreInfoModel>>> GetStores(
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
                .Select(store => new StoreInfoModel(store))
                .ToListAsync();
        }

        // GET: api/public/store/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreInfoModel>> GetStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);

            if (store == null)
            {
                return NotFound();
            }

            return new StoreInfoModel(store);
        }
    }
}
