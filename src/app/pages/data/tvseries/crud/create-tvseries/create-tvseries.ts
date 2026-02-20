import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthResponse } from '@/app/models';
import { TVSeriesDataService } from '@/app/services';
import { Router } from '@angular/router';
import { DatepickerComponent } from '@/app/components';

@Component({
  selector: 'app-create-tvseries',
  imports: [AdminRoutesModule, ReactiveFormsModule, DatepickerComponent],
  providers: [TVSeriesDataService],
  templateUrl: './create-tvseries.html',
  styleUrl: './create-tvseries.scss',
})
export class CreateTvseries {
  formCreateTVSeries = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    studio: new FormControl('', [Validators.required]),
    artwork: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    isFeatured: new FormControl(false, []),
    releaseDate: new FormControl(null, []),
    genre: new FormControl([''], []),
    format: new FormControl([''], []),
    scoreRating: new FormControl(0, []),
    numSeasons: new FormControl(0, []),
    numEpisodes: new FormControl(0, [])
  });

  isLoggedIn: boolean = false;
  userDetails?: AuthResponse;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private tVSeriesDataService: TVSeriesDataService) {
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

  onReset() {
    this.formCreateTVSeries.clearAsyncValidators();
    this.formCreateTVSeries.reset();
  }

  onSubmit() {
    let promptcre = confirm(`Do you want to create this data?`);

    if(promptcre !== null && promptcre == true) {
      try {
        const {title, description, studio, image, artwork, isFeatured, releaseDate, scoreRating, genre, format, numSeasons, numEpisodes} = this.formCreateTVSeries.value;

        this.tVSeriesDataService.createTVSeries({
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
          numSeasons: parseInt(""+numSeasons),
          numEpisodes: parseInt(""+numEpisodes)
        }).subscribe((r) => {
          alert(`Created info for tv series ${r.title}!`);

          setTimeout(() => {
            this.router.navigateByUrl('/data/tvseries', { skipLocationChange: true }).then(() => {
              this.router.navigate([this.router.url]);
            });
          }, 100 * 5);
        });
      } catch (error) {
        alert(error);
      }
    }
  }
}
