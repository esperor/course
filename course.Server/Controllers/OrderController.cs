using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Services;
using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Controllers
{
    [Route("api/order")]
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

        // GET: api/order
        [HttpGet("user")]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult<IEnumerable<OrderInfoModel>>> GetUserOrders(
            int offset = 0,
            int limit = 10)
        {
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();


            var orders = await _context.Orders
                .Where(o => o.UserId == user.Id)
                .GroupJoin(
                    _context.OrderRecords,
                    o => o.Id,
                    r => r.OrderId,
                    (order, records) => new { order, records })
                .ToListAsync();

            IQueryable<OrderInfoModel> set = Enumerable.Empty<OrderInfoModel>().AsQueryable();

            foreach (var item in orders)
            {
                Dictionary<InventoryRecord, int> iRecords = [];
                foreach (var orderRecord in item.records)
                {
                    var ir = await _context.InventoryRecords.FindAsync(orderRecord.InventoryRecordId);
                    iRecords.Add(ir!, orderRecord.Quantity);
                }
                set = set.Append(new OrderInfoModel(item.order, iRecords));
            }
            return set.Skip(offset).Take(limit).ToList();
        }


        // GET: api/order/5
        [HttpGet("{id}")]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult<OrderInfoModel>> GetOrder(int id)
        {
            var result = CheckUserForOrder(id, out var order);
            if (result != null) return result;

            Dictionary<InventoryRecord, int> iRecords = [];
            foreach (var orderRecord in 
                await _context.OrderRecords
                .Where(r => r.OrderId == id)
                .ToListAsync())
            {
                var ir = await _context.InventoryRecords.FindAsync(orderRecord.InventoryRecordId);
                iRecords.Add(ir!, orderRecord.Quantity);
            }

            return new OrderInfoModel(order!, iRecords);
        }

        [HttpGet("{id}/admin")]
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

        // POST: api/order
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult<OrderInfoModel>> PostOrder(OrderPostModel model)
        {
            if (model.OrderedRecords.Count == 0) return BadRequest();

            _context.Database.BeginTransaction();
            EntityEntry<Order> entry;
            try
            {
                model.UserId ??= _identityService.GetUser(HttpContext)!.Id;

                entry = _context.Orders.Add(model.ToEntity());
                await _context.SaveChangesAsync();

                try
                {
                    var orderRecords = model.OrderedRecords.Select((recordInfo) => {
                        var id = recordInfo.Key;
                        if (!_context.InventoryRecords.Any(r => r.Id == id))
                            throw new ArgumentException("No such inventory record");
                        var quantity = recordInfo.Value;
                        return new OrderRecord
                        {
                            OrderId = entry.Entity.Id,
                            InventoryRecordId = id,
                            Quantity = quantity
                        };
                    });

                    _context.OrderRecords.AddRange(orderRecords);
                } catch (ArgumentException)
                {
                    return NotFound();
                }

                await _context.SaveChangesAsync();
                await _context.Database.CommitTransactionAsync();

            } catch (Exception)
            {
                await _context.Database.RollbackTransactionAsync();
                throw;
            }

            return CreatedAtAction("GetOrder", new { id = entry.Entity.Id }, new OrderInfoModel(entry.Entity));
        }

        [HttpPut]
        [Route("{id}/cancel")]
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult> CancelOrder([FromRoute] int id)
        {
            var result = CheckUserForOrder(id, out var order);
            if (result != null) return result;

            order!.Status = EOrderStatus.Canceled;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
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

        private ActionResult? CheckUserForOrder(int orderId, out Order? order)
        {
            var user = _identityService.GetUser(HttpContext);
            order = _context.Orders.Find(orderId);

            if (user is null) return BadRequest();
            if (order is null) return NotFound();

            if (user.GetAccessLevel() < EAccessLevel.Administrator &&
                user.Id != order.UserId) return Forbid();

            return null;
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
