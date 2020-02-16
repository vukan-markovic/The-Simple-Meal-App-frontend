import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, NavigationEnd } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UserDTO } from 'src/app/models/userDTO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: UserDTO = new UserDTO();

  constructor(private authService: AuthenticationService,
    private router: Router,
    private userService: UsersService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.isLoggedIn()) {
          this.userService.getUser(this.authService.currentUserSubject.value.email)
            .subscribe(user => {
              this.user = user;
            });
        }
      }
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }


  isChosenOne() {
    return this.authService.isChoosenOne();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}