import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {

  constructor(private http: HttpClient) { }

  getSpecialties() {
    return this.http.get<any>("http://localhost:1275/api/Specialty");
  }

  getSpecialty(id) {
    return this.http.get("http://localhost:1275/api/Specialty/" + id);
  }

  addSpecialties(body) {
    return this.http.post("http://localhost:1275/api/Specialty/", body);
  }

  editSpecialties(body, id) {
    return this.http.put("http://localhost:1275/api/Specialty/" + id, body);
  }
}
