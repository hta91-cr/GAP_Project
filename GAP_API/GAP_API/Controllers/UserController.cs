using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Linq;
using DB;
using System.Web.Http.Cors;

namespace GAP_API.Controllers
{
    public class UserController : ApiController
    {
        DBDataContext dc = new DBDataContext();

        //Obtiene pacientes
        public IHttpActionResult GetUsers() {

            var Users = dc.User.ToList();
            return Ok(Users);

        }

        //Obtiene pacientes
        public IHttpActionResult GetUser(int id)
        {
            var User = dc.User.Where(x=>x.id == id).ToList();
            return Ok(User);
        }

        //Agrega Pacientes
        [HttpPost]
        public IHttpActionResult AddUser(DB.User user)
        {
            dc.User.InsertOnSubmit(user);
            dc.SubmitChanges();
            return Ok();
        }
        [HttpPut]
        public IHttpActionResult EditUser(int id, DB.User user)
        {
            DB.User updtInfo = (from userdb in dc.User where userdb.id == id select userdb).FirstOrDefault();
            if (updtInfo != null) { 
            updtInfo.full_name = user.full_name;
            updtInfo.email = user.email;
            updtInfo.password = user.password;
            dc.SubmitChanges();
            }
            else{
                return NotFound();
            }
            return Ok();
        }
    }
}
