import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class PatientService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any>("http://localhost:1275/api/User");
  }

  getUser(id) {
    return this.http.get("http://localhost:1275/api/User/" + id);
  }

  addUsers(body) {
    return this.http.post("http://localhost:1275/api/User/", body);
  }

  editUsers(id,body) {
    return this.http.put("http://localhost:1275/api/User/" + id, body);
  }
}
