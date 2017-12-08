export class InstructionalResources {
  performanceLevelToResources: Map<number, InstructionalResource[]>;

  getResourcesByPerformance(performanceLevel: number): InstructionalResource[] {
    return this.performanceLevelToResources.get(performanceLevel) || [];
  }

  constructor(instructionalResourcesMap: Map<number, InstructionalResource[]>) {
    this.performanceLevelToResources = instructionalResourcesMap;
  }
}

export class InstructionalResource {
  organizationLevel: string;
  performanceLevel: string;
  url: string;
}
