import { AbstractStore } from '../../../shared/store/abstract-store';
import { Injectable } from '@angular/core';
import { SandboxConfiguration } from '../model/sandbox-configuration';

@Injectable()
export class SandboxStore extends AbstractStore<SandboxConfiguration[]> {
  constructor() {
    super([]);
  }
}
