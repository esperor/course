using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
using course.Server.Models;
using course.Server.Models.Identity;
using course.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace course.Server.Controllers
{
    [Route("api/identity")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IdentityService _identityService;

        public IdentityController(ApplicationDbContext context, IdentityService identityService) 
        {
            _context = context;
            _identityService = identityService;
        }

        [Route("user-info")]
        [HttpGet]
        public async Task<ActionResult<UserInfoModel>> UserInfo()
        {
            var user = await _identityService.GetUser(HttpContext);
            if (user is null) return Ok(new UserInfoModel());

            var seller = await _context.Sellers
                .Where(s => s.UserId == user.Id)
                .SingleOrDefaultAsync();

            return Ok(new UserInfoModel(user, isSeller: seller is not null));
        }

        [Route("login")]
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] UserLoginModel model)
        {
            if ((await _identityService.GetUser(HttpContext)) is not null)
                return new StatusCodeResult(StatusCodes.Status405MethodNotAllowed);

            var user = _identityService.GetUserByPhone(model.Phone);
            if (user is null) return BadRequest();

            var result = _identityService.SignIn(user, model.Password);
            if (!result.Success) 
                return new StatusCodeResult(StatusCodes.Status401Unauthorized);


            if (result.AuthCookie.HasValue)
            {
                var cookieBuilder = new CookieBuilder
                {
                    Path = "/",
                    Expiration = TimeSpan.FromDays(Constants.CookieExpirationDays),
                    SameSite = SameSiteMode.Strict
                };
                var options = cookieBuilder.Build(HttpContext);
                Response.Cookies.Append(Constants.AuthCookieName, result.AuthCookie.Value!, options);
            }

            return Ok();
        }

        [Route("logout")]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            var user = await _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();

            var result = _identityService.SignOut(user);
            if (!result.Success) return BadRequest(result.Errors);
            return Ok();
        }

        [Route("register")]
        [HttpPost]
        public ActionResult Register([FromBody] UserRegisterModel model)
        {
            try
            {
                var clientAccessLevelId = _identityService.AccessLevelsToIdMap[EAccessLevel.Client];
                var user = new ApplicationUser { Name = model.Name, Phone = model.Phone, AccessLevelId = clientAccessLevelId };
                var result = _identityService.CreateUser(user, model.Password);

                if (!result.Success)
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        Section = "Identity service",
                        result.Errors
                    }));

            } catch (Exception)
            {
                var user = _identityService.GetUserByPhone(model.Phone);
                if (user is null) return BadRequest();
            }
            return Ok();
        }

        [Route("update-user")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateModel model)
        {
            var user = await _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();

            bool hasChanged = false;

            if (user.Name != model.Name) { user.Name = model.Name; hasChanged = true; }
            if (user.Phone != model.Phone) { user.Phone = model.Phone; hasChanged = true; }

            if (hasChanged) _identityService.UpdateUser(user); 

            return Ok();
        }

        //// PUT: api/seller
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut]
        //[AuthorizeAccessLevel(EAccessLevel.Client)]
        //public async Task<IActionResult> PutSeller(SellerUpdateModel model)
        //{
        //    var user = _identityService.GetUser(HttpContext);
        //    if (user is null) return BadRequest("User unauthenticated");

        //    var seller = await _context.Sellers.Where(s => s.UserId == user.Id).SingleOrDefaultAsync();

        //    if (seller?.ContractNumber != model.ContractNumber) return BadRequest();

        //    _context.Entry(model.ToEntity(user.Id)).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!SellerExists(user.Id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/seller
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //[AuthorizeAccessLevel(EAccessLevel.Client)]
        //public async Task<ActionResult<SellerExtendedInfoModel>> PostSeller(SellerPostModel model)
        //{
        //    var user = _identityService.GetUser(HttpContext);
        //    if (user is null) return BadRequest("User unauthenticated");

        //    if (model.ContractConditionsAccepted == false)
        //        return BadRequest("Contract conditions must be accepted to continue");

        //    var contractNumber = Guid.NewGuid().ToString();

        //    var entry = _context.Sellers.Add(model.ToEntity(user.Id, contractNumber));
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (SellerExists(user.Id))
        //            return Conflict();
        //        else
        //            throw;
        //    }

        //    return CreatedAtAction(
        //        nameof(IdentityController.UserInfo),
        //        nameof(IdentityController),
        //        new { id = user.Id },
        //        new SellerExtendedInfoModel
        //        {
        //            UserId = entry.Entity.UserId,
        //            Email = entry.Entity.Email,
        //            ContractNumber = entry.Entity.ContractNumber,
        //        }
        //    );
        //}

        //// POST: api/seller/freeze
        //[HttpPost("freeze")]
        //[AuthorizeAccessLevel(EAccessLevel.Client)]
        //public async Task<IActionResult> FreezeSeller()
        //{
        //    var user = _identityService.GetUser(HttpContext);
        //    if (user is null) return BadRequest("User unauthenticated");

        //    var seller = await _context.Sellers.FindAsync(user.Id);
        //    if (seller == null)
        //    {
        //        return NotFound();
        //    }

        //    seller.Freezed = true;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (!SellerExists(seller.UserId))
        //            return NotFound();
        //        else
        //            throw;
        //    }

        //    return NoContent();
        //}

        //private bool SellerExists(int id)
        //{
        //    return _context.Sellers.Any(e => e.UserId == id);
        //}

        //// PUT: api/store/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //[AuthorizeAccessLevel(EAccessLevel.Administrator)]
        //public async Task<IActionResult> PutStore(int id, Store store)
        //{
        //    if (id != store.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(store).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!StoreExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/store
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //[AuthorizeAccessLevel(EAccessLevel.Administrator)]
        //public async Task<ActionResult<Store>> PostStore(StorePostModel model)
        //{
        //    var entry = _context.Stores.Add(model.ToEntity());
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetStore", new { id = entry.Entity.Id }, entry.Entity);
        //}

        //// DELETE: api/store/5
        //[HttpDelete("{id}")]
        //[AuthorizeAccessLevel(EAccessLevel.Administrator)]
        //public async Task<IActionResult> DeleteStore(int id)
        //{
        //    var store = await _context.Stores.FindAsync(id);
        //    if (store == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Stores.Remove(store);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool StoreExists(int id)
        //{
        //    return _context.Stores.Any(e => e.Id == id);
        //}
    }
}
