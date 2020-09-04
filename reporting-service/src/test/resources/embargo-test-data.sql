-- Create non-embargoed district
insert into district (id, natural_id, name) values
  (-100, 'districtNat100', 'district100');

insert into district_embargo (district_id, school_year, subject_id, individual) values
  (-100, 1997, 1, 2);

-- Create school within (non-embargoed) district
insert into school (id, district_id, natural_id, name, update_import_id, updated, migrate_id, school_group_id, district_group_id, external_id) VALUES
  (-100, -10, 'schoolNat100', 'school100', -1, '1997-07-18 20:14:34.000000', -1, null, null, 'externalId100');