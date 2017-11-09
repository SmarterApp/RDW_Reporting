import { NgModule } from "@angular/core";
import { SubjectPipe } from "./subject.pipe";
import { HttpModule } from "@angular/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Angulartics2Module } from 'angulartics2';
import {
  AuthenticationServiceAuthenticationExpiredRoute,
  RdwDataModule,
  RdwDataTableModule,
  RdwFormatModule,
  RdwI18nModule,
  RdwSecurityModule,
  RdwTranslateLoader
} from "@sbac/rdw-reporting-common-ngx";

@NgModule({
  declarations: [
    SubjectPipe
  ],
  imports: [
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwSecurityModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: RdwTranslateLoader
      }
    })
  ],
  exports: [
    SubjectPipe,
    TranslateModule,
    RdwDataTableModule,
    RdwFormatModule,
    RdwSecurityModule,
    RouterModule
  ],
  providers: [
    { provide: AuthenticationServiceAuthenticationExpiredRoute, useValue: 'session-expired' }
  ]
})
export class CommonModule {
}
