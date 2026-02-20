import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthResponse, MoviesModel } from '@/app/models';
import { myFunctionsService, MoviesDataService } from '@/app/services';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Alert, AlertModel, Loading } from '@/app/components';
import { CommonModule } from '@angular/common';
import { PrettyJsonPipe } from '@/app/pipes/prettyjson.pipe';

@Component({
  selector: 'app-delete-movies',
  imports: [CommonModule, AdminRoutesModule, ReactiveFormsModule, Loading, Alert, PrettyJsonPipe],
  providers: [MoviesDataService, myFunctionsService],
  templateUrl: './delete-movies.html',
  styleUrl: './delete-movies.scss',
})
export class DeleteMovies {
  id: number = 1;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  userDetails?: AuthResponse;
  dataAlert: AlertModel = {} as AlertModel;
  moviesdata$: Observable<MoviesModel> = new Observable<MoviesModel>();

  formDeleteMovies = new FormGroup({
    movieId: new FormControl(this.id, [Validators.required]),
  });

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private myfunctions: myFunctionsService, private moviesDataService: MoviesDataService) {
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
      this.formDeleteMovies.controls["movieId"].setValue(this.id);
      this.loadData(this.id);
    });
  }

  loadData(mid: number): void {  
    try {
      this.moviesdata$ = this.moviesDataService.getMovies(mid).pipe(
        map((data: any) => data as MoviesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Movies data:', error);
      this.isLoading = false;
    }
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("NO Movies data has been found!");
  }

  onReset() {
    this.formDeleteMovies.reset({
      movieId: this.id
    });
  }

  onSubmit() {
    let promptdel = confirm(`Do you want to delete this data (id: ${this.id})?`);

    if(promptdel !== null && promptdel == true) {
      try {
        this.moviesDataService.delMovies(this.id).subscribe((r) => {
          alert(`Deleted info for movies (id: ${this.id})!`);

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
    if (this.moviesdata$) {
      this.moviesdata$ = new Observable<MoviesModel>();
    }

    this.isLoading = true;
    this.moviesDataService.destroy();
  }
}
