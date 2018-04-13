insert into school_group (id, natural_id, name) values
  (-10, 'schoolGroup1', 'schoolGroup1'),
  (-40, 'schoolGroup4', 'schoolGroup4');

insert into district_group (id, natural_id, name) values
  (-10, 'districtGroup1', 'districtGroup1'),
  (-20, 'districtGroup2', 'districtGroup2'),
  (-40, 'districtGroup4', 'districtGroup4');

insert into district (id, natural_id, name) values
  (-10, 'districtNat1', 'district1'),
  (-20, 'districtNat2', 'district2'),
  (-30, 'districtNat3', 'district3');

insert into school (id, district_id, natural_id, name, embargo_enabled, update_import_id, updated, migrate_id, school_group_id, district_group_id, external_id) VALUES
  (-10, -10, 'schoolNat1', 'school1', 1, -1, '1997-07-18 20:14:34.000000', -1, null, -40, 'externalId1'),
  (-20, -10, 'schoolNat2', 'school2', 1, -1, '1997-07-18 20:14:34.000000', -1, -10, -10, 'externalId2'),
  (-30, -20, 'schoolNat3', 'school3', 1, -1, '1997-07-18 20:14:34.000000', -1, null, -20, 'externalId3'),
  (-40, -30, 'schoolNat4', 'school4', 1, -1, '1997-07-18 20:14:34.000000', -1, -40, -40, 'externalId4');

insert into grade (id, code, name) values
  (-1, 'g1', 'grade1'),
  (-2, 'g2', 'grade2'),
  (-3, 'g3', 'grade3');

insert into gender (id, code) values
  (-1, 'g1');

insert into school_year (year) values
  (1996),
  (1997),
  (1998);

insert into student (id, ssid, last_or_surname, first_name, gender_id, gender_code, birthday, inferred_school_id, update_import_id, updated, migrate_id) values
  (-1, 'student1_ssid', 'student1_lastName', 'student1_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -10, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 'student2_ssid', 'student2_lastName', 'student2_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -20, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 'student3_ssid', 'student3_lastName', 'student3_firstName', -1, 'g1', '1997-01-01 00:00:00.000000', -10, -1, '1997-07-18 20:14:34.000000', -1);

insert into asmt (id, type_id, natural_id, grade_id, grade_code, subject_id, school_year, name, label, version,
  claim1_score_code, claim2_score_code, claim3_score_code, claim4_score_code,
  min_score, cut_point_1, cut_point_2, cut_point_3, max_score, update_import_id, updated, migrate_id) values
  (-1, 1, 'ica1', -1, 'g1', 1, 1997, 'ica1', 'ica1', 'v1', 'ica_claim1', 'ica_claim2', 'ica_claim3', 'ica_claim4', 100, 200, 300, 400, 500, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 2, 'iab1', -1, 'g1', 1, 1997, 'iab1', 'iab1', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 3, 'sum1', -1, 'g1', 1, 1997, 'sum1', 'sum1', 'v1', 'sum_claim1', 'sum_claim2', 'sum_claim3', null, 1000, 2000, 3000, 4000, 5000, -1, '1997-07-18 20:14:34.000000', -1),
  (-4, 3, 'sum2', -1, 'g1', 2, 1997, 'sum2', 'sum2', 'v1', 'sum_claim1', 'sum_claim2', 'sum_claim3', null, 1000, 2000, 3000, 4000, 5000, -1, '1997-07-18 20:14:34.000000', -1),
  (-6, 2, 'iab4', -1, 'g1', 2, 1997, 'iab2', 'iab4', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1),
  (-7, 2, 'iab5', -1, 'g1', 2, 1997, 'iab3', 'iab5', 'v1', null, null, null, null, 1, null, 2, null, 3, -1, '1997-07-18 20:14:34.000000', -1);

INSERT INTO percentile (id, asmt_id, start_date, end_date, count, mean, standard_deviation, min_score, max_score, update_import_id, updated, migrate_id) VALUES
  (1, -2, '1996-01-01', '1997-01-07', 11, 2410.1, 88.9, 1, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (2, -2, '2016-01-02', '2018-06-30', 22, 2420.6, 77.9, 1, 1, -1, '1997-07-18 20:14:34.000000', -1);

INSERT INTO percentile_score (percentile_id, percentile_rank, score, min_inclusive, max_exclusive) VALUES
  (1,  5, 1113, 1111, 2000),
  (1, 10, 2003, 2000, 2322),
  (1, 20, 2325, 2322, 2354),
  (1, 25, 2358, 2354, 2368),
  (1, 90, 2370, 2368, 2566),
  (1, 95, 2577.8, 2566, 4444),
  (2,  5, 1121, 1111, 2303),
  (2, 10, 2313, 2303, 2322),
  (2, 15, 2332, 2322, 2338),
  (2, 95, 2358, 2338, 4444);

insert into exam (id, type_id, grade_id, grade_code, student_id, school_id, opportunity, iep, lep, section504, economic_disadvantage,
  school_year, asmt_id, asmt_version, completeness_code, administration_condition_code, session_id,
  scale_score, scale_score_std_err, performance_level, completed_at,
  claim1_category, claim1_scale_score, claim1_scale_score_std_err,
  claim2_category, claim2_scale_score, claim2_scale_score_std_err,
  claim3_category, claim3_scale_score, claim3_scale_score_std_err,
  claim4_category, claim4_scale_score, claim4_scale_score_std_err,
  update_import_id, updated, migrate_id) values
  (-1, 1, -1, 'g1', -1, -10, 0, 0, 0, 0, 0, 1997, -1, 'v1', 'Complete', 'Valid', 'session1', 2000, 20, 1, '1997-01-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-2, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session2', 2100, 21, 2, '1997-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-3, 3, -3, 'g3', -1, -20, 2, 0, 0, 0, 0, 1997, -3, 'v1', 'Complete', 'Valid', 'session3', 2200, 22, 3, '1997-01-01 00:00:00.000000', 1, 1000, 100, 2, 2000, 200, 3, 3000, 300, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-4, 3, -1, 'g1', -1, -30, 3, 0, 0, 0, 0, 1997, -3, 'v1', 'Complete', 'Valid', 'session4', 2300, 23, 1, '1997-01-02 00:00:00.000000', 1, 1100, 110, 2, 2100, 210, 3, 3100, 310, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-5, 3, -1, 'g1', -1, -30, 4, 0, 0, 0, 0, 1997, -3, 'v1', 'Complete', 'Valid', 'session5', 2400, 24, 2, '1997-01-05 00:00:00.000000', 1, 1200, 120, 2, 2200, 220, 3, 3200, 320, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-6, 3, -1, 'g1', -1, -30, null, 1, 1, 1, 1, 1997, -3, 'v1', 'Partial', 'Standardized', 'session6', null, null, null, '1997-01-03 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-7, 3, -1, 'g1', -2, -30, null, 1, 1, 1, 1, 1997, -4, 'v1', 'Partial', 'Standardized', 'session6', null, null, null, '1997-01-03 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-17, 3, -1, 'g1', -2, -30, null, 1, 1, 1, 1, 1997, -1, 'v1', 'Partial', 'Standardized', 'session6', null, null, null, '1997-01-04 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-8, 3, -1, 'g1', -1, -30, null, 1, 1, 1, 1, 1997, -4, 'v1', 'Partial', 'Standardized', 'session6', null, null, null, '1997-01-03 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-06-18 20:14:34.000000', -1),
  (-20, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1997, -2, 'v1', 'Complete', 'Valid', 'session2', 2500, 25, 2, '1996-12-31 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1),
  (-21, 2, -2, 'g2', -1, -10, 1, 0, 0, 0, 0, 1998, -2, 'v1', 'Complete', 'Valid', 'session2', 2500, 25, 2, '1998-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1998-07-18 20:14:34.000000', -1);

-- items

insert into claim (id, subject_id, code, name, description) values
  (-1, 1, 'c1', 'c1', 'c1');

insert into target (id, claim_id, code, description) values
  (-1, -1, 't1', 't1'),
  (-2, -1, 't2', 't2'),
  (-3, -1, 't3', 't3');

insert into math_practice (practice, description, code) values
  (-1, 'mp1', '-1');

insert into depth_of_knowledge (id, level, subject_id, description, reference) values
  (-1, 1, 1, 'dok1', 'dok1');

insert into item (id, natural_id, claim_id, claim_code, target_id, target_code, asmt_id, math_practice, math_practice_code, dok_id, dok_level_subject_id, difficulty_code, max_points, common_core_standard_ids, answer_key, options_count, type, performance_task_writing_type) values
  (-1, '200-3391', -1, 'c1', -1, 't1', -1, -1, '-1', -1,'-1_1', 'E', 3, 'S-ID.1','C',3,'MS',null),
  (-2, '200-3392', -1, 'c1', -2, 't2', -1, -1, '-1', -1, '-1_1', 'D', 4, 'S-ID.3',null,null,'EQ',null),
  (-3, '200-3393', -1, 'c1', -3, 't3', -1, -1, '-1', -1, '-1_1', 'M', 5, 'S-ID.4|S-ID.7','B',2,'MC',null),
  (-4, '200-3394', -1, 'c1', -3, 't3', -4, -1, '-1', -1, '-1_1', 'M', 5, 'S-ID.4|S-ID.7','D',4,'MC',null),
  (-5, '200-3395', -1, 'c1', -3, 't3', -4, -1, '-1', -1, '-1_1', 'M', 5, 'S-ID.4|S-ID.7','A',5,'MS',null),
  (-6, '200-3396', -1, 'c1', -3, 't3', -4, -1, '-1', -1, '-1_1', 'M', 5, 'S-ID.4|S-ID.7','B',5,'MC',null),
  (-7, '200-3397', -1, 'c1', -3, 't3', -1, -1, '-1', -1, '-1_1', 'M', 5, 'S-ID.4|S-ID.7','Hand',null,'WER','Narrative'),
  (-8, '200-3398', -1, 'c1', -3, 't3', -4, -1, '-1', -1, '-1_1', 'M', 5, 'S-ID.4|S-ID.7','Hand',null,'WER','Opinion');

insert into exam_item (id, exam_id, item_id, score, position, response, trait_evidence_elaboration_score, trait_organization_purpose_score, trait_conventions_score) values
  (-1, -1, -1, 0, 1, 'A', null, null, null),
  (-2, -1, -2, 1, 2, 'D', 2, 3, 1),
  (-3, -8, -1, 0, 1, 'A', null, null, null),
  (-4, -8, -2, 1, 2, 'D', 2, 3, 1);

insert into common_core_standard (id, natural_id, subject_id, description) values
  (-1, 'ABC.223.1', 1, 'test-description1'),
  (-2, 'DEF.224.1', 1, 'test-description2'),
  (-3, 'GHI.225.1', 1, 'test-description3'),
  (-4, 'JKL.226.1', 1, 'test-description4');

insert into item_common_core_standard (item_id, common_core_standard_id) values
  (-1, -1),
  (-1, -2),
  (-1, -3),
  (-2, -1),
  (-3, -4);

-- groups
insert into student_group (id, name, school_id, school_year, subject_id, update_import_id, updated, migrate_id) values
  (-10, 'group1', -10, 1997, 1, -1, '1997-07-18 20:14:34.000000', -1),
  (-20, 'group_ela', -10, 1997, 2, -1, '1997-07-18 20:14:34.000000', -1),
  (-30, 'group_all', -10, 1997, null, -1, '1997-07-18 20:14:34.000000', -1);

insert into student_group_membership (student_group_id, student_id) values
  (-10, -1),
  (-20, -2),
  (-30, -2);

insert into user_student_group(student_group_id, user_login) values
   (-10, 'someone-10@somewhere.com'),
   (-30, 'someone-10@somewhere.com'),
   (-20, 'someone-20@somewhere.com');

-- transfer student test data
insert into student (id, ssid, last_or_surname, first_name, gender_id, gender_code,
                     birthday, inferred_school_id, update_import_id, updated, migrate_id) values
  (-100, 'transfer_1', 'from_school3', 'to_school4', -1, 'g1', '1997-01-01 00:00:00.000000', -40, -1, '1997-07-18 20:14:34.000000', -1);

insert into exam (id, type_id, grade_id, grade_code, student_id, school_id, opportunity, iep, lep, section504, economic_disadvantage,
                  school_year, asmt_id, asmt_version, completeness_code, administration_condition_code, session_id,
                  scale_score, scale_score_std_err, performance_level, completed_at,
                  claim1_category, claim1_scale_score, claim1_scale_score_std_err,
                  claim2_category, claim2_scale_score, claim2_scale_score_std_err,
                  claim3_category, claim3_scale_score, claim3_scale_score_std_err,
                  claim4_category, claim4_scale_score, claim4_scale_score_std_err,
                  update_import_id, updated, migrate_id) values
  (-100, 1, -1, 'g1', -100, -30, 0, 0, 0, 0, 0, 1998, -1, 'v1', 'Complete', 'Valid', 'session1', 2000, 20, 1, '1998-10-01 00:00:00.000000', 1, 100, 10, 2, 200, 20, 3, 300, 30, 4, 400, 40, -1, '1997-07-18 20:14:34.000000', -1),
  (-101, 2, -1, 'g2', -100, -40, 1, 0, 0, 0, 0, 1998, -2, 'v1', 'Complete', 'Valid', 'session1', 2100, 21, 2, '1999-01-01 00:00:00.000000', null, null, null, null, null, null, null, null, null, null, null, null, -1, '1997-07-18 20:14:34.000000', -1);

insert into exam_item (id, exam_id, item_id, score, position, response, trait_evidence_elaboration_score, trait_organization_purpose_score, trait_conventions_score) values
  (-100, -100, -1, 0, 1, 'A', null, null, null),
  (-101, -101, -1, 1, 1, 'D', 3, 4, 1);

insert into student_group (id, name, school_id, school_year, subject_id, update_import_id, updated, migrate_id) values
  (-100, 'transfer group', -40, 1998, 1, -1, '1997-07-18 20:14:34.000000', -1);

insert into student_group_membership (student_group_id, student_id) values
  (-100, -100);

insert into user_student_group(student_group_id, user_login) values
   (-100, 'someone-10@somewhere.com');