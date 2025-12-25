using course.Server.Configs.Enums;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace course.Server.Data
{
    public class DbInitializer
    {
        private static readonly char[] alphabet = [
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
                'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
                'y', 'z'
            ];

        public static async Task Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            context.Database.BeginTransaction();

            try
            {
                if (context.AccessLevels.Any()) return;

                await SeedAccessLevels(context);

                var clientLevelId = context.AccessLevels.Where(l => l.Name == EAccessLevel.Client.ToString()).First().Id;
                var adminLevelId = context.AccessLevels.Where(l => l.Name == EAccessLevel.Administrator.ToString()).First().Id;
                var hasher = new PasswordHasher<ApplicationUser>();

                var users = new ApplicationUser[]
                {
                    new ApplicationUser{ Name="Алексей Арсенов", AccessLevelId=clientLevelId, Phone=RandomPhone()},
                    new ApplicationUser{ Name="Мария", AccessLevelId=clientLevelId, Phone=RandomPhone()},
                    new ApplicationUser{ Name="Сергей", AccessLevelId=clientLevelId, Phone=RandomPhone()},
                    new ApplicationUser{ Name="Анастасия Рябкова", AccessLevelId=clientLevelId, Phone=RandomPhone()},
                    new ApplicationUser{ Name="Администратор", AccessLevelId=adminLevelId, Phone=RandomPhone()},
                };

                foreach (ApplicationUser s in users)
                {
                    if (s.AccessLevelId == clientLevelId)
                        s.PasswordHash = hasher.HashPassword(s, "1234");
                    else s.PasswordHash = hasher.HashPassword(s, "admin");
                    context.Users.Add(s);
                }

                var user1Id = context.Users.Where(u => u.Name == "Мария").First().Id;
                var user2Id = context.Users.Where(u => u.Name == "Сергей").First().Id;

                var sellers = new Seller[]
                {
                    new Seller{ UserId = user1Id, ContractNumber = RandomContract.ForSeller(), Email = "mary@gmail.com" },
                    new Seller{ UserId = user2Id, ContractNumber = RandomContract.ForSeller(), Email = "sergei@gmail.com" },
                };

                var stores = new Store[]
                {
                    new Store{ Name="ООО Белорусский трикотаж", OwnerId = user1Id },
                    new Store{ Name="Одежда", OwnerId = user1Id },
                    new Store{ Name="Много одежды", OwnerId = user2Id },
                    new Store{ Name="Оханский ювелирный завод", OwnerId = user2Id },
                };

                foreach (Store s in stores)
                {
                    context.Stores.Add(s);
                }

                context.SaveChanges();

                var user0Id = context.Users.Where(u => u.Name == "Алексей Арсенов").First().Id;
                var user3Id = context.Users.Where(u => u.Name == "Анастасия Рябкова").First().Id;

                var deliverers = new Deliverer[]
                {
                    new Deliverer{ UserId=user0Id, ContractNumber=RandomContract.ForDeliverer()},
                    new Deliverer{ UserId=user3Id, ContractNumber=RandomContract.ForDeliverer()},
                };

                foreach (Deliverer s in deliverers)
                {
                    context.Deliverers.Add(s);
                }

                var products = new Product[]
                {
                    new Product{ Title="Брюки мужские", Description="Lorem ipsum dolor sit amet", StoreId=context.Stores.First().Id },
                    new Product{ Title="Рубашка", Description="Lorem ipsum dolor sit amet", StoreId=context.Stores.First().Id },
                    new Product{ Title="Футболка мужская", Description="Lorem ipsum dolor sit amet", StoreId=context.Stores.Where(v => v.Name == "Одежда").First().Id },
                };

                foreach (Product s in products)
                {
                    context.Products.Add(s);
                }

                context.SaveChanges();
            } catch (Exception)
            {
                context.Database.RollbackTransaction();
                throw;
            }
            context.Database.CommitTransaction();
        }

        private static async Task SeedAccessLevels(ApplicationDbContext context)
        {
            foreach (EAccessLevel level in (EAccessLevel[])Enum.GetValues(typeof(EAccessLevel)))
                await context.AccessLevels.AddAsync(new AccessLevel { Name = level.ToString() });

            context.SaveChanges();
        }

        private static class RandomContract
        {
            public static string ForSeller()
            {
                var number = "";
                const short letters = 2;
                for (int i = 0; i < letters; i++)
                    number = $"{number}{alphabet[RandomNumberGenerator.GetInt32(alphabet.Length)]}";

                return $"{number}{RandomNumberGenerator.GetInt32(10000)}";
            }

            public static string ForDeliverer()
            {
                var number = $"D{alphabet[RandomNumberGenerator.GetInt32(alphabet.Length)]}";

                return $"{number}{RandomNumberGenerator.GetInt32(1000)}";

            }
        }

        private static string RandomPhone()
        {
            return $"89{RandomNumberGenerator.GetInt32(100000000, 999999999)}";
        }
    }
}
