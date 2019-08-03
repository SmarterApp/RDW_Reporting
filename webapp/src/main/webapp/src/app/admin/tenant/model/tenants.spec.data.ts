import { DataSet } from './tenant-configuration';

export const dataSets: DataSet[] = [
  {
    label: 'ds1',
    id: 'DS1'
  },
  {
    label: 'ds2',
    id: 'DS2'
  }
];

export const activeSandbox = {
  tenant: {
    id: 'TS_S001',
    key: 'TS_S001',
    name: 'Test Tenant Sandbox 001',
    description: 'desc',
    sandbox: true,
    sandboxDataset: 'DS1'
  },
  parentTenantKey: 'TS',
  localization: null,
  administrationStatus: { tenantAdministrationStatus: 'ACTIVE' },
  reporting: {
    analyticsTrackingId: null,
    interpretiveGuideUrl: null,
    accessDeniedUrl: null,
    landingPageUrl: null,
    irisVendorId: null,
    minItemDataYear: null,
    percentileDisplayEnabled: null,
    reportLanguages: [],
    schoolYear: null,
    state: { name: 'Test State', code: 'TS' },
    transferAccessEnabled: null,
    translationLocation: null,
    uiLanguages: [],
    userGuideUrl: null,
    targetReport: {},
    studentFields: {
      EnglishLanguageAcquisitionStatus: 'Enabled',
      EconomicDisadvantage: 'Enabled',
      Section504: 'Enabled',
      Ethnicity: 'Enabled',
      MigrantStatus: 'Enabled',
      IndividualEducationPlan: 'Enabled',
      MilitaryStudentIdentifier: 'Enabled',
      LimitedEnglishProficiency: 'Disabled',
      PrimaryLanguage: 'Enabled',
      Gender: 'Enabled'
    }
  },
  datasources: {},
  archive: null,
  aggregate: null
};

export const failedTenant = {
  tenant: {
    id: '',
    key: '',
    name: '',
    description: '',
    sandbox: false,
    sandboxDataset: null
  },
  parentTenantKey: null,
  localization: null,
  administrationStatus: {
    tenantConfiguration: {
      tenant: {
        id: '',
        key: '',
        name: '',
        description: '',
        sandbox: false,
        sandboxDataset: null
      },
      parentTenantKey: null,
      localization: null,
      administrationStatus: null,
      reporting: null,
      datasources: {},
      archive: null,
      aggregate: null
    },
    tenantAdministrationStatus: 'FAILED',
    message: 'stack trace...'
  },
  reporting: null,
  datasources: {},
  archive: null,
  aggregate: null
};

export const activeTenant = {
  tenant: {
    id: 'CA',
    key: 'CA',
    name: 'California',
    description: 'desc',
    sandbox: false,
    sandboxDataset: null
  },
  parentTenantKey: null,
  localization: {
    'aggregate-report-form': {
      field: {
        'summative-administration-condition-info':
          'For summative assessments, a test is noted as invalid if an appeal is submitted  to invalidate the test due to a test irregularity or breach. Note: Not applicable for ELPAC.'
      }
    },
    common: {
      'completeness-form-control': {
        info:
          'A test is considered complete when the student provides an answer for every question. Note: Not applicable for ELPAC.'
      },
      filters: {
        status: {
          'summative-info':
            'For summative assessments, a test is noted as invalid if an appeal is submitted  to invalidate the test due to a test irregularity or breach. Note: Not applicable for ELPAC.'
        }
      },
      info: {
        claim:
          'Claims are a way of classifying test content. The claim is the major topic area. For example, in English language arts, reading is a claim and in Math, Concepts and Procedures is a claim. For the ELPAC, claims are the same as domains.'
      },
      results: {
        assessment: {
          'no-instruct-found': 'Resources not available in the CA Sandbox'
        },
        'assessment-exam-columns': {
          'score-info':
            "This is the student's test score and error band based on the Standard Error of Measurement (SEM) associated with that score. Test scores are on a vertical scale, meaning that scores for all grades are reported on a single continuous scale to reflect the increased expectations as students advance through the grades. The error band is included because test scores are estimates of student performance/achievement and come with a certain amount of measurement error. See the Interpretive Guide for additional information."
        }
      }
    }
  },
  administrationStatus: { tenantAdministrationStatus: 'ACTIVE' },
  reporting: {
    analyticsTrackingId: null,
    interpretiveGuideUrl: null,
    accessDeniedUrl: null,
    landingPageUrl: null,
    irisVendorId: null,
    minItemDataYear: null,
    percentileDisplayEnabled: null,
    reportLanguages: [],
    schoolYear: null,
    state: { name: 'California', code: 'CA' },
    transferAccessEnabled: null,
    translationLocation:
      'binary-http://config-server:8888/*/*/master/tenant-CA/',
    uiLanguages: [],
    userGuideUrl: null,
    targetReport: {},
    studentFields: {
      EnglishLanguageAcquisitionStatus: 'Enabled',
      EconomicDisadvantage: 'Disabled',
      Section504: 'Disabled',
      Ethnicity: 'Enabled',
      MigrantStatus: 'Enabled',
      IndividualEducationPlan: 'Disabled',
      MilitaryStudentIdentifier: 'Disabled',
      LimitedEnglishProficiency: 'Disabled',
      PrimaryLanguage: 'Enabled',
      Gender: 'Disabled'
    }
  },
  datasources: {
    reporting_rw: {
      url: null,
      urlParts: { database: 'reporting' },
      username: null,
      password: null,
      schemaSearchPath: null,
      testWhileIdle: null,
      validationQuery: null,
      validationInterval: null,
      driverClassName: null,
      initialSize: null,
      maxActive: null,
      minIdle: null,
      maxIdle: null,
      removeAbandoned: null,
      removeAbandonedTimeout: null,
      logAbandoned: null
    },
    reporting_ro: {
      url: null,
      urlParts: { database: 'reporting' },
      username: null,
      password: null,
      schemaSearchPath: null,
      testWhileIdle: null,
      validationQuery: null,
      validationInterval: null,
      driverClassName: null,
      initialSize: null,
      maxActive: null,
      minIdle: null,
      maxIdle: null,
      removeAbandoned: null,
      removeAbandonedTimeout: null,
      logAbandoned: null
    },
    warehouse_rw: {
      url: null,
      urlParts: { database: 'warehouse' },
      username: null,
      password: null,
      schemaSearchPath: null,
      testWhileIdle: null,
      validationQuery: null,
      validationInterval: null,
      driverClassName: null,
      initialSize: null,
      maxActive: null,
      minIdle: null,
      maxIdle: null,
      removeAbandoned: null,
      removeAbandonedTimeout: null,
      logAbandoned: null
    }
  },
  archive: null,
  aggregate: null
};
