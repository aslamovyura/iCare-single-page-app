import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, NotFoundComponent }   from './common';
import { SensorsComponent }   from './sensors';
import { RecordsComponent }   from './records';
import { PatientsComponent }   from './patients';
import { ReportsComponent }   from './reports';
import { HealthCheckComponent} from './health-check';
import { LoginComponent, RegisterComponent }   from './account';
import { ProfileComponent, EditProfileComponent } from './profile';
import { AuthGuard } from './_guards';

const appRoutes: Routes =[
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'sensors', component: SensorsComponent, canActivate: [AuthGuard] },
    { path: 'records', component: RecordsComponent, canActivate: [AuthGuard] },
    { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] }, 
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'health-check', component: HealthCheckComponent, canActivate: [AuthGuard] },

    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },

    { path: '**', component: NotFoundComponent},
];

export const routing = RouterModule.forRoot(appRoutes);