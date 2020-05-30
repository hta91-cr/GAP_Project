using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DB;

namespace GAP_API.Controllers
{
    public class AppointmentController : ApiController
    {
        DBDataContext dc = new DBDataContext();

        //Obtiene citas
        public IHttpActionResult GetAppointments()
        {

            var appointments = (from appdb in dc.appointments
                                join userdb in dc.User on appdb.id_user equals userdb.id
                                join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                                select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            return Ok(appointments);

        }
        static IEnumerable<T> SequenceByExample<T>(T t) { return null; }

        //Obtiene citas(filtros)
        [HttpPost]
        public IHttpActionResult GetAppointments(int id, DB.appointments appointment)
        {
            var app = SequenceByExample(new { id = 0, id_user = 0, id_specialty = 0, date = DateTime.Today, full_name = "", name="" });

            if (id != -1)
            {
                 app = (from appdb in dc.appointments
                                     join userdb in dc.User on appdb.id_user equals userdb.id
                                     join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                                     where appdb.id == id
                        select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            }
            else if (appointment.date != DateTime.MinValue && appointment.id_user != -1 && appointment.id_specialty != -1) {
                 app = (from appdb in dc.appointments
                           join userdb in dc.User on appdb.id_user equals userdb.id
                           join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                           where appdb.date == appointment.date && appdb.id_specialty == appointment.id_specialty && appdb.id_user == appointment.id_user
                        select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();

            } else if (appointment.date == DateTime.MinValue && appointment.id_user != -1 && appointment.id_specialty != -1) {
                 app = (from appdb in dc.appointments
                           join userdb in dc.User on appdb.id_user equals userdb.id
                           join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                           where appdb.id_specialty == appointment.id_specialty && appdb.id_user == appointment.id_user
                        select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            }
            else if (appointment.date != DateTime.MinValue && appointment.id_user == -1 && appointment.id_specialty != -1)
            {
                app = (from appdb in dc.appointments
                       join userdb in dc.User on appdb.id_user equals userdb.id
                       join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                       where appdb.id_specialty == appointment.id_specialty && appdb.date == appointment.date
                       select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            }
            else if (appointment.date != DateTime.MinValue && appointment.id_user != -1 && appointment.id_specialty == -1)
            {
                app = (from appdb in dc.appointments
                       join userdb in dc.User on appdb.id_user equals userdb.id
                       join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                       where appdb.date == appointment.date && appdb.id_user == appointment.id_user
                       select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            }
            else if (appointment.date == DateTime.MinValue && appointment.id_user == -1 && appointment.id_specialty != -1)
            {
                 app = (from appdb in dc.appointments
                           join userdb in dc.User on appdb.id_user equals userdb.id
                           join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                           where appdb.id_specialty == appointment.id_specialty
                        select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            }
            else if (appointment.date == DateTime.MinValue && appointment.id_user != -1 && appointment.id_specialty == -1)
            {
                app = (from appdb in dc.appointments
                       join userdb in dc.User on appdb.id_user equals userdb.id
                       join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                       where appdb.id_user == appointment.id_user
                       select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();

            }
            else if (appointment.date != DateTime.MinValue && appointment.id_user == -1 && appointment.id_specialty == -1)
            {
                app = (from appdb in dc.appointments
                       join userdb in dc.User on appdb.id_user equals userdb.id
                       join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                       where appdb.date == appointment.date
                       select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();

            }
            else
            {
                 app = (from appdb in dc.appointments
                           join userdb in dc.User on appdb.id_user equals userdb.id
                           join specialtydb in dc.specialty on appdb.id_specialty equals specialtydb.id
                        select new { appdb.id, appdb.id_user, appdb.id_specialty, appdb.date, userdb.full_name, specialtydb.name }).ToList();
            }

            return Ok(app);
        }

        ////Agrega Citas
        [HttpPost]
        public IHttpActionResult AddAppointment(DB.appointments appointment)
        {
            var app = (from appdb in dc.appointments
                   join userdb in dc.User on appdb.id_user equals userdb.id
                   where appdb.id_user == appointment.id_user && appdb.date == appointment.date
                   select new {appdb.id}).ToList();
            if (app.Count == 0)
            {
                dc.appointments.InsertOnSubmit(appointment);
                dc.SubmitChanges();
                return Ok();
            }
            else {
                return NotFound();
                    }
        }

        ////Edita Citas
        [HttpPut]
        public IHttpActionResult EditAppointment(int id, DB.appointments appointment)
        {
            DB.appointments updtInfo = (from appdb in dc.appointments where appdb.id == id select appdb).FirstOrDefault();
            if (updtInfo != null)
            {
                updtInfo.date = appointment.date;
                updtInfo.id_user = appointment.id_user;
                updtInfo.id_specialty = appointment.id_specialty;
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
