import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm !: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) 
      this.router.navigateByUrl("/product");

    this.signupForm = this.fb.group({
      fullName: '',
      email: '',
      password: ''
    });
    // this.signupForm.valueChanges.subscribe(console.log);
  }

  onSubmit() {
    console.log(this.signupForm.value);
    this.userService.signupUser(this.signupForm.value).subscribe(
      (res : any) => {
        // this.router.navigateByUrl("login");
        this.router.navigate(['/login'], {queryParams: {redirectedFrom: "register"}});
      },
      err => {
        console.error("Login error", err);
      }
    )
  }

}
