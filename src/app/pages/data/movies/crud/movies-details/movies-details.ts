import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesDataService } from '@/app/services';
import { SafePipe } from '@pipes/safe.pipe';
import { map, Observable } from 'rxjs';
import { MoviesModel } from '@models/movies';

@Component({
  selector: 'app-movies-details',
  imports: [CommonModule, RouterModule, SafePipe],
  providers: [MoviesDataService],
  templateUrl: './movies-details.html',
  styleUrl: './movies-details.scss',
})
export class MoviesDetails {
  id: number = 0;
  isLoading: boolean = true;
  loadedVideo: boolean = false;
  moviesdata$: Observable<MoviesModel> = new Observable<MoviesModel>();

  constructor(private route: ActivatedRoute, private moviesDataService: MoviesDataService) { }

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
      this.moviesdata$ = this.moviesDataService.getMovies(mid).pipe(
        map((data: any) => data as MoviesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Movies data:', error);
      this.isLoading = false;
    }
  }

  toggleLoadVideo(): void {
    this.loadedVideo = !this.loadedVideo;
  }
  
  ngOnDestroy(): void {
    if (this.moviesdata$) {
      this.moviesdata$ = new Observable<MoviesModel>();
    }

    this.isLoading = true;
    this.moviesDataService.destroy();
  }
}
