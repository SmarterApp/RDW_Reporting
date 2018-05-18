insert into district_group (id, natural_id, name) values
  (-9, 'districtNatgroup1', 'districtgroup1');

insert into district (id, natural_id, name) values
  (-10, 'districtNat1', 'district1');

insert into school_group (id, natural_id, name) values
  (-11, 'schoolgroupNat1', 'schoolgroup1'),
  (-20, 'schoolgroupNat2', 'schoolgroup2');

insert into school (id, district_group_id, district_id, school_group_id, natural_id, name, embargo_enabled, update_import_id, updated, migrate_id) VALUES
  (-10, -9, -10, -11, 'schoolNat1', 'school1', 0, -1, '1997-07-18 20:14:34.000000', -1),
  (-11, -9, -10, null, 'schoolNat2', 'school2', 0, -1, '1997-07-18 20:14:34.000000', -1),
  (-12, -9, -10, -20, 'schoolNat3', 'school3', 0, -1, '1997-07-18 20:14:34.000000', -1),
  (-13, -9, -10, -20, 'schoolNat4', 'school4', 0, -1, '1997-07-18 20:14:34.000000', -1);

insert into grade (id, code, name, sequence) values
  (-1, 'g1', 'grade1', 1),
  (-2, 'g2', 'grade2', 2);

insert into gender (id, code) values
  (-1, 'g1');

insert into school_year (year) values
  (1995),
  (1996),
  (1997),
  (1998);

insert into student (id, ssid, last_or_surname, first_name, gender_id, gender_code, birthday, inferred_school_id, update_import_id, updated, migrate_id) values
  (-1, 'student1_ssid', 'student1_lastName', 'student1_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -10, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 'student2_ssid', 'student2_lastName', 'student2_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -12, -1, '1997-07-18 20:14:34.000000', -1);

insert into asmt (id, type_id, natural_id, grade_id, grade_code, subject_id, school_year, name, label, version,
  claim1_score_code, claim2_score_code, claim3_score_code, claim4_score_code,
  min_score, cut_point_1, cut_point_2, cut_point_3, max_score, update_import_id, updated, migrate_id) values
  (-1, 1, 'ica1', -1, 'g1', 1, 1997, 'ica1', 'ica1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 2, 'iab1', -2, 'g2', 1, 1997, 'iab1', 'iab1', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 2, 'iab2', -1, 'g1', 1, 1996, 'iab2', 'iab2', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 2, 'iab3', -1, 'g1', 1, 1995, 'iab3', 'iab3', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-5, 1, 'ica2', -1, 'g1', 2, 1997, 'ica2', 'ica2', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-6, 2, 'iab4', -1, 'g1', 2, 1997, 'iab2', 'iab4', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-7, 2, 'iab5', -1, 'g1', 2, 1997, 'iab3', 'iab5', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-8, 3, 'sum1', -1, 'g1', 1, 1997, 'sum1', 'sum1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1);

-- mean values are intentionally unique here, the test relies on it
INSERT INTO percentile (id, asmt_id, start_date, end_date, count, mean, standard_deviation, min_score, max_score, update_import_id, updated, migrate_id) VALUES
  (1, -2, '1996-01-01', '1997-01-07', 1, 2410.1, 88.9, 1, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (2, -2, '2016-01-02', '2018-06-30', 1, 2420.5, 77.9, 1, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (3, -6, '1997-01-01', '1997-03-31', 1, 2430.1, 88.9, 1, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (4, -6, '1997-04-01', '2016-01-05', 1, 2440.5, 77.9, 1, 1, -1, '1997-07-18 20:14:34.000000', -1);

INSERT INTO percentile_score (percentile_id, percentile_rank, score, min_inclusive, max_exclusive) VALUES
-- note that score is irrelevant here
  (1,  5, 1, 1111, 2000),
  (1, 10, 1, 2000, 2322),
  (1, 20, 1, 2322, 2354),
  (1, 25, 1, 2354, 2368),
  (1, 90, 1, 2368, 2566),
  (1, 95, 1, 2566, 4444),
  (2,  5, 1, 1111, 2303), -- 2303 is the score of the exam, checking for max exclusive
  (2, 10, 1, 2303, 2322),
  (2, 15, 1, 2322, 2338),
  (2, 95, 1, 2338, 4444),
  (3,  5, 1, 1111, 2300),
  (3, 70, 1, 2300, 2485),
  (3, 75, 1, 2485, 2500),
  (3, 80, 1, 2500, 2517),
  (3, 85, 1, 2517, 2538),
  (3, 90, 1, 2538, 2566),
  (3, 95, 1, 2566, 4444),
  (4,  5, 1, 1111, 2300),
  (4, 10, 1, 2300, 2322),
  (4, 15, 1, 2322, 2338), -- 2322 is the score of the exam, checking for min inclusive
  (4, 80, 1, 2338, 2517),
  (4, 85, 1, 2517, 2538),
  (4, 90, 1, 2538, 2566),
  (4, 95, 1, 2566, 4444);

insert into claim (id, subject_id, code, name, description) values
  (-1, 1, 'c1', 'c1', 'c1');

insert into target (id, claim_id, code, description) values
  (-1, -1, 't1', 't1');

insert into math_practice (practice, description, code) values
  (-1, 'mp1', '-1');

insert into depth_of_knowledge (id, level, subject_id, description, reference) values
  (-1, 1, 1, 'dok1', 'dok1');

insert into item (id, natural_id, claim_id, claim_code, target_id, target_code, asmt_id, math_practice, math_practice_code, dok_id, dok_level_subject_id, difficulty_code, max_points, common_core_standard_ids) values
  (-1, '200-3391', -1, 'c1', -1, 't1', -1, -1, '-1', -1,'-1_1', 'E', 3, 'S-ID.1');

insert into exam (id, type_id, grade_id, grade_code, student_id, school_id, opportunity, migrant_status, iep, lep, section504, economic_disadvantage,
  school_year, asmt_id, asmt_version, completeness_code, administration_condition_code, session_id,
  scale_score, scale_score_std_err, performance_level, completed_at,
  claim1_category, claim1_scale_score, claim1_scale_score_std_err,
  claim2_category, claim2_scale_score, claim2_scale_score_std_err,
  claim3_category, claim3_scale_score, claim3_scale_score_std_err,
  claim4_category, claim4_scale_score, claim4_scale_score_std_err,
  available_accommodation_codes, elas_code, elas_start_at,
  update_import_id, updated, migrate_id) values
  (-1, 1, -2, 'g2', -1, -10, 0, null, 0, 0, 0, 0, 1997, -1, 'v1', 'Complete', 'Valid', 'session1', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, '123|456', 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 1, -1, 'g1', -1, -10, 0, null, 0, 0, 0, 0, 1996, -1, 'v1', 'Complete', 'Valid', 'session2', 2000, 20, 1, '2016-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 2, -2, 'g2', -1, -10, 1, null, 0, 0, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session3', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 2, -2, 'g2', -1, -10, 1, null, 0, 0, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session4', 2303, 21, 2, '2016-01-02 02:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-5, 2, -2, 'g2', -1, -10, 1, null, 0, 0, 0, 0, 1997, -3, 'v1', 'Complete', 'Valid', 'session5', 2100, 21, 2, '1997-01-03 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-6, 2, -2, 'g2', -1, -10, 1, null, 0, 0, 0, 0, 1997, -3, 'v1', 'Complete', 'Valid', 'session6', 2100, 21, 2, '1997-01-04 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-7, 2, -1, 'g1', -1, -10, 1, null, 0, 0, 0, 0, 1996, -4, 'v1', 'Complete', 'Valid', 'session7', 2100, 21, 2, '1997-01-05 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-8, 2, -1, 'g1', -1, -10, 1, null, 0, 0, 0, 0, 1996, -4, 'v1', 'Complete', 'Valid', 'session8', 2100, 21, 2, '1997-01-06 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-9, 1, -2, 'g2', -1, -10, 0, null, 0, 0, 0, 0, 1997, -5, 'v1', 'Complete', 'Valid', 'session9', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-10, 2, -1, 'g1', -1, -10, 1, null, 0, 0, 0, 0, 1997, -6, 'v1', 'Complete', 'Valid', 'session10', 2100, 21, 2, '1997-01-05 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-11, 2, -1, 'g1', -1, -10, 1, null, 0, 0, 0, 0, 1997, -7, 'v1', 'Complete', 'Valid', 'session11', 2100, 21, 2, '1997-01-06 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-12, 1, -2, 'g2', -2, -10, 0, null, 0, 0, 0, 0, 1997, -5, 'v1', 'Complete', 'Valid', 'session9', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-13, 2, -1, 'g1', -2, -10, 1, null, 0, 0, 0, 0, 1997, -6, 'v1', 'Complete', 'Valid', 'session10', 2322, 21, 2, '2016-01-05 02:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-14, 2, -1, 'g1', -2, -10, 1, null, 0, 0, 0, 0, 1997, -7, 'v1', 'Complete', 'Valid', 'session11', 2100, 21, 2, '1997-01-06 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-15, 1, -1, 'g1', -2, -10, 0, null, 0, 0, 0, 0, 1997, -1, 'v1', 'Complete', 'Valid', 'session2', 2000, 20, 1, '2016-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-16, 2, -2, 'g2', -2, -10, 1, null, 0, 0, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session3', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-17, 2, -2, 'g2', -2, -11, 1, null, 0, 1, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session3', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, 'TDS_BT_UCT|NEA0|NEA_Abacus', 'RFEP', '1996-08-01', -1, '1997-07-18 20:14:34.000000', -1),
  (-18, 2, -2, 'g2', -2, -12, 1, null, 0, 0, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session3', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1),
  (-19, 3, -2, 'g2', -2, -10, 0, null, 0, 0, 0, 0, 1997, -8, 'v1', 'Complete', 'Valid', 'session12', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, null, 'EO', null, -1, '1997-07-18 20:14:34.000000', -1);

-- groups
insert into student_group (id, name, school_id, school_year, subject_id, update_import_id, updated, migrate_id) values
  (-10, 'group1', -10, 1997, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (-20, 'group2', -10, 1997, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-30, 'group3', -10, 1997, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-40, 'group4', -10, 1997, null, -1, '1997-07-18 20:14:34.000000', -1);

insert into student_group_membership (student_group_id, student_id) values
  (-10, -1),
  (-20, -1),
  (-30, -1),
  (-40, -2);

insert into user_student_group(student_group_id, user_login) values
  (-10, 'someone@somewhere.com'),
  (-20, 'someone@somewhere.com'),
  (-30, 'someoneelse@somewhere.com'),
  (-40, 'someone@somewhere.com');

insert into ethnicity (id, code) values
  (8, 'Filipino');

insert into student_ethnicity (ethnicity_id, ethnicity_code, student_id) values
  (8, 'Filipino', -2);

-- transfer student test data
insert into student (id, ssid, last_or_surname, first_name, gender_id, gender_code,
                     birthday, inferred_school_id, update_import_id, updated, migrate_id) values
  (-100, 'transfer_1', 'from_school3', 'to_school4', -1, 'g1', '1997-01-01 00:00:00.000000', -13, -1, '1997-07-18 20:14:34.000000', -1);

insert into exam (id, type_id, grade_id, grade_code, student_id, school_id, opportunity, iep, lep, section504, economic_disadvantage,
                  school_year, asmt_id, asmt_version, completeness_code, administration_condition_code, session_id,
                  scale_score, scale_score_std_err, performance_level, completed_at,
                  claim1_category, claim1_scale_score, claim1_scale_score_std_err,
                  claim2_category, claim2_scale_score, claim2_scale_score_std_err,
                  claim3_category, claim3_scale_score, claim3_scale_score_std_err,
                  claim4_category, claim4_scale_score, claim4_scale_score_std_err,
                  update_import_id, updated, migrate_id) values
  (-100, 1, -1, 'g1', -100, -12, 0, 0, 0, 0, 0, 1998, -1, 'v1', 'Complete', 'Valid', 'session1', 2000, 20, 1, '1998-10-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-101, 2, -1, 'g1', -100, -12, 1, 0, 0, 0, 0, 1998, -3, 'v1', 'Complete', 'Valid', 'session1', 2100, 21, 2, '1998-10-02 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-102, 1, -1, 'g1', -100, -13, 0, 0, 0, 0, 0, 1998, -5, 'v1', 'Complete', 'Valid', 'session1', 2000, 20, 1, '1999-02-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-103, 2, -1, 'g1', -100, -13, 1, 0, 0, 0, 0, 1998, -6, 'v1', 'Complete', 'Valid', 'session1', 2100, 21, 2, '1999-02-02 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1);

insert into exam_item (id, exam_id, item_id, score, position, response) values
  (-100, -100, -1, 0, 1, 'A'),
  (-101, -101, -1, 1, 1, 'D'),
  (-102, -102, -1, 0, 1, 'A'),
  (-103, -103, -1, 1, 1, 'D');

insert into student_group (id, name, school_id, school_year, subject_id, update_import_id, updated, migrate_id) values
  (-100, 'transfer groupSomeone', -13, 1998, null, -1, '1997-07-18 20:14:34.000000', -1);

insert into student_group_membership (student_group_id, student_id) values
  (-100, -100);

insert into user_student_group(student_group_id, user_login) values
   (-100, 'someone@somewhere.com');
