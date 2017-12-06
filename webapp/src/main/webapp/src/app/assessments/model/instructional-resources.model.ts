export class InstructionalResources {
  // instructionalResources:
  performanceLevelToResources: {[key: number]: InstructionalResource[]};

  getResourcesByPerformance(performanceLevel: number): InstructionalResource[] {
    return this.performanceLevelToResources[performanceLevel] || [];
  }

  constructor(instructionalResourcesMap: {[key: number]: InstructionalResource[]}) {
    this.performanceLevelToResources = instructionalResourcesMap;
  }
}
export class InstructionalResource {
  organizationLevel: string;
  organizationName: string;
  url: string;
}
