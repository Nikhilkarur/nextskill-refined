CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id IDENTITY PRIMARY KEY,
    user_id BIGINT,
    desired_role VARCHAR(128),
    experience VARCHAR(32),
    priority VARCHAR(32),
    time_commitment VARCHAR(32),
    answers_json CLOB,
    resume_text CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questionnaire_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Align resume_uploads table with entity (add extracted_text column if missing)
ALTER TABLE resume_uploads ADD COLUMN IF NOT EXISTS extracted_text CLOB;
CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id IDENTITY PRIMARY KEY,
    user_id BIGINT,
    desired_role VARCHAR(128),
    experience VARCHAR(32),
    priority VARCHAR(32),
    time_commitment VARCHAR(32),
    answers_json CLOB,
    resume_text CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questionnaire_user FOREIGN KEY (user_id) REFERENCES users(id)
);
