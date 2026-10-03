using System.Text.Json.Serialization;
using DeviceInventory.Api.Middleware;
using DeviceInventory.Api.Services;
using DeviceInventory.Core.Interfaces;
using DeviceInventory.Infrastructure.Data;
using DeviceInventory.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure Controllers and JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API de Inventario de Equipos Celulares",
        Version = "v1",
        Description = "API RESTful para el registro, monitoreo, control de stock y movimientos de equipos celulares.",
        Contact = new OpenApiContact
        {
            Name = "Equipo de Desarrollo UPT",
            Email = "contacto@upt.pe"
        }
    });
});

// Configure Database Provider (SQLite by default, PostgreSQL for container/cloud)
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=inventory.db";

if (dbProvider.Equals("PostgreSql", StringComparison.OrdinalIgnoreCase))
{
    var pgConn = builder.Configuration.GetConnectionString("PostgresConnection") ?? connectionString;
    builder.Services.AddDbContext<InventoryDbContext>(options =>
        options.UseNpgsql(pgConn));
}
else
{
    builder.Services.AddDbContext<InventoryDbContext>(options =>
        options.UseSqlite(connectionString));
}

// Register Repositories and Services
builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<IMovementRepository, MovementRepository>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Global Exception Handler
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Enable Swagger in Development and Production for demonstration
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Device Inventory API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Initialize and seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<InventoryDbContext>();
        await DbInitializer.InitializeAsync(context, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during database initialization.");
    }
}

app.Run();

// Required for integration testing with WebApplicationFactory
public partial class Program { }
