import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "@/app/components/header/header";
import { Footer } from "@/app/components/footer/footer";
import { FooterSticky } from '@/app/components/footersticky/footersticky';
import { Admin } from '@pages/admin/admin';
import { Auth } from '@pages/auth/auth';
import { User } from '@pages/user/user';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Admsettings } from '@pages/admin/admsettings/admsettings';
import { Settings } from '@pages/user/settings/settings';
import { AdminComponentsModule } from '@components/admin/admincomponents-module';
import { Admdata } from '@pages/admin/admdata/admdata';

const myDependencies = [NgbModule];
const sharedComponents = [Header, Footer, FooterSticky, AdminComponentsModule];
const sharedPages = [Admin, Auth, User, Admsettings, Admdata, Settings];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    myDependencies,
    sharedComponents,
    sharedPages
  ],
  exports: [
    sharedComponents,
    sharedPages,
  ]
})
export class SharedModule { }
