import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthResponse } from '@/app/models';
import { TVSeriesDataService } from '@/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadImageDirective } from '@/app/directives';
import { DatepickerComponent } from '@/app/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-tvseries',
  imports: [CommonModule, AdminRoutesModule, ReactiveFormsModule, DatepickerComponent],
  providers: [TVSeriesDataService, LazyLoadImageDirective],
  templateUrl: './update-tvseries.html',
  styleUrl: './update-tvseries.scss',
})
export class UpdateTvseries {
  tvserieId: number = 1;

  formUpdateTVSeries = new FormGroup({
    tvserieId: new FormControl(this.tvserieId, []),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    studio: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    artwork: new FormControl('', [Validators.required]),
    isFeatured: new FormControl(false, []),
    releaseDate: new FormControl(null, []),
    genre: new FormControl([''], []),
    format: new FormControl([''], []),
    scoreRating: new FormControl(0, []),
    numSeasons: new FormControl(0, []),
    numEpisodes: new FormControl(0, [])
  });

  isLoggedIn: boolean = false;
  isImagePreviewed: boolean = false;
  isArtworkPreviewed: boolean = false;
  userDetails?: AuthResponse;

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private router: Router, private tVSeriesDataService: TVSeriesDataService) {
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
    this.route.paramMap.subscribe(params => {
      this.tvserieId = parseInt(params.get('id')!) || 1;
      this.loadNewData(this.tvserieId);
    });
  }

  loadNewData(tvserieId: number = 1) {
    this.tVSeriesDataService.getTvSeries(tvserieId).subscribe((r) => {
      if(r) {
        const datares: any = r;
        this.formUpdateTVSeries.setValue({
          tvserieId: tvserieId,
          title: datares.title,
          description: ""+datares.description,
          studio: ""+datares.studio,
          image: ""+datares.image,
          artwork: ""+datares.artwork,
          isFeatured: Boolean(datares.isFeatured),
          // keep releaseDate as the stored ISO/string so datepicker can normalize it
          releaseDate: datares.releaseDate ? datares.releaseDate : null,
          genre: datares.genre?.toString().split(","),
          format: datares.format?.toString().split(","),
          scoreRating: parseInt(datares.scoreRating!.toString()),
          numSeasons: parseInt(datares.numSeasons!.toString()),
          numEpisodes: parseInt(datares.numEpisodes!.toString())
        })
      }
    });
  }

  onReset() {
    this.formUpdateTVSeries.clearAsyncValidators();
    this.formUpdateTVSeries.reset();
    this.loadNewData(this.tvserieId);
  }

  onSubmit() {
    let promptupd = confirm(`Do you want to update this data (id: ${this.tvserieId})?`);

    if(promptupd !== null && promptupd == true) {
      try {
        const {title, description, studio, image, artwork, isFeatured, releaseDate, scoreRating, genre, format, numSeasons, numEpisodes} = this.formUpdateTVSeries.value;
        const obj = {
          tvserieId: this.tvserieId,
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
        };

        this.tVSeriesDataService.updateTVSeries(this.tvserieId, obj).subscribe((r) => {
          alert(`Updated info for tv series ${this.tvserieId}!`);

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

  onTogglePreviewArtwork() {
    this.isArtworkPreviewed = !this.isArtworkPreviewed;
  }

  onTogglePreviewImage() {
    this.isImagePreviewed = !this.isImagePreviewed;
  }
}
