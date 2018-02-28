-- Create non-embargoed district
insert into district (id, natural_id, name) values
  (-100, 'districtNat100', 'district100');

-- Create non-embargoed school within district
insert into school (id, district_id, natural_id, name, embargo_enabled, update_import_id, updated, migrate_id, school_group_id, district_group_id, external_id) VALUES
  (-100, -10, 'schoolNat100', 'school100', 0, -1, '1997-07-18 20:14:34.000000', -1, null, null, 'externalId100');