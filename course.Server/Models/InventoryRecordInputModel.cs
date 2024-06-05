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
        public string Size { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int Price { get; set; }

        public byte[]? Image { get; set; }

        public InventoryRecord ToEntity()
        {
            var entity = new InventoryRecord
            {
                Size = Size,
                Quantity = Quantity,
                Price = Price,
                Image = Image
            };
            if (Id != null) entity.Id = (int)Id;            
            return entity;
        }
    }
}
