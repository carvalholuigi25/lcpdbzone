import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, startWith } from 'rxjs';
import { BooksDataService } from '@services/data/booksdata.service';
import { AllDataBooks, BooksModel } from '@/app/models';
import { AlertModel } from '@/app/components';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-books',
  imports: [SharedComponentsModule],
  providers: [BooksDataService, myFunctionsService],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})

export class Books implements OnInit {
  // Observable streams - initialized lazily
  readonly booksData$!: Observable<BooksModel[]>;
  readonly isLoading$!: Observable<boolean>;
  readonly allBooks$!: Observable<BooksModel[]>;
  readonly totalItems$!: Observable<number>;
  readonly paginatedBooks$!: Observable<BooksModel[]>;
  readonly currentPage$Obs!: Observable<number>;

  private readonly currentPage$ = new BehaviorSubject<number>(1);
  readonly itemsPerPage = 12;

  dataAlert: AlertModel = {} as AlertModel;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private booksDataService: BooksDataService,
    private myfunctions: myFunctionsService
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem("login") ? true : false;

    // Initialize observables
    const booksData$ = this.booksDataService.getBooks().pipe(
      map((data: AllDataBooks) => data.data),
      shareReplay(1)
    );

    this.allBooks$ = booksData$.pipe(startWith([]));
    this.totalItems$ = booksData$.pipe(
      map(data => data.length),
      startWith(0)
    );
    this.isLoading$ = booksData$.pipe(
      map(() => false),
      startWith(true)
    );
    this.paginatedBooks$ = combineLatest([
      this.allBooks$,
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
