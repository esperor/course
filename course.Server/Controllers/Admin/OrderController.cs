using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Services;
using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Controllers.Admin
{
    [Route("api/admin/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IdentityService _identityService;

        public OrderController(ApplicationDbContext context,
            IdentityService identityService)
        {
            _context = context;
            _identityService = identityService;
        }

        // GET: api/order
        [HttpGet]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<IEnumerable<OrderAdminInfoModel>>> GetOrders(
            int? userId,
            int offset = 0,
            int limit = 10)
        {
            var orders = _context.Orders
                .Include(o => o.Deliverer)
                .ThenInclude(d => d.User)
                .GroupJoin(
                    _context.OrderRecords,
                    o => o.Id,
                    r => r.OrderId,
                    (order, records) => new { order, records });

            if (userId != null)
                orders = orders.Where(a => a.order.UserId == userId);

            var ordersListed = await orders.Skip(offset).Take(limit).ToListAsync();

            return 
                ordersListed.Select((item) =>
                {
                    Dictionary<InventoryRecord, int> iRecords = [];
                    foreach (var orderRecord in item.records)
                    {
                        var ir = _context.InventoryRecords.Find(orderRecord.InventoryRecordId);
                        iRecords.Add(ir!, orderRecord.Quantity);
                    }
                    return new OrderAdminInfoModel(item.order, iRecords);
                }).ToList();
        }


        [HttpGet("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult<OrderAdminInfoModel>> GetOrderAdmin(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Deliverer)
                .ThenInclude(d => d.User)
                .Where(o => o.Id == id)
                .SingleOrDefaultAsync();

            if (order is null) return NotFound();

            Dictionary<InventoryRecord, int> iRecords = [];
            foreach (var orderRecord in
                await _context.OrderRecords
                .Where(r => r.OrderId == id)
                .ToListAsync())
            {
                var ir = await _context.InventoryRecords.FindAsync(orderRecord.InventoryRecordId);
                iRecords.Add(ir!, orderRecord.Quantity);
            }

            return new OrderAdminInfoModel(order!, iRecords);
        }

        public class AssignDelivererModel
        {
            [Required]
            public int DelivererId { get; set; }
        }

        [HttpPut("{id}/assign-deliverer")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult> AssignDeliverer(
            [FromRoute] int id,
            AssignDelivererModel model)
        {
            var order = _context.Orders.Find(id);
            if (order is null) return NotFound();

            await _context.Database.BeginTransactionAsync();

            try {
                order.DelivererId = model.DelivererId;

                if (order.Status == EOrderStatus.Created)
                    order.Status = EOrderStatus.Assigned;

                _context.Entry(order).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                await _context.Database.CommitTransactionAsync();
            } catch (Exception)
            {
                await _context.Database.RollbackTransactionAsync();
                throw;
            }
            return NoContent();
        }

        public class SetStatusModel
        {
            [Required]
            public EOrderStatus Status { get; set; }
        }

        [HttpPut("{id}/set-status")]
        [AuthorizeAccessLevel(EAccessLevel.Administrator)]
        public async Task<ActionResult> SetStatus(
            [FromRoute] int id,
            SetStatusModel model)
        {
            var order = _context.Orders.Find(id);
            if (order is null) return NotFound();

            order.Status = model.Status;

            _context.Entry(order).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/order/5
        //[HttpDelete("{id}")]
        //[AuthorizeAccessLevel(EAccessLevel.Administrator)]
        //public async Task<IActionResult> DeleteOrder(int id)
        //{
        //    var order = await _context.Orders.FindAsync(id);
        //    if (order == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Orders.Remove(order);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}
    }
}
