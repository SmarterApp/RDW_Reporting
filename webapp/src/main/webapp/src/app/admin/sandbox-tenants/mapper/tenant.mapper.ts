import { ConfigurationProperty } from '../model/configuration-property';
import { flattenJsonObject } from '../../../shared/support/support';
import { forOwn, get, isString } from 'lodash';
import { TenantConfiguration } from '../model/tenant-configuration';
import { SandboxConfiguration } from '../model/sandbox-configuration';

export function mapTenant(
  tenant: any,
  defaultApplicationTenantConfiguration: any
): TenantConfiguration {
  return <TenantConfiguration>{
    code: tenant.tenant['key'],
    id: tenant.tenant['id'],
    label: tenant.tenant['name'],
    description: tenant.tenant['description'],
    configurationProperties: mapConfigurationProperties(
      defaultApplicationTenantConfiguration,
      tenant.applicationTenantConfiguration
    ),
    localizationOverrides: mapLocalizationOverrides(tenant.localization)
  };
}

export function mapSandbox(
  sandbox: any,
  defaultApplicationSandboxConfiguration: any
): SandboxConfiguration {
  return <SandboxConfiguration>{
    code: sandbox.sandbox['key'],
    label: sandbox.sandbox['name'],
    description: sandbox.sandbox['description'],
    dataSetId: sandbox.sandbox['dataSetId'],
    configurationProperties: mapConfigurationProperties(
      defaultApplicationSandboxConfiguration,
      sandbox.applicationSandboxConfiguration
    ),
    localizationOverrides: mapLocalizationOverrides(sandbox.localization)
  };
}

export function mapFromSandbox(sandbox: SandboxConfiguration): any {
  return {
    tenantConfiguration: {
      sandbox: {
        key: sandbox.code,
        id: sandbox.code,
        description: sandbox.description,
        name: sandbox.label
      },
      applicationSandboxConfiguration: mapFromConfigurationProperties(
        sandbox.configurationProperties
      ),
      localization: sandbox.localizationOverrides
    }
  };
}

export function mapFromTenant(tenant: TenantConfiguration): any {
  return {
    tenant: {
      key: tenant.code,
      id: tenant.id,
      description: tenant.description,
      name: tenant.label
    },
    applicationTenantConfiguration: mapFromConfigurationProperties(
      tenant.configurationProperties
    ),
    localization: mapFromLocalizationOverrides(tenant.localizationOverrides)
  };
}

function mapFromConfigurationProperties(configProperties: any): any {
  let mappedGroup = {};

  forOwn(configProperties, (group, groupKey) => {
    if (groupKey === 'datasources') {
      let datasourceGroup = {};

      forOwn(group, (configurationProperties, datasourceKey) => {
        let configGroup = {};
        configurationProperties.forEach(
          configurationProperty =>
            (configGroup[configurationProperty.key] =
              configurationProperty.value)
        );
        datasourceGroup[datasourceKey] = configGroup;
      });

      mappedGroup[groupKey] = datasourceGroup;
    } else {
      let configGroup = {};
      // group is the list of configuration properties
      group.forEach(configurationProperty => {
        if (
          isString(configurationProperty.value) &&
          configurationProperty.value.indexOf(',') > -1
        ) {
          configGroup[
            configurationProperty.key
          ] = configurationProperty.value.split(',');
        } else {
          configGroup[configurationProperty.key] = configurationProperty.value;
        }
      });
      mappedGroup[groupKey] = configGroup;
    }
  });

  return mappedGroup;
}

export function mapConfigurationProperties(
  configProperties: any,
  overrides: any = {}
): any {
  let groupedProperties = {};

  forOwn(configProperties, (configGroup, groupKey) => {
    if (groupKey !== 'datasources') {
      let configProps: ConfigurationProperty[] = [];

      forOwn(flattenJsonObject(configGroup), (value, key) => {
        if (!overrides) {
          configProps.push(new ConfigurationProperty(key, value));
        } else {
          const groupOverrides = overrides[groupKey] || {};
          const override = get(groupOverrides, key);
          if (override) {
            configProps.push(new ConfigurationProperty(key, override, value));
          } else {
            configProps.push(new ConfigurationProperty(key, value));
          }
        }
      });

      groupedProperties = {
        ...groupedProperties,
        [groupKey]: configProps
      };
    } else {
      // current group is datasources
      let databaseProps = {};

      // Iterate over the group of databases
      forOwn(configGroup, (databaseProperties, databaseName) => {
        let configProps: ConfigurationProperty[] = [];

        forOwn(flattenJsonObject(databaseProperties), (value, key) => {
          if (!overrides) {
            configProps.push(new ConfigurationProperty(key, value));
          } else {
            const groupOverrides = overrides[groupKey] || {};
            const override = get(groupOverrides, `${databaseName}.${key}`);
            if (override) {
              configProps.push(new ConfigurationProperty(key, override, value));
            } else {
              configProps.push(new ConfigurationProperty(key, value));
            }
          }
        });

        databaseProps = {
          ...databaseProps,
          [databaseName]: configProps
        };
      });

      groupedProperties = {
        ...groupedProperties,
        [groupKey]: databaseProps
      };
    }
  });

  return groupedProperties;
}

function mapLocalizationOverrides(overrides: any): ConfigurationProperty[] {
  const configProperties: ConfigurationProperty[] = [];
  forOwn(overrides, (value, key) =>
    configProperties.push(new ConfigurationProperty(key, value))
  );
  return configProperties;
}

function mapFromLocalizationOverrides(overrides: ConfigurationProperty[]): any {
  return overrides
    ? overrides.reduce((localizationOverrides, { key, value }) => {
        localizationOverrides[key] = value;
        return localizationOverrides;
      }, {})
    : [];
}
