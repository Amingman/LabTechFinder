TRUNCATE TABLE laboratories;

ALTER SEQUENCE labid RESTART WITH 1;



INSERT INTO laboratories (name, description, email) VALUES ('unaffiliated', 'repository for lab-tech ronins', 'placeholder@lorem.com');

INSERT INTO laboratories (name, description, email) VALUES ('Cancer Proteomics', 'The Cancer Proteomics Laboratory specialises in studying the specific protein functions of oncogenes. We are focused in studying the Gene/Protein interaction, protein expressions and PPI using cutting edge methodologies.', 'cpl@sciency.com');

INSERT INTO laboratories (name, description, email) VALUES ('Cancer Genomics', 'The Cancer Genomics Laboratory investigates the development of cancer through germline and somatic genetic variation. Using computer modelling, big data analysis, cellular and animal models, we studied how certain cancer types are more susceptible to specific oncogene variants and its potential therapeutic options. Our team consisted of clinicians, pathologists as well as lab technicians and biostatisticians. ', 'cgl@sciency.com');