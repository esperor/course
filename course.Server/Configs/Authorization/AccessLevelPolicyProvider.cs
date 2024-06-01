using course.Server.Configs.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace course.Server.Configs.Authorization
{
    public class AccessLevelPolicyProvider : IAuthorizationPolicyProvider
    {
        const string POLICY_PREFIX = "AccessLevel";
        public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }
        public AccessLevelPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }
        public Task<AuthorizationPolicy> GetDefaultPolicyAsync() =>
                                FallbackPolicyProvider.GetDefaultPolicyAsync();
        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() =>
                                FallbackPolicyProvider.GetFallbackPolicyAsync();

        public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(POLICY_PREFIX, StringComparison.OrdinalIgnoreCase) &&
                Enum.TryParse(typeof(EAccessLevel), policyName.Substring(POLICY_PREFIX.Length), 
                out var accessLevel))
            {
                var policy = new AuthorizationPolicyBuilder(
                                                    JwtBearerDefaults.AuthenticationScheme);
                policy.AddRequirements(new AuthorizeAccessLevelAttribute((EAccessLevel)accessLevel));
                return Task.FromResult<AuthorizationPolicy?>(policy.Build());
            }

            return Task.FromResult<AuthorizationPolicy?>(null);
        }
    }
}
