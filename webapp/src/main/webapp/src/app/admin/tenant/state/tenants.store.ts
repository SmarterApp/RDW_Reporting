import { Injectable } from '@angular/core';
import { AbstractStore } from '../../../shared/store/abstract-store';
import { TenantConfiguration } from '../model/tenant-configuration';

@Injectable({
  providedIn: 'root'
})
export class TenantsStore extends AbstractStore<TenantConfiguration[]> {
  constructor() {
    super([]);
  }
}
