using course.Server.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace course.Server.Models
{
    public class InventoryRecordInputModel
    {
        public int? Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int Price { get; set; }

        public string? PropertiesJson { get; set; }

        public byte[]? Image { get; set; }

        public InventoryRecord ToEntity()
        {
            var entity = new InventoryRecord
            {
                PropertiesJson = PropertiesJson,
                Quantity = Quantity,
                Price = Price,
                Image = Image
            };
            if (Id != null) entity.Id = (int)Id;            
            return entity;
        }
    }
}
