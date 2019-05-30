import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { TenantConfiguration } from '../model/tenant-configuration';
import { toTenantApiModel, mapTenant } from '../mapper/tenant.mapper';
import { catchError, map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';
import { ResponseUtils } from '../../../shared/response-utils';

const ResourceRoute = `${AdminServiceRoute}/tenants`;

/**
 * Service responsible for managing tenants
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(private dataService: DataService) {}

  /**
   * Gets default configuration properties for a tenant
   */
  getDefaultConfigurationProperties(): Observable<any> {
    return this.dataService
      .get(`${ResourceRoute}`)
      .pipe(map(apiTenants => apiTenants['applicationTenantConfiguration']));
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<TenantConfiguration[]> {
    return this.dataService
      .get(`${ResourceRoute}`)
      .pipe(
        map(apiTenants =>
          apiTenants.tenants.map(apiTenant =>
            mapTenant(apiTenant, apiTenants['applicationTenantConfiguration'])
          )
        )
      );
  }

  /**
   * Creates a new tenant
   * @param tenant - The tenant to create
   */
  create(tenant: TenantConfiguration): Observable<TenantConfiguration> {
    return this.dataService
      .post(`${ResourceRoute}`, toTenantApiModel(tenant))
      .pipe(
        map(() => tenant),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Updates an existing tenant
   * @param tenant - The tenant to update
   */
  update(tenant: TenantConfiguration): Observable<TenantConfiguration> {
    return this.dataService
      .put(`${ResourceRoute}`, toTenantApiModel(tenant))
      .pipe(
        map(() => tenant),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Deletes an existing tenant
   * @param tenantCode - The code or "key" of the tenant to delete
   */
  delete(tenantCode: string): Observable<void> {
    return this.dataService
      .delete(`${ResourceRoute}/${tenantCode}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
