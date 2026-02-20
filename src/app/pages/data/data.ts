import { Component } from '@angular/core';
import { AuthModule } from "../../modules";
import { dataAryPages } from '@/app/models/dataarypages';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-data',
  imports: [AuthModule],
  providers: [myFunctionsService],
  templateUrl: './data.html',
  styleUrl: './data.scss',
})
export class Data {
  aryPages: dataAryPages[] = [];

  constructor(private myfuncsSrv: myFunctionsService) {}

  ngOnInit() {
    this.aryPages = this.myfuncsSrv.getOrderedPagesLinks();
  }
}
