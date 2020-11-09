insert into district_group (id, natural_id, name) values
  (-10, 'districtgroup1', 'districtgroup1'),
  (-20, 'districtgroup2', 'districtgroup2');

insert into district (id, natural_id, name) values
  (-10, 'district1', 'district1'),
  (-20, 'district2', 'district2'),
  (-30, 'district3', 'district3');

insert into school_group (id, natural_id, name) values
  (-10, 'schoolgroup1', 'schoolgroup1');

insert into school (id, district_group_id, district_id, school_group_id, natural_id, name, update_import_id, updated, migrate_id, external_id) VALUES
  (-101, -10, -10, -10, 'schoolNat1', 'school1', -1, '1997-07-18 20:14:34.000000', -1, 'externalId1'),
  (-102, -10, -10, null, 'schoolNat2', 'school2', -1, '1997-07-18 20:14:34.000000', -1, 'externalId2'),
  (-201, -20, -20, null, 'schoolNat3', 'school3', -1, '1997-07-18 20:14:34.000000', -1, 'externalId3'),
  (-301, null, -30, null, 'schoolNat4', 'school4', -1, '1997-07-18 20:14:34.000000', -1, 'externalId4');
