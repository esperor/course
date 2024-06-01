using course.Server.Configs;
using course.Server.Configs.Enums;
using course.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Primitives;
using System.Collections;
using System.Security.Cryptography;

namespace course.Server.Services
{
    public class IdentityService
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher;

        public class Result
        {
            public string[]? Errors { get; set; }
            public required bool Success { get; set; }
        }

        public class SignInResult : Result
        {
            public StringValues? AuthCookie { get; set; }
        }

        private Result Ok() { return new Result { Errors = null, Success = true }; }
        private Result Errors(string[] errors) { return new Result { Success = false, Errors = errors }; }

        public IdentityService(ApplicationDbContext context) 
        { 
            _context = context;
            _passwordHasher = new PasswordHasher<ApplicationUser>();
        }

        public Result CreateUser(ApplicationUser user, string password) 
        {
            _context.Database.BeginTransaction();
            try
            {
                if (_context.Users.Where(u => u.Phone == user.Phone).ToList().Count > 0)
                    return Errors(["Phone number should be unique"]);

                user.PasswordHash = _passwordHasher.HashPassword(user, password);
                _context.Users.Add(user);
                _context.SaveChanges();
            } catch (Exception e)
            {
                _context.Database.RollbackTransaction();
                return Errors([e.Message]);
            }
            _context.Database.CommitTransaction();
            return Ok();
        }

        public ApplicationUser? GetUser(HttpContext httpContext)
        {
            var authCookie = httpContext.Request.Cookies
                .Where(c => c.Key == Constants.AuthCookieName).FirstOrDefault().Value;
            if (authCookie is null) return null;

            Session? session = _context.Sessions.Where(s => s.Cookie == authCookie).FirstOrDefault();
            if (session == null) return null;
            if (session.CreationTime.AddDays(
                    Constants.ServerCookieExpirationDays
                ) < DateTime.Now) 
                return null;

            return _context.Users.Where(u => u.Id == session.UserId).FirstOrDefault();
        }

        public ApplicationUser? GetUserByPhone(string phone)
        {
            return _context.Users.Where(u => u.Phone == phone).FirstOrDefault();
        }

        public SignInResult SignIn(ApplicationUser user, string password)
        {
            if (user.PasswordHash is null) return (SignInResult)Errors(["Provided user lacks PasswordHash"]);
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);


            switch (result)
            {
                case PasswordVerificationResult.Success:
                    return new SignInResult { Success = true, AuthCookie = GenerateAuthCookie(user) };
                case PasswordVerificationResult.Failed:
                    return (SignInResult)Errors(["Wrong password"]);
                case PasswordVerificationResult.SuccessRehashNeeded:
                    return new SignInResult { 
                        Success = true, 
                        AuthCookie = GenerateAuthCookie(user), 
                        Errors = ["Rehash needed"] 
                    };
                default: 
                    return (SignInResult)Errors(["Unexpected error"]);
            }
        }

        public Result SignOut(ApplicationUser user)
        {
            try
            {
                Session? session = _context.Sessions
                .Where(s => s.UserId == user.Id)
                .OrderByDescending(s => s.CreationTime).FirstOrDefault();

                if (session is null) return Errors(["No session found"]);

                _context.Sessions.Remove(session);
                _context.SaveChanges();
            } catch (Exception) 
            {
                return Errors(["Unexpected error"]);
            }
            return Ok();
        }

        public Dictionary<EAccessLevel, int> GetAccessLevelsToIdMap()
        {
            var dictionary = new Dictionary<EAccessLevel, int>();
            _context.AccessLevels.ToList().ForEach(level =>
            {
                var success = Enum.TryParse(level.Name, out EAccessLevel eLevel);
                if (success) dictionary.Add(eLevel, level.Id);
            });
            return dictionary;
        }

        public Dictionary<int, EAccessLevel> GetIdToAccessLevelsMap()
        {
            var dictionary = new Dictionary<int, EAccessLevel>();
            _context.AccessLevels.ToList().ForEach(level =>
            {
                var success = Enum.TryParse(level.Name, out EAccessLevel eLevel);
                if (success) dictionary.Add(level.Id, eLevel);
            });
            return dictionary;
        }

        private string GenerateAuthCookie(ApplicationUser user)
        {
            _context.Database.BeginTransaction();

            try
            {
                string cookie = RandomNumberGenerator.GetHexString(64);

                _context.Sessions.Add(new Session
                { UserId = user.Id, Cookie = cookie, CreationTime = DateTime.Now });
                _context.SaveChanges();
                _context.Database.CommitTransaction();
                return cookie;
            } catch (Exception)
            {
                _context.Database.RollbackTransaction();
                throw;
            }
        }
    }
}
