import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

export const DATA_AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('@pages/auth/login/login').then((c) => c.Login)
  },
  { 
    path: 'register', 
    loadComponent: () => import('@pages/auth/register/register').then((c) => c.Register) 
  },
  { 
    path: 'forgotpass', 
    loadComponent: () => import('@pages/auth/forgotpass/forgotpass').then((c) => c.Forgotpass) 
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(DATA_AUTH_ROUTES),
  ],
  exports: [RouterModule]
})
export class AuthModule { }
