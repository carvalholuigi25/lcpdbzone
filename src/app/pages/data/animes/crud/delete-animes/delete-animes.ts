import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthResponse, AnimesModel } from '@/app/models';
import { myFunctionsService, AnimesDataService } from '@/app/services';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Alert, AlertModel, Loading } from '@/app/components';
import { CommonModule } from '@angular/common';
import { PrettyJsonPipe } from '@/app/pipes/prettyjson.pipe';

@Component({
  selector: 'app-delete-animes',
  imports: [CommonModule, AdminRoutesModule, ReactiveFormsModule, Loading, Alert, PrettyJsonPipe],
  providers: [AnimesDataService, myFunctionsService],
  templateUrl: './delete-animes.html',
  styleUrl: './delete-animes.scss',
})
export class DeleteAnimes {
  id: number = 1;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  userDetails?: AuthResponse;
  dataAlert: AlertModel = {} as AlertModel;
  animesdata$: Observable<AnimesModel> = new Observable<AnimesModel>();

  formDeleteAnimes = new FormGroup({
    animeId: new FormControl(this.id, [Validators.required]),
  });

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private myfunctions: myFunctionsService, private animesDataService: AnimesDataService) {
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
      this.formDeleteAnimes.controls["animeId"].setValue(this.id);
      this.loadData(this.id);
    });
  }

  loadData(mid: number): void {  
    try {
      this.animesdata$ = this.animesDataService.getAnimes(mid).pipe(
        map((data: any) => data as AnimesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching Animes data:', error);
      this.isLoading = false;
    }
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("NO Animes data has been found!");
  }

  onReset() {
    this.formDeleteAnimes.reset({
      animeId: this.id
    });
  }

  onSubmit() {
    let promptdel = confirm(`Do you want to delete this data (id: ${this.id})?`);

    if(promptdel !== null && promptdel == true) {
      try {
        this.animesDataService.delAnimes(this.id).subscribe((r) => {
          alert(`Deleted info for animes (id: ${this.id})!`);

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
    if (this.animesdata$) {
      this.animesdata$ = new Observable<AnimesModel>();
    }

    this.isLoading = true;
    this.animesDataService.destroy();
  }
}
