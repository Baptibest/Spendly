-- Script pour supprimer TOUTES les dépenses de TOUS les utilisateurs
-- ATTENTION : Cette action est irréversible !

-- Supprimer toutes les dépenses
DELETE FROM expenses;

-- Vérifier que la table est vide
SELECT COUNT(*) as remaining_expenses FROM expenses;

-- Afficher les utilisateurs existants
SELECT id, email, role FROM users;
