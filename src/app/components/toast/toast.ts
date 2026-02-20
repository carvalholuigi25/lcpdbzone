import { ToastService } from '@/app/services/toast.service';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast implements OnInit {
  constructor(public toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.markForCheck();
  }
}
