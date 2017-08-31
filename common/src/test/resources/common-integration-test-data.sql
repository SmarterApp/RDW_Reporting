insert into district (id, natural_id, name) values
  (-10, 'district1', 'district1');

insert into school (id, district_id, natural_id, name, import_id, updated, migrate_id) VALUES
  (-10, -10, 'school1', 'school1', -1, '1997-07-18 20:14:34.000000', -1);

insert into grade (id, code, name) values
  (-1, 'g1', 'grade1'),
  (-2, 'g2', 'grade2');

insert into gender (id, code) values
  (-1, 'g1');

insert into school_year (year) values
  (1995),
  (1996),
  (1997);

insert into student (id, ssid, last_or_surname, first_name, gender_id, gender_code, birthday, import_id, updated, migrate_id) values
  (-1, 'student1_ssid', 'student1_lastName', 'student1_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 'student2_ssid', 'student2_lastName', 'student2_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -1, '1997-07-18 20:14:34.000000', -1);

insert into asmt (id, type_id, natural_id, grade_id, grade_code, subject_id, school_year, name, label, version,
  claim1_score_code, claim2_score_code, claim3_score_code, claim4_score_code,
  min_score, cut_point_1, cut_point_2, cut_point_3, max_score, import_id, updated, migrate_id) values
  (-1, 1, 'ica1', -1, 'g1', 1, 1997, 'ica1', 'ica1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 2, 'iab1', -2, 'g2', 1, 1997, 'iab1', 'iab1', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 2, 'iab2', -1, 'g1', 1, 1996, 'iab2', 'iab2', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 2, 'iab3', -1, 'g1', 1, 1995, 'iab3', 'iab3', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-5, 1, 'ica2', -1, 'g1', 2, 1997, 'ica2', 'ica2', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-6, 2, 'iab4', -1, 'g1', 2, 1997, 'iab2', 'iab4', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-7, 2, 'iab5', -1, 'g1', 2, 1997, 'iab3', 'iab5', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1);

insert into exam (id, type_id, grade_id, grade_code, student_id, school_id, opportunity, iep, lep, section504, economic_disadvantage,
  school_year, asmt_id, asmt_version, completeness_id, completeness_code, administration_condition_id, administration_condition_code, session_id,
  scale_score, scale_score_std_err, performance_level, completed_at,
  claim1_category, claim1_scale_score, claim1_scale_score_std_err,
  claim2_category, claim2_scale_score, claim2_scale_score_std_err,
  claim3_category, claim3_scale_score, claim3_scale_score_std_err,
  claim4_category, claim4_scale_score, claim4_scale_score_std_err,
  import_id, updated, migrate_id) values
  (-1, 1, -2, 'g2', -1, -10, 0, 0, 0, 0, 0, 1997, -1, 'v1', 2, 'Complete', 1, 'Valid', 'session1', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 1, -1, 'g1', -1, -10, 0, 0, 0, 0, 0, 1996, -1, 'v1', 2, 'Complete', 1, 'Valid', 'session2', 2000, 20, 1, '2016-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1997, -2, 'v1', 2, 'Complete', 1, 'Valid', 'session3', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1997, -2, 'v1', 2, 'Complete', 1, 'Valid', 'session4', 2100, 21, 2, '1997-01-02 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-5, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1997, -3, 'v1', 2, 'Complete', 1, 'Valid', 'session5', 2100, 21, 2, '1997-01-03 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-6, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1997, -3, 'v1', 2, 'Complete', 1, 'Valid', 'session6', 2100, 21, 2, '1997-01-04 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-7, 2, -1, 'g1', -1, -10, 1, 0, 0, 0, 0, 1996, -4, 'v1', 2, 'Complete', 1, 'Valid', 'session7', 2100, 21, 2, '1997-01-05 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-8, 2, -1, 'g1', -1, -10, 1, 0, 0, 0, 0, 1996, -4, 'v1', 2, 'Complete', 1, 'Valid', 'session8', 2100, 21, 2, '1997-01-06 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-9, 1, -2, 'g2', -1, -10, 0, 0, 0, 0, 0, 1997, -5, 'v1', 2, 'Complete', 1, 'Valid', 'session9', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-10, 2, -1, 'g1', -1, -10, 1, 0, 0, 0, 0, 1997, -6, 'v1', 2, 'Complete', 1, 'Valid', 'session10', 2100, 21, 2, '1997-01-05 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-11, 2, -1, 'g1', -1, -10, 1, 0, 0, 0, 0, 1997, -7, 'v1', 2, 'Complete', 1, 'Valid', 'session11', 2100, 21, 2, '1997-01-06 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-12, 1, -2, 'g2', -2, -10, 0, 0, 0, 0, 0, 1997, -5, 'v1', 2, 'Complete', 1, 'Valid', 'session9', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-13, 2, -1, 'g1', -2, -10, 1, 0, 0, 0, 0, 1997, -6, 'v1', 2, 'Complete', 1, 'Valid', 'session10', 2100, 21, 2, '1997-01-05 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-14, 2, -1, 'g1', -2, -10, 1, 0, 0, 0, 0, 1997, -7, 'v1', 2, 'Complete', 1, 'Valid', 'session11', 2100, 21, 2, '1997-01-06 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-15, 1, -1, 'g1', -2, -10, 0, 0, 0, 0, 0, 1997, -1, 'v1', 2, 'Complete', 1, 'Valid', 'session2', 2000, 20, 1, '2016-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-16, 2, -2, 'g2', -2, -10, 1, 0, 0, 0, 0, 1997, -2, 'v1', 2, 'Complete', 1, 'Valid', 'session3', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1);

-- groups
insert into student_group (id, name, school_id, school_year, subject_id, import_id, updated, migrate_id) values
  (-10, 'group1', -10, 1997, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (-20, 'group2', -10, 1997, null, -1, '1997-07-18 20:14:34.000000', -1);

insert into student_group_membership (student_group_id, student_id) values
  (-10, -1),
  (-20, -1);
