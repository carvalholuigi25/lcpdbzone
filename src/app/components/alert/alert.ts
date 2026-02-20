import { Component, Input } from '@angular/core';

export interface AlertModel {
  alertType: string;
  icoType: string;
  message: string;
}

@Component({
  selector: 'app-alert',
  imports: [],
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  @Input() data!: AlertModel;

  // @Input() alerttype: string = "warning"; 
  // @Input() icotype: string = "bi-exclamation-octagon-fill"; 
  // @Input() message: string = "No data has been found!";

  constructor() {}
}
