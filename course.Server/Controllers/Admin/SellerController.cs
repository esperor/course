using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
using course.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Controllers.Admin
{
    [Route("api/admin/seller")]
    [ApiController]
    [AuthorizeAccessLevel(EAccessLevel.Administrator)]
    public class SellerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SellerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/seller
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SellerExtendedInfoModel>>> GetSellers(
            string? searchName,
            string? searchPhone,
            string? searchEmail,
            int offset = 0,
            int limit = 10)
        {
            IQueryable<SellerExtendedInfoModel> set = _context.SellerExtendedView
                .Select(se => new SellerExtendedInfoModel(se));

            if (searchName != null)
                set = set.Where(se => se.Name.Contains(searchName, StringComparison.CurrentCultureIgnoreCase));

            if (searchPhone != null)
                set = set.Where(se => se.Phone.Contains(searchPhone));

            if (searchEmail != null)
                set = set.Where(se => se.Email.Contains(searchEmail, StringComparison.CurrentCultureIgnoreCase));

            return await set
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        // GET: api/seller/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SellerExtendedInfoModel>> GetSeller(int id)
        {
            var sellerExtended = await _context.SellerExtendedView
                .Where(s => s.UserId == id)
                .SingleOrDefaultAsync();

            if (sellerExtended == null)
            {
                return NotFound();
            }

            return new SellerExtendedInfoModel(sellerExtended);
        }
    }
}
