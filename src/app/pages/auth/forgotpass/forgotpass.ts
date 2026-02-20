import { Component, DOCUMENT, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthResponse } from '@models/auth';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-forgotpass',
  imports: [ReactiveFormsModule],
  templateUrl: './forgotpass.html',
  styleUrl: './forgotpass.scss',
})
export class Forgotpass {
  formForgotPass = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  isLoggedIn: boolean = false;
  userDetails?: AuthResponse;

  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService) {
    const localStorage = this.document.defaultView?.localStorage;

    if(localStorage && localStorage.getItem("login")) {
      this.isLoggedIn = true;

      this.userDetails = {
        displayName: JSON.parse(localStorage.getItem("login")!).displayName,
        username: JSON.parse(localStorage.getItem("login")!).username
      }
    }
  }

  ngOnInit() {

  }

  onSubmit() {
    try {
      const {email, password} = this.formForgotPass.value;
      this.authService.forgotPass({
        email: ""+email,
        password: ""+password
      }).subscribe((r) => {
        alert(`Your email ${r.email} has been recovered successfully!`);

        setTimeout(() => {
          window.location.href = "/";
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([this.router.url]);
          // });
        }, 100 * 5);
      });
    } catch (error) {
      alert(error);
    }
  }
}
