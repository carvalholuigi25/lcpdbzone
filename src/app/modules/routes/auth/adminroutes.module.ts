import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: ':id', loadComponent: () => import('@pages/admin/admin').then((c) => c.Admin) },
  {
    path: 'settings',
    loadComponent: () =>
      import('@pages/admin/admsettings/admsettings').then((c) => c.Admsettings),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(ADMIN_ROUTES)],
  exports: [RouterModule],
})
export class AdminRoutesModule {}
