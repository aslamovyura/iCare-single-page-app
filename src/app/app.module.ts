import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {Routes, RouterModule} from '@angular/router';

import { FormsModule }   from '@angular/forms';
import { HttpClientModule }   from '@angular/common/http';

import { AppComponent }   from './app.component';

import { NavComponent }   from './navigation/nav.component';
import { FooterComponent}   from './footer/footer.component'

import { HomeComponent }   from './home/home.component';
import { NotFoundComponent} from './not-found/not-found.component';

import { SensorsComponent }   from './sensors/sensorts.component';
import { RecordsComponent }   from './records/records.component';
import { PatientsComponent }   from './patients/patients.component';
import { ReportsComponent }   from './reports/reports.component';

import { LoginComponent }   from './login/login.component';
import { RegisterComponent }   from './register/register.component';


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