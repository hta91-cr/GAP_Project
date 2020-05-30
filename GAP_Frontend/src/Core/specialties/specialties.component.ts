import { Component, OnInit, ViewChild } from "@angular/core";
import { SpecialtyService } from "src/Services/specialty.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";

@Component({
  selector: "app-specialties",
  templateUrl: "./specialties.component.html",
  styleUrls: ["./specialties.component.scss"],
})
export class SpecialtiesComponent implements OnInit {
  constructor(
    private specServ: SpecialtyService,

    private fb: FormBuilder,
    private ts: ToastService
  ) {}

  @ViewChild("basicModal", { static: true }) basicModal: ModalDirective;

  userForm = this.fb.group({
    name: ["", Validators.required],
  });

  edit: boolean = false;
  editingId: number = 0;
  specialties: any = [];

  appElements = ["ID", "Nombre", "Editar"];

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.specServ.getSpecialties().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          let element = {
            id: res[i].id,
            name: res[i].name,
          };
          this.specialties.push(element);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addSpecialty() {
    var params = {
      name: this.userForm.get(["name"]).value,
    };
    if (this.userForm.valid == true) {
      this.specServ.addSpecialties(params).subscribe((res) => {
        this.specialties = [];
        this.loadSpecialties();
        this.basicModal.hide();
        this.userForm.reset();
      });
    } else {
      this.ts.error("Por favor ingrese la informacion correspondiente");
    }
  }

  editSpecialty(p) {
    this.edit = true;
    this.editingId = p.id;
    this.specServ.getSpecialty(p.id).subscribe((res) => {
      this.userForm.get(["name"]).setValue(res[0].name);
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
      name: this.userForm.get(["name"]).value,
    };
    this.specServ.editSpecialties( params,this.editingId).subscribe((res) => {
      this.specialties = [];
      this.loadSpecialties();
      this.basicModal.hide();
      this.userForm.reset();
    });
  }
}
