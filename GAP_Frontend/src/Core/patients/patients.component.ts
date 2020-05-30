import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from 'src/Services/appointment.service';
import { PatientService } from 'src/Services/patient.service';
import { SpecialtyService } from 'src/Services/specialty.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  constructor(

    private patServ: PatientService,

    private fb: FormBuilder,
    private ts: ToastService
  ) {}

  @ViewChild("basicModal", { static: true }) basicModal: ModalDirective;

  userForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    password: ["", Validators.required],
  });

  edit: boolean = false;
  editingId: number = 0;
  patients: any = [];

  appElements = ["ID", "Nombre", "Email", "Editar"];

  ngOnInit(): void {

    this.loadPatients();

  }

  loadPatients() {
    this.patServ.getUsers().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          let element = {
            id: res[i].id,
            full_name: res[i].full_name,
            email: res[i].email,
          };
          this.patients.push(element);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  addUser() {

    var params = {
      full_name: this.userForm.get(["name"]).value,
      email: this.userForm.get(["email"]).value,
      password: this.userForm.get(["password"]).value,
    };
    if (this.userForm.valid == true) {
      this.patServ.addUsers(params).subscribe(
        (res) => {
          this.patients = []
          this.loadPatients();
          this.basicModal.hide();
          this.userForm.reset();
        },
        (error) => {
          console.error(error);
          if (error.status == "404") {
            this.ts.error("El usuario ya tiene una cita programada para ese dia");
          }
        }
      );
    } else {
      this.ts.error("Por favor ingrese la informacion correspondiente");
    }
  }

  editUser(p) {
    this.edit = true;
    this.editingId = p.id;
    this.patServ.getUser(p.id).subscribe((res) => {
      this.userForm.get(["name"]).setValue(res[0].full_name);
      this.userForm.get(["email"]).setValue(res[0].email);
      this.userForm.get(["password"]).setValue(res[0].password);
      this.basicModal.show();
    });

  }

  openModal() {
    this.userForm.reset();
    this.edit = false;
    this.basicModal.show();
  }

  saveEdit() {
    var params = {
      full_name: this.userForm.get(["name"]).value,
      email: this.userForm.get(["email"]).value,
      password: this.userForm.get(["password"]).value,
    };
    this.patServ.editUsers(this.editingId, params).subscribe((res) => {
      this.patients = []
      this.loadPatients();
      this.basicModal.hide();
      this.userForm.reset();
    });
  }
}
