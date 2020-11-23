INSERT INTO school_year VALUES (1997), (1999), (2000), (2001);

INSERT INTO district (id, name, natural_id, external_id, migrate_id) VALUES
  (-18, 'District-8', 'id-8', 'externalId-8', -1),
  (-19, 'District-9', 'id-9', 'externalId-9', -1);

-- Start with all results released
INSERT INTO district_embargo (school_year, district_id, subject_id, aggregate, migrate_id)
            SELECT  y.year, d.id, s.id, 2, -10
            FROM school_year y
                 JOIN district d ON 1=1
                 JOIN subject s ON 1=1
