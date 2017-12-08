import { Injectable } from "@angular/core";
import { InstructionalResource, InstructionalResources } from "../model/instructional-resources.model";


const organizationLevels: string[] = [
  "System",
  "State",
  "DistrictGroup",
  "District",
  "SchoolGroup"
];

@Injectable()
export class InstructionalResourcesMapper {
  private organizationLevel: string;
  private performanceLevel: number;
  private organizationName: string;

  mapInstructionalResourcesFromApi(apiModel): InstructionalResources {
    let uiModels = new Map<number, InstructionalResource[]>();

    for (let apiInstructionalResource of apiModel) {
      if (!uiModels.has(apiInstructionalResource.performanceLevel)) {
        uiModels.set(apiInstructionalResource.performanceLevel, [ this.mapInstructionalResourceFromApi(apiInstructionalResource) ]);
      } else {
        uiModels.set(apiInstructionalResource.performanceLevel,
          uiModels.get(apiInstructionalResource.performanceLevel).concat(this.mapInstructionalResourceFromApi(apiInstructionalResource)));
      }
    }

    return new InstructionalResources(uiModels);
  }

  mapInstructionalResourceFromApi(apiModel): InstructionalResource {
    let instructionalResource = new InstructionalResource();
    instructionalResource.organizationLevel = apiModel.organizationLevel;
    instructionalResource.performanceLevel = apiModel.performanceLevel;
    instructionalResource.url = apiModel.resource;
    return instructionalResource;
  }
}
