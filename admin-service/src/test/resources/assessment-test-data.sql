insert into school_year (year) values
  (1996),
  (1997),
  (1998);

insert into grade (id, code, name, sequence) values
  (-1, 'g1', 'grade1', 1),
  (-2, 'g2', 'grade2', 2),
  (-3, 'g3', 'grade3', 3);

insert into asmt (id, type_id, natural_id, grade_id, grade_code, subject_id, school_year, name, label, version,
                  claim1_score_code, claim2_score_code, claim3_score_code, claim4_score_code, claim5_score_code, claim6_score_code,
                  min_score, cut_point_1, cut_point_2, cut_point_3, cut_point_4, cut_point_5, max_score, update_import_id, updated, migrate_id) values
  (-1, 1, 'ica1', -1, 'g1', 1, 1997, 'ica1', 'ica1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', null, null, 100, 200, 300, 400, null, null, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 2, 'iab1', -1, 'g1', 1, 1997, 'iab1', 'iab1', 'v1', null, null, null, null, null, null, 1, null, 2, null, null, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 3, 'sum1', -1, 'g1', 1, 1997, 'sum1', 'sum1', 'v1', 'sum_claim1', 'sum_claim2', 'sum_claim3', null, null, null, 1000, 2000, 3000, 4000, null, null, 5000, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 3, 'sum2', -1, 'g1', 2, 1997, 'sum2', 'sum2', 'v1', 'sum_claim1', 'sum_claim2', 'sum_claim3', null, null, null, 1000, 2000, 3000, 4000, null, null, 5000, -1, '1997-07-18 20:14:34.000000', -1);