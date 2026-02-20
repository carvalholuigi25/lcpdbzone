import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, startWith } from 'rxjs';
import { GamesDataService } from '@services/data/gamesdata.service';
import { AllDataGames, GamesModel } from '@/app/models';
import { AlertModel } from '@/app/components';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-games',
  imports: [SharedComponentsModule],
  providers: [GamesDataService, myFunctionsService],
  templateUrl: './games.html',
  styleUrl: './games.scss',
})

export class Games implements OnInit {
  // Observable streams - initialized lazily
  readonly gamesData$!: Observable<GamesModel[]>;
  readonly isLoading$!: Observable<boolean>;
  readonly allGames$!: Observable<GamesModel[]>;
  readonly totalItems$!: Observable<number>;
  readonly paginatedGames$!: Observable<GamesModel[]>;
  readonly currentPage$Obs!: Observable<number>;

  private readonly currentPage$ = new BehaviorSubject<number>(1);
  readonly itemsPerPage = 12;

  dataAlert: AlertModel = {} as AlertModel;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private gamesDataService: GamesDataService,
    private myfunctions: myFunctionsService
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem("login") ? true : false;

    // Initialize observables
    const gamesData$ = this.gamesDataService.getGames().pipe(
      map((data: AllDataGames) => data.data),
      shareReplay(1)
    );

    this.allGames$ = gamesData$.pipe(startWith([]));
    this.totalItems$ = gamesData$.pipe(
      map(data => data.length),
      startWith(0)
    );
    this.isLoading$ = gamesData$.pipe(
      map(() => false),
      startWith(true)
    );
    this.paginatedGames$ = combineLatest([
      this.allGames$,
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
