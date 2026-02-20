import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Alert, Loading, Modal, Pagination } from '@/app/components';
import { LazyLoadImageDirective } from '@/app/directives';
import { SafePipe, SafeHtmlPipe } from '@/app/pipes';

const myComps = [CommonModule, RouterModule, Alert, Loading, Modal, Pagination, SafePipe, SafeHtmlPipe, LazyLoadImageDirective];

@NgModule({
  declarations: [],
  imports: myComps,
  exports: myComps,
})
export class SharedComponentsModule {}
