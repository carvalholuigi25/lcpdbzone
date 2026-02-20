/**
 * EXAMPLE: How to Integrate Notifications with Data Services
 * 
 * This is a reference example showing how to enhance the existing data services
 * with the new notification system using RxJS operators.
 * 
 * You can apply this pattern to any data service in the application.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from './toast.service';

// Example interface
interface DataItem {
  id: number;
  title: string;
  description?: string;
}

/**
 * EXAMPLE SERVICE WITH NOTIFICATION INTEGRATION
 */
@Injectable({ providedIn: 'root' })
export class ExampleDataServiceWithNotifications {
  private apiURL = 'http://localhost:5001/api/example';

  constructor(
    private http: HttpClient,
    private toastService: ToastService // Inject ToastService
  ) {}

  /**
   * Example: Get all items with error handling
   */
  getItems(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(this.apiURL).pipe(
      tap(() => console.log('Data loaded successfully')),
      catchError(error => {
        this.toastService.error(
          'Failed to load items. Please try again.',
          'Loading Error'
        );
        console.error('Error loading items:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Example: Create item with success/error notifications
   */
  createItem(data: DataItem): Observable<DataItem> {
    return this.http.post<DataItem>(this.apiURL, data).pipe(
      tap((result) => {
        this.toastService.success(
          `Item "${result.title}" created successfully!`,
          'Success',
          3000
        );
      }),
      catchError((error) => {
        this.toastService.error(
          `Failed to create item: ${error.message || 'Unknown error'}`,
          'Creation Error',
          5000
        );
        console.error('Error creating item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Example: Update item with notifications
   */
  updateItem(id: number, data: DataItem): Observable<DataItem> {
    return this.http.put<DataItem>(`${this.apiURL}/${id}`, data).pipe(
      tap((result) => {
        this.toastService.success(
          `Item "${result.title}" updated successfully!`,
          'Updated',
          3000
        );
      }),
      catchError((error) => {
        this.toastService.error(
          `Failed to update item: ${error.message || 'Unknown error'}`,
          'Update Error',
          5000
        );
        console.error('Error updating item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Example: Delete item with confirmatory notification
   */
  deleteItem(id: number, title: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(
      tap(() => {
        this.toastService.success(
          `Item "${title}" deleted successfully!`,
          'Deleted',
          3000
        );
      }),
      catchError((error) => {
        this.toastService.error(
          `Failed to delete item: ${error.message || 'Unknown error'}`,
          'Deletion Error',
          5000
        );
        console.error('Error deleting item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Example: Long-running operation with start/end notifications
   */
  importData(file: File): Observable<any> {
    this.toastService.info('Starting import process...', 'Importing', 10000);

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiURL}/import`, formData).pipe(
      tap((result: any) => {
        this.toastService.success(
          `Successfully imported ${result.count || 0} items`,
          'Import Complete',
          3000
        );
      }),
      catchError((error) => {
        this.toastService.error(
          `Import failed: ${error.message || 'Unknown error'}`,
          'Import Error',
          5000
        );
        return throwError(() => error);
      }),
      finalize(() => {
        console.log('Import process finished');
      })
    );
  }

  /**
   * Example: Batch operation with progress notifications
   */
  batchUpdate(items: DataItem[]): Observable<any> {
    this.toastService.warning(
      `Updating ${items.length} items...`,
      'Processing',
      10000
    );

    return this.http.post<any>(`${this.apiURL}/batch-update`, { items }).pipe(
      tap((result: any) => {
        this.toastService.success(
          `Successfully updated ${result.updated || 0} out of ${result.total || 0} items`,
          'Batch Update Complete',
          3000
        );
      }),
      catchError((error) => {
        this.toastService.error(
          `Batch update failed: ${error.message || 'Unknown error'}`,
          'Batch Error',
          5000
        );
        return throwError(() => error);
      })
    );
  }
}

/**
 * HOW TO USE IN YOUR COMPONENTS
 */
/*

import { Component, OnInit } from '@angular/core';
import { ExampleDataServiceWithNotifications } from '@services/example.service';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="loadItems()">Load Items</button>
    <button (click)="createNewItem()">Create Item</button>
    <button (click)="updateItem()">Update Item</button>
    <button (click)="deleteItem()">Delete Item</button>
  `
})
export class ExampleComponent implements OnInit {
  items: any[] = [];

  constructor(private dataService: ExampleDataServiceWithNotifications) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        // User already sees a success notification from the service
      },
      error: (error) => {
        // User already sees an error notification from the service
        // But you can handle the error locally too if needed
      }
    });
  }

  createNewItem() {
    const newItem = { id: 0, title: 'New Item', description: 'Description' };
    
    this.dataService.createItem(newItem).subscribe({
      next: (createdItem) => {
        this.items.push(createdItem);
        // Notification already shown by service
      },
      error: () => {
        // Error notification already shown by service
      }
    });
  }

  updateItem() {
    const itemToUpdate = this.items[0];
    itemToUpdate.title = 'Updated Title';
    
    this.dataService.updateItem(itemToUpdate.id, itemToUpdate).subscribe({
      next: (updated) => {
        // Notification already shown by service
      }
    });
  }

  deleteItem() {
    const itemToDelete = this.items[0];
    
    this.dataService.deleteItem(itemToDelete.id, itemToDelete.title).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== itemToDelete.id);
        // Notification already shown by service
      }
    });
  }
}

*/

/**
 * RxJS OPERATORS REFERENCE
 * 
 * tap(): Execute side effects (like showing notifications)
 * catchError(): Handle errors
 * finalize(): Execute cleanup code
 * map(): Transform data
 * filter(): Filter data
 * switchMap(): Switch to a new observable
 * 
 * Example chain:
 * this.http.post(...).pipe(
 *   tap(data => console.log('Success:', data)),        // Handle success
 *   catchError(error => {                              // Handle error
 *     this.toastService.error(...);
 *     return throwError(() => error);
 *   }),
 *   finalize(() => this.loading = false)               // Cleanup
 * )
 */
