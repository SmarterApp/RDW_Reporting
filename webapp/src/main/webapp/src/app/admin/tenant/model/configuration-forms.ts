import { studentFields } from './data/student-fields';
import {
  archiveUriDataType,
  assessmentTypeDataType,
  booleanDataType,
  databaseNameDataType,
  databasePasswordDataType,
  databaseUsernameDataType,
  languagesDataType,
  positiveDecimalDataType,
  positiveIntegerDataType,
  reportLanguagesDataType,
  requiredDataElementsDataType,
  secretDataType,
  stateDataType,
  stringDataType,
  studentFieldDataType,
  uriDataType,
  urlFragmentDataType
} from './data-types';
import { FormFieldConfiguration } from './form/form-field-configuration';
import { TenantType } from './tenant-type';
import { FormMode } from '../component/tenant-form/tenant-form.component';
import { FormField } from './form/form-field';
import { formFields } from './form/form-fields';
import { requiredIfOthersPresent } from './form/validators';

function dataSources(
  sources: string[],
  mapper: (source: string) => FormFieldConfiguration[]
): FormFieldConfiguration[] {
  return sources.reduce((configurations, source) => {
    return [...configurations, ...mapper(`datasources.${source}`)];
  }, []);
}

function mysqlDataSource(basePath: string): FormFieldConfiguration[] {
  return [
    {
      name: `${basePath}.urlParts.database`,
      dataType: databaseNameDataType,
      required: true
    },
    {
      name: `${basePath}.username`,
      dataType: databaseUsernameDataType,
      required: true
    },
    {
      name: `${basePath}.password`,
      dataType: databasePasswordDataType,
      required: true
    }
  ];
}

function postgresDataSource(basePath: string): FormFieldConfiguration[] {
  return [
    {
      name: `${basePath}.schemaSearchPath`,
      dataType: databaseNameDataType,
      required: true
    },
    {
      name: `${basePath}.username`,
      dataType: databaseUsernameDataType,
      required: true
    },
    {
      name: `${basePath}.password`,
      dataType: databasePasswordDataType,
      required: true
    }
  ];
}

function oauth2(
  basePath: string,
  hasDefaultCredentials: boolean
): FormFieldConfiguration[] {
  return [
    {
      name: `${basePath}.accessTokenUri`,
      dataType: uriDataType
    },
    {
      name: `${basePath}.clientId`,
      dataType: stringDataType
    },
    {
      name: `${basePath}.clientSecret`,
      dataType: secretDataType
    },
    {
      name: `${basePath}.clientSecret`,
      dataType: secretDataType
    },
    {
      name: `${basePath}.username`,
      dataType: stringDataType,
      validators: hasDefaultCredentials
        ? []
        : [
            requiredIfOthersPresent(
              [`${basePath}.password`],
              'requiredOAuth2Field'
            )
          ]
    },
    {
      name: `${basePath}.password`,
      dataType: secretDataType,
      validators: hasDefaultCredentials
        ? []
        : [
            requiredIfOthersPresent(
              [`${basePath}.username`],
              'requiredOAuth2Field'
            )
          ]
    }
  ];
}

function archive(basePath: string): FormFieldConfiguration[] {
  return [
    {
      name: `${basePath}.pathPrefix`,
      dataType: stringDataType
    },
    {
      name: `${basePath}.uriRoot`,
      dataType: archiveUriDataType
    },
    {
      name: `${basePath}.s3AccessKey`,
      dataType: stringDataType
    },
    {
      name: `${basePath}.s3RegionStatic`,
      dataType: stringDataType
    },
    {
      name: `${basePath}.s3SecretKey`,
      dataType: secretDataType
    },
    {
      name: `${basePath}.s3Sse`,
      dataType: stringDataType
    }
  ];
}

function archives(basePath: string, count: number): FormFieldConfiguration[] {
  const archives = [];
  for (let i = 0; i < count; i++) {
    archives.push(...archive(`${basePath}.${i}`));
  }
  return archives;
}

export function aggregateFieldConfigurations(): FormFieldConfiguration[] {
  return [
    {
      name: 'aggregate.assessmentTypes',
      dataType: assessmentTypeDataType,
      required: true
    },
    {
      name: 'aggregate.statewideUserAssessmentTypes',
      dataType: assessmentTypeDataType,
      required: true
    },
    {
      name: 'aggregate.stateAggregateAssessmentTypes',
      dataType: assessmentTypeDataType,
      required: true
    }
  ];
}

export function archiveFieldConfigurations(
  readonly: boolean = false
): FormFieldConfiguration[] {
  return archive('archive').map(configuration => ({
    ...configuration,
    readonly
  }));
}

export function dataSourceFieldConfigurations(
  readonly: boolean = false
): FormFieldConfiguration[] {
  return [
    ...dataSources(
      ['reporting_ro', 'reporting_rw', 'warehouse_rw', 'migrate_rw'],
      mysqlDataSource
    ),
    ...dataSources(['olap_ro', 'olap_rw'], postgresDataSource)
  ].map(configuration => ({
    ...configuration,
    readonly
  }));
}

function embargoFieldConfigurations(): FormFieldConfiguration[] {
  return [
    {
      name: 'embargo.pageSize',
      dataType: positiveIntegerDataType,
      required: true
    },
    {
      name: 'embargo.auditLogDays',
      dataType: positiveIntegerDataType,
      required: true
    },
    {
      name: 'embargo.auditLogFileName',
      dataType: stringDataType,
      required: true
    }
  ];
}

function reportingFieldConfigurations(): FormFieldConfiguration[] {
  return [
    {
      name: 'reporting.accessDeniedUrl',
      dataType: stringDataType
    },
    {
      name: 'reporting.interpretiveGuideUrl',
      dataType: urlFragmentDataType
    },
    {
      name: 'reporting.landingPageUrl',
      dataType: stringDataType
    },
    {
      name: 'reporting.minItemDataYear',
      dataType: positiveIntegerDataType
    },
    {
      name: 'reporting.percentileDisplayEnabled',
      dataType: booleanDataType
    },
    {
      name: 'reporting.schoolYear',
      dataType: positiveIntegerDataType
    },
    {
      name: 'reporting.state',
      dataType: stateDataType,
      required: true
    },
    {
      name: 'reporting.transferAccessEnabled',
      dataType: booleanDataType
    },
    {
      name: 'reporting.reportLanguages',
      dataType: reportLanguagesDataType
    },
    {
      name: 'reporting.uiLanguages',
      dataType: languagesDataType
    },
    {
      name: 'reporting.userGuideUrl',
      dataType: urlFragmentDataType
    },
    {
      name: 'reporting.targetReport.insufficientDataCutoff',
      dataType: positiveDecimalDataType
    },
    {
      name: 'reporting.targetReport.minNumberOfStudents',
      dataType: positiveIntegerDataType
    },
    ...studentFields.map(studentField => ({
      name: `reporting.studentFields.${studentField}`,
      dataType: studentFieldDataType
    }))
  ];
}

export function validationFieldConfigurations(): FormFieldConfiguration[] {
  return [
    {
      name: 'validation.requiredDataElements',
      dataType: requiredDataElementsDataType,
      required: true
    }
  ];
}

export function taskServiceArtClientFieldConfigurations(): FormFieldConfiguration[] {
  return oauth2('artClient.oauth2', true);
}

export function taskServiceImportServiceClientFieldConfigurations(): FormFieldConfiguration[] {
  return oauth2('importServiceClient.oauth2', false);
}

export function taskServiceReconciliationReportFieldConfigurations(): FormFieldConfiguration[] {
  return [
    {
      name: 'sendReconciliationReport.log',
      dataType: booleanDataType
    },
    {
      name: 'sendReconciliationReport.query',
      dataType: stringDataType
    },
    ...archives('sendReconciliationReport.archives', 2)
  ];
}

const configurations = [
  ...aggregateFieldConfigurations(),
  ...archiveFieldConfigurations(),
  ...dataSourceFieldConfigurations(),
  ...embargoFieldConfigurations(),
  ...reportingFieldConfigurations(),
  ...validationFieldConfigurations(),
  ...taskServiceArtClientFieldConfigurations(),
  ...taskServiceImportServiceClientFieldConfigurations(),
  ...taskServiceReconciliationReportFieldConfigurations()
];

export function configurationsFormFieldConfiguration(
  name: string
): FormFieldConfiguration {
  return configurations.find(configuration => configuration.name === name);
}

export function configurationsFormFieldConfigurations(
  tenantType: TenantType,
  formMode: FormMode
): FormFieldConfiguration[] {
  if (tenantType === 'TENANT') {
    const readonly = formMode !== 'create';
    return [
      ...aggregateFieldConfigurations(),
      ...archiveFieldConfigurations(readonly),
      ...dataSourceFieldConfigurations(readonly),
      ...embargoFieldConfigurations(),
      ...reportingFieldConfigurations(),
      ...validationFieldConfigurations(),
      ...taskServiceArtClientFieldConfigurations(),
      ...taskServiceImportServiceClientFieldConfigurations(),
      ...taskServiceReconciliationReportFieldConfigurations()
    ];
  } else {
    return [
      ...aggregateFieldConfigurations(),
      ...embargoFieldConfigurations(),
      ...reportingFieldConfigurations()
    ];
  }
}

export function configurationFormFields(
  tenantType: TenantType,
  formMode: FormMode
): FormField[] {
  return formFields(
    configurationsFormFieldConfigurations(tenantType, formMode)
  );
}
