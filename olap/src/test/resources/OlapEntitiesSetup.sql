-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name) VALUES
  (-98, 'District-98'),
  (-99, 'District-99');

INSERT INTO school (id, district_id, name, update_import_id, migrate_id) VALUES
  (-98, -98, 'School-98', -1, -1),
  (-99, -99, 'School-99', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO ica_asmt (id, grade_id, subject_id, school_year, name, update_import_id, migrate_id) VALUES
   (-98, -98, 1, 1999, 'asmt-98', -1, -1),
   (-99, -99, 1, 1999, 'asmt-99', -1, -1);

-- ------------------------------------------ Student and Groups  ------------------------------------------------------------------------------------------------
INSERT INTO student (id, gender_id, update_import_id, migrate_id) VALUES
   (-95, -98, -1, -1),
   (-96, -98, -1, -1),
   (-97, -99, -1, -1),
   (-98, -99, -1, -1),
   (-99, -99, -1, -1);

INSERT INTO student_ethnicity(student_id, ethnicity_id) values
    (-98,  -98);

-- ------------------------------------------ Exams ---------------------------------------------------------------------------------------------
INSERT INTO  fact_student_ica_exam (id, school_year, asmt_id, asmt_grade_id, completeness_id,
                                    administration_condition_id, performance_level,
                                    scale_score, scale_score_std_err, grade_id, student_id, school_id,
                                    iep, lep, section504, economic_disadvantage, migrant_status,
                                    claim1_scale_score, claim1_scale_score_std_err,claim1_category,
                                    claim2_scale_score, claim2_scale_score_std_err,claim2_category,
                                    claim3_scale_score, claim3_scale_score_std_err,claim3_category,
                                    claim4_scale_score, claim4_scale_score_std_err,claim4_category,
                                    completed_at, update_import_id, migrate_id) VALUES
  (-95, 1999, -98, -98, -99, -99, 1, 2500, 0.17, -98, -98, -98, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-96, 1999, -98, -98, -99, -99, 1, 2400, 0.17, -98, -98, -98, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-97, 1999, -98, -98, -99, -99, 1, 2300, 0.17, -98, -98, -98, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-98, 1999, -98, -98, -99, -99, 1, 2100, 0.17, -98, -98, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-98, 1999, -98, -98, -99, -99, 1, 2000, 0.17, -98, -98, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),

  (-95, 2000, -99, -99, -99, -99, 1, 2500, 0.17, -98, -99, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-96, 2000, -99, -99, -99, -99, 1, 2500, 0.17, -98, -99, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-97, 2000, -99, -99, -99, -99, 1, 2500, 0.17, -98, -99, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-98, 2000, -99, -99, -99, -99, 1, 2500, 0.17, -98, -99, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-98, 2000, -99, -99, -99, -99, 1, 2500, 0.17, -98, -99, -99, true, true, false, false, true,  -2000, 0.11, 1, -2100, 0.12, 2, -2500, 0.13, 3, -3000, .15, 4, '2016-08-14 19:05:33.000000', -1, -1);
