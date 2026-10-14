using Dapper;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

var connStr = "Server=localhost;Database=todo_db;User=root;Password=;";

app.MapGet("/todos", async () =>
{
    using var conn = new MySqlConnection(connStr);
    var todos = await conn.QueryAsync<Todo>("SELECT Id, Title, Done FROM todos");
    return Results.Ok(todos);
});

app.MapPost("/todos", async (Todo todo) =>
{
    using var conn = new MySqlConnection(connStr);
    await conn.ExecuteAsync("INSERT INTO todos (Title) VALUES (@Title)", new { todo.Title });
    return Results.Ok("Eklendi");
});

app.MapDelete("/todos/{id}", async (int id) =>
{
    using var conn = new MySqlConnection(connStr);
    var rows = await conn.ExecuteAsync("DELETE FROM todos WHERE Id = @Id", new { Id = id });
    return rows == 0 ? Results.NotFound() : Results.NoContent();
});

app.MapPut("/todos/{id}", async (int id, Todo todo) =>
{
    using var conn = new MySqlConnection(connStr);
    var rows = await conn.ExecuteAsync(
        "UPDATE todos SET Title = @Title, Done = @Done WHERE Id = @Id",
        new { todo.Title, todo.Done, Id = id });
    return rows == 0 ? Results.NotFound() : Results.Ok();
});

app.MapGet("/servers", async () =>
{
    using var conn = new MySqlConnection(connStr);
    var servers = await conn.QueryAsync<Sunucu>("SELECT Id, Name, Ip, Online FROM servers");
    return Results.Ok(servers);
});

app.MapPut("/servers/{id}/durum", async (int id) =>
{
    using var conn = new MySqlConnection(connStr);
    var rows = await conn.ExecuteAsync("UPDATE servers SET Online = NOT Online WHERE Id = @Id", new { Id = id });
    return rows == 0 ? Results.NotFound() : Results.Ok();
});

app.Run();

record Todo(int Id, string Title, bool Done);
record Sunucu(int Id, string Name, string Ip, bool Online);