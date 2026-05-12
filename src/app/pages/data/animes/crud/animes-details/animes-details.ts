import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimesDataService } from '@/app/services';
import { SafePipe } from '@/app/pipes/safe.pipe';
import { map, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnimesModel } from '@models/animes';

@Component({
  selector: 'app-animes-details',
  imports: [CommonModule, RouterModule, SafePipe],
  providers: [AnimesDataService],
  templateUrl: './animes-details.html',
  styleUrl: './animes-details.scss',
})
export class AnimesDetails implements OnInit, OnDestroy {
  id: number = 0;
  isLoading: boolean = true;
  loadedVideo: boolean = false;
  animesdata$: Observable<AnimesModel> = new Observable<AnimesModel>();
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private animesDataService: AnimesDataService) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const dynamicId = params.get('id');
        if (dynamicId && !isNaN(+dynamicId)) {
          this.id = +dynamicId;
          this.loadData(this.id);
        }
      });
  }

  loadData(mid: number): void {
    this.animesdata$ = this.animesDataService.getAnimes(mid).pipe(
      map((data: any) => data as AnimesModel),
      takeUntil(this.destroy$)
    );
    this.isLoading = false;
  }

  toggleLoadVideo(): void {
    this.loadedVideo = !this.loadedVideo;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.animesDataService.destroy();
  }
}
