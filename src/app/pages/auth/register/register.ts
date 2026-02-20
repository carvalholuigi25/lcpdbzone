import { Component, DOCUMENT, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthResponse } from '@models/auth';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  formRegister = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    chkacptterms: new FormControl(false)
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
      const {username, email, password} = this.formRegister.value;
      this.authService.register({
        username: ""+username,
        email: ""+email,
        password: ""+password
      }).subscribe((r) => {
        alert(`Registered as ${r.username}!`);

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
