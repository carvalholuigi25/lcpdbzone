import { Component } from '@angular/core';

@Component({
  selector: 'app-footersticky',
  imports: [],
  templateUrl: './footersticky.html',
  styleUrl: './footersticky.scss',
})
export class FooterSticky {
   year: number = new Date().getFullYear();
   mail: string = 'luiscarvalho239@gmail.com';
}
