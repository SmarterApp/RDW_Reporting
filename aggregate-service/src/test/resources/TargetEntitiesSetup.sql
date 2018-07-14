INSERT INTO grade (id, code, sequence) VALUES (-3,'-3', 3),(-4 ,'-4', 4),(-5, '-5', 5),(-6, '-6', 6);
INSERT INTO elas (id, code) VALUES (-11, 'EL'), (-14, 'RFEP');
INSERT INTO completeness (id, code) VALUES (-9, 'Complete'), (-8, 'Partial');
INSERT INTO administration_condition VALUES (-99,'IN'),(-98,'SD'),(-97,'NS'),(-96,'Valid');
INSERT INTO ethnicity VALUES (-29,'ethnicity-29'),(-28,'ethnicity-28'),(-27, 'ethnicity-27'), (-26, 'ethnicity-26');
INSERT INTO gender VALUES (-19,'gender-19'),(-18,'gender-18');
INSERT INTO school_year VALUES (1999),(2000),(2001);

-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name, natural_id, external_id, migrate_id) VALUES
  (-17, 'District-7', 'id-7', 'externalId-7', -1),
  (-18, 'District-8', 'id-8', 'externalId-8', -1),
  (-19, 'District-9', 'id-9', 'externalId-9', -1);

INSERT INTO school (id, district_group_id, district_id, school_group_id, name, natural_id, external_id, embargo_enabled, updated, update_import_id, migrate_id) VALUES
  (-7, -1, -17, -1, 'School-7', 'id-7', 'externalId-7', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, -1, -18, -1, 'School-8', 'id-8', 'externalId-8', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, -1, -19, -1, 'School-9', 'id-9', 'externalId-9', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-10, -1, -19, -1, 'School-10','id-10', 'externalId-10', 1, '2016-08-14 19:05:33.000000', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO asmt (id, grade_id, subject_id, type_id, school_year, name, label, cut_point_1, cut_point_2, cut_point_3, min_score, max_score, updated, update_import_id, migrate_id) VALUES
  (-6,  -5, 2, 3, 1888, 'asmt-6', 'asmt-6', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-5,  -5, 1, 3, 1888, 'asmt-5', 'asmt-5', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-8,  -4, 1, 3, 1999, 'asmt-8','asmt-8', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-18, -4, 1, 3, 1998, 'asmt-8','asmt-8', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-9,  -3, 2, 3, 1888, 'asmt-9', 'asmt-9', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-10, -3, 2, 3, 1888, 'asmt-9-again','asmt-9-again',2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-11, -3, 2, 3, 1888, 'asmt-11', 'asmt-11', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-12, -3, 2, 2, 1888, 'asmt-iab-12', 'asmt-iab-12', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-13, -3, 2, 2, 1999, 'asmt-iab-13', 'asmt-iab-13', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1);

INSERT INTO target(id, natural_id, claim_code, subject_id) VALUES
  (-11,  'NBT|E-3','1', 1),
  (-12,  'MD|J-3','1',  1),
  (-21,  'OA|D',  '2',  1),
  (-22,  'OA|A',  '2',  1),
  (-31,  'NF|C',  '3',  1),
  (-32,  'MD|D',  '3',  1),
  (-33,  'MD|E',  '3',  1),
  (-34,  'OA|E',  '3',  1),
  (-41,  'OA|E',  '4',  1),
  (-42,  'MD|D',  '4',  1),
  (-43,  'OA|A',  '4',  1);

INSERT INTO asmt_target (target_id, asmt_id, include_in_report) VALUES
  (-11, -18, 1),
  (-12, -18, 1),
  (-21, -18, 1),
  (-22, -18, 1),
  (-31, -18, 1),
  (-32, -18, 0),
  (-33, -18, 1),
  (-34, -18, 1),
  (-41, -18, 1),
  (-42, -18, 1),
  (-43, -18, 1),

  (-11, -8, 1),
  (-12, -8, 1),
  (-21, -8, 1),
  (-22, -8, 1),
  (-31, -8, 1),
  (-32, -8, 0),
  (-33, -8, 1),
  (-34, -8, 1),
  (-41, -8, 1),
  -- missing scores for this target/asmt
  (-42, -8, 1),
  (-43, -8, 1);

INSERT INTO asmt_active_year(asmt_id, school_year) VALUES
  (-18, 2000),
  (-12, 1888),
  (-13, 1999),
  (-12, 1999),
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
  (-5, -18, '2016-08-14 19:05:33.000000', -1, -1),
  (-6, -18, '2016-08-14 19:05:33.000000', -1, -1),
  (-7, -19, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, -19, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, -19, '2016-08-14 19:05:33.000000', -1, -1);

INSERT INTO student_ethnicity(student_id, ethnicity_id) values
  (-8,  -28),
  (-8,  -29),
  (-9,  -29);

INSERT INTO  exam (id, school_year, asmt_id, elas_id, completeness_id, administration_condition_id, performance_level,
                                scale_score, grade_id, student_id, school_id,  iep, lep, section504, economic_disadvantage,
                                migrant_status,completed_at, updated, update_import_id, migrate_id) VALUES
  (-5, 1999, -8, -11, -8, -98, 1, 2500,  -4, -5, -8,  1, 1, 2, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-6, 1999, -8, -11, -9, -98, 2, 2400,  -4, -6, -8,  0, 1, 0, 1, 2, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-7, 1999, -8, -11, -9, -99, 3, 2300,  -5, -8, -8,  1, 1, 1, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-8, 1999, -8, -11, -9, -99, 4, 2100,  -4, -9, -9,  0, 1, 2, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-9, 1999, -8, -11, -9, -99, 1, 2000,  -4, -9, -10, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-10, 1999, -9, -11, -9, -99, 1, 2000, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-20, 2000, -9, -11, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-21, 2000, -9, -11, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-22, 2000, -9, -11, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-23, 2000, -9, -11, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-35, 1999, -11, -11, -9, -99, 1, 2500, -4, -5, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-36, 1999, -11, -11, -9, -99, 2, 2400, -4, -6, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-37, 1999, -11, -11, -9, -99, 3, 2300, -4, -8, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-38, 1999, -11, -11, -9, -99, 4, 2100, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-39, 1999, -11, -11, -9, -99, 1, 2000, -4, -9, -10, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-40, 1999, -11, -11, -9, -99, 1, 2000, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1);


INSERT INTO exam_target_score(id, target_id, exam_id, school_year, asmt_id, student_relative_residual_score, standard_met_relative_residual_score,
                                    student_id,completed_at, updated, update_import_id, migrate_id) VALUES
  (-11,  -11, -5, 1999, -8, -1,    -1,      -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-12,  -12, -5, 1999, -8, 0.9876, 0.8976, -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-13,  -21, -5, 1999, -8, 0.123,  0.1456, -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-15,  -22, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-16,  -31, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-17,  -32, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-18,  -33, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-19,  -34, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-191, -41, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-192, -43, -5, 1999, -8, 0.1,    0.1,    -5, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-21,  -11, -6, 1999, -8, -0.88, -0.88,  -6, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-22,  -21, -6, 1999, -8, 1,      1,     -6, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-23,  -32, -6, 1999, -8, 0.1,    0.1,   -6, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-31,  -11, -7, 1999, -8, -0.77, -0.77,  -8, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-32,  -21, -7, 1999, -8,  1,     1,     -8, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-33,  -32, -7, 1999, -8,  0.1,   0.1,   -8, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-41, -11, -8, 1999, -8, -1,    -1,       -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-42, -12, -8, 1999, -8, 0.9876, 0.8976,  -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-43, -21, -8, 1999, -8, 0.123,  0.1456,  -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-44, -22, -8, 1999, -8, 0.111,  0.111,   -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-45, -31, -8, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-45, -32, -8, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-47, -33, -8, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-48, -34, -8, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-49, -41, -8, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-50, -43, -8, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-51, -11, -9, 1999, -8, -1,    -1,       -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -12, -9, 1999, -8, 0.9876, 0.8976,  -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -21, -9, 1999, -8, 0.123,  0.1456,  -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -22, -9, 1999, -8, 0.222,  0.222,   -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -31, -9, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -32, -9, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -33, -9, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -34, -9, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-51, -41, -9, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-52, -43, -9, 1999, -8, 0.1,    0.1,     -9, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1);
