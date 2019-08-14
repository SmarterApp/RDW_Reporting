import { studentFields } from './data/student-fields';
import { FieldConfiguration, OptionsProvider } from './field';
import { isEqual } from 'lodash';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { of } from 'rxjs';
import { StateOptionsService } from '../service/state-options.service';
import { State } from './state';
import { map } from 'rxjs/operators';
import { configurableDataElements } from './data/configurable-data-elements';

const sandboxHidden = type => type === 'SANDBOX';

const byLabel = ordering(byString).on(({ label }) => label).compare;

const assessmentTypeOptions = ({ translateService }) =>
  of(
    ['sum', 'ica', 'iab'].map(value => ({
      value,
      label: translateService.instant(
        `common.assessment-type.${value}.short-name`
      )
    }))
  );

const languageOptions = ({ translateService }) =>
  of(
    ['en']
      .map(value => ({
        value,
        label: translateService.instant(`common.language.${value}`)
      }))
      .sort(byLabel)
  );

const reportLanguageOptions = ({ translateService }) =>
  of(
    ['en', 'es']
      .map(value => ({
        value,
        label: translateService.instant(`common.language.${value}`)
      }))
      .sort(byLabel)
  );

const stateOptions: OptionsProvider<State> = ({ injector }) =>
  injector
    .get(StateOptionsService)
    .getStates()
    .pipe(
      map(states =>
        states.map(value => ({
          label: value.name,
          value
        }))
      )
    );

const studentFieldOptions = () =>
  of(
    ['Enabled', 'Admin', 'Disabled'].map(value => ({
      value,
      label: value
    }))
  );

const examProcessorRequiredDataElements = () =>
  of(
    configurableDataElements.map(value => ({
      value,
      label: value
    }))
  );

function dataSources(
  sources: string[],
  mapper: (source: string) => { [key: string]: FieldConfiguration }
): { [key: string]: FieldConfiguration } {
  return sources.reduce((configurations, source) => {
    return {
      ...configurations,
      ...mapper(`datasources.${source}`)
    };
  }, {});
}

function mysqlDataSource(
  basePath: string
): { [key: string]: FieldConfiguration } {
  return {
    [`${basePath}.urlParts.database`]: {
      dataType: 'string',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${basePath}.username`]: {
      dataType: 'username',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${basePath}.password`]: {
      dataType: 'password',
      required: true,
      hidden: sandboxHidden
    }
  };
}

function postgresDataSource(
  basePath: string
): { [key: string]: FieldConfiguration } {
  return {
    [`${basePath}.schemaSearchPath`]: {
      dataType: 'string',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${basePath}.username`]: {
      dataType: 'username',
      required: true,
      lowercase: true,
      hidden: sandboxHidden
    },
    [`${basePath}.password`]: {
      dataType: 'password',
      required: true,
      hidden: sandboxHidden
    }
  };
}

function oauth2(basePath: string): { [key: string]: FieldConfiguration } {
  return {
    [`${basePath}.accessTokenUri`]: {
      dataType: 'uri',
      hidden: sandboxHidden
    },
    [`${basePath}.clientId`]: {
      dataType: 'string',
      hidden: sandboxHidden
    },
    [`${basePath}.clientSecret`]: {
      dataType: 'string',
      hidden: sandboxHidden
    },
    [`${basePath}.username`]: {
      dataType: 'string',
      hidden: sandboxHidden
      // can we provide a reasonable default?
    },
    [`${basePath}.password`]: {
      dataType: 'string',
      hidden: sandboxHidden
    }
  };
}

function archive(
  basePath: string,
  pathPrefixRequired: boolean = true
): { [key: string]: FieldConfiguration } {
  return {
    [`${basePath}.pathPrefix`]: {
      dataType: 'string',
      required: pathPrefixRequired,
      hidden: sandboxHidden
    },
    [`${basePath}.uriRoot`]: {
      dataType: 'archive-uri',
      hidden: sandboxHidden
    },
    [`${basePath}.s3AccessKey`]: {
      dataType: 'string',
      hidden: sandboxHidden
    },
    [`${basePath}.s3RegionStatic`]: {
      dataType: 'string',
      hidden: sandboxHidden
    },
    [`${basePath}.s3SecretKey`]: {
      dataType: 'string',
      hidden: sandboxHidden
    },
    [`${basePath}.s3Sse`]: {
      dataType: 'string',
      hidden: sandboxHidden
    }
  };
}

function archives(
  basePath: string,
  count: number
): { [key: string]: FieldConfiguration } {
  let archives = {};
  for (let i = 0; i < count; i++) {
    archives = {
      ...archives,
      ...archive(`${basePath}.${i}`, false)
    };
  }
  return archives;
}

export const fieldConfigurationsByKey: { [key: string]: FieldConfiguration } = {
  'aggregate.assessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions,
    required: true
  },
  'aggregate.statewideUserAssessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions,
    required: true
  },
  'aggregate.stateAggregateAssessmentTypes': {
    dataType: 'enumeration-list',
    options: assessmentTypeOptions,
    required: true
  },
  ...archive('archive'),
  ...dataSources(
    ['reporting_ro', 'reporting_rw', 'warehouse_rw', 'migrate_rw'],
    mysqlDataSource
  ),
  ...dataSources(['olap_ro', 'olap_rw'], postgresDataSource),
  'reporting.accessDeniedUrl': {
    dataType: 'string', // not url-fragment b/c of spring forward: prefix
    hidden: sandboxHidden
  },
  'reporting.interpretiveGuideUrl': {
    dataType: 'url-fragment'
  },
  'reporting.landingPageUrl': {
    dataType: 'string' // not url-fragment b/c of spring forward: prefix
  },
  'reporting.minItemDataYear': {
    dataType: 'positive-integer'
  },
  'reporting.percentileDisplayEnabled': {
    dataType: 'boolean'
  },
  'reporting.schoolYear': {
    dataType: 'positive-integer'
  },
  // flatten state
  'reporting.state': {
    dataType: 'enumeration',
    required: true,
    options: stateOptions,
    equals: isEqual,
    hidden: sandboxHidden
  },
  'reporting.transferAccessEnabled': {
    dataType: 'boolean'
  },
  'reporting.reportLanguages': {
    dataType: 'enumeration-list',
    options: reportLanguageOptions
  },
  'reporting.uiLanguages': {
    dataType: 'enumeration-list',
    options: languageOptions
  },
  'reporting.userGuideUrl': {
    dataType: 'url-fragment'
  },
  'reporting.targetReport.insufficientDataCutoff': {
    dataType: 'positive-decimal'
  },
  'reporting.targetReport.minNumberOfStudents': {
    dataType: 'positive-integer'
  },
  ...studentFields.reduce((configurations, studentField) => {
    configurations[`reporting.studentFields.${studentField}`] = {
      dataType: 'enumeration',
      options: studentFieldOptions,
      equals: (a, b) =>
        (a || 'Enabled').toLowerCase() === (b || 'Enabled').toLowerCase()
    };
    return configurations;
  }, {}),
  'validation.requiredDataElements': {
    dataType: 'enumeration-list',
    options: examProcessorRequiredDataElements,
    hidden: sandboxHidden
  },
  ...oauth2('artClient.oauth2'),
  ...oauth2('importServiceClient.oauth2'),
  'sendReconciliationReport.log': {
    dataType: 'boolean'
  },
  'sendReconciliationReport.query': {
    dataType: 'string'
  },
  ...archives('sendReconciliationReport.archives', 2)
};
