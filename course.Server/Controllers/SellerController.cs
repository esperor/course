using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
using course.Server.Models;
using course.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Controllers
{
    [Route("api/seller")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IdentityService _identityService;

        public SellerController(ApplicationDbContext context, IdentityService identityService)
        {
            _context = context;
            _identityService = identityService;
        }

        // GET: api/seller
        [HttpGet]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
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
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
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

        // PUT: api/seller
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<IActionResult> PutSeller(SellerUpdateModel model)
        {
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest("User unauthenticated");

            var seller = await _context.Sellers.Where(s => s.UserId == user.Id).SingleOrDefaultAsync();

            if (seller?.ContractNumber != model.ContractNumber) return BadRequest();

            _context.Entry(model.ToEntity(user.Id)).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SellerExists(user.Id))
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

        // POST: api/seller
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult<SellerExtendedInfoModel>> PostSeller(SellerPostModel model)
        {
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest("User unauthenticated");

            if (model.ContractConditionsAccepted == false) 
                return BadRequest("Contract conditions must be accepted to continue");

            var contractNumber = Guid.NewGuid().ToString();

            var entry = _context.Sellers.Add(model.ToEntity(user.Id, contractNumber));
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SellerExists(user.Id))
                    return Conflict();
                else
                    throw;
            }

            return CreatedAtAction(
                nameof(IdentityController.UserInfo),
                nameof(IdentityController),
                new { id = user.Id },
                new SellerExtendedInfoModel {
                    UserId = entry.Entity.UserId,
                    Email = entry.Entity.Email,
                    ContractNumber = entry.Entity.ContractNumber,
                }
            );
        }

        // POST: api/seller/freeze
        [HttpPost("freeze")]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<IActionResult> FreezeSeller()
        {
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest("User unauthenticated");

            var seller = await _context.Sellers.FindAsync(user.Id);
            if (seller == null)
            {
                return NotFound();
            }

            seller.Freezed = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (!SellerExists(seller.UserId))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        private bool SellerExists(int id)
        {
            return _context.Sellers.Any(e => e.UserId == id);
        }
    }
}
