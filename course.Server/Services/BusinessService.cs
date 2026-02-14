using course.Server.Data;
using course.Server.Models;

namespace course.Server.Services
{
    public class BusinessService(ApplicationDbContext context)
    {
        private readonly ApplicationDbContext _context = context;


        public async Task<bool> UpdateProduct(int id, ProductAggregatedInfoModel model)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return false;

            product.Title = model.Title;
            product.Description = model.Description;

            await UpdateInventoryRecordsWithoutCommit(model.Records ?? []);

            await _context.SaveChangesAsync();

            return true;
        }

        private async Task UpdateInventoryRecordsWithoutCommit(InventoryRecordInfoModel[] models)
        {
            foreach (var model in models)
            {
                var inventoryRecord = await _context.InventoryRecords.FindAsync(model.Id);
                if (inventoryRecord is null) continue;

                inventoryRecord.Size = model.Size;
                inventoryRecord.Variation = model.Variation;
                inventoryRecord.Price = model.Price;
                inventoryRecord.Quantity = model.Quantity;
                inventoryRecord.Image = model.Image;
                inventoryRecord.PropertiesJson = model.PropertiesJson;
            }
        }
    }
}
