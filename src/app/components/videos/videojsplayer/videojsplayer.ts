import videojs from 'video.js';
import 'videojs-youtube';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

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
  @Input() poster?: string = "assets/videos/posters/default.png";
  @Input() fluid: boolean = false;
  @Input() autoplay: boolean = false;
  @Input() controls: boolean = true;
  @Input() type?: string;

  objopts: any = this.getVideoDefOptions();

  ngOnInit() {
    this.initVideoPlayer();
  }

  ngOnDestroy() {
    // Clean up the Video.js player to avoid memory leaks
    if (this.player) {
      this.player.dispose();
    }
  }

  getVideoDefOptions() {
    return {
      techOrder: this.isYoutube() ? ['youtube', 'html5'] : ['html5'],
      sources: [{ src: this.src, type: this.getVideoType() }],
      width: this.width,
      height: this.height,
      poster: this.poster,
      fluid: this.fluid,
      autoplay: this.autoplay ?? false,
      controls: this.controls ?? true,
      youtube: this.isYoutube() ? { iv_load_policy: 1 } : {}
    };
  }

  private initVideoPlayer() {
    const options = {
      techOrder: this.isYoutube() ? ['youtube', 'html5'] : ['html5'],
      sources: [{ src: this.src, type: this.getVideoType() }],
      width: this.width,
      height: this.height,
      poster: this.poster,
      fluid: this.fluid,
      autoplay: this.autoplay ?? false,
      controls: this.controls ?? true,
      youtube: this.isYoutube() ? { iv_load_policy: 1 } : {}
    };

    this.objopts = JSON.stringify(options);

    this.player = videojs(this.target.nativeElement, JSON.parse(this.objopts), () => {
      console.log("The player is now ready");
    });

    // if(this.player) {
    //   this.player.src({
    //     type: "video/youtube",
    //     src: "https://www.youtube.com/watch?v=Hb17uaaldwM"
    //   });
    // }
  }

  private isYoutube(): boolean {
    return this.src?.includes('youtube.com') ?? false;
  }

  private getVideoType(): string {
    if (!this.src) return 'video/mp4';
    if (this.isYoutube()) return 'video/youtube';
    if (this.src.endsWith('.webm')) return 'video/webm';
    return 'video/mp4';
  }
}
