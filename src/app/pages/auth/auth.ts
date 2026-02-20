import { Component } from '@angular/core';
import { Login } from './login/login';
import { Register } from './register/register';
import { Forgotpass } from './forgotpass/forgotpass';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [Login, Register, Forgotpass],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  currentUrl: string = '';  

  constructor(private route: Router) { 
    
  }

  ngOnInit() {
    this.currentUrl = this.route.url;
  }

  ngOnDestroy() {
  }
}
