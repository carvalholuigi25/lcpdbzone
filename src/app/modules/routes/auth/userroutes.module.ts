import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

export const USER_ROUTES: Routes = [
  { path: ':id', loadComponent: () => import('@pages/user/user').then((c) => c.User) },
  {
    path: 'settings',
    loadComponent: () => import('@pages/user/settings/settings').then((c) => c.Settings),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(USER_ROUTES)],
  exports: [RouterModule],
})
export class UserRoutesModule {}
