using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Configs.Enums;
using course.Server.Configs;
using course.Server.Models;

namespace course.Server.Controllers
{
    [Route("api/deliverer")]
    [ApiController]
    public class DelivererController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DelivererController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/deliverer
        [HttpGet]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<IEnumerable<DelivererInfoModel>>> GetDeliverers(
            string? searchName,
            string? searchPhone,
            int offset = 0,
            int entries = 10)
        {
            IQueryable<ApplicationUser> users = _context.Users;

            if (searchName != null)
                users = users.Where(u => u.Name.ToLower().Contains(searchName.ToLower()));

            if (searchPhone != null)
                users = users.Where(u => u.Phone.Contains(searchPhone));

            IQueryable<DelivererInfoModel> set = _context.Deliverers
                .Join(users,
                    d => d.UserId,
                    u => u.Id,
                    (d, u) => new DelivererInfoModel(d, u));

            return await set
                .Skip(offset)
                .Take(entries)
                .ToListAsync();
        }

        // GET: api/deliverer/5
        [HttpGet("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<DelivererInfoModel>> GetDeliverer(int id)
        {
            var deliverer = await _context.Deliverers
                .Where(d => d.UserId == id)
                .Include(d => d.User)
                .SingleOrDefaultAsync();

            if (deliverer == null)
            {
                return NotFound();
            }

            return new DelivererInfoModel(deliverer);
        }

        // PUT: api/deliverer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<IActionResult> PutDeliverer(int id, DelivererInputModel model)
        {
            if (id != model.UserId)
            {
                return BadRequest();
            }

            _context.Entry(model.ToEntity()).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DelivererExists(id))
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

        // POST: api/deliverer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<DelivererInfoModel>> PostDeliverer(DelivererInputModel model)
        {
            var entry = _context.Deliverers.Add(model.ToEntity());
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DelivererExists(model.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDeliverer",
                new { id = model.UserId },
                entry.Entity
            );
        }

        // DELETE: api/deliverer/5
        [HttpDelete("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<IActionResult> DeleteDeliverer(int id)
        {
            var deliverer = await _context.Deliverers.FindAsync(id);
            if (deliverer == null)
            {
                return NotFound();
            }

            _context.Deliverers.Remove(deliverer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DelivererExists(int id)
        {
            return _context.Deliverers.Any(e => e.UserId == id);
        }
    }
}
