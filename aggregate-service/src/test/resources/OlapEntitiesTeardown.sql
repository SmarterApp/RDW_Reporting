DELETE FROM fact_student_exam WHERE id  < 0;
DELETE FROM fact_student_iab_exam WHERE id  < 0;
DELETE FROM student_ethnicity WHERE student_id  < 0;
DELETE FROM student WHERE id  < 0;
DELETE FROM asmt_active_year WHERE asmt_id  < 0;
DELETE FROM asmt WHERE id  < 0;
DELETE FROM school WHERE id  < 0;
DELETE FROM district WHERE id  < 0;

DELETE FROM grade WHERE id  < 0;
DELETE FROM completeness WHERE id  < 0;
DELETE FROM administration_condition WHERE id  < 0;
DELETE FROM ethnicity WHERE id  < 0;
DELETE FROM gender WHERE id  < 0;
DELETE FROM school_year WHERE year in (1999,2000,2001);