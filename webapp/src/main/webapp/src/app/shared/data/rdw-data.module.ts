import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DATA_CONTEXT_URL, DataService } from './data.service';
import { CachingDataService } from './caching-data.service';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, FormsModule, HttpModule]
})
export class RdwDataModule {
  /**
   * Call this to customize the data service providers.
   *
   * To customize the data context URL add the provider to your consuming module's providers:
   * { provide: DATA_CONTEXT_URL, useValue: '/myContext' }
   *
   * @returns {ModuleWithProviders}
   */
  static forRoot(): ModuleWithProviders {
    // Unable to pass options into the forRoot() function.
    // Providers that are dynamic in value are not supported by the AoT (ngc) compiler
    // We may want to consider moving to use tsc/nsc compiler instead.
    // See limitations & issues:
    // https://github.com/rangle/angular-2-aot-sandbox#func-in-providers-usevalue-top
    // https://github.com/angular/angular-cli/issues/3706
    // https://github.com/angular/angular/issues/13892

    return {
      ngModule: RdwDataModule,
      providers: [
        DataService,
        CachingDataService,
        { provide: DATA_CONTEXT_URL, useValue: '/api' }
      ]
    };
  }
}
