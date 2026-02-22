import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { myFunctionsService } from '@/app/services';
import { Alert, AlertModel } from '@/app/components';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, row?: any) => string;
  cellClass?: string;
}

export interface DataTableAction {
  label: string;
  icon: string;
  title: string;
  action: (row: any) => void;
  class?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, Alert, AdminRoutesModule],
  providers: [myFunctionsService],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTableComponent implements OnInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() actions: DataTableAction[] = [];
  @Input() pageSize: number = 10;
  @Input() searchableFields: string[] = [];
  @Input() title: string = '';
  @Input() showPagination: boolean = true;
  @Input() loading: boolean = false;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<{ field: string; direction: 'asc' | 'desc' }>();
  @Output() searchChanged = new EventEmitter<string>();

  dataAlert: AlertModel = {} as AlertModel;
  
  // Observable controls
  search$ = new BehaviorSubject<string>('');
  sortField$ = new BehaviorSubject<string>('');
  sortDir$ = new BehaviorSubject<'asc' | 'desc'>('asc');
  page$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);

  // UI state
  displayedData$: Observable<any[]> = new Observable<any[]>();
  totalItems: number = 0;
  page: number = 1;
  pages: number[] = [];

  private sortClickMap = new Map<string, number>();
  private defaultSort: string = '';
  private defaultPageSize: number = 10;

  constructor(private myfunctions: myFunctionsService) {
    
  }

  ngOnInit(): void {
    this.loadData();
    this.setupDataAlert();
  }

  loadData() {
    this.pageSize$.next(this.pageSize);
    this.defaultPageSize = this.pageSize;
    if (this.columns.length > 0 && this.columns[0].sortable !== false) {
      this.defaultSort = this.columns[0].key;
      this.sortField$.next(this.defaultSort);
    }

    this.setupDataPipeline();
  }

  private setupDataPipeline(): void {
    this.displayedData$ = combineLatest([
      new BehaviorSubject(this.data).asObservable(),
      this.search$,
      this.sortField$,
      this.sortDir$,
      this.page$,
      this.pageSize$,
    ]).pipe(
      map(([items, search, sortField, sortDir, page, pageSize]) => {
        let filtered = [...items];

        // Filter
        if (search && this.searchableFields.length > 0) {
          const q = search.trim().toLowerCase();
          filtered = filtered.filter((item) => {
            return this.searchableFields.some((field) => {
              const value = this.getNestedValue(item, field);
              return (value || '').toString().toLowerCase().includes(q);
            });
          });
        }

        // Update total items after filtering
        this.totalItems = filtered.length;
        this.updatePages();

        // Sort
        if (sortField) {
          const sd = sortDir === 'desc' ? -1 : 1;
          filtered = filtered.slice().sort((a: any, b: any) => {
            const va = (this.getNestedValue(a, sortField) ?? '').toString().toLowerCase();
            const vb = (this.getNestedValue(b, sortField) ?? '').toString().toLowerCase();
            if (va < vb) return -1 * sd;
            if (va > vb) return 1 * sd;
            return 0;
          });
        }

        // Pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return filtered.slice(start, end);
      }),
    );
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  private updatePages(): void {
    const totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize$.value));
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize$.value));
  }

  get hasSortableColumns(): boolean {
    return this.columns.some((c) => c.sortable !== false);
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning('No data has been found');
  }

  onSearch(value: string): void {
    this.search$.next(value || '');
    this.page$.next(1);
    this.page = 1;
    this.searchChanged.emit(value);
  }

  setSort(field: string): void {
    const column = this.columns.find((c) => c.key === field);
    if (!column || column.sortable === false) return;

    if (this.sortField$.value === field) {
      const currentClicks = (this.sortClickMap.get(field) ?? 0) + 1;
      this.sortClickMap.set(field, currentClicks);

      if (currentClicks === 3) {
        this.sortField$.next(this.defaultSort || 'id');
        this.sortDir$.next('asc');
        this.sortClickMap.clear();
      } else if (currentClicks === 2) {
        const next = this.sortDir$.value === 'asc' ? 'desc' : 'asc';
        this.sortDir$.next(next);
      }
    } else {
      this.sortField$.next(field);
      this.sortDir$.next('asc');
      this.sortClickMap.clear();
      this.sortClickMap.set(field, 1);
    }

    this.page$.next(1);
    this.page = 1;
    this.sortChanged.emit({ field: this.sortField$.value, direction: this.sortDir$.value });
  }

  setPageSize(n: number | string): void {
    const size = Number(n) || this.defaultPageSize;
    this.pageSize$.next(size);
    this.page$.next(1);
    this.page = 1;
    this.pageSizeChanged.emit(size);
  }

  gotoPage(n: number): void {
    const page = Math.max(1, Math.min(n, this.totalPages));
    this.page$.next(page);
    this.page = page;
    this.pageChanged.emit(page);
  }

  prevPage(): void {
    this.gotoPage(this.page - 1);
  }

  nextPage(): void {
    this.gotoPage(this.page + 1);
  }

  getSortIndicator(field: string): string {
    if (this.sortField$.value !== field) return '';
    return this.sortDir$.value === 'asc' ? ' ↑' : ' ↓';
  }

  isSortActive(field: string): boolean {
    return this.sortField$.value === field;
  }

  clearFilters(): void {
    this.search$.next('');
    this.sortField$.next(this.defaultSort || 'id');
    this.sortDir$.next('asc');
    this.pageSize$.next(this.defaultPageSize);
    this.page$.next(1);
    this.page = 1;
    this.sortClickMap.clear();
  }

  formatValue(value: any, column: DataTableColumn): string {
    if (column.formatter) {
      return column.formatter(value);
    }
    if (Array.isArray(value) && value.length > 0) {
      return value.join(', ');
    }
    return value?.toString() || '-';
  }

  ngOnDestroy(): void {
    try {
      this.search$.complete();
      this.sortField$.complete();
      this.sortDir$.complete();
      this.page$.complete();
      this.pageSize$.complete();
    } catch (e) {}
  }
}
