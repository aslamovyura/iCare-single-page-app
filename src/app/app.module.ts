import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {Routes, RouterModule} from '@angular/router';

import { FormsModule }   from '@angular/forms';
import { HttpClientModule }   from '@angular/common/http';

import { AppComponent }   from './app.component';

import { NavComponent }   from './components/navigation/nav.component';
import { FooterComponent}   from './components/footer/footer.component'

import { HomeComponent }   from './components/home/home.component';
import { NotFoundComponent} from './components/not-found/not-found.component';

import { SensorsComponent }   from './components/sensors/sensorts.component';
import { RecordsComponent }   from './components/records/records.component';
import { PatientsComponent }   from './components/patients/patients.component';
import { ReportsComponent }   from './components/reports/reports.component';

import { LoginComponent }   from './components/login/login.component';
import { RegisterComponent }   from './components/register/register.component';


const appRoutes: Routes =[
    { path: 'home', component: HomeComponent},
    { path: 'sensors', component: SensorsComponent},
    { path: 'records', component: RecordsComponent},
    { path: 'patients', component: PatientsComponent}, 
    { path: 'reports', component: ReportsComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '**', component: NotFoundComponent},
];

@NgModule({
    imports:      [ BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
    declarations: [ AppComponent, NavComponent, FooterComponent, HomeComponent, NotFoundComponent,SensorsComponent, 
                    RecordsComponent, PatientsComponent, ReportsComponent, RegisterComponent, LoginComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }