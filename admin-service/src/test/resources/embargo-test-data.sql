insert into district (id, natural_id, name) values
  (-10, 'district1', 'district1'),
  (-20, 'district2', 'district2'),
  (-30, 'district3', 'district3');

insert into state_embargo (school_year, individual, aggregate) values
  (2018, false, true),
  (2019, true, true),
  (2020, false, false);

insert into district_embargo (district_id, school_year, subject_id, individual, aggregate) values
  (-10, 2018, 1, 1, 1),
  (-20, 2018, 1, 2, 0),
  (-10, 2017, 1, 2, 2),
  (-10, 2019, 1, 1, 1);

-- get some summative exams in there to test counts

insert into import (id, status, content, contentType, digest) values
  (-1, 1, 1, '', '');

insert into asmt (id, type_id, natural_id, grade_id, subject_id, school_year, name, label, version,
                  import_id, update_import_id, deleted) values
  (-1, 3, 'sum-math', 11, 1, 2018, 'sum-math', 'Math', 'v1', -1, -1, 0),
  (-2, 3, 'sum-ela', 11, 2, 2018, 'sum-ela', 'ELA', 'v1', -1, -1, 0);

insert into student (id, ssid, last_or_surname, first_name, gender_id, birthday, import_id, update_import_id) values
  (-1, 'student1_ssid', 'student1_lastName', 'student1_firstName', -1, '2017-01-01 00:00:00.000000', -1, -1),
  (-2, 'student2_ssid', 'student2_lastName', 'student2_firstName', -1, '2017-01-01 00:00:00.000000', -1, -1);

insert into school (id, district_id, natural_id, name, import_id, update_import_id) VALUES
  (-10, -10, 'school1', 'school1', -1, -1),
  (-20, -20, 'school2', 'school2', -1, -1);

insert into exam (id, type_id, grade_id, student_id, school_id, opportunity, migrant_status, iep, lep, section504,
  economic_disadvantage, school_year, asmt_id, asmt_version, completeness_id, administration_condition_id, session_id,
  scale_score, scale_score_std_err, performance_level, completed_at, import_id, update_import_id, deleted) values
  (-1, 3, 11, -1, -10, 0, null, 0, 0, 0, 0, 2018, -1, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-11-01 00:00:00.000000', -1, -1, 0),
  (-2, 3, 11, -2, -10, 0, null, 0, 0, 0, 0, 2018, -1, 'v1', 2, 1, 'session2', 2000, 20, 1, '2017-11-01 00:00:00.000000', -1, -1, 0),
  (-3, 3, 11, -1, -20, 0, null, 0, 0, 0, 0, 2018, -2, 'v1', 2, 1, 'session2', 2000, 20, 1, '2017-11-01 00:00:00.000000', -1, -1, 0);


insert into exam_count (school_year, district_id, subject_id, count) values
(2015, -10, 1, 5),
(2015, -10, 2, 5),
(2015, -20, 1, 5),
(2015, -20, 2, 5),
(2015, -30, 1, 5),
(2015, -30, 2, 5),
(2016, -10, 1, 5),
(2016, -10, 2, 5),
(2016, -20, 1, 5),
(2016, -20, 2, 5),
(2016, -30, 1, 5),
(2016, -30, 2, 5),
(2017, -10, 1, 5),
(2017, -10, 2, 5),
(2017, -20, 1, 5),
(2017, -20, 2, 5),
(2017, -30, 1, 5),
(2017, -30, 2, 5),
(2018, -10, 1, 5),
(2018, -10, 2, 5),
(2018, -20, 1, 5),
(2018, -20, 2, 5),
(2018, -30, 1, 5),
(2018, -30, 2, 5),
(2019, -10, 1, 5),
(2019, -10, 2, 5),
(2019, -20, 1, 5),
(2019, -20, 2, 5),
(2019, -30, 1, 5),
(2019, -30, 2, 5)
