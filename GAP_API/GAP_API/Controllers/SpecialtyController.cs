using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DB;
namespace GAP_API.Controllers
{
    public class SpecialtyController : ApiController
    {
        DBDataContext dc = new DBDataContext();

        //Obtiene pacientes
        public IHttpActionResult GetSpecialties()
        {

            var specialties = dc.specialty.ToList();
            return Ok(specialties);

        }

        //Obtiene pacientes
        public IHttpActionResult GetSpecialty(int id)
        {
            var specialty = dc.specialty.Where(x => x.id == id).ToList();
            return Ok(specialty);
        }

        //Agrega Pacientes
        [HttpPost]
        public IHttpActionResult AddSpecialty(DB.specialty specialty)
        {
            dc.specialty.InsertOnSubmit(specialty);
            dc.SubmitChanges();
            return Ok();
        }
        [HttpPut]
        public IHttpActionResult EditSpecialty(int id, DB.specialty specialty)
        {
            DB.specialty updtInfo = (from specialtydb in dc.specialty where specialtydb.id == id select specialtydb).FirstOrDefault();
            if (updtInfo != null)
            {
                updtInfo.name = specialty.name;
                dc.SubmitChanges();
            }
            else
            {
                return NotFound();
            }
            return Ok();
        }

    }
}
