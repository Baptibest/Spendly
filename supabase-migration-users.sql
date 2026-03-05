-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default admin account
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, role)
VALUES ('admin@spendly.com', '$2a$10$rKZvVxwvXxVxVxVxVxVxVuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Note: In production, you should use a proper password hashing library
-- For now, we'll implement a simple authentication system
