using course.Server.Configs;
using course.Server.Configs.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;
using System.Security.Claims;

namespace course.Server.Services
{
    public class AccessLevelAuthorizationHandler : AuthorizationHandler<AuthorizeAccessLevelAttribute>
    {
        private readonly IdentityService _identityService;

        public AccessLevelAuthorizationHandler(IdentityService identityService)
        {
            _identityService = identityService;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                               AuthorizeAccessLevelAttribute requirement)
        {
            if (requirement == null) return Task.CompletedTask;

            var httpContext = context.Resource as HttpContext;
            if (httpContext is null) 
                throw new Exception("No http context in authorization attribute");

            var user = _identityService.GetUser(httpContext);
            if (user == null) return Task.CompletedTask;

            if (user.GetAccessLevel() >= requirement.AccessLevel) 
                context.Succeed(requirement);
  
            return Task.CompletedTask;
        }
    }
}
