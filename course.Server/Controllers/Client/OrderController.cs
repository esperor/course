using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using course.Server.Data;
using course.Server.Services;
using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace course.Server.Controllers.Client
{
    [Route("api/client/order")]
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
        [AuthorizeAccessLevel(EAccessLevel.Client)]
        public async Task<ActionResult<IEnumerable<OrderInfoModel>>> GetOrders(
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
    }
}
