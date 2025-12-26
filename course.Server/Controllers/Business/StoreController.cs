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
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult<IEnumerable<StoreInfoModel>>> GetStores(
            string? searchName,
            int offset = 0,
            int limit = 10)
        {
            var user = _identityService.GetUser(HttpContext);
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
    }
}
