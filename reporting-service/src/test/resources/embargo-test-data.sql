-- Create new districts that will have all subjects released, reviewing, and released.
insert into district (id, natural_id, name) values
    (-100, 'districtNat100', 'district100');
insert into district (id, natural_id, name) values
    (-101, 'districtNat101', 'district101');
insert into district (id, natural_id, name) values
    (-102, 'districtNat102', 'district102');

-- Release individual results for this district for all years and subjects
insert into district_embargo (district_id, school_year, subject_id, individual)
    select -102, 1997, id, 2 from subject;

-- Move individual results to reviewing for this district for all years and subjects
insert into district_embargo (district_id, school_year, subject_id, individual)
    select -101, 1997, id, 1 from subject;

-- Create school within (non-embargoed) district
insert into school (id, district_id, natural_id, name, update_import_id, updated, migrate_id, school_group_id, district_group_id, external_id) VALUES
  (-100, -10, 'schoolNat100', 'school100', -1, '1997-07-18 20:14:34.000000', -1, null, null, 'externalId100');
