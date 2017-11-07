import { NgModule } from "@angular/core";
import { SubjectPipe } from "./subject.pipe";
import { Http, HttpModule } from "@angular/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Angulartics2Module } from 'angulartics2';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { RdwDataModule, RdwDataTableModule, RdwFormatModule } from "@sbac/rdw-reporting-common-ngx";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ Http ]
      }
    })
  ],
  exports: [
    SubjectPipe,
    TranslateModule,
    RdwDataTableModule,
    RdwFormatModule,
    RouterModule
  ]
})
export class CommonModule {
}
