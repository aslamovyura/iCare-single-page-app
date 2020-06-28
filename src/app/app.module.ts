import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {Routes, RouterModule} from '@angular/router';

import { FormsModule }   from '@angular/forms';
import { HttpClientModule }   from '@angular/common/http';

import { AppComponent }   from './app.component';

import { NavComponent }   from './components/navigation/nav.component';

import { HomeComponent }   from './components/home/home.component';
import { LoginComponent }   from './components/login/login.component';
import { PatientsComponent }   from './components/patients/patients.component';
import { RecordsComponent }   from './components/records/records.component';
import { RegisterComponent }   from './components/register/register.component';
import { ReportsComponent }   from './components/reports/reports.component';
import { SensorsComponent }   from './components/sensors/sensorts.component';

const appRoutes: Routes =[
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'patients', component: PatientsComponent},
    { path: 'records', component: RecordsComponent},
    { path: 'reports', component: ReportsComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'sensors', component: SensorsComponent},
];

@NgModule({
    imports:      [ BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
    declarations: [ AppComponent, NavComponent, HomeComponent, LoginComponent, PatientsComponent, RecordsComponent, RegisterComponent, ReportsComponent, SensorsComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }