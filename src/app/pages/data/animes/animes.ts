import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, startWith } from 'rxjs';
import { AnimesDataService } from '@services/data/animesdata.service';
import { AllDataAnimes, AnimesModel } from '@/app/models';
import { AlertModel } from '@/app/components';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-animes',
  imports: [SharedComponentsModule],
  providers: [AnimesDataService, myFunctionsService],
  templateUrl: './animes.html',
  styleUrl: './animes.scss',
})

export class Animes implements OnInit {
  // Observable streams - initialized lazily
  readonly animesData$!: Observable<AnimesModel[]>;
  readonly isLoading$!: Observable<boolean>;
  readonly allAnimes$!: Observable<AnimesModel[]>;
  readonly totalItems$!: Observable<number>;
  readonly paginatedAnimes$!: Observable<AnimesModel[]>;
  readonly currentPage$Obs!: Observable<number>;

  private readonly currentPage$ = new BehaviorSubject<number>(1);
  readonly itemsPerPage = 12;

  dataAlert: AlertModel = {} as AlertModel;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private animesDataService: AnimesDataService,
    private myfunctions: myFunctionsService
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem("login") ? true : false;

    // Initialize observables
    const animesData$ = this.animesDataService.getAnimes().pipe(
      map((data: AllDataAnimes) => data.data),
      shareReplay(1)
    );

    this.allAnimes$ = animesData$.pipe(startWith([]));
    this.totalItems$ = animesData$.pipe(
      map(data => data.length),
      startWith(0)
    );
    this.isLoading$ = animesData$.pipe(
      map(() => false),
      startWith(true)
    );
    this.paginatedAnimes$ = combineLatest([
      this.allAnimes$,
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
