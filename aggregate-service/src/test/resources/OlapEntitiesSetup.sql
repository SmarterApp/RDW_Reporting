INSERT INTO grade (id, code) VALUES (-9,'-9'),(-8 ,'-8'),(-5, '-5'),(-6, '-6');
INSERT INTO completeness (id, code) VALUES (-9, 'Complete'), (-8, 'Partial');
INSERT INTO administration_condition VALUES (-9,'IN'),(-8,'SD'),(-97,'IN'),(-96,'Valid');
INSERT INTO ethnicity VALUES (-9,'ethnicity-9'),(-8,'ethnicity-8');
INSERT INTO gender VALUES (-9,'gender-9'),(-8,'gender-8');
INSERT INTO school_year VALUES (1999),(2000),(2001);

-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name, natural_id, external_id, migrate_id) VALUES
  (-7, 'District-7', 'id-7', 'externalId-7', -1),
  (-8, 'District-8', 'id-8', 'externalId-8', -1),
  (-9, 'District-9', 'id-9', 'externalId-9', -1);

INSERT INTO school (id, district_group_id, district_id, school_group_id, name, natural_id, external_id, embargo_enabled, updated, update_import_id, migrate_id) VALUES
  (-7, -1, -7, -1, 'School-7', 'id-7', 'externalId-7', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, -1, -8, -1, 'School-8', 'id-8', 'externalId-8', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, -1, -9, -1, 'School-9', 'id-9', 'externalId-9', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-10, -1, -9, -1, 'School-10','id-10', 'externalId-10', 1, '2016-08-14 19:05:33.000000', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO asmt (id, grade_id, subject_id, type_id, school_year, name, label, updated, update_import_id, migrate_id) VALUES
  (-6, -5, 2, 1, 1888, 'asmt-6', 'asmt-6', '2016-08-14 19:05:33.000000', -1, -1),
  (-5, -5, 1, 1, 1888, 'asmt-5', 'asmt-5', '2016-08-14 19:05:33.000000', -1, -1),
  (-8,  -8, 1, 1, 1999, 'asmt-8','asmt-8', '2016-08-14 19:05:33.000000', -1, -1),
  (-18,  -8, 1, 1, 2000, 'asmt-8','asmt-8', '2016-08-14 19:05:33.000000', -1, -1),
  (-9,  -9, 2, 1, 1888, 'asmt-9', 'asmt-9', '2016-08-14 19:05:33.000000', -1, -1),
  (-10, -9, 2, 1, 1888, 'asmt-9-again','asmt-9-again',' 2016-08-14 19:05:33.000000', -1, -1),
  (-11, -9, 2, 3, 1888, 'asmt-11', 'asmt-11', '2016-08-14 19:05:33.000000', -1, -1);

INSERT INTO asmt_active_year(asmt_id, school_year) VALUES
   (-18, 2000),
   (-11, 1888),
   (-11, 1999),
   (-10, 1888),
   (-9,  1888),
   (-9,  1999),
   (-9,  2000),
   (-8,  1999),
   (-6,  1888),
   (-5,  1888);

-- ------------------------------------------ Student and Groups  ------------------------------------------------------------------------------------------------
INSERT INTO student (id, gender_id, updated, update_import_id, migrate_id) VALUES
  (-5, -8, '2016-08-14 19:05:33.000000', -1, -1),
  (-6, -8, '2016-08-14 19:05:33.000000', -1, -1),
  (-7, -9, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, -9, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, -9, '2016-08-14 19:05:33.000000', -1, -1);

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
                                    completed_at, updated, update_import_id, migrate_id) VALUES
  (-5, 1999, -8, -8, -8, -8, 1, 2500, 25, -8, -5, -8, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-6, 1999, -8, -8, -9, -8, 2, 2400, 24, -8, -6, -8, 0, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-7, 1999, -8, -8, -9, -9, 3, 2300, 23, -5, -8, -8, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-8, 1999, -8, -8, -9, -9, 4, 2100, 21, -8, -9, -9, 0, 1, 2, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-9, 1999, -8, -8, -9, -9, 1, 2000, 20, -8, -9, -10, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-10, 1999, -9, -9, -9, -9, 1, 2000, 20, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-20, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-21, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-22, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-23, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-35, 1999, -11, -9, -9, -9, 1, 2500, 25, -8, -5, -8, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-36, 1999, -11, -9, -9, -9, 2, 2400, 24, -8, -6, -8, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-37, 1999, -11, -9, -9, -9, 3, 2300, 23, -8, -8, -8, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-38, 1999, -11, -9, -9, -9, 4, 2100, 21, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-39, 1999, -11, -9, -9, -9, 1, 2000, 20, -8, -9, -10, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-40, 1999, -11, -9, -9, -9, 1, 2000, 20, -8, -9, -9, 1, 1, 0, 0, 1,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1);

