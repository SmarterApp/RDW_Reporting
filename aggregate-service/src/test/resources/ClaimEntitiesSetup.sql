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