using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
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
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return Ok(new UserInfoModel());

            var seller = await _context.Sellers
                .Where(s => s.UserId == user.Id)
                .SingleOrDefaultAsync();

            return Ok(new UserInfoModel(user, isSeller: seller is not null));
        }

        [Route("login")]
        [HttpPost]
        public ActionResult Login([FromBody] UserLoginModel model)
        {
            if (_identityService.GetUser(HttpContext) != null)
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
        public ActionResult<string[]> Logout()
        {
            var user = _identityService.GetUser(HttpContext);
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
        public ActionResult UpdateUser([FromBody] UserUpdateModel model)
        {
            var user = _identityService.GetUser(HttpContext);
            if (user is null) return BadRequest();

            bool hasChanged = false;

            if (user.Name != model.Name) { user.Name = model.Name; hasChanged = true; }
            if (user.Phone != model.Phone) { user.Phone = model.Phone; hasChanged = true; }

            if (hasChanged) _identityService.UpdateUser(user); 

            return Ok();
        }
    }
}
