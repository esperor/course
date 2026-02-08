using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
using course.Server.Models;
using course.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Controllers.Business
{
    [Route("api/business/store")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IdentityService _identityService;

        public StoreController(ApplicationDbContext context,
            IdentityService identityService)
        {
            _context = context;
            _identityService = identityService;
        }

        // GET: api/business/store
        [HttpGet]
        [AuthorizeAccessTrait(EAccessTrait.Seller)]
        public async Task<ActionResult<IEnumerable<StoreInfoModel>>> GetStores(
            string? searchName,
            int offset = 0,
            int limit = 10)
        {
            var user = await _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();

            IQueryable<Store> set = _context.Stores.Where(s => s.OwnerId == user.Id);

            if (searchName != null)
                set = set.Where(v => v.Name.Contains(searchName, StringComparison.InvariantCultureIgnoreCase));

            return await set
                .Skip(offset)
                .Take(limit)
                .Select(store => new StoreInfoModel(store))
                .ToListAsync();
        }

        // POST: api/business/store
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessTrait(EAccessTrait.Seller)]
        public async Task<ActionResult<Store>> PostStore(StorePostModel model)
        {
            var user = await _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();

            var entry = _context.Stores.Add(model.ToEntity(ownerId: user.Id));
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStore", new { id = entry.Entity.Id }, entry.Entity);
        }
    }
}
