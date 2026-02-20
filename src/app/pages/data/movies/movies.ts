import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, startWith } from 'rxjs';
import { MoviesDataService } from '@services/data/moviesdata.service';
import { AllDataMovies, MoviesModel } from '@/app/models';
import { AlertModel } from '@/app/components';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-movies',
  imports: [SharedComponentsModule],
  providers: [MoviesDataService, myFunctionsService],
  templateUrl: './movies.html',
  styleUrl: './movies.scss',
})

export class Movies implements OnInit {
  // Observable streams - initialized lazily
  readonly moviesData$!: Observable<MoviesModel[]>;
  readonly isLoading$!: Observable<boolean>;
  readonly allMovies$!: Observable<MoviesModel[]>;
  readonly totalItems$!: Observable<number>;
  readonly paginatedMovies$!: Observable<MoviesModel[]>;
  readonly currentPage$Obs!: Observable<number>;

  private readonly currentPage$ = new BehaviorSubject<number>(1);
  readonly itemsPerPage = 12;

  dataAlert: AlertModel = {} as AlertModel;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private moviesDataService: MoviesDataService,
    private myfunctions: myFunctionsService
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem("login") ? true : false;

    // Initialize observables
    const moviesData$ = this.moviesDataService.getMovies().pipe(
      map((data: AllDataMovies) => data.data),
      shareReplay(1)
    );

    this.allMovies$ = moviesData$.pipe(startWith([]));
    this.totalItems$ = moviesData$.pipe(
      map(data => data.length),
      startWith(0)
    );
    this.isLoading$ = moviesData$.pipe(
      map(() => false),
      startWith(true)
    );
    this.paginatedMovies$ = combineLatest([
      this.allMovies$,
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
