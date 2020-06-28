import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }   from './home';
import { NotFoundComponent} from './not-found';
import { SensorsComponent }   from './sensors';
import { RecordsComponent }   from './records';
import { PatientsComponent }   from './patients';
import { ReportsComponent }   from './reports';
import { LoginComponent }   from './login';
import { RegisterComponent }   from './register';

const appRoutes: Routes =[
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'sensors', component: SensorsComponent},
    { path: 'records', component: RecordsComponent},
    { path: 'patients', component: PatientsComponent}, 
    { path: 'reports', component: ReportsComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},

    { path: '**', component: NotFoundComponent},
];

export const routing = RouterModule.forRoot(appRoutes);