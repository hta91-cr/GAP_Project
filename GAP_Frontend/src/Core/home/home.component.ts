import { PatientService } from "./../../Services/patient.service";
import { AppointmentService } from "./../../Services/appointment.service";
import { SpecialtyService } from "./../../Services/specialty.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ModalDirective } from "ng-uikit-pro-standard";
import { ToastService } from "ng-uikit-pro-standard";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(
    private appServ: AppointmentService,
    private patServ: PatientService,
    private specServ: SpecialtyService,
    private fb: FormBuilder,
    private ts: ToastService
  ) {}

  @ViewChild("basicModal", { static: true }) basicModal: ModalDirective;

  appointmentForm = this.fb.group({
    patient: ["", Validators.required],
    specialty: ["", Validators.required],
    date: ["", Validators.required],
  });

  edit: boolean = false;
  editingId: number = 0;
  patients: any = [];
  specialties: any = [];
  appointments: any = [];
  appElements = ["ID", "Paciente", "Fecha", "Especialidad", "Editar"];

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
    this.loadSpecialties();
  }

  loadAppointments() {
    this.appServ.getAppointments().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          let element = {
            id: res[i].id,
            patient: res[i].full_name,
            date: res[i].date.substr(0, 10),
            specialty: res[i].name,
          };
          this.appointments.push(element);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadPatients() {
    this.patServ.getUsers().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          let element = {
            value: res[i].id,
            label: res[i].full_name,
          };
          this.patients.push(element);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadSpecialties() {
    this.specServ.getSpecialties().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          let element = {
            value: res[i].id,
            label: res[i].name,
          };
          this.specialties.push(element);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addAppointment() {
    var params = {
      id_user: this.appointmentForm.get(["patient"]).value,
      date: this.appointmentForm.get(["date"]).value,
      id_specialty: this.appointmentForm.get(["specialty"]).value,
    };
    if (this.appointmentForm.valid == true) {
      this.appServ.addAppointment(params).subscribe(
        (res) => {
          this.appointments = [];
          this.loadAppointments();
          this.basicModal.hide();
          this.appointmentForm.reset();
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

  editAppointment(p) {
    this.edit = true;
    this.editingId = p.id;
    this.appServ.getAppointment(p.id,p).subscribe((res) => {
      this.appointmentForm.get(["patient"]).setValue(res[0].id_user);
      this.appointmentForm.get(["specialty"]).setValue(res[0].id_specialty);
      this.appointmentForm.get(["date"]).setValue(res[0].date);
      this.basicModal.show();
    });
    // var params = {
    //   id_user: this.appointmentForm.get(["patient"]).value,
    //   date: this.appointmentForm.get(["date"]).value,
    //   id_specialty: this.appointmentForm.get(["specialty"]).value,
    // };
  }

  openModal() {
    this.appointmentForm.reset();
    this.edit = false;
    this.basicModal.show();
  }

  saveEdit() {
    var params = {
      id_user: this.appointmentForm.get(["patient"]).value,
      date: this.appointmentForm.get(["date"]).value,
      id_specialty: this.appointmentForm.get(["specialty"]).value,
    };
    this.appServ.EditAppointment(this.editingId, params).subscribe((res) => {
      this.appointments = [];
      this.loadAppointments();
      this.basicModal.hide();
      this.appointmentForm.reset();
    });
  }
}
