import { AlertModel, DataTableComponent, DataTableColumn, DataTableAction } from '@/app/components';
import { AllDataTvSeries, TvSeriesModel } from '@/app/models';
import { SharedComponentsModule } from '@/app/modules/sharedcomps.module';
import { myFunctionsService, TVSeriesDataService, AnimesDataService, BooksDataService, MoviesDataService, GamesDataService } from '@/app/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, DOCUMENT, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-admdata',
  imports: [CommonModule, SharedComponentsModule, DataTableComponent, FormsModule],
  providers: [TVSeriesDataService, myFunctionsService],
  templateUrl: './admdata.html',
  styleUrl: './admdata.scss',
})
export class Admdata {
  @Input() hideSidebar: boolean = false;

  // Data
  tvSeriesData$: Observable<any[]> = new Observable<any[]>();
  tvSeriesData: any[] = [];

  // Tables
  tables: { key: string; label: string }[] = [
    { key: 'tvseries', label: 'TV Series' },
    { key: 'animes', label: 'Animes' },
    { key: 'movies', label: 'Movies' },
    { key: 'books', label: 'Books' },
    { key: 'games', label: 'Games' },
  ];

  selectedTableKey: string = 'tvseries';

  // Table configuration
  columns: DataTableColumn[] = [
    { key: 'tvserieId', label: 'ID', sortable: true },
    { key: 'image', label: 'Image', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'studio', label: 'Studio', sortable: true },
    { key: 'releaseDate', label: 'Release', sortable: true, formatter: (value) => new Date(value).toLocaleDateString() },
    {
      key: 'genre',
      label: 'Genre',
      sortable: true,
      formatter: (value) => this.formatGenreOrFormat(value),
    },
    {
      key: 'format',
      label: 'Format',
      sortable: true,
      formatter: (value) => this.formatGenreOrFormat(value),
    },
    { key: 'scoreRating', label: 'Rating', sortable: true },
    { key: 'numSeasons', label: 'Seasons', sortable: true },
    { key: 'numEpisodes', label: 'Episodes', sortable: true },
  ];

  actions: DataTableAction[] = [
    {
      label: 'Edit',
      icon: 'bi bi-pen-fill',
      title: 'Edit',
      action: (row: TvSeriesModel) => this.onEdit(row),
      class: 'btn-outline-primary',
    },
    {
      label: 'Delete',
      icon: 'bi bi-trash2-fill',
      title: 'Delete',
      action: (row: TvSeriesModel) => this.onDelete(row),
      class: 'btn-outline-danger',
    },
  ];

  searchableFields = ['tvserieId', 'title', 'image', 'studio', 'genre', 'format', 'scoreRating', 'numSeasons', 'numEpisodes'];

  // UI state
  isLoading: boolean = true;
  dataAlert: AlertModel = {} as AlertModel;
  deleteconfirmActive: boolean = false;
  selectedRowForDelete: any | null = null;
  currentIdKey: string = 'tvserieId';
  isLoggedIn: boolean = false;

  // Query console state
  isQueryConsoleSQLEnabled: boolean = false;
  isQueryConsoleSQLHidden: boolean = false;
  querySql: string = '';
  queryLoading: boolean = false;
  queryResults: any[] = [];
  queryResultHeaders: string[] = [];
  queryError: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private tvSeriesDataService: TVSeriesDataService,
    private animesDataService: AnimesDataService,
    private moviesDataService: MoviesDataService,
    private booksDataService: BooksDataService,
    private gamesDataService: GamesDataService,
    private myfunctions: myFunctionsService,
    private router: Router,
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.isLoggedIn = localStorage && localStorage.getItem('login') ? true : false;
  }

  ngOnInit(): void {
    this.setupColumnsFor(this.selectedTableKey);
    this.loadData();
    this.setupDataAlert();
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning('No data has been found');
  }

  loadData() {
    this.isLoading = true;

    let obs: Observable<any>;

    switch (this.selectedTableKey) {
      case 'animes':
        obs = this.animesDataService.getAnimes();
        break;
      case 'movies':
        obs = this.moviesDataService.getMovies();
        break;
      case 'books':
        obs = this.booksDataService.getBooks();
        break;
      case 'games':
        obs = this.gamesDataService.getGames();
        break;
      case 'tvseries':
      default:
        obs = this.tvSeriesDataService.getTvSeries();
        break;
    }

    this.tvSeriesData$ = obs.pipe(
      map((data: any) => {
        this.tvSeriesData = data?.data ?? [];
        this.isLoading = false;
        return this.tvSeriesData;
      }),
      startWith([] as any[]),
    );

    this.tvSeriesData$.subscribe((data) => {
      this.tvSeriesData = data;
    });
  }

  toggleQueryConsole() {
    this.isQueryConsoleSQLHidden = !this.isQueryConsoleSQLHidden;
  }

  selectTable(key: string) {
    if (!key || key === this.selectedTableKey) return;
    this.selectedTableKey = key;
    this.setupColumnsFor(key);
    this.loadData();
  }

  setupColumnsFor(key: string) {
    const idKey = key === 'tvseries' ? 'tvserieId' : key === 'animes' ? 'animeId' : key === 'movies' ? 'movieId' : key === 'books' ? 'bookId' : key === 'games' ? 'gameId' : 'id';
    this.currentIdKey = idKey;

    this.columns = [
      { key: idKey, label: 'ID', sortable: true },
      { key: 'image', label: 'Image', sortable: true },
      { key: 'title', label: 'Title', sortable: true },
      { key: 'studio', label: 'Studio', sortable: true },
      { key: 'releaseDate', label: 'Release', sortable: true, formatter: (value) => new Date(value).toLocaleDateString() },
      {
        key: 'genre',
        label: 'Genre',
        sortable: true,
        formatter: (value) => this.formatGenreOrFormat(value),
      },
      {
        key: 'format',
        label: 'Format',
        sortable: true,
        formatter: (value) => this.formatGenreOrFormat(value),
      },
      { key: 'scoreRating', label: 'Rating', sortable: true },
    ];

    this.searchableFields = [idKey, 'title', 'image', 'studio', 'genre', 'format', 'scoreRating'];

    this.actions = [
      {
        label: 'Edit',
        icon: 'bi bi-pen-fill',
        title: 'Edit',
        action: (row: any) => this.onEdit(row),
        class: 'btn-outline-primary',
      },
      {
        label: 'Delete',
        icon: 'bi bi-trash2-fill',
        title: 'Delete',
        action: (row: any) => this.onDelete(row),
        class: 'btn-outline-danger',
      },
    ];
  }

  get selectedTableLabel(): string {
    const t = this.tables.find((x) => x.key === this.selectedTableKey);
    return t ? `${t.label} Database` : 'Data';
  }

  onEdit(row: any) {
    const id = row?.[this.currentIdKey];
    if (!row || !id) return;
    this.router.navigate(['/data', this.selectedTableKey, 'crud', 'update', id]);
  }

  onDelete(row: any) {
    const id = row?.[this.currentIdKey];
    if (!row || !id) return;
    this.selectedRowForDelete = row;
    this.deleteconfirmActive = true;
  }

  confirmDelete() {
    const id = this.selectedRowForDelete?.[this.currentIdKey];
    if (!this.selectedRowForDelete || !id) {
      this.cancelDelete();
      return;
    }
    this.router.navigate(['/data', this.selectedTableKey, 'crud', 'delete', id]);
  }

  cancelDelete() {
    this.deleteconfirmActive = false;
    this.selectedRowForDelete = null;
  }

  formatGenreOrFormat(value: any): string {
    if (!value) return '-';
    if (Array.isArray(value) && value.length > 0) {
      return value.join(', ');
    }
    return value?.toString() || '-';
  }

  ngOnDestroy(): void {
    try {
      this.tvSeriesDataService.destroy();
    } catch (e) {}
  }

  runQuery() {
    this.queryError = '';
    this.queryResults = [];
    this.queryResultHeaders = [];

    const sql = (this.querySql || '').trim();
    if (!sql) {
      this.queryError = 'Please enter a SQL query.';
      return;
    }

    // Ensure user is logged in
    if (!this.isLoggedIn) {
      this.queryError = 'Unauthorized. Please log in as admin to run queries.';
      return;
    }

    const svc: any = this.tvSeriesDataService as any;
    const fn = svc && (svc.executeQuery || svc.executeAdminQuery || svc.query);
    if (!fn) {
      this.queryError = 'Query endpoint not available on the client service. Add an executeQuery backend method.';
      return;
    }

    this.queryLoading = true;

    try {
      const result = fn.call(svc, { sql, table: this.selectedTableKey });

      // Handle Observable
      if (result && typeof result.subscribe === 'function') {
        result.subscribe(
          (resp: any) => {
            const data = resp?.data ?? resp?.rows ?? resp ?? [];
            if (Array.isArray(data)) {
              this.queryResults = data;
              this.queryResultHeaders = data.length > 0 ? Object.keys(data[0]) : [];
            } else {
              this.queryError = 'Unexpected query response format.';
            }
            this.queryLoading = false;
          },
          (err: any) => {
            this.queryError = err?.message || 'Query failed';
            this.queryLoading = false;
          },
        );
      } else if (result && typeof result.then === 'function') {
        // Promise
        result
          .then((resp: any) => {
            const data = resp?.data ?? resp?.rows ?? resp ?? [];
            if (Array.isArray(data)) {
              this.queryResults = data;
              this.queryResultHeaders = data.length > 0 ? Object.keys(data[0]) : [];
            } else {
              this.queryError = 'Unexpected query response format.';
            }
            this.queryLoading = false;
          })
          .catch((err: any) => {
            this.queryError = err?.message || 'Query failed';
            this.queryLoading = false;
          });
      } else {
        this.queryError = 'Query did not return an observable or promise.';
        this.queryLoading = false;
      }
    } catch (e: any) {
      this.queryError = e?.message || 'Query execution error.';
      this.queryLoading = false;
    }
  }

  clearQuery() {
    this.querySql = '';
    this.queryError = '';
    this.queryResults = [];
    this.queryResultHeaders = [];
  }
}

