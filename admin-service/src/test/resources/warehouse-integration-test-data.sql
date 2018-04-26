insert into import (id, status, content, contentType, digest) values
  (-1, 1, 1, '', '');

insert into district_group (id, natural_id, name) values
  (-9, 'districtgroup1', 'districtgroup1');

insert into district (id, natural_id, name) values
  (-10, 'district1', 'district1'),
  (-20, 'district2', 'district2'),
  (-30, 'district3', 'district3');

insert into school_group (id, natural_id, name) values
  (-11, 'schoolgroup1', 'schoolgroup1');

insert into school (id, district_group_id, district_id, school_group_id, natural_id, name, import_id, update_import_id) VALUES
  (-10, -9, -10, -11, 'school1', 'school1', -1, -1),
  (-20, -9, -10, -11, 'school2', 'school2', -1, -1),
  (-30, null, -20, null, 'school3', 'school3', -1, -1),
  (-40, null, -30, null, 'school4', 'school4', -1, -1);

insert into grade (id, code, name, sequence) values
  (-1, 'g1', 'grade1', 1),
  (-2, 'g2', 'grade2', 2),
  (-3, 'g3', 'grade3', 3);

insert into gender (id, code) values
  (-1, 'g1');

insert into student (id, ssid, last_or_surname, first_name, gender_id, birthday, import_id, update_import_id) values
  (-1, 'student1_ssid', 'student1_lastName', 'student1_firstName', -1, '2017-01-01 00:00:00.000000', -1, -1),
  (-2, 'student2_ssid', 'student2_lastName', 'student2_firstName', -1, '2017-01-01 00:00:00.000000', -1, -1);

-- groups

insert into student_group (id, name, school_id, school_year, subject_id, import_id, update_import_id, active) values
  (-10, 'group1', -10, 2017, 1, -1, -1, 1),
  (-20, 'group2', -10, 2017, null, -1, -1, 1),
  (-30, 'group2', -20, 2016, null, -1, -1, 1);


insert into student_group_membership (student_group_id, student_id) values
  (-10, -1);
