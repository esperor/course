using course.Server.Configs.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace course.Server.Configs
{
    public class AuthorizeAccessLevelAttribute 
        : AuthorizeAttribute
        , IAuthorizationRequirement
        , IAuthorizationRequirementData
    {
        public EAccessLevel AccessLevel { get; }

        public AuthorizeAccessLevelAttribute(EAccessLevel accessLevel) => AccessLevel = accessLevel;

        public IEnumerable<IAuthorizationRequirement> GetRequirements()
        {
            yield return this;
        }
    }
}
