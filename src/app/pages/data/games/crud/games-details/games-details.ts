import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesDataService } from '@/app/services';
import { SafePipe } from '@pipes/safe.pipe';
import { map, Observable } from 'rxjs';
import { GamesModel } from '@models/games';

@Component({
  selector: 'app-games-details',
  imports: [CommonModule, RouterModule, SafePipe],
  providers: [GamesDataService],
  templateUrl: './games-details.html',
  styleUrl: './games-details.scss',
})
export class GamesDetails {
  id: number = 0;
  isLoading: boolean = true;
  loadedVideo: boolean = false;
  gamesdata$: Observable<GamesModel> = new Observable<GamesModel>();

  constructor(private route: ActivatedRoute, private gamesDataService: GamesDataService) { }

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
      this.gamesdata$ = this.gamesDataService.getGames(mid).pipe(
        map((data: any) => data as GamesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Games data:', error);
      this.isLoading = false;
    }
  }

  toggleLoadVideo(): void {
    this.loadedVideo = !this.loadedVideo;
  }
  
  ngOnDestroy(): void {
    if (this.gamesdata$) {
      this.gamesdata$ = new Observable<GamesModel>();
    }

    this.isLoading = true;
    this.gamesDataService.destroy();
  }
}
