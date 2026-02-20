import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAdmin, SidebarAdmin } from '.';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderAdmin,
    SidebarAdmin
  ],
  exports: [HeaderAdmin, SidebarAdmin]
})
export class AdminComponentsModule { }
