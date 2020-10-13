-- Delete imports loaded by initial dml.
DELETE
FROM import;

-- Content type- 3 = CODES
INSERT INTO import (id, status, content, contentType, digest, batch, creator, created, updated)
VALUES (2000, 1, 2, 'application/xml', 'student-future', 'batch', 'dwtest@example.com', '2017-08-18 20:09:33.966000',
        '2017-07-18 20:16:34.966000'),
       (-1, 1, 4, 'application/xml', 'hash-school-99', 'batch', 'dwtest@example.com', '2017-07-18 20:08:13.966000',
        '2017-07-18 20:14:34.966000'),
       (-2, -1, 4, 'application/xml', 'hash-school-98', 'batch', 'dwtest@example.com', '2017-07-18 20:08:12.966000',
        '2017-07-18 20:13:34.966000'),
       (-7, 0, 3, 'application/xml', 'hash-school-98', 'batch', 'dwtest@example.com', '2017-07-18 20:08:11.966000',
        '2017-07-18 20:08:11.966000'),
       (-20, 1, 2, 'application/xml', 'hash-asmt', 'batch', 'dwtest@example.com', '2017-07-18 19:07:10.966000',
        '2017-07-18 19:05:34.966000'),
       (-78, 0, 5, 'application/xml', 'hash-group', 'batch', 'dwtest@example.com', '2017-07-18 19:07:10.966000',
        '2017-07-18 19:11:34.966000'),
       (-79, 1, 5, 'application/xml', 'hash-group', 'batch', 'dwtest@example.com', '2017-07-18 19:07:09.966000',
        '2017-07-18 19:10:34.966000'),
       (-84, 0, 5, 'application/xml', 'hash-student', 'batch', 'dwtest@example.com', '2017-07-18 19:06:09.966000',
        '2017-07-18 19:06:09.966000'),
       (-86, 1, 5, 'application/xml', 'hash-student', 'batch', 'dwtest@example.com', '2017-07-18 19:06:08.966000',
        '2017-07-18 19:09:34.966000'),
       (-87, 1, 5, 'application/xml', 'hash-student', 'batch', 'dwtest@example.com', '2017-07-18 19:06:07.966000',
        '2017-07-18 19:09:34.966000'),
       (-88, -1, 5, 'application/xml', 'hash-student', 'batch', 'dwtest@example.com', '2017-07-18 19:06:06.966000',
        '2017-07-18 19:08:34.966000'),
       (-89, -1, 5, 'application/xml', 'hash-student', 'batch', 'dwtest@example.com', '2017-07-18 19:05:05.966000',
        '2017-07-18 19:06:00.966000'),
       (-90, 1, 1, 'application/xml', 'hash-iab_exam', 'batch', 'dwtest@example.com', '2017-07-18 19:05:04.966000',
        '2017-07-18 19:06:35.966000'),
       (-93, 1, 6, 'text/plain', 'embargo', 'batch', 'dwtest@example.com', '2017-07-18 19:05:04.966000',
        '2017-07-18 19:06:35.966000'),
       (-99, 1, 3, 'application/xml', 'hash-code', 'batch', 'dwtest@example.com', '2017-07-18 19:05:03.966000',
        '2017-07-18 19:06:34.966000'),
       (-5000, 1, 2, 'application/xml', 'hash-preload', 'batch', 'dwtest@example.com', '2017-05-18 19:05:33.966000',
        '2017-05-18 19:06:34.966000');


INSERT INTO school_year(year)
VALUES (1999),
       (1998);
INSERT INTO grade(id, code, name, sequence)
VALUES (111, '31', '11th-grade-test', 11),
       (109, '29', '9th-grade-test', 9),
       (108, '28', '8th-grade-test', 8),
       (107, '27', '7th-grade-test', 7);
INSERT INTO elas(id, code)
VALUES (-99, 'E99'),
       (-98, 'E98');
INSERT INTO language(id, code, display_order, name)
VALUES (-99, 'abc', 1, 'lang-abc'),
       (-98, 'cba', 2, 'lang-cba');
INSERT INTO completeness(id, code)
VALUES (-99, 'test1'),
       (-98, 'test55');
INSERT INTO administration_condition(id, code)
VALUES (-99, 'IN-test'),
       (-98, 'NS-test'),
       (-97, 'SD-test'),
       (-96, 'Valid-test');
INSERT INTO military_connected(id, code)
VALUES (-99, 'No-test'),
       (-98, 'Active-test');
INSERT INTO ethnicity(id, code)
VALUES (-99, 'AmericanIndianOrAlaskaNative-test'),
       (-98, 'Asian-test');
INSERT INTO gender(id, code)
VALUES (-99, 'Female-test'),
       (-98, 'Male-test');
INSERT INTO accommodation(id, code)
VALUES (-99, 'code1-test'),
       (-98, 'code2-test');
INSERT INTO accommodation_translation(accommodation_id, language_code, school_year, label)
VALUES (-99, 'lan', 2017, 'Hola'),
       (-98, 'gua', 2017, 'Hello');
INSERT INTO math_practice(practice, description, code)
VALUES (-99, 'Make sense of problems and persevere in solving them', '-9'),
       (-98, 'Reason abstractly and quantitatively', '-8');

-- ------------------------ Subjects and related data ---------------------------------------------------------------------------------------------------------------------
INSERT INTO subject(id, code, import_id, update_import_id, created, updated)
VALUES
-- NOTE: Because of the life BEFORE 'configurable subjects' the two SB subjects (and the related data)
-- are pre-loaded by default. Ideally it should not be there, but it is.
-- add new subjects to better control test use cases
(-1, 'New', -99, -99, '2017-07-18 19:06:30.966000', '2017-07-18 19:06:30.966000'),
(-2, 'Old', -99, -99, '2014-07-18 19:06:30.966000', '2017-04-18 19:06:30.966000'),
(-3, 'Update', -99, -99, '2017-07-18 19:06:30.966000', '2017-07-18 19:06:30.966000');

-- To trigger the default subjects data migration we need to update the timestamps
UPDATE subject
SET created = '2017-07-18 19:06:30.966000',
    updated = '2017-07-18 19:06:30.966000'
WHERE id IN (1, 2);

-- add subjects' related data for the new subjects
INSERT INTO subject_asmt_type (subject_id, asmt_type_id, target_report, printed_report, trait_report)
VALUES (-1, 1, 0, 1, 0),
       (-2, 1, 0, 1, 0),
       (-3, 1, 0, 1, 0), -- new entry
       (-3, 2, 0, 1, 0); -- updated entry

INSERT INTO subject_asmt_scoring (subject_id, asmt_type_id, score_type_id, performance_level_count,
                                  performance_level_standard_cutoff)
VALUES (-1, 1, 1, 10, 3),
       (-1, 1, 3, 6, null),
       (-2, 1, 1, 5, 2),
       (-2, 1, 3, 6, null),
       (-3, 1, 1, 8, 2),
       (-3, 1, 3, 7, null),
       (-3, 2, 1, 8, 2),
       (-3, 2, 3, 7, null);

INSERT INTO subject_score (id, subject_id, asmt_type_id, score_type_id, code, display_order, data_order)
VALUES (-1, -1, 1, 3, 'Score1', 0, 1),
       (-2, -1, 1, 3, 'Score2', 0, 2),
       (-3, -1, 1, 3, 'Score3', -3, 3),
       (-4, -2, 3, 3, 'Score4', -4, 4),
       (-5, -2, 3, 3, 'Score5', 0, 5),
       (-6, -2, 3, 3, 'Score6', -5, 6),
       (-14, -3, 3, 3, 'Score7', -6, 4),
       (-15, -3, 3, 3, 'Update', -7, 5),
       (-16, -3, 3, 3, 'New', -8, 6);

INSERT INTO claim (id, subject_id, code)
VALUES (-21, -1, 'ClaimCode2'),
       (-3, -1, 'ClaimCode3'),
       (-4, -1, 'ClaimCode4'),
       (-5, -2, 'ClaimCode5'),
       (-6, -2, 'ClaimCode6'),
       (-7, -2, 'ClaimCode7'),
       (-8, -2, 'ClaimCode8'),
       (-9, -2, 'ClaimCode9'),

       (-66, -3, 'Update66'),
       (-67, -3, 'new'),
       (-68, -3, 'Old68'),
       (-69, -3, 'Old69'),
-- add more data for the default subjects to better control validation while testing
       (-1, 1, 't1'),
       (-2, 1, 't3'),
       (-99, 2, 'c9'),
       (-98, 2, 'c8'),
       (-11, 2, 't1'),
       (-12, 2, 't2'),
       (-13, 2, 't3'),
       (-14, 2, 't4');

INSERT INTO target (id, natural_id, claim_id)
VALUES (-1, 'Target1', -1),
       (-2, 'Target2', -21),
       (-3, 'Target3', -3),
       (-4, 'Target4', -4),
       (-5, 'Target5', -5),
       (-6, 'Target6', -6),
       (-7, 'Target7', -7),
       (-8, 'Target8', -8),
       (-9, 'Target9', -9),

       (-66, 'NewTarget', -66),
       (-67, 'UpdatedTarget', -67),
       (-68, 'Target8', -68),
       (-69, 'Target9', -69),

-- add more data for the default subjects to better control validation while testing
       (-99, 'NBT|99', -11),
       (-98, 'NBT|98', -11),

-- we need to test a use case with 'Math' subject and claim '1' since it has special migrate rules
-- since it is being pre-loaded we need to get the db id
       (-71, 'tNBT|E-3', (SELECT id FROM claim WHERE code = '1' AND subject_id = 1)),
       (-72, 'MD|J-3', -2),
       (-73, 'OA|D', -2),

       (-11, 'NBT|E-3', -11),
       (-12, 'MD|J-3', -11),
       (-21, 'OA|D', -12),
       (-22, 'OA|A', -12),
       (-31, 'NF|C', -13),
       (-32, 'MD|D', -13),
       (-33, 'MD|E', -13),
       (-34, 'OA|E', -13),
       (-41, 'OA|E', -14),
       (-42, 'MD|D', -14),
       (-43, 'OA|A', -14);

INSERT INTO depth_of_knowledge(id, level, subject_id, reference)
VALUES (-99, -1, 1, 'something'),
       (-98, -2, 1, 'anything'),
       (-97, -2, -2, 'anything'),
       (-96, -2, -1, 'anything'),
       (-66, 1, -3, 'new'),
       (-67, 2, -3, 'updated'),
       (-68, 3, -3, 'anything');

-------------------------- Preload  entities into warehouse  -------------------------------------------------------------------------------------------------------
INSERT INTO district_group (id, name, natural_id)
VALUES (-98, 'Sample District Group -98', 'natural_id-98');

INSERT INTO district (id, name, natural_id)
VALUES (-1, 'Preload District -1', 'natural_id-1'),
       (-99, 'Sample District -99', 'natural_id-99'),
       (-98, 'Sample District -98', 'natural_id-98');

INSERT INTO school_group (id, name, natural_id)
VALUES (-1, 'New School Group -1', 'natural_id-1'),
       (-98, 'Sample School Group -98', 'natural_id-98');

INSERT INTO school (id, district_id, district_group_id, school_group_id, name, natural_id, deleted, import_id,
                    update_import_id, created, updated)
VALUES (-1, -1, NULL, -1, 'Preload School -1', 'natural_id-1', 0, -5000, -5000, '2017-05-18 19:05:33.967000',
        '2017-05-18 20:06:34.966000'),
-- -99 is marked as deleted.  It's district will not be copied.
       (-99, -99, NULL, NULL, 'Sample School -99', 'natural_id-99', 1, -1, -1, '2017-07-18 20:14:34.966000',
        '2017-07-18 20:14:34.000000'),
       (-98, -98, -98, -98, 'Sample School -98', 'natural_id-98', 0, -2, -2, '2017-07-18 20:13:34.000000',
        '2017-07-18 20:13:34.000000');

INSERT INTO asmt
(id, type_id, natural_id, grade_id, subject_id, school_year, name, label, version, deleted, import_id, update_import_id,
 created, updated)
VALUES (-11, 3, 'ica-1999-grade-8-subject-1', 108, 1, 1999, 'ica-1999-grade-8-subject-1', 'test', '9835', 0, -5000,
        -5000, '2017-05-18 19:05:33.967000', '2017-05-18 20:06:34.966000'),
       (-99, 3, 'summative-1999-grade-9-subject-1', 109, 1, 1999, 'summative-1999-grade-9-subject-1', 'summative',
        '9835', 1, -5000, -20, '2017-07-18 19:05:34.966000', '2017-07-18 19:05:34.966000'),
       (-98, 1, 'ica-1999-grade-8-subject-2', 108, 2, 1999, 'ica-1999-grade-8-subject-2', 'ica', '9831', 0, -20, -20,
        '2017-07-18 19:05:34.966000', '2017-07-18 19:05:34.966000'),
       (-66, 2, 'iab', 109, 2, 1999, 'iab', 'iab', '9831', 0, -20, -20, '2017-07-18 19:05:34.966000',
        '2017-07-18 19:05:34.966000'),
       (-97, 2, 'iab-1999-grade-8-subject-2', 108, 2, 1999, 'iab-1999-grade-8-subject-2', 'iab', '9831', 0, -20, -20,
        '2017-07-18 19:05:34.966000', '2017-07-18 19:05:34.966000'),
       (-107, 3, 'test-summative-2001-grade-7', 107, 1, 1999, 'summative-grade-8', 'summative', '9831', 0, -20, -20,
        '2017-07-18 19:05:34.966000', '2017-07-18 19:05:34.966000'),
       (-111, 3, 'test-summative-2001-grade-11', 111, 1, 1999, 'summative-grade-11', 'summative', '9831', 0, -20, -20,
        '2017-07-18 19:05:34.966000', '2017-07-18 19:05:34.966000'),
       (-311, 3, 'test-summative-2001-ELA-grade-11', 111, 2, 1999, 'summative-ELA-grade-11', 'summative', '9831', 0,
        -20, -20, '2017-07-18 19:05:34.966000', '2017-07-18 19:05:34.966000');

INSERT INTO item (id, claim_id, target_id, natural_id, asmt_id, dok_id, difficulty, difficulty_code, max_points,
                  math_practice, allow_calc, position,
                  field_test, active, type, options_count, answer_key, performance_task_writing_type)
VALUES (-9, -1, -71, '200-2019', -99, -99, -0.23, 'E', 2, -99, 0, 1, null, null, null, null, null, null),
       (-8, -2, -72, '200-2018', -99, -99, -0.23, 'E', 2, -99, 0, 2, null, null, null, null, null, null),
       (-7, -2, -73, '200-2017', -99, -99, -0.23, 'E', 2, -99, 0, 3, null, null, null, null, null, null),

       (-6, -1, -71, '200-2016', -107, -99, -0.23, 'E', 2, -99, 0, 4, null, null, null, null, null, null),
       (-990, -2, -72, '200-2010', -107, -99, -0.23, 'E', 2, -99, 0, 4, null, null, null, null, null, null),
       (-991, -2, -72, '200-18943', -107, -99, -0.13, 'E', 2, -98, 0, 3, false, true, 1, 0, 'key', 'Narrative'),
       (-992, -2, -73, '200-8906', -107, -99, -0.03, 'E', 2, -99, 1, 2, false, true, 1, 0, 'key', 'Informational'),
       (-993, -2, -73, '200-2014', -107, -98, 1.23, 'D', 2, -98, 1, 1, false, true, 1, 0, 'key', 'Explanatory'),

       (-980, -1, -71, '200-60347', -111, -98, -0.32, 'E', 1, null, null, 5, false, true, 1, 0, 'key', 'Opinion'),
       (-981, -1, -71, '200-51719', -111, -98, -1.32, 'D', 1, null, null, 4, false, true, 1, 0, 'key', 'Opinion'),
       (-982, -1, -71, '200-59217', -111, -98, -2.32, 'D', 1, null, null, 3, false, true, 1, 0, 'key', 'Argumentative'),
       (-983, -1, -71, '200-59208', -111, -98, -0.32, 'D', 1, null, null, 2, false, true, 1, 0, 'key', 'Argumentative'),
       (-984, -2, -72, '200-30901', -111, -98, -0.32, 'D', 1, null, null, 1, true, false, 2, 8, 'key', 'Argumentative'),

       (-180, -11, -11, '200-60347', -311, -98, -0.32, 'E', 1, null, null, 5, false, true, 1, 0, 'key', 'Opinion'),
       (-181, -12, -21, '200-51719', -311, -98, -1.32, 'D', 1, null, null, 4, false, true, 1, 0, 'key', 'Opinion'),
       (-182, -13, -31, '200-59217', -311, -98, -2.32, 'D', 1, null, null, 3, false, true, 1, 0, 'key',
        'Argumentative'),
       (-183, -14, -41, '200-59208', -311, -98, -0.32, 'D', 1, null, null, 2, false, true, 1, 0, 'key',
        'Argumentative'),
       (-184, -14, -42, '200-30901', -311, -98, -0.32, 'D', 1, null, null, 1, true, false, 2, 8, 'key',
        'Argumentative');

INSERT INTO asmt_score (asmt_id, cut_point_1, cut_point_2, cut_point_3, min_score, max_score)
VALUES (-11, 2442, 2502, 2582, 2201, 2701),
       (-99, 2442, 2502, 2582, 2201, 2701),
       (-98, 2442, 2502, 2582, 2201, 2701),
       (-66, 2442, 2502, 2582, 2201, 2701),
       (-97, 2442, 2502, 2582, 2201, 2701),
       (-107, 2442, 2502, 2582, 2201, 2701),
       (-111, 2442, 2502, 2582, 2201, 2701);
-- put a couple extra scores in to test stopgap filtering; TODO - put real alternate scores in
INSERT INTO asmt_score (asmt_id, subject_score_id, min_score, max_score)
VALUES (-99, -1, 1000, 3000),
       (-99, -2, 1000, 3000),
       (-98, -1, 1000, 3000);

INSERT INTO asmt_target_exclusion(asmt_id, target_id)
VALUES (-99, -71),
       (-99, -72),
       (-111, -71),
       (-111, -72),
       (-311, -11);

INSERT INTO student (id, ssid, last_or_surname, first_name, middle_name, gender_id, first_entry_into_us_school_at,
                     lep_entry_at,
                     lep_exit_at, birthday, import_id, update_import_id, deleted, created, updated)
VALUES (-11, '11', 'LastName-preload', 'FirstName-preload', 'MiddleName-preload', -98, '2012-08-14', '2012-11-13', null,
        '2000-01-01', -5000, -5000, 0, '2017-05-18 19:05:33.967000', '2017-05-18 20:06:34.966000'),
       (-89, '89', '漢字', 'FirstName2', 'MiddleName2', -98, '2012-08-14', '2012-11-13', null, '2000-01-01', -5000, -89,
        1, '2017-05-18 19:05:33.967000', '2017-07-18 19:06:00.966000'),
       (-88, '88', 'Last, Name2', 'FirstName2', 'MiddleName2', -98, '2012-08-14', '2012-11-13', null, '2000-01-01', -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000'),
       (-87, '87', 'LastName2', 'FirstName2', 'MiddleName2', -98, '2012-08-14', '2012-11-13', null, '2000-01-01', -87,
        -87, 0, '2017-07-18 19:09:33.966000', '2017-07-18 19:09:33.966000'),
       (-86, '86', 'LastName2', 'FirstName2', 'MiddleName2', -98, '2012-08-14', '2012-11-13', null, '2000-01-01', -86,
        -86, 0, '2017-07-18 19:09:3.966000', '2017-07-18 19:09:33.966000'),
       (-33, '33', 'LastName2', 'FirstName2', 'MiddleName2', -98, '2012-08-14', '2012-11-13', null, '2000-01-01', 2000,
        2000, 0, '2017-07-18 20:16:33.966000', '2017-07-18 20:16:33.966000'),
       (-18, '18', 'LastName2', 'FirstName2', 'MiddleName2', -98, '2012-08-14', '2012-11-13', null, '2000-01-01', 2000,
        2000, 0, '2017-07-18 20:16:33.966000', '2017-07-18 20:16:33.966000');

INSERT INTO student_ethnicity(student_id, ethnicity_id)
values (-89, -99),
       (-88, -98),
       (-87, -98),
       (-86, -98),
       (-86, -99);

INSERT INTO exam (id, type_id, school_year, asmt_id, student_id, completed_at,
                  asmt_version, opportunity, elas_id, completeness_id, administration_condition_id,
                  military_connected_id, session_id, performance_level, scale_score, scale_score_std_err,
                  import_id, update_import_id, deleted, created, updated,
                  grade_id, school_id, iep, lep, section504, economic_disadvantage,
                  migrant_status, eng_prof_lvl, t3_program_type, language_id, prim_disability_type)
VALUES (-88, 3, 1999, -99, -89, '2016-08-14 19:05:33.967000', null, 1, 1, 1, 1, 1, 'session', 1, 2145, 20.17, -5000,
        -88, 1, '2017-05-18 19:05:33.967000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-87, 3, 1998, -11, -11, '2016-08-14 19:06:07.966000', null, 1, null, 1, 1, 1, 'session', 1, 2106, 21.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-85, 3, 1999, -11, -11, '2016-08-14 19:06:07.966000', null, 1, -99, 1, 1, 1, 'session', 1, 2125, 40.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),

       (-68, 2, 1999, -66, -89, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, 2135, 30.17, -88, -88,
        1, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-84, 2, 1998, -66, -11, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, 2135, 30.17, -88, -88,
        0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-83, 2, 1999, -66, -11, '2016-08-12 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, 2000, 30.17, -88, -88,
        0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),

       (-10, 2, 1999, -97, -11, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', null, 2135, 30.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-11, 2, 1998, -97, -89, '2016-08-12 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, null, 30.17, -88, -88,
        0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-12, 2, 1999, -97, -89, '2016-08-12 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, 2000, null, -88, -88,
        0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),

       (-15, 3, 1999, -99, -11, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, null, 40.17, -88, -88,
        0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-16, 1, 1998, -98, -11, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, 2125, null, -88, -88,
        0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-17, 1, 1999, -98, -11, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', null, 2125, 40.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 108, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),

       (-268, 3, 1999, -107, -89, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 1, 2135, 30.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 107, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-206, 3, 1998, -111, -89, '2016-08-14 19:05:07.966000', null, 1, 1, 1, 1, 1, 'session', 2, 2145, 40.17, -88,
        -88, 0, '2017-07-18 20:14:34.000000', '2017-07-18 19:06:07.966000', 111, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),
       (-209, 3, 1999, -111, -18, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 3, 2145, 40.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 111, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null),

       (-311, 3, 1999, -311, -33, '2016-08-14 19:06:07.966000', null, 1, 1, 1, 1, 1, 'session', 3, 2145, 40.17, -88,
        -88, 0, '2017-07-18 19:06:07.966000', '2017-07-18 19:06:07.966000', 111, -1, 1, 1, 0, 0, 1, 'eng_prof_lvl',
        't3_program_type', 0, null);

INSERT INTO exam_score (id, exam_id, subject_score_id, scale_score, scale_score_std_err, performance_level)
VALUES (-2, -87, 1, 2014, 0.19, 1),
       (-4, -85, 1, 2014, 0.19, 1),
       (-5, -268, 1, 2014, 0.19, 1),
-- un-scored claim
       (-6, -68, 1, 2014, 0.19, null),
-- un-scored exams
       (-7, -10, 1, 2014, 0.19, 1),
       (-8, -11, 1, 2014, 0.19, 1),
       (-9, -12, 1, 2014, 0.19, 1);

INSERT INTO exam_target_score (id, target_id, exam_id, student_relative_residual_score,
                               standard_met_relative_residual_score)
VALUES (-1, -71, -88, -1, -1),
       (-2, -72, -88, 0.123, 0.1456),
       (-3, -73, -88, 0.1, 0.1),

       (-11, -11, -311, -1, -1),
       (-12, -12, -311, 0.9876, 0.8976),
       (-13, -21, -311, 0.123, 0.1456),
       (-15, -22, -311, 0.1, 0.1),
       (-16, -31, -311, 0.1, 0.1),
       (-17, -32, -311, 0.1, 0.1),
       (-18, -33, -311, 0.1, 0.1),
       (-19, -34, -311, 0.1, 0.1),
       (-191, -41, -311, 0.1, null),
       (-192, -43, -311, null, 0.1),

       (-210, -71, -209, -0.88, -0.88),
       (-220, -72, -209, 1, 1),
       (-230, -73, -209, 0.1, 0.1);
