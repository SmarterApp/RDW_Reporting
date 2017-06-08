insert into district (id, natural_id, name) values
  (-10, 'district1', 'district1'),
  (-20, 'district2', 'district2'),
  (-30, 'district3', 'district3');

insert into school (id, district_id, natural_id, name, import_id) VALUES
  (-10, -10, 'school1', 'school1', -1),
  (-20, -10, 'school2', 'school2', -1),
  (-30, -20, 'school3', 'school3', -1),
  (-40, -30, 'school4', 'school4', -1);

insert into grade (id, code, name) values
  (-1, 'g1', 'grade1'),
  (-2, 'g2', 'grade2'),
  (-3, 'g3', 'grade3');

insert into gender (id, code) values
  (-1, 'g1');

insert into student (id, ssid, last_or_surname, first_name, gender_id, birthday, import_id) values
  (-1, '-1', 'student1', 'student1', -1, '2017-01-01 00:00:00.000000', -1);

insert into asmt (id, type_id, natural_id, grade_id, subject_id, school_year, name, label, version, import_id) values
  (-1, 1, 'ica1', -1, 1, 2017, 'ica1', 'ica1', 'ica1', -1),
  (-2, 2, 'iab1', -1, 1, 2017, 'iab1', 'iab1', 'iab1', -1),
  (-3, 3, 'sum1', -1, 1, 2017, 'sum1', 'sum1', 'sum1', -1);

insert into exam (id, type_id, grade_id, student_id, school_id, iep, lep, section504, economic_disadvantage,
  school_year, asmt_id, asmt_version, completeness_id, administration_condition_id, session_id,
  scale_score, scale_score_std_err, performance_level, completed_at, import_id) values
  (-1, 1, -1, -1, -10, 0, 0, 0, 0, 2017, -1, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-01-01 00:00:00.000000', -1),
  (-2, 2, -2, -1, -10, 0, 0, 0, 0, 2017, -2, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-01-01 00:00:00.000000', -1),
  (-3, 3, -3, -1, -20, 0, 0, 0, 0, 2017, -3, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-01-01 00:00:00.000000', -1),
  (-4, 3, -1, -1, -30, 0, 0, 0, 0, 2017, -3, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-01-02 00:00:00.000000', -1),
  (-5, 3, -1, -1, -30, 0, 0, 0, 0, 2017, -3, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-01-05 00:00:00.000000', -1),
  (-6, 3, -1, -1, -30, 0, 0, 0, 0, 2017, -3, 'v1', 2, 1, 'session1', 2000, 20, 1, '2017-01-03 00:00:00.000000', -1);