using course.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace course.Server.Configs.Authentication
{
    public class AuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public IServiceProvider ServiceProvider { get; set; }

        [Obsolete]
        public AuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options, 
            ILoggerFactory logger, 
            UrlEncoder encoder, 
            ISystemClock clock, 
            IServiceProvider serviceProvider
            )
            : base(options, logger, encoder, clock)
        {
            ServiceProvider = serviceProvider;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var identityService = ServiceProvider.GetRequiredService<IdentityService>();

            var user = identityService.GetUser(Request.HttpContext);

            var authCookie = Request.Cookies
                .Where(c => c.Key == Constants.AuthCookieName).FirstOrDefault().Value;

            if (user is null) return Task.FromResult(AuthenticateResult.Fail("Authentication cookie not found"));

            var claims = new[] { new Claim("cookie", authCookie) };
            var identity = new ClaimsIdentity(claims, nameof(AuthenticationHandler));
            var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), this.Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
