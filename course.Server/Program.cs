using course.Server.Configs;
using course.Server.Configs.Authentication;
using course.Server.Data;
using course.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IdentityService>();
builder.Services.AddTransient<IAuthorizationHandler, AccessLevelAuthorizationHandler>();
builder.Services.AddTransient<IAuthorizationHandler, AccessTraitAuthorizationHandler>();

#region Authentication
builder.Services.AddAuthentication(o => {
    o.DefaultScheme = Constants.AuthScheme;
})
.AddScheme<AuthenticationSchemeOptions, AuthenticationHandler>(Constants.AuthScheme, o => { });
#endregion

var config = builder.Configuration;

var connectionString = config.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ApplicationDbContext>();
        await DbInitializer.Initialize(context);
    }
}

app.Run();
