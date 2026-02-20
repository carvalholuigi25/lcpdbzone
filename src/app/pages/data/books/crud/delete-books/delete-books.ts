import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthResponse, BooksModel } from '@/app/models';
import { myFunctionsService, BooksDataService } from '@/app/services';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Alert, AlertModel, Loading } from '@/app/components';
import { CommonModule } from '@angular/common';
import { PrettyJsonPipe } from '@/app/pipes/prettyjson.pipe';

@Component({
  selector: 'app-delete-books',
  imports: [CommonModule, AdminRoutesModule, ReactiveFormsModule, Loading, Alert, PrettyJsonPipe],
  providers: [BooksDataService, myFunctionsService],
  templateUrl: './delete-books.html',
  styleUrl: './delete-books.scss',
})
export class DeleteBooks {
  id: number = 1;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  userDetails?: AuthResponse;
  dataAlert: AlertModel = {} as AlertModel;
  booksdata$: Observable<BooksModel> = new Observable<BooksModel>();

  formDeleteBooks = new FormGroup({
    bookId: new FormControl(this.id, [Validators.required]),
  });

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private myfunctions: myFunctionsService, private booksDataService: BooksDataService) {
    const localStorage = this.document.defaultView?.localStorage;

    if(localStorage && localStorage.getItem("login")) {
      this.isLoggedIn = true;

      this.userDetails = {
        displayName: JSON.parse(localStorage.getItem("login")!).displayName,
        username: JSON.parse(localStorage.getItem("login")!).username
      }
    }
  }

  ngOnInit() {
    // this.id = parseInt(this.route.snapshot.paramMap.get("id")?.toString()!) || 1;
    this.setupDataAlert();
    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id')!) || 1;
      this.formDeleteBooks.controls["bookId"].setValue(this.id);
      this.loadData(this.id);
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

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("NO Books data has been found!");
  }

  onReset() {
    this.formDeleteBooks.reset({
      bookId: this.id
    });
  }

  onSubmit() {
    let promptdel = confirm(`Do you want to delete this data (id: ${this.id})?`);

    if(promptdel !== null && promptdel == true) {
      try {
        this.booksDataService.delBooks(this.id).subscribe((r) => {
          alert(`Deleted info for books (id: ${this.id})!`);

          setTimeout(() => {
            window.location.href = "/";
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   this.router.navigate([this.router.url]);
            // });
          }, 100 * 5);
        });
      } catch (error) {
        alert(error);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.booksdata$) {
      this.booksdata$ = new Observable<BooksModel>();
    }

    this.isLoading = true;
    this.booksDataService.destroy();
  }
}
