using course.Server.Configs.Enums;
using Microsoft.AspNetCore.Authorization;

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

    public class AuthorizeAccessTraitAttribute
        : AuthorizeAttribute
        , IAuthorizationRequirement
        , IAuthorizationRequirementData
    {
        public EAccessTrait[] AccessTraits { get; }

        public AuthorizeAccessTraitAttribute(params EAccessTrait[] accessTraits) => AccessTraits = accessTraits;

        public IEnumerable<IAuthorizationRequirement> GetRequirements()
        {
            yield return this;
        }
    }
}
