import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAppointments() {
    return this.http.get<any>("http://localhost:1275/api/Appointment");
  }

  getAppointment(id, body) {
    return this.http.post("http://localhost:1275/api/Appointment/" + id, body);
  }

  addAppointment(body) {
    return this.http.post("http://localhost:1275/api/Appointment/", body);
  }

  EditAppointment(id, body) {
    return this.http.put("http://localhost:1275/api/Appointment/" + id, body);
  }
}
