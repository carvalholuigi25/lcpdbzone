import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  @Input() modalId: string = "mymodal";
  @Input() modalTitle!: string;
  @Input() modalContent!: string;

  constructor() {}
}
