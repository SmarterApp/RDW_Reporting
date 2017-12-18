INSERT INTO grade (id, code, name) VALUES (-9,'-9','grade-9'),(-8 ,'-8','grade-8'),(-5, '-5', 'grade-5'),(-6, '-6', 'grade-6');
INSERT INTO completeness (id, code) VALUES (-9, 'c_code-9'), (-8, 'c_code-8');
INSERT INTO administration_condition VALUES (-9,'ac_code-9'),(-8,'cc_code-8'),(-97,'cc_code-97'),(-96,'cc_code-96t');
INSERT INTO ethnicity VALUES (-9,'ethnicity-9'),(-8,'ethnicity-8');
INSERT INTO gender VALUES (-9,'gender-9'),(-8,'gender-8');
INSERT INTO school_year VALUES (1999),(2000),(2001);

-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name) VALUES
  (-7, 'District-7'),
  (-8, 'District-8'),
  (-9, 'District-9');

INSERT INTO school (id, district_id, name, update_import_id, migrate_id) VALUES
  (-7, -7, 'School-7', -1, -1),
  (-8, -8, 'School-8', -1, -1),
  (-9, -9, 'School-9', -1, -1),
  (-10, -9, 'School-10', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO asmt (id, grade_id, subject_id, type_id, school_year, name, update_import_id, migrate_id) VALUES
  (-6, -5, 2, 1, 1888, 'asmt-6', -1, -1),
  (-5, -5, 1, 1, 1888, 'asmt-5', -1, -1),
  (-8,  -8, 1, 1, 1888, 'asmt-8', -1, -1),
  (-9,  -9, 2, 1, 1888, 'asmt-9', -1, -1),
  (-10, -9, 2, 1, 1888, 'asmt-9-again', -1, -1),
  (-11, -9, 2, 2, 1888, 'asmt-11', -1, -1);

-- ------------------------------------------ Student and Groups  ------------------------------------------------------------------------------------------------
INSERT INTO student (id, gender_id, update_import_id, migrate_id) VALUES
  (-5, -8, -1, -1),
  (-6, -8, -1, -1),
  (-7, -9, -1, -1),
  (-8, -9, -1, -1),
  (-9, -9, -1, -1);

INSERT INTO student_ethnicity(student_id, ethnicity_id) values
  (-8,  -8),
  (-8,  -9),
  (-9,  -9);

-- ------------------------------------------ Exams ---------------------------------------------------------------------------------------------
INSERT INTO  fact_student_exam (id, school_year, asmt_id, asmt_grade_id, completeness_id,
                                    administration_condition_id, performance_level,
                                    scale_score, scale_score_std_err, grade_id, student_id, school_id,
                                    iep, lep, section504, economic_disadvantage, migrant_status,
                                    claim1_scale_score, claim1_scale_score_std_err,claim1_category,
                                    claim2_scale_score, claim2_scale_score_std_err,claim2_category,
                                    claim3_scale_score, claim3_scale_score_std_err,claim3_category,
                                    claim4_scale_score, claim4_scale_score_std_err,claim4_category,
                                    completed_at, update_import_id, migrate_id) VALUES
  (-5, 1999, -8, -8, -9, -9, 1, 2500, 25, -8, -5, -8, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-6, 1999, -8, -8, -9, -9, 2, 2400, 24, -8, -6, -8, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-7, 1999, -8, -8, -9, -9, 3, 2300, 23, -8, -8, -8, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, 1999, -8, -8, -9, -9, 4, 2100, 21, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, 1999, -8, -8, -9, -9, 1, 2000, 20, -8, -9, -10, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-10, 1999, -9, -9, -9, -9, 1, 2000, 20, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),

  (-20, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-21, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-22, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-23, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),

  -- NOTE: we should not have two assessments for the same asmt_type/subject/grade and exam school year, but since we have no way to enforce it we need to test that we report correctly
  (-34, 2000 , -10, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1);
