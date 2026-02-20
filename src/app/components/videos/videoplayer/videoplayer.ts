import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoplayer',
  imports: [],
  templateUrl: './videoplayer.html',
  styleUrl: './videoplayer.scss',
})
export class Videoplayer {
@Input() src!: string;
@Input() width?: number;
@Input() height?: number;
@Input() poster?: string;
@Input() controls?: boolean;
@Input() autoplay?: boolean;
}
