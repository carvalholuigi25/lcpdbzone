import { Component, DOCUMENT, Inject } from '@angular/core';
import { AdminRoutesModule } from "@/app/modules/routes/auth/adminroutes.module";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AllDataTvSeries, AuthResponse, TvSeriesModel } from '@/app/models';
import { AuthService } from '@/app/services/auth.service';
import { myFunctionsService, TVSeriesDataService } from '@/app/services';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Alert, AlertModel, Loading } from '@/app/components';
import { CommonModule } from '@angular/common';
import { PrettyJsonPipe } from '@/app/pipes/prettyjson.pipe';

@Component({
  selector: 'app-delete-tvseries',
  imports: [CommonModule, AdminRoutesModule, ReactiveFormsModule, Loading, Alert, PrettyJsonPipe],
  providers: [TVSeriesDataService, myFunctionsService],
  templateUrl: './delete-tvseries.html',
  styleUrl: './delete-tvseries.scss',
})
export class DeleteTvseries {
  id: number = 1;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  userDetails?: AuthResponse;
  dataAlert: AlertModel = {} as AlertModel;
  tvseriesdata$: Observable<TvSeriesModel> = new Observable<TvSeriesModel>();

  formDeleteTVSeries = new FormGroup({
    tvserieId: new FormControl(this.id, [Validators.required]),
  });

  constructor(@Inject(DOCUMENT) private document: Document, private route: ActivatedRoute, private myfunctions: myFunctionsService, private tVSeriesDataService: TVSeriesDataService) {
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
      this.formDeleteTVSeries.controls["tvserieId"].setValue(this.id);
      this.loadData(this.id);
    });
  }

  loadData(mid: number): void {  
    try {
      this.tvseriesdata$ = this.tVSeriesDataService.getTvSeries(mid).pipe(
        map((data: any) => data as TvSeriesModel)
      );
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching TV series data:', error);
      this.isLoading = false;
    }
  }

  setupDataAlert() {
    this.dataAlert = this.myfunctions.getAlertWarning("No data has been found!");
  }

  onReset() {
    this.formDeleteTVSeries.reset({
      tvserieId: this.id
    });
  }

  onSubmit() {
    let promptdel = confirm(`Do you want to delete this data (id: ${this.id})?`);

    if(promptdel !== null && promptdel == true) {
      try {
        this.tVSeriesDataService.delTVSeries(this.id).subscribe((r) => {
          alert(`Deleted info for tv series (id: ${this.id})!`);

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
    if (this.tvseriesdata$) {
      this.tvseriesdata$ = new Observable<TvSeriesModel>();
    }

    this.isLoading = true;
    this.tVSeriesDataService.destroy();
  }
}
