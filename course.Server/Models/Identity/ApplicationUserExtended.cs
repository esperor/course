using course.Server.Configs.Enums;
using course.Server.Data;
using System.Diagnostics.CodeAnalysis;

namespace course.Server.Models.Identity
{
    public class ApplicationUserExtended : ApplicationUser
    {
        public required EAccessTrait AccessTraits { get; init; }

        [SetsRequiredMembers]
        public ApplicationUserExtended(ApplicationUser user, EAccessTrait accessTraits)
            : base(user)
        {
            AccessTraits = accessTraits;
        }
    }
}
