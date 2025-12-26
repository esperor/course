using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Models;

namespace course.Server.Controllers.Admin
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/user
        [HttpGet]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<IEnumerable<UserAdminInfoModel>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.AccessLevel)
                .Select(u => new UserAdminInfoModel(u))
                .ToListAsync();
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<UserAdminInfoModel>> GetApplicationUser(int id)
        {
            var applicationUser = await _context.Users
                .Include(u => u.AccessLevel)
                .Where(u => u.Id == id)
                .SingleOrDefaultAsync();

            if (applicationUser == null)
            {
                return NotFound();
            }

            return new UserAdminInfoModel(applicationUser);
        }

        // DELETE: api/user/5
        [HttpDelete("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<IActionResult> DeleteApplicationUser(int id)
        {
            var applicationUser = await _context.Users.FindAsync(id);
            if (applicationUser == null)
            {
                return NotFound();
            }

            _context.Users.Remove(applicationUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
