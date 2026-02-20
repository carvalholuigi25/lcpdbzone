import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MoviesModel, AuthResponse } from '@/app/models';
import { AuthService } from '@/app/services/auth.service';
import { MoviesDataService } from '@/app/services';
import { DatepickerComponent } from '@/app/components';

@Component({
  selector: 'app-create-movies',
  imports: [AdminRoutesModule, ReactiveFormsModule, DatepickerComponent],
  providers: [MoviesDataService],
  templateUrl: './create-movies.html',
  styleUrl: './create-movies.scss',
})
export class CreateMovies {
  formCreateMovies = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    studio: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    artwork: new FormControl('', [Validators.required]),
    isFeatured: new FormControl('', []),
    releaseDate: new FormControl(null, []),
    genre: new FormControl([''], []),
    format: new FormControl([''], []),
    scoreRating: new FormControl(0, []),
  });

  isLoggedIn: boolean = false;
  userDetails?: AuthResponse;

  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService, private moviesDataService: MoviesDataService) {
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

  }

  onSubmit() {
    let promptcre = confirm(`Do you want to create this data?`);

    if(promptcre !== null && promptcre == true) {
      try {
        const {title, description, studio, image, artwork, isFeatured, releaseDate, scoreRating, genre, format} = this.formCreateMovies.value;
        const objdata: MoviesModel = {
          movieId: 0,
          title: ""+title,
          description: ""+description,
          studio: ""+studio,
          image: ""+image,
          artwork: ""+artwork,
          isFeatured: Boolean(isFeatured),
          releaseDate: new Date(""+releaseDate).toISOString(),
          scoreRating: parseInt(""+scoreRating),
          genre: genre?.toString().split(","),
          format: format?.toString().split(","),
        };

        console.log(objdata)
        this.moviesDataService.createMovies(objdata).subscribe((r) => {
          alert(`Created info for movies ${r.title}!`);

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
}
