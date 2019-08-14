import {
  oauth2s,
  oneDatabasePerDataSource,
  onePasswordPerUser,
  uniqueDatabasePerInstance
} from './tenant-form.validators';
import { FormControl, FormGroup } from '@angular/forms';

describe('onePasswordPerUser', () => {
  it('should return null when form is valid', () => {
    expect(
      onePasswordPerUser(
        new FormGroup({
          'datasources.reporting_ro.username': new FormControl('user1'),
          'datasources.reporting_ro.password': new FormControl('a'),
          'datasources.warehouse_ro.username': new FormControl('user1'),
          'datasources.warehouse_ro.password': new FormControl('a'),
          'datasources.olap_ro.username': new FormControl('user2'),
          'datasources.olap_ro.password': new FormControl('c')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      onePasswordPerUser(
        new FormGroup({
          'datasources.reporting_ro.username': new FormControl('user1'),
          'datasources.reporting_ro.password': new FormControl('a'),
          'datasources.warehouse_ro.username': new FormControl('user1'),
          'datasources.warehouse_ro.password': new FormControl('b'),
          'datasources.olap_ro.username': new FormControl('user2'),
          'datasources.olap_ro.password': new FormControl('c')
        })
      )
    ).toEqual({
      onePasswordPerUser: {
        usernames: ['user1']
      }
    });
  });
});

describe('oneDatabasePerDataSource', () => {
  it('should return null when form is valid', () => {
    expect(
      oneDatabasePerDataSource(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('a'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('c'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('d')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      oneDatabasePerDataSource(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('x'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('c'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('y')
        })
      )
    ).toEqual({
      oneDatabasePerDataSource: {
        conflicts: [['reporting', ['a', 'x']], ['olap2', ['d', 'y']]]
      }
    });
  });
});

describe('uniqueDatabasePerInstance', () => {
  it('should return null when form is valid', () => {
    expect(
      uniqueDatabasePerInstance(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('a'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('c'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('d')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      uniqueDatabasePerInstance(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('b'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('d')
        })
      )
    ).toEqual({
      uniqueDatabasePerInstance: {
        duplicates: [
          ['b', ['reporting', 'warehouse']],
          ['d', ['olap', 'olap2']]
        ]
      }
    });
  });

  it('should allow redshift and aurora database names to collide because they are separate database instances', () => {
    expect(
      uniqueDatabasePerInstance(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('a'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('a'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('a'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('b'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('b')
        })
      )
    ).toBeNull();
  });
});

describe('oauth2s', () => {
  it('should return null when form is validly empty', () => {
    expect(
      oauth2s(
        new FormGroup({
          'g1.oauth2.clientSecret': new FormControl(''),
          'g1.oauth2.password': new FormControl(''),
          'g1.oauth2.ignored': new FormControl('ignored'),
          'g2.oauth2.clientSecret': new FormControl(''),
          'g2.oauth2.password': new FormControl(''),
          'g2.oauth2.ignored': new FormControl('ignored')
        })
      )
    ).toBeNull();
  });

  it('should return null when form is validly filled', () => {
    expect(
      oauth2s(
        new FormGroup({
          'g1.oauth2.clientSecret': new FormControl('a'),
          'g1.oauth2.password': new FormControl('a'),
          'g1.oauth2.ignored': new FormControl(''),
          'g2.oauth2.clientSecret': new FormControl('a'),
          'g2.oauth2.password': new FormControl('a'),
          'g2.oauth2.ignored': new FormControl('')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      oauth2s(
        new FormGroup({
          'g1.oauth2.clientSecret': new FormControl('a'),
          'g1.oauth2.password': new FormControl(' '),
          'g2.oauth2.clientSecret': new FormControl('a'),
          'g2.oauth2.password': new FormControl('')
        })
      )
    ).toEqual({
      oauth2s: ['g1', 'g2']
    });
  });
});
