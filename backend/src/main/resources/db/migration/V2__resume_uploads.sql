CREATE TABLE IF NOT EXISTS resume_uploads (
    id IDENTITY PRIMARY KEY,
    user_id BIGINT,
    filename VARCHAR(512) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users(id)
);
