using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore;

namespace course.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<AccessLevel> AccessLevels { get; set; }
        public DbSet<Deliverer> Deliverers { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<InventoryRecord> InventoryRecords { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderRecord> OrderRecords { get; set; }
        public DbSet<Session> Sessions { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>()
                .Property(u => u.PasswordHash).IsRequired();
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
