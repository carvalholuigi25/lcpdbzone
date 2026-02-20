import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AllDataGames, AuthResponse, GamesModel } from '@/app/models';
import { AuthService } from '@/app/services/auth.service';
import { GamesDataService } from '@/app/services';
import { ActivatedRoute } from '@angular/router';
import { DatepickerComponent } from '@/app/components';

@Component({
  selector: 'app-update-games',
  imports: [AdminRoutesModule, ReactiveFormsModule, DatepickerComponent],
  providers: [GamesDataService],
  templateUrl: './update-games.html',
  styleUrl: './update-games.scss',
})
export class UpdateGames {
  gameId: number = 1;

  formUpdateGames = new FormGroup({
    gameId: new FormControl(this.gameId, []),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    studio: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    artwork: new FormControl('', []),
    isFeatured: new FormControl(false, []),
    releaseDate: new FormControl(null, []),
    genre: new FormControl([''], []),
    format: new FormControl([''], []),
    scoreRating: new FormControl(0, []),
  });

  isLoggedIn: boolean = false;
  userDetails?: AuthResponse;

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private authService: AuthService, private gamesDataService: GamesDataService) {
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
      this.gameId = parseInt(params.get('id')!) || 1;
      this.loadNewData(this.gameId);
    });
  }

  loadNewData(gameId: number = 1) {
    this.gamesDataService.getGames(gameId).subscribe((r) => {
      if(r) {
        console.log(r)
        const datares: any = r;
        this.formUpdateGames.setValue({
          gameId: gameId,
          title: datares.title,
          description: ""+datares.description,
          studio: ""+datares.studio,
          image: ""+datares.image,
          artwork: ""+datares.artwork,
          isFeatured: Boolean(datares.isFeatured),
          releaseDate: (datares.releaseDate ? new Date(datares.releaseDate.toString()) : null) as any,
          genre: datares.genre?.toString().split(","),
          format: datares.format?.toString().split(","),
          scoreRating: parseInt(datares.scoreRating!.toString()),
        })
      }
    });
  }

  onSubmit() {
    let promptupd = confirm(`Do you want to update this data (id: ${this.gameId})?`);

    if(promptupd !== null && promptupd == true) {
      try {
        const {title, description, studio, image, artwork, isFeatured, releaseDate, scoreRating, genre, format} = this.formUpdateGames.value;
        this.gamesDataService.updateGames(this.gameId, {
          gameId: this.gameId,
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
        } as GamesModel).subscribe((r) => {
          alert(`Updated info for games (id: ${this.gameId})!`);

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
