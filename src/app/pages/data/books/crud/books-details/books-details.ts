import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksDataService } from '@/app/services';
import { SafePipe } from '@pipes/safe.pipe';
import { map, Observable } from 'rxjs';
import { BooksModel } from '@models/books';

@Component({
  selector: 'app-books-details',
  imports: [CommonModule, RouterModule, SafePipe],
  providers: [BooksDataService],
  templateUrl: './books-details.html',
  styleUrl: './books-details.scss',
})
export class BooksDetails {
  id: number = 0;
  isLoading: boolean = true;
  loadedVideo: boolean = false;
  booksdata$: Observable<BooksModel> = new Observable<BooksModel>();

  constructor(private route: ActivatedRoute, private booksDataService: BooksDataService) { }

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
      this.booksdata$ = this.booksDataService.getBooks(mid).pipe(
        map((data: any) => data as BooksModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Books data:', error);
      this.isLoading = false;
    }
  }

  toggleLoadVideo(): void {
    this.loadedVideo = !this.loadedVideo;
  }
  
  ngOnDestroy(): void {
    if (this.booksdata$) {
      this.booksdata$ = new Observable<BooksModel>();
    }

    this.isLoading = true;
    this.booksDataService.destroy();
  }
}
