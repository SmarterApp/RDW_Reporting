insert into district_group (id, natural_id, name) values
  (-10, 'districtgroup1', 'districtgroup1'),
  (-20, 'districtgroup2', 'districtgroup2');

insert into district (id, natural_id, name) values
  (-10, 'district1', 'district1'),
  (-20, 'district2', 'district2'),
  (-30, 'district3', 'district3');

insert into school_group (id, natural_id, name) values
  (-10, 'schoolgroup1', 'schoolgroup1');

insert into school (id, district_group_id, district_id, school_group_id, natural_id, name, embargo_enabled, update_import_id, updated, migrate_id, external_id) VALUES
  (-101, -10, -10, -10, 'schoolNat1', 'school1', 0, -1, '1997-07-18 20:14:34.000000', -1, 'externalId1'),
  (-102, -10, -10, null, 'schoolNat2', 'school2', 0, -1, '1997-07-18 20:14:34.000000', -1, 'externalId2'),
  (-201, -20, -20, null, 'schoolNat3', 'school3', 0, -1, '1997-07-18 20:14:34.000000', -1, 'externalId3'),
  (-301, null, -30, null, 'schoolNat4', 'school4', 0, -1, '1997-07-18 20:14:34.000000', -1, 'externalId4');

insert into school_year (year) values
  (1996),
  (1997),
  (1998);

insert into grade (id, code, name, sequence) values
  (-1, 'g1', 'grade1', 1),
  (-2, 'g2', 'grade2', 2),
  (-3, 'g3', 'grade3', 3);

insert into asmt (id, type_id, natural_id, grade_id, grade_code, subject_id, school_year, name, label, version,
                  claim1_score_code, claim2_score_code, claim3_score_code, claim4_score_code,
                  min_score, cut_point_1, cut_point_2, cut_point_3, max_score, update_import_id, updated, migrate_id) values
  (-1, 1, 'ica1', -1, 'g1', 1, 1997, 'ica1', 'ica1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 2, 'iab1', -1, 'g1', 1, 1997, 'iab1', 'iab1', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 3, 'sum1', -1, 'g1', 1, 1997, 'sum1', 'sum1', 'v1', 'sum_claim1', 'sum_claim2', 'sum_claim3', null, 1000, 2000, 3000, 4000, 5000, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 3, 'sum2', -1, 'g1', 2, 1997, 'sum2', 'sum2', 'v1', 'sum_claim1', 'sum_claim2', 'sum_claim3', null, 1000, 2000, 3000, 4000, 5000, -1, '1997-07-18 20:14:34.000000', -1),
  (-5, 1, 'ica1-1996', -1, 'g1', 1, 1996, 'ica1', 'ica1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-6, 1, 'ica1-1998', -1, 'g1', 1, 1996, 'ica1', 'ica1 new label', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1);

insert into instructional_resource (asmt_name, resource, org_level, performance_level, org_id) VALUES
  ('ica1', 'http://System/ica1/0', 'System', 0, null),
  ('ica1', 'http://State/ica1/0', 'State', 0, null),
  ('ica1', 'http://State/ica1/1', 'State', 1, null),
  ('iab1', 'http://DistrictGroup-10/iab1/0', 'DistrictGroup', 0, -10),
  ('iab1', 'http://DistrictGroup-10/iab1/1', 'DistrictGroup', 1, -10),
  ('iab1', 'http://DistrictGroup-20/iab1/0', 'DistrictGroup', 0, -20),
  ('sum1', 'http://District-10/sum1/0', 'District', 0, -10),
  ('sum1', 'http://District-20/sum1/0', 'District', 0, -20),
  ('sum1', 'http://District-30/sum1/0', 'District', 0, -30),
  ('sum2', 'http://SchoolGroup-10/sum2/0', 'SchoolGroup', 0, -10);