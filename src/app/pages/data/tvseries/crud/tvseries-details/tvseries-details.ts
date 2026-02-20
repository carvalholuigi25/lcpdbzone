import { ActivatedRoute } from '@angular/router';
import { Component, DOCUMENT, Inject } from '@angular/core';
import { catchError, finalize, map, Observable, tap } from 'rxjs';
import { TvSeriesModel } from '@/app/models';
import { TVSeriesDataService } from '@/app/services';
import { AlertModel } from '@/app/components';
import { myFunctionsService } from '@/app/services/myfunctions.service';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';

@Component({
  selector: 'app-tvseries-details',
  standalone: true,
  imports: [SharedComponentsModule],
  providers: [TVSeriesDataService, myFunctionsService],
  templateUrl: './tvseries-details.html',
  styleUrl: './tvseries-details.scss',
})
export class TvseriesDetails {
  id: number = 0;
  isLoading: boolean = true;
  loadedVideo: boolean = false;
  loadedInfoSesEps: boolean = false;
  dataAlert: AlertModel = {} as AlertModel;
  tvseriesdata$: Observable<TvSeriesModel> = new Observable<TvSeriesModel>();
  isLoggedIn: boolean = false;
    
  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private myfunctions: myFunctionsService, private tVSeriesDataService: TVSeriesDataService) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem("login") ? true : false;
  }

  ngOnInit(): void {
    this.setupDataAlert();
    this.route.paramMap.subscribe(params => {
      const dynamicId = params.get('id');
      if (dynamicId && !isNaN(+dynamicId)) {
        this.id = +dynamicId;
        this.loadData(this.id);
      }
    });
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("No data has been found!");
  }

  loadData(mid: number): void {  
    try {
      this.tvseriesdata$ = this.tVSeriesDataService.getAllTvSeries(mid).pipe(
        finalize(async () => this.isLoading = false),
        catchError(async (err) => {
          this.isLoading = false;
          console.log(err);
        }),
        map((data: any) => data as TvSeriesModel),
      );
    } catch (error) {
      console.error('Error fetching TV series data:', error);
      this.isLoading = false;
    }
  }

  toggleLoadVideo(): void {
    this.loadedVideo = !this.loadedVideo;
  }

  toggleLoadInfoSesEps(): void {
    this.loadedInfoSesEps = !this.loadedInfoSesEps;
  }

  ngOnDestroy(): void {
    if (this.tvseriesdata$) {
      this.tvseriesdata$ = new Observable<TvSeriesModel>();
    }

    this.isLoading = true;
    this.tVSeriesDataService.destroy();
  }
}
