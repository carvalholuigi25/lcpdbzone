import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

export const ERROR_ROUTES: Routes = [
  {
    path: 'notfound',
    loadComponent: () => import('@pages/error/notfound/notfound').then((c) => c.Notfound),
  },
  {
    path: 'unauth',
    loadComponent: () => import('@pages/error/unauth/unauth').then((c) => c.Unauth),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(ERROR_ROUTES)],
  exports: [RouterModule],
})
export class ErrorRoutesModule {}
