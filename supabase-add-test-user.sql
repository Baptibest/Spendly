-- Ajouter un compte utilisateur test
-- Email: test@spendly.com
-- Password: test123
-- Role: user

INSERT INTO users (email, password_hash, role)
VALUES ('test@spendly.com', 'test123', 'user')
ON CONFLICT (email) DO NOTHING;
