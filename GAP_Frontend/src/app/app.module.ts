import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import { AppComponent } from "./app.component";
import {
  MDBSpinningPreloader,
  MDBBootstrapModulesPro,
  ToastModule,
} from "ng-uikit-pro-standard";
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AppointmentService } from "../Services/appointment.service";
import { PatientService } from "../Services/patient.service";

import { MenuComponent } from "../Menu/menu/menu.component";
import { HomeComponent } from "../Core/home/home.component";
import { SpecialtiesComponent } from "../Core/specialties/specialties.component";
import { PatientsComponent } from "../Core/patients/patients.component";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    SpecialtiesComponent,
    PatientsComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: "Your_api_key",
    }),
    AppRoutingModule,
  ],
  providers: [MDBSpinningPreloader, AppointmentService, PatientService],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
