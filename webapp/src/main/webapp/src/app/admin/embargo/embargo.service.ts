import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Embargo } from "./embargo";
import { isUndefined } from "util";
import { EmbargoScope } from "./embargo-scope.enum";
import { OrganizationType } from "./organization-type.enum";
import { DataService } from "../../shared/data/data.service";
import { ResponseContentType } from "@angular/http";

const ResourceContext = '/admin-service/embargoes';

/**
 * Service responsible for managing organization embargo settings
 */
@Injectable()
export class EmbargoService {

  constructor(private dataService: DataService) {
  }

  /**
   * Gets all organization embargo settings the user has access to view or edit
   *
   * @returns {Observable<Map<OrganizationType, Embargo[]>>}
   */
  getEmbargoesByOrganizationType(): Observable<Map<OrganizationType, Embargo[]>> {
    return this.dataService.get(`${ResourceContext}`)
      .map((sourceEmbargoes: any[]) => {
        return sourceEmbargoes.reduce((embargoesByOrganizationType, sourceEmbargo) => {
          const embargo = this.toEmbargo(sourceEmbargo),
            type = embargo.organization.type;

          embargoesByOrganizationType.set(type, (embargoesByOrganizationType.get(type) || []).concat(embargo));
          return embargoesByOrganizationType;
        }, new Map());
      });
  }

  /**
   * Updates the provided embargo to the given value for the given scope
   *
   * @param {Embargo} embargo the embargo to update
   * @param {EmbargoScope} scope the scope of the embargo setting to update
   * @param {boolean} value the new value of the embargo setting
   * @returns {Observable<Object>}
   */
  update(embargo: Embargo, scope: EmbargoScope, value: boolean): Observable<Object> {
    return this.dataService.put(
      `${ResourceContext}/${embargo.organization.type}/${embargo.organization.id ? embargo.organization.id : -1}/${scope}`,
      String(value),
      { responseType: ResponseContentType.Text }
    );
  }

  /**
   * Maps an API provided embargo model to a UI model
   *
   * NOTE: This method coerces individual and aggregate embargo enabled fields to <code>true</code> (embargoed) if undefined.
   * This method assumes the state individual and aggregate embargo enabled fields will not be undefined.
   *
   * @param source the API embargo model
   * @returns {Embargo} a UI embargo model
   */
  private toEmbargo(source: any): Embargo {
    return {
      organization: {
        id: source.organizationId,
        name: source.organizationName,
        type: source.organizationType
      },
      schoolYear: source.schoolYear,
      readonly: source.readOnly,
      examCountsBySubject: source.examCounts,
      individualEnabled: isUndefined(source.individualEnabled) ? true : source.individualEnabled,
      aggregateEnabled: isUndefined(source.aggregateEnabled) ? true : source.aggregateEnabled
    };
  }

}
