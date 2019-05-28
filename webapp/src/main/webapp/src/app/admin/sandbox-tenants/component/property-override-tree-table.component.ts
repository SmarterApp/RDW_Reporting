import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { FormControl, FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { forOwn, cloneDeep, get } from 'lodash';

@Component({
  selector: 'property-override-tree-table',
  templateUrl: './property-override-tree-table.component.html'
})
export class PropertyOverrideTreeTableComponent implements OnInit {
  _configurationProperties: any;

  get configurationProperties(): any {
    return this._configurationProperties;
  }

  @Input()
  set configurationProperties(properties: any) {
    this._configurationProperties = properties;
    if (this.form) {
      this.createConfigurationPropertyTree();
    }
  }

  @Input()
  propertiesArrayName: string;
  @Input()
  form: FormGroup;

  showModifiedPropertiesOnly = false;
  configurationPropertiesTreeNodes: TreeNode[] = [];

  constructor() {}

  ngOnInit(): void {
    this.createConfigurationPropertyTree();
  }

  updateOverride(override: ConfigurationProperty): void {
    let configurationProperties: ConfigurationProperty[];
    const formGroup = <FormGroup>this.form.controls[this.propertiesArrayName];
    const formControl = formGroup.controls[override.formControlName];
    const newVal = formControl.value;
    const group = override.formControlName.split(/\.(.+)/)[0];
    const key = override.formControlName.split(/\.(.+)/)[1];

    configurationProperties = <ConfigurationProperty[]>(
      this._configurationProperties[group]
    );

    if (!configurationProperties) {
      // If we couldn't find the group within the top-level property groups, lets peek at datasources...
      const datasources = this._configurationProperties['datasources'];
      configurationProperties = <ConfigurationProperty[]>datasources[group];
    }

    const configurationProperty = configurationProperties.find(
      property => property.key === key
    );
    configurationProperty.value = newVal;
    override.value = newVal;
  }

  expandOrCollapse(node: TreeNode): void {
    node.expanded = !node.expanded;
    // Change detection is not triggered unless the TreeNode array is replaced due to framework using setter-based change detection
    this.configurationPropertiesTreeNodes = cloneDeep(
      this.configurationPropertiesTreeNodes
    );
  }

  resetClicked(override: ConfigurationProperty): void {
    override.value = override.originalValue;
  }

  childrenHaveOverrides(node: TreeNode): boolean {
    if (node.children && node.children.length > 0) {
      const hasOverride = node.children.some(
        child => child.data.value !== child.data.originalValue
      );
      if (hasOverride) {
        return true;
      } else {
        return node.children.some(child => this.childrenHaveOverrides(child));
      }
    }

    return false;
  }

  private createConfigurationPropertyTree(): void {
    const groupNodes: TreeNode[] = [];

    forOwn(this._configurationProperties, (configGroup, groupKey) => {
      const childrenNodes: TreeNode[] = [];
      // For each configuration group, create a root-level node

      if (groupKey === 'datasources') {
        forOwn(configGroup, (dataSourceProperties, dataSourceKey) => {
          let dataSourcePropertyNodes: TreeNode[] = [];
          this.mapLeafNodes(
            dataSourceProperties,
            dataSourceKey,
            dataSourcePropertyNodes
          );

          childrenNodes.push({
            data: {
              key: dataSourceKey
            },
            children: dataSourcePropertyNodes
          });
        });
      } else {
        this.mapLeafNodes(configGroup, groupKey, childrenNodes);
      }

      const groupNode = <TreeNode>{
        data: {
          key: groupKey,
          groupNode: true
        },
        children: childrenNodes,
        expanded: false,
        leaf: false
      };
      groupNodes.push(groupNode);
    });

    this.configurationPropertiesTreeNodes = groupNodes;
  }

  private mapLeafNodes(
    configGroup: ConfigurationProperty[],
    groupKey: string,
    childrenNodes: TreeNode[]
  ): void {
    const configPropertiesFormGroup = <FormGroup>(
      this.form.controls[this.propertiesArrayName]
    );

    configGroup.forEach(group => {
      const formControlKey = `${groupKey}.${group.key}`;
      childrenNodes.push({
        data: {
          key: group.key,
          value: group.value,
          originalValue: group.originalValue,
          formControlName: formControlKey
        },
        expanded: false,
        leaf: true
      });

      configPropertiesFormGroup.addControl(
        formControlKey,
        new FormControl(group.value)
      );
    });
  }
}
