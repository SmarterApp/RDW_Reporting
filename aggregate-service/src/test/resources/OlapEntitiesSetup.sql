INSERT INTO grade (id, code, sequence) VALUES (-3,'-3', 3),(-4 ,'-4', 4),(-5, '-5', 5),(-6, '-6', 6);
INSERT INTO elas (id, code) VALUES (-11, 'EL'), (-14, 'RFEP');
INSERT INTO language (id, code) VALUES (-21, 'abc'), (-22, 'cba'), (-23, 'a23'), (-24, 'a23'), (-25, 'a25');
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
  (-6,  -5, 2, 1, 1888, 'asmt-6', 'asmt-6', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-5,  -5, 1, 1, 1888, 'asmt-5', 'asmt-5', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-8,  -4, 1, 1, 1999, 'asmt-8','asmt-8', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-18, -4, 1, 1, 2000, 'asmt-8','asmt-8', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-9,  -3, 2, 1, 1888, 'asmt-9', 'asmt-9', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-10, -3, 2, 1, 1888, 'asmt-9-again','asmt-9-again',2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-11, -3, 2, 3, 1888, 'asmt-11', 'asmt-11', 2300, 2500, 2700, 2000, 2800,'2016-08-14 19:05:33.000000', -1, -1),
  (-12, -3, 2, 2, 1888, 'asmt-iab-12', 'asmt-iab-12', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-13, -3, 2, 2, 1999, 'asmt-iab-13', 'asmt-iab-13', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1);


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

-- ------------------------------------------ Exams ---------------------------------------------------------------------------------------------
INSERT INTO  exam (id, school_year, asmt_id, elas_id, language_id, completeness_id, administration_condition_id, performance_level,
                                    scale_score, grade_id, student_id, school_id,  iep, lep, section504, economic_disadvantage,
                                     migrant_status,completed_at, updated, update_import_id, migrate_id) VALUES
  (-5, 1999, -8, -11, -21, -8, -98, 1, 2500,  -4, -5, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-6, 1999, -8, -11, -21, -9, -98, 2, 2400,  -4, -6, -8,  0, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-7, 1999, -8, -11, -22, -9, -99, 3, 2300,  -5, -8, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-8, 1999, -8, -11, -21, -9, -99, 4, 2100,  -4, -9, -9,  0, 1, 2, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-9, 1999, -8, -11, -21, -9, -99, 1, 2000,  -4, -9, -10, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-10, 1999, -9, -11, -21, -9, -99, 1, 2000, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-20, 2000, -9, -11, -21, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-21, 2000, -9, -11, -21, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-22, 2000, -9, -11, -21, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-23, 2000, -9, -11, -21, -9, -99, 1, 2500, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-35, 1999, -11, -11, -21, -9, -99, 1, 2500, -4, -5, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-36, 1999, -11, -11, -21, -9, -99, 2, 2400, -4, -6, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-37, 1999, -11, -11, -22, -9, -99, 3, 2300, -4, -8, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-38, 1999, -11, -11, -21, -9, -99, 4, 2100, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-39, 1999, -11, -11, -21, -9, -99, 1, 2000, -4, -9, -10, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-40, 1999, -11, -11, -21, -9, -99, 1, 2000, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1);


INSERT INTO  iab_exam (id, school_year, asmt_id, elas_id, language_id, completeness_id, administration_condition_id, performance_level,
                                    scale_score, grade_id, student_id, school_id,  iep, lep, section504, economic_disadvantage,
                                     migrant_status,completed_at, updated, update_import_id, migrate_id) VALUES
  (-100, 1999, -12, -11, -21, -9, -99, 1, 2500, -4, -5, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-101, 1999, -12, -11, -21, -9, -99, 2, 2400, -4, -6, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-102, 1999, -12, -11, -21, -9, -99, 3, 2300, -4, -8, -8,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-103, 1999, -12, -11, -21, -9, -99, 4, 2100, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-104, 1999, -12, -11, -21, -9, -99, 1, 2000, -4, -9, -10, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-105, 1999, -12, -11, -21, -9, -99, 1, 2000, -4, -9, -9,  1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1);
