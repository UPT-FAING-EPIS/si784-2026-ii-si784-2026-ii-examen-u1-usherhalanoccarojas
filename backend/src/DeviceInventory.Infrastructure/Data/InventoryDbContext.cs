using DeviceInventory.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeviceInventory.Infrastructure.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options)
    {
    }

    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Movement> Movements => Set<Movement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Device configuration
        modelBuilder.Entity<Device>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Brand).IsRequired().HasMaxLength(100);
            entity.Property(d => d.Model).IsRequired().HasMaxLength(100);
            entity.Property(d => d.Imei).IsRequired().HasMaxLength(15);
            entity.HasIndex(d => d.Imei).IsUnique();
            entity.Property(d => d.SerialNumber).HasMaxLength(100);
            entity.Property(d => d.Location).IsRequired().HasMaxLength(150);
            entity.Property(d => d.Status).IsRequired();
            entity.Property(d => d.PurchasePrice).HasPrecision(18, 2);
            entity.Property(d => d.Notes).HasMaxLength(500);

            entity.HasMany(d => d.Movements)
                  .WithOne(m => m.Device)
                  .HasForeignKey(m => m.DeviceId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Movement configuration
        modelBuilder.Entity<Movement>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.MovementType).IsRequired();
            entity.Property(m => m.OriginLocation).HasMaxLength(150);
            entity.Property(m => m.DestinationLocation).HasMaxLength(150);
            entity.Property(m => m.Reason).IsRequired().HasMaxLength(300);
            entity.Property(m => m.ResponsiblePerson).IsRequired().HasMaxLength(150);
        });
    }
}
