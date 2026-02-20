import { Component, Input } from '@angular/core';
import { dataAryPages } from '@/app/models/dataarypages';
import { RouterModule } from '@angular/router';
import { myFunctionsService } from '@/app/services';

@Component({
  selector: 'app-admin',
  imports: [RouterModule],
  providers: [myFunctionsService],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  @Input() hideSidebar: boolean = false;

   aryPages: dataAryPages[] = [];

  constructor(private myfunctionsSrv: myFunctionsService) {}

  ngOnInit() {
    this.aryPages = this.myfunctionsSrv.getOrderedPagesLinks();
  }
}
