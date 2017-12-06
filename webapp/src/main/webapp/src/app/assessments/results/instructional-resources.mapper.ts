import { Injectable } from "@angular/core";
import { Option, Utils } from "@sbac/rdw-reporting-common-ngx";
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
  private resource: string;

  //taken from AssessmentExamMapper
  mapInstructionalResourcesFromApi(apiModel): InstructionalResources {
    let uiModels:  {[key: number]: InstructionalResource[]} = {};

    for (let apiInstructionalResource of apiModel) {
        uiModels[apiModel.performanceLevel].push(this.mapInstructionalResourceFromApi(apiModel));
    }

    // uiModels.sort(ordering(byNumber).on<AssessmentItem>(ai => ai.position).compare);
    return new InstructionalResources(uiModels);
  }

  mapInstructionalResourceFromApi(apiModel): InstructionalResource {
    let instructionalResource = new InstructionalResource();
    instructionalResource.organizationLevel = apiModel.organizationLevel;
    instructionalResource.organizationName = apiModel.organizationName;
    instructionalResource.url = apiModel.url;
    return instructionalResource;
  }
}
