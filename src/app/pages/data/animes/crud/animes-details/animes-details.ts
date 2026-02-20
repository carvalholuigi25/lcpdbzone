import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimesDataService } from '@/app/services';
import { SafePipe } from '@/app/pipes/safe.pipe';
import { map, Observable } from 'rxjs';
import { AnimesModel } from '@models/animes';

@Component({
  selector: 'app-animes-details',
  imports: [CommonModule, RouterModule, SafePipe],
  providers: [AnimesDataService],
  templateUrl: './animes-details.html',
  styleUrl: './animes-details.scss',
})
export class AnimesDetails {
  id: number = 0;
  isLoading: boolean = true;
  loadedVideo: boolean = false;
  animesdata$: Observable<AnimesModel> = new Observable<AnimesModel>();

  constructor(private route: ActivatedRoute, private animesDataService: AnimesDataService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const dynamicId = params.get('id');
      if (dynamicId && !isNaN(+dynamicId)) {
        this.id = +dynamicId;
        this.loadData(this.id);
      }
    });
  }

  loadData(mid: number): void {  
    try {
      this.animesdata$ = this.animesDataService.getAnimes(mid).pipe(
        map((data: any) => data as AnimesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Animes data:', error);
      this.isLoading = false;
    }
  }

  toggleLoadVideo(): void {
    this.loadedVideo = !this.loadedVideo;
  }
  
  ngOnDestroy(): void {
    if (this.animesdata$) {
      this.animesdata$ = new Observable<AnimesModel>();
    }

    this.isLoading = true;
    this.animesDataService.destroy();
  }
}
