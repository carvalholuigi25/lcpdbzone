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
  @Input() poster?: string = "assets/videos/posters/default.png";
  @Input() fluid: boolean = false;
  @Input() autoplay: boolean = false;
  @Input() type?: string;

  objopts: any;
  typevideo: any;

  ngOnInit() {
    this.initVideoPlayer();
  }

  initVideoPlayer() {
    // Initialize the Video.js player
    this.objopts = this.setVideoOptions();
    console.log(this.objopts)

    this.player = videojs(this.target.nativeElement, this.objopts, () => {
      console.log("The player is now ready");
    });

    // if(this.player) {
    //   this.player.src({
    //     type: this.type ?? this.getVideoTypeSrc(this.src),
    //     src: this.src
    //   });
    // }
  }

  setVideoOptions() {
    this.typevideo = this.type ?? this.getVideoTypeSrc(this.src);

    const srclist = [{ 
      type: this.type ?? this.getVideoTypeSrc(this.src), 
      src: this.src 
    }];

    return {
      width: this.width,
      height: this.height,
      poster: this.poster,
      fluid: this.fluid,
      autoplay: this.autoplay,
      sources: srclist,
      techOrder: this.typevideo.includes("youtube") ? ["youtube", "html5"] : ["html5"],
      "youtube": this.typevideo.includes("youtube") ? { "iv_load_policy": 1 } : {}
    };
  }

  getVideoTypeSrc(src: string) {
    // all mime types: https://mimetype.io/all-types
    let regex = /http([a-z]?):\/\/youtube\.com/mig;
    return new RegExp(regex).test(src) ? "video/youtube" : src.endsWith(".webm") ? "video/webm" : "video/mp4";
  }

  ngOnDestroy() {
    // Clean up the Video.js player to avoid  memory leaks
    if (this.player) {
      this.player.dispose();
    }
  }
}
