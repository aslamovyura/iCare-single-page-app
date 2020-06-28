import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {Routes, RouterModule} from '@angular/router';

import { FormsModule }   from '@angular/forms';
import { HttpClientModule }   from '@angular/common/http';

import { AppComponent }   from './app.component';
import { routing }   from './app.routing';

import { NavComponent }   from './navigation';
import { FooterComponent}   from './footer'

import { HomeComponent }   from './home';
import { NotFoundComponent} from './not-found';

import { SensorsComponent }   from './sensors';
import { RecordsComponent }   from './records';
import { PatientsComponent }   from './patients';
import { ReportsComponent }   from './reports';

import { LoginComponent }   from './login';
import { RegisterComponent }   from './register';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        NavComponent,
        FooterComponent,
        HomeComponent,
        NotFoundComponent,
        SensorsComponent, 
        RecordsComponent,
        PatientsComponent,
        ReportsComponent,
        RegisterComponent,
        LoginComponent
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }