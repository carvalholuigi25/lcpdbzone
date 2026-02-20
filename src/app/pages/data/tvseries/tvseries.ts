import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, startWith } from 'rxjs';
import { TVSeriesDataService } from '@services/data/tvseriesdata.service';
import { AllDataTvSeries, TvSeriesModel } from '@/app/models';
import { AlertModel } from '@/app/components';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-tvseries',
  imports: [SharedComponentsModule],
  providers: [TVSeriesDataService, myFunctionsService],
  templateUrl: './tvseries.html',
  styleUrl: './tvseries.scss',
})

export class Tvseries implements OnInit {
  // Observable streams - initialized lazily
  readonly tvSeriesData$!: Observable<TvSeriesModel[]>;
  readonly isLoading$!: Observable<boolean>;
  readonly allTvSeries$!: Observable<TvSeriesModel[]>;
  readonly totalItems$!: Observable<number>;
  readonly paginatedTvSeries$!: Observable<TvSeriesModel[]>;
  readonly currentPage$Obs!: Observable<number>;

  private readonly currentPage$ = new BehaviorSubject<number>(1);
  readonly itemsPerPage = 12;

  dataAlert: AlertModel = {} as AlertModel;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private tvSeriesDataService: TVSeriesDataService,
    private myfunctions: myFunctionsService
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem("login") ? true : false;

    // Initialize observables
    const tvSeriesData$ = this.tvSeriesDataService.getTvSeries().pipe(
      map((data: AllDataTvSeries) => data.data),
      shareReplay(1)
    );

    this.allTvSeries$ = tvSeriesData$.pipe(startWith([]));
    this.totalItems$ = tvSeriesData$.pipe(
      map(data => data.length),
      startWith(0)
    );
    this.isLoading$ = tvSeriesData$.pipe(
      map(() => false),
      startWith(true)
    );
    this.paginatedTvSeries$ = combineLatest([
      this.allTvSeries$,
      this.currentPage$
    ]).pipe(
      map(([data, page]) => {
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return data.slice(startIndex, endIndex);
      })
    );
    this.currentPage$Obs = this.currentPage$.asObservable();
  }

  ngOnInit(): void {
    this.setupDataAlert();
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("No data has been found");
  }

  onPageChange(page: number) {
    this.currentPage$.next(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
