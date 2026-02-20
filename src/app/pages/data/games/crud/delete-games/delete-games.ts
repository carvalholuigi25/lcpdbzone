import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthResponse, GamesModel } from '@/app/models';
import { myFunctionsService, GamesDataService } from '@/app/services';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Alert, AlertModel, Loading } from '@/app/components';
import { CommonModule } from '@angular/common';
import { PrettyJsonPipe } from '@/app/pipes/prettyjson.pipe';

@Component({
  selector: 'app-delete-games',
  imports: [CommonModule, AdminRoutesModule, ReactiveFormsModule, Loading, Alert, PrettyJsonPipe],
  providers: [GamesDataService, myFunctionsService],
  templateUrl: './delete-games.html',
  styleUrl: './delete-games.scss',
})
export class DeleteGames {
  id: number = 1;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  userDetails?: AuthResponse;
  dataAlert: AlertModel = {} as AlertModel;
  gamesdata$: Observable<GamesModel> = new Observable<GamesModel>();

  formDeleteGames = new FormGroup({
    gameId: new FormControl(this.id, [Validators.required]),
  });

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private myfunctions: myFunctionsService, private gamesDataService: GamesDataService) {
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
      this.formDeleteGames.controls["gameId"].setValue(this.id);
      this.loadData(this.id);
    });
  }

  loadData(mid: number): void {  
    try {
      this.gamesdata$ = this.gamesDataService.getGames(mid).pipe(
        map((data: any) => data as GamesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Games data:', error);
      this.isLoading = false;
    }
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("NO Games data has been found!");
  }

  onReset() {
    this.formDeleteGames.reset({
      gameId: this.id
    });
  }

  onSubmit() {
    let promptdel = confirm(`Do you want to delete this data (id: ${this.id})?`);

    if(promptdel !== null && promptdel == true) {
      try {
        this.gamesDataService.delGames(this.id).subscribe((r) => {
          alert(`Deleted info for games (id: ${this.id})!`);

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
    if (this.gamesdata$) {
      this.gamesdata$ = new Observable<GamesModel>();
    }

    this.isLoading = true;
    this.gamesDataService.destroy();
  }
}
