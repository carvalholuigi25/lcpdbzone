import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audioplayer',
  imports: [],
  standalone: true,
  templateUrl: './audioplayer.html',
  styleUrl: './audioplayer.scss',
})
export class Audioplayer implements OnDestroy {
  @ViewChild('targetaudio', { static: true }) targetaudio!: ElementRef<HTMLAudioElement>;
  @Input() src: string = '';
  @Input() autoplay: boolean = false;
  @Input() controls: boolean = true;
  @Input() type?: string;

  type_file: string = this.getAudioType();

  ngOnDestroy() {
    // Clean up audio element if needed
    if (this.targetaudio?.nativeElement) {
      this.targetaudio.nativeElement.pause();
      this.targetaudio.nativeElement.src = '';
    }
  }

  getAudioType(): string {
    if (this.type) {
      return this.type;
    }

    const lowerSrc = this.src?.toLowerCase() ?? '';
    if (lowerSrc.endsWith('.wav')) return 'audio/wav';
    if (lowerSrc.endsWith('.ogg')) return 'audio/ogg';
    if (lowerSrc.endsWith('.mp3')) return 'audio/mpeg';
    if (lowerSrc.endsWith('.mp4')) return 'audio/mp4';
    return 'audio/mpeg';
  }
}