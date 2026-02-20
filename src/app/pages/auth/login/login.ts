import { AfterViewInit, Component, DOCUMENT, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { AuthResponse } from '@models/auth';
import { Toast } from '@/app/components';
import { CommonModule } from '@angular/common';
import { ToastService } from '@/app/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, Toast],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, AfterViewInit, OnDestroy {
  isAuthLoggedIn: boolean = false;
  isLoggedIn: boolean = false;
  isToastShown: boolean = false;
  userDetails?: AuthResponse;
  
  formLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  private sub!: Subscription;


  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService, private toastService: ToastService, private cdr: ChangeDetectorRef) {
    const localStorage = this.document.defaultView?.localStorage;

    if(localStorage && localStorage.getItem("login")) {
      this.isLoggedIn = true;

      this.userDetails = {
        displayName: JSON.parse(localStorage.getItem("login")!).displayName,
        username: JSON.parse(localStorage.getItem("login")!).username
      };
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  onSubmit() {
    this.isToastShown = true;
    
    try {
      const {username, password} = this.formLogin.value;
      const logreq = { username: ""+username, password: ""+password };

      this.sub = this.authService.login(logreq).subscribe({
        next: (r) => {
          console.log(`Logged as ${r.displayName ?? r.username}!`);
          localStorage.setItem("login", JSON.stringify(r));
          this.isAuthLoggedIn = true;

          setTimeout(() => {
            location.href = "/";
          }, 1000 * 1);
        },
        error: (err) => {
          console.error("Login failed: " + err);
          this.isAuthLoggedIn = false;
          this.loadToastNotif(username!, err);
        },
        complete: () => {
          console.log("Login auth successfully done");
          this.isAuthLoggedIn = true;
          this.loadToastNotif(username!, "");
        }
      });
    } catch (error) {
      console.log("Error: " + error);
      this.isAuthLoggedIn = false;
      this.loadToastNotif(this.formLogin.value.username!, ""+error);
    }
  }

  loadToastNotif(uname: string, error?: string) {
    if(this.isToastShown) {
      const msg = this.isAuthLoggedIn ? `Logged in as ${uname}` : `Error: ${error}`;
      const isuuidenabled = false;

      const options = {
        id: isuuidenabled ? crypto.randomUUID().toString() : 1,
        title: 'LCPDBZone - Login',
        classname: this.isAuthLoggedIn ? 'bg-success text-white' : 'bg-danger text-white',
        idname: this.isAuthLoggedIn ? "toastlogsuccess" : "toastlogerror",
        delay: 500
      };

      console.log(options)

      this.toastService.clear();
      this.toastService.show(msg, options);
      // Trigger change detection to ensure toast is displayed
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
