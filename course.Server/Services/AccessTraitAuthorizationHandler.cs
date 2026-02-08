using course.Server.Configs;
using Microsoft.AspNetCore.Authorization;

namespace course.Server.Services
{
    public class AccessTraitAuthorizationHandler : AuthorizationHandler<AuthorizeAccessTraitAttribute>
    {
        private readonly IdentityService _identityService;

        public AccessTraitAuthorizationHandler(IdentityService identityService)
        {
            _identityService = identityService;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AuthorizeAccessTraitAttribute requirement)
        {
            if (requirement == null) return;

            if (context.Resource is not HttpContext httpContext)
                throw new Exception("No http context in authorization attribute");

            var user = await _identityService.GetUser(httpContext);
            if (user is null) return;

            foreach (var accessTrait in requirement.AccessTraits)
            {
                if (!user.AccessTraits.HasFlag(accessTrait))
                    return;
            }
            
            context.Succeed(requirement);
  
            return;
        }
    }
}
