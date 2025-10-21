CREATE TABLE IF NOT EXISTS roadmaps (
    id IDENTITY PRIMARY KEY,
    user_id BIGINT,
    questionnaire_id BIGINT,
    role VARCHAR(128),
    experience VARCHAR(32),
    priority VARCHAR(32),
    time_commitment VARCHAR(32),
    source VARCHAR(32),
    content_json CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_roadmap_questionnaire FOREIGN KEY (questionnaire_id) REFERENCES questionnaire_responses(id)
);
