import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }   from './home';
import { NotFoundComponent} from './not-found';
import { SensorsComponent }   from './sensors';
import { RecordsComponent }   from './records';
import { PatientsComponent }   from './patients';
import { ReportsComponent }   from './reports';
import { LoginComponent }   from './login';
import { RegisterComponent }   from './register';
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

    { path: '**', component: NotFoundComponent},
];

export const routing = RouterModule.forRoot(appRoutes);