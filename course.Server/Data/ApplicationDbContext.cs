using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        {
            builder.Properties<DateOnly>()
               .HaveColumnType("date");
        }

        public class DateOnlyConverter() : ValueConverter<DateOnly, DateTime>(d => d.ToDateTime(TimeOnly.MinValue),
        d => DateOnly.FromDateTime(d));
    }
}
