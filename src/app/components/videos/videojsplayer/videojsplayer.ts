import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-videojsplayer',
  imports: [],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './videojsplayer.html',
  styleUrl: './videojsplayer.scss',
})
export class Videojsplayer implements OnInit, OnDestroy {
  private player: any;

  @ViewChild("target", { static: true }) target!: ElementRef;
  @Input() src!: string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() poster?: string;
  @Input() fluid: boolean = false;

  ngOnInit() {
    // Initialize the Video.js player
    this.player = videojs(this.target.nativeElement, {
      sources: [{ src: this.src }],
      width: this.width,
      height: this.height,
      poster: this.poster,
      fluid: this.fluid,
    });
  }

  ngOnDestroy() {
    // Clean up the Video.js player to avoid  memory leaks
    if (this.player) {
      this.player.dispose();
    }
  }
}
