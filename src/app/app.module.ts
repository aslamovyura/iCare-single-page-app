import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS }   from '@angular/common/http';
import { DatePipe } from '@angular/common'

import { AppComponent }   from './app.component';
import { routing }   from './app.routing';

import { NavComponent, FooterComponent, HomeComponent, NotFoundComponent } from './common';
import { SensorsComponent }   from './sensors';
import { RecordsComponent }   from './records';
import { PatientsComponent }   from './patients';
import { ReportsComponent }   from './reports';
import { LoginComponent, RegisterComponent}   from './account';
import { ProfileComponent, EditProfileComponent } from './profile';
import { HealthCheckComponent } from './health-check';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgxPaginationModule
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
        LoginComponent,
        AlertComponent,
        ProfileComponent,
        EditProfileComponent,
        HealthCheckComponent,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, // Add JWT token to the request header.
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}, // Catch errors.
        [DatePipe]
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }