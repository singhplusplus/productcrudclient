import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {}
  // title = 'inventory';

  ngOnInit() {}

  onLogout() {
    this.userService.deleteToken();
    this.router.navigateByUrl('/login');
  }

  userLoggedIn() : boolean {
    return this.userService.isLoggedIn();
  }
}
