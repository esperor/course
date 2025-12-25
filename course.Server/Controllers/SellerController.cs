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
        public async Task<ActionResult<IEnumerable<SellerInfoModel>>> GetSellers(
            string? searchName,
            string? searchPhone,
            int offset = 0,
            int limit = 10)
        {
            IQueryable<ApplicationUser> users = _context.Users;

            if (searchName != null)
                users = users.Where(u => u.Name.ToLower().Contains(searchName.ToLower()));

            if (searchPhone != null)
                users = users.Where(u => u.Phone.Contains(searchPhone));

            IQueryable<SellerInfoModel> set = _context.Sellers
                .Join(users,
                    s => s.UserId,
                    u => u.Id,
                    (s, u) => new SellerInfoModel(s, u));

            return await set
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        // GET: api/seller/5
        [HttpGet("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<SellerInfoModel>> GetSeller(int id)
        {
            var seller = await _context.Sellers
                .Where(s => s.UserId == id)
                .Include(s => s.User)
                .SingleOrDefaultAsync();

            if (seller == null)
            {
                return NotFound();
            }

            return new SellerInfoModel(seller);
        }

        // PUT: api/seller
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<IActionResult> PutSeller(int id, SellerUpdateModel model)
        {
            if (id != model.UserId)
            {
                return BadRequest();
            }

            var seller = await _context.Sellers.Where(s => s.UserId == id).SingleOrDefaultAsync();

            if (seller?.ContractNumber != model.ContractNumber) return BadRequest();

            _context.Entry(model.ToEntity()).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SellerExists(id))
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
        public async Task<ActionResult<SellerInfoModel>> PostSeller(SellerPostModel model)
        {
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest("User unauthenticated");

            if (model.ContractConditionsAccepted == false) 
                return BadRequest("Contract conditions must be accepted to continue");

            var contractNumber = Guid.NewGuid().ToString();

            var entry = _context.Sellers.Add(model.ToEntity(contractNumber));
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SellerExists(model.UserId))
                    return Conflict();
                else
                    throw;
            }

            return CreatedAtAction("GetSeller",
                new { id = model.UserId },
                new SellerInfoModel {
                    Id = entry.Entity.UserId,
                    Email = entry.Entity.Email,
                    ContractNumber = entry.Entity.ContractNumber,
                }
            );
        }

        // DELETE: api/seller/5
        [HttpDelete("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<IActionResult> DeleteSeller(int id)
        {
            var seller = await _context.Sellers.FindAsync(id);
            if (seller == null)
            {
                return NotFound();
            }

            _context.Sellers.Remove(seller);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SellerExists(int id)
        {
            return _context.Sellers.Any(e => e.UserId == id);
        }
    }
}
