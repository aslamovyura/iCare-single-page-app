import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../_models';

@Component({
    selector: 'nav-app',
    templateUrl: './nav.component.html'
})
export class NavComponent {
    currentUser: User;
    isAdminMode: boolean;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.authenticationService.currentUser.subscribe(x => this.isAdminMode = x.role == 'Admin' );
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}