import { supabase } from './supabase';

export interface AchievementProgress {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export class AchievementService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Récupérer tous les succès débloqués de l'utilisateur
  async getUnlockedAchievements(): Promise<string[]> {
    console.log('🔍 Récupération des succès pour user:', this.userId);
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', this.userId);

    if (error) {
      console.error('❌ Erreur récupération succès:', error);
      return [];
    }

    console.log('✅ Succès récupérés:', data);
    return data?.map(a => a.achievement_id) || [];
  }

  // Débloquer un succès
  async unlockAchievement(achievementId: string): Promise<boolean> {
    console.log('🎯 Tentative de débloquage:', achievementId, 'pour user:', this.userId);
    
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: this.userId,
        achievement_id: achievementId
      })
      .select();

    if (error) {
      // Si l'erreur est due à un doublon, ce n'est pas grave
      if (error.code === '23505') {
        console.log('⚠️ Succès déjà débloqué:', achievementId);
        return true;
      }
      console.error('❌ Erreur débloquage succès:', achievementId, error);
      return false;
    }

    console.log('✅ Succès débloqué avec succès:', achievementId, data);
    return true;
  }

  // Vérifier et débloquer les succès basés sur les dépenses
  async checkExpenseAchievements(): Promise<void> {
    console.log('💰 Vérification des succès de dépenses...');
    
    // Récupérer le nombre total de dépenses
    const { count: expenseCount, error } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId);

    if (error) {
      console.error('❌ Erreur récupération dépenses:', error);
      return;
    }

    console.log('📊 Nombre de dépenses:', expenseCount);

    // Première dépense
    if (expenseCount && expenseCount >= 1) {
      console.log('🎉 Condition remplie: Première dépense');
      await this.unlockAchievement('first-expense');
    }

    // 10 dépenses
    if (expenseCount && expenseCount >= 10) {
      console.log('🎉 Condition remplie: 10 dépenses');
      await this.unlockAchievement('10-expenses');
    }

    // 50 dépenses (Assidu)
    if (expenseCount && expenseCount >= 50) {
      console.log('🎉 Condition remplie: 50 dépenses');
      await this.unlockAchievement('50-expenses');
    }

    // Vérifier les dépenses consécutives pour "Cochon qui Flambe"
    await this.checkDailyExpenseStreak();

    // Vérifier l'absence de dépenses pour "Vous êtes un Rat"
    await this.checkNoExpenseStreak();
  }

  // Vérifier les succès basés sur les budgets
  async checkBudgetAchievements(): Promise<void> {
    // Récupérer le nombre de budgets
    const { count: budgetCount } = await supabase
      .from('budgets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId);

    // Premier budget
    if (budgetCount && budgetCount >= 1) {
      await this.unlockAchievement('first-budget');
    }

    // Vérifier si tous les budgets sont respectés ce mois
    await this.checkBudgetsRespected();
  }

  // Vérifier les succès basés sur les catégories
  async checkCategoryAchievements(): Promise<void> {
    const { count: categoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId);

    // Première catégorie personnalisée
    if (categoryCount && categoryCount >= 1) {
      await this.unlockAchievement('first-category');
    }
  }

  // Vérifier si tous les budgets sont respectés
  private async checkBudgetsRespected(): Promise<void> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Récupérer tous les budgets avec leur date de création
    const { data: budgets } = await supabase
      .from('budgets')
      .select('id, amount, category_id, created_at')
      .eq('user_id', this.userId);

    if (!budgets || budgets.length === 0) return;

    // Vérifier qu'au moins 1 mois s'est écoulé depuis la création du budget le plus ancien
    const oldestBudget = budgets.reduce((oldest, budget) => {
      const budgetDate = new Date(budget.created_at);
      const oldestDate = new Date(oldest.created_at);
      return budgetDate < oldestDate ? budget : oldest;
    });

    const oldestBudgetDate = new Date(oldestBudget.created_at);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Si le budget le plus ancien a moins d'1 mois, on ne vérifie pas
    if (oldestBudgetDate > oneMonthAgo) {
      console.log('⏳ Budgets trop récents, minimum 1 mois requis');
      return;
    }

    let allRespected = true;

    for (const budget of budgets) {
      // Calculer les dépenses pour cette catégorie ce mois
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', this.userId)
        .eq('category_id', budget.category_id)
        .gte('expense_date', firstDay.toISOString().split('T')[0])
        .lte('expense_date', lastDay.toISOString().split('T')[0]);

      const totalSpent = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

      if (totalSpent > budget.amount) {
        allRespected = false;
        break;
      }
    }

    if (allRespected && budgets.length > 0) {
      console.log('🎉 Budget respecté pendant 1 mois minimum !');
      await this.unlockAchievement('budget-respected');
      
      // Si tous les budgets respectés (minimum 3 budgets)
      if (budgets.length >= 3) {
        console.log('🎉 Maîtrise totale - Tous les budgets respectés !');
        await this.unlockAchievement('all-budgets-respected');
      }
    }
  }

  // Vérifier les dépenses quotidiennes consécutives
  private async checkDailyExpenseStreak(): Promise<void> {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('expense_date')
      .eq('user_id', this.userId)
      .order('expense_date', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Erreur vérification streak:', error);
      return;
    }

    if (!expenses || expenses.length < 5) return;

    // Vérifier si on a une dépense par jour pendant 5 jours consécutifs
    const dates = expenses.map(e => new Date(e.expense_date).toDateString());
    const uniqueDates = [...new Set(dates)];

    if (uniqueDates.length >= 5) {
      // Vérifier la consécutivité
      let consecutive = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = Math.abs((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          consecutive++;
          if (consecutive >= 5) {
            await this.unlockAchievement('daily-expense-5-days');
            break;
          }
        } else {
          consecutive = 1;
        }
      }
    }
  }

  // Vérifier l'absence de dépenses pendant 5 jours
  private async checkNoExpenseStreak(): Promise<void> {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const { count, error } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId)
      .gte('expense_date', fiveDaysAgo.toISOString().split('T')[0]);
    
    if (error) {
      console.error('❌ Erreur vérification no expense:', error);
      return;
    }

    if (count === 0) {
      await this.unlockAchievement('no-expense-5-days');
    }
  }

  // Vérifier le solde négatif
  async checkBalanceAchievements(): Promise<void> {
    // Calculer le solde total
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', this.userId);

    const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

    // Si le solde est à -500€ ou moins
    if (totalExpenses >= 500) {
      await this.unlockAchievement('broke-500');
    }
  }

  // Vérifier tous les succès
  async checkAllAchievements(): Promise<void> {
    await Promise.all([
      this.checkExpenseAchievements(),
      this.checkBudgetAchievements(),
      this.checkCategoryAchievements(),
      this.checkBalanceAchievements()
    ]);

    // Vérifier le succès Perfectionniste (tous les autres débloqués)
    const unlockedIds = await this.getUnlockedAchievements();
    if (unlockedIds.length >= 19) { // 20 succès - 1 (Perfectionniste)
      await this.unlockAchievement('all-achievements');
    }
  }
}
