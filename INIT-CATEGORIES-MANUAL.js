// Script pour créer manuellement les catégories par défaut
// À exécuter dans la console du navigateur (F12)

const userId = '875cfeef-3a24-4e1b-863e-56e496278f8f';

const categories = [
  { name: 'Logement', icon: '🏠', color: '#3b82f6' },
  { name: 'Alimentation', icon: '🛒', color: '#10b981' },
  { name: 'Transport', icon: '🚗', color: '#f59e0b' },
  { name: 'Loisirs', icon: '🎮', color: '#8b5cf6' },
  { name: 'Santé', icon: '❤️', color: '#ef4444' },
  { name: 'Abonnements', icon: '💳', color: '#06b6d4' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Autres', icon: '➕', color: '#6b7280' }
];

async function createCategories() {
  console.log('🚀 Création des catégories...');
  
  for (const cat of categories) {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(cat)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ ${cat.icon} ${cat.name} créée`);
      } else {
        console.error(`❌ Erreur pour ${cat.name}:`, data.error);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${cat.name}:`, error);
    }
  }
  
  console.log('✅ Terminé ! Rafraîchissez la page (F5)');
}

// Exécuter
createCategories();
