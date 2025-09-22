import { createClient } from '../supabase/client'

export interface GamificationProfile {
  id: string
  profile_id: string
  points: number
  level: number
  experience: number
  badges: string[]
  achievements: Achievement[]
  created_at: string
  updated_at: string
  // Dados relacionados
  employee_name?: string
  employee_position?: string
  avatar_url?: string
  ranking?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  unlocked_at: string
  progress?: number
  max_progress?: number
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'monthly'
  points_reward: number
  requirements: any
  active: boolean
  start_date: string
  end_date: string
  created_at: string
  // Dados relacionados
  participation_count?: number
  completion_rate?: number
}

export interface ChallengeParticipation {
  id: string
  challenge_id: string
  profile_id: string
  progress: number
  completed: boolean
  completed_at?: string
  created_at: string
  // Dados relacionados
  challenge_name?: string
  employee_name?: string
  points_reward?: number
}

export interface CreateChallengeData {
  name: string
  description: string
  type: 'daily' | 'weekly' | 'monthly'
  points_reward: number
  requirements: any
  start_date: string
  end_date: string
}

export interface UpdateChallengeData {
  name?: string
  description?: string
  points_reward?: number
  requirements?: any
  active?: boolean
  start_date?: string
  end_date?: string
}

export interface UpdateParticipationData {
  progress: number
  completed?: boolean
}

class GamificationAPI {
  private supabase = createClient()

  // PERFIS DE GAMIFICAÇÃO
  async getAllProfiles(): Promise<{ data: GamificationProfile[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('gamification_ranking')
        .select('*')
        .order('points', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar perfis de gamificação:', error)
      return { data: null, error }
    }
  }

  async getProfileById(profileId: string): Promise<{ data: GamificationProfile | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('gamification')
        .select(`
          *,
          employee_name:profiles(full_name),
          employee_position:employees(position),
          avatar_url:profiles(avatar_url)
        `)
        .eq('profile_id', profileId)
        .single()

      if (data) {
        data.employee_name = data.employee_name?.full_name
        data.employee_position = data.employee_position?.position
        data.avatar_url = data.avatar_url?.avatar_url
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar perfil de gamificação:', error)
      return { data: null, error }
    }
  }

  async createProfile(profileId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('gamification')
        .insert({
          profile_id: profileId,
          points: 0,
          level: 1,
          experience: 0,
          badges: [],
          achievements: []
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar perfil de gamificação:', error)
      return { data: null, error }
    }
  }

  async updateProfile(profileId: string, updates: Partial<GamificationProfile>): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('gamification')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar perfil de gamificação:', error)
      return { data: null, error }
    }
  }

  // PONTOS E NÍVEIS
  async addPoints(profileId: string, points: number, reason?: string): Promise<{ data: any; error: any }> {
    try {
      // Buscar perfil atual
      const { data: currentProfile, error: fetchError } = await this.getProfileById(profileId)
      
      if (fetchError) {
        return { data: null, error: fetchError }
      }

      if (!currentProfile) {
        // Criar perfil se não existir
        await this.createProfile(profileId)
        const { data: newProfile } = await this.getProfileById(profileId)
        currentProfile = newProfile
      }

      const newPoints = currentProfile.points + points
      const newExperience = currentProfile.experience + points
      
      // Calcular novo nível (exemplo: a cada 1000 XP = 1 nível)
      const newLevel = Math.floor(newExperience / 1000) + 1

      const { data, error } = await this.updateProfile(profileId, {
        points: newPoints,
        experience: newExperience,
        level: newLevel
      })

      // Registrar log da atividade se necessário
      if (reason) {
        await this.logActivity(profileId, 'points_earned', {
          points,
          reason,
          total_points: newPoints
        })
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error)
      return { data: null, error }
    }
  }

  async removePoints(profileId: string, points: number, reason?: string): Promise<{ data: any; error: any }> {
    try {
      const { data: currentProfile, error: fetchError } = await this.getProfileById(profileId)
      
      if (fetchError || !currentProfile) {
        return { data: null, error: fetchError || new Error('Perfil não encontrado') }
      }

      const newPoints = Math.max(0, currentProfile.points - points)
      
      const { data, error } = await this.updateProfile(profileId, {
        points: newPoints
      })

      if (reason) {
        await this.logActivity(profileId, 'points_removed', {
          points,
          reason,
          total_points: newPoints
        })
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao remover pontos:', error)
      return { data: null, error }
    }
  }

  // CONQUISTAS E BADGES
  async unlockAchievement(profileId: string, achievement: Achievement): Promise<{ data: any; error: any }> {
    try {
      const { data: currentProfile, error: fetchError } = await this.getProfileById(profileId)
      
      if (fetchError || !currentProfile) {
        return { data: null, error: fetchError || new Error('Perfil não encontrado') }
      }

      // Verificar se a conquista já foi desbloqueada
      const hasAchievement = currentProfile.achievements.some(a => a.id === achievement.id)
      if (hasAchievement) {
        return { data: currentProfile, error: null }
      }

      const newAchievements = [...currentProfile.achievements, {
        ...achievement,
        unlocked_at: new Date().toISOString()
      }]

      const { data, error } = await this.updateProfile(profileId, {
        achievements: newAchievements
      })

      // Adicionar pontos da conquista
      if (achievement.points > 0) {
        await this.addPoints(profileId, achievement.points, `Conquista: ${achievement.name}`)
      }

      await this.logActivity(profileId, 'achievement_unlocked', {
        achievement_id: achievement.id,
        achievement_name: achievement.name,
        points: achievement.points
      })

      return { data, error }
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error)
      return { data: null, error }
    }
  }

  async addBadge(profileId: string, badge: string): Promise<{ data: any; error: any }> {
    try {
      const { data: currentProfile, error: fetchError } = await this.getProfileById(profileId)
      
      if (fetchError || !currentProfile) {
        return { data: null, error: fetchError || new Error('Perfil não encontrado') }
      }

      // Verificar se o badge já existe
      if (currentProfile.badges.includes(badge)) {
        return { data: currentProfile, error: null }
      }

      const newBadges = [...currentProfile.badges, badge]

      const { data, error } = await this.updateProfile(profileId, {
        badges: newBadges
      })

      await this.logActivity(profileId, 'badge_earned', {
        badge
      })

      return { data, error }
    } catch (error) {
      console.error('Erro ao adicionar badge:', error)
      return { data: null, error }
    }
  }

  // DESAFIOS
  async getAllChallenges(): Promise<{ data: Challenge[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .select(`
          *,
          participation_count:challenge_participations(count)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar desafios:', error)
      return { data: null, error }
    }
  }

  async getChallengeById(id: string): Promise<{ data: Challenge | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar desafio:', error)
      return { data: null, error }
    }
  }

  async createChallenge(challengeData: CreateChallengeData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .insert({
          ...challengeData,
          active: true
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar desafio:', error)
      return { data: null, error }
    }
  }

  async updateChallenge(id: string, challengeData: UpdateChallengeData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .update(challengeData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar desafio:', error)
      return { data: null, error }
    }
  }

  async deleteChallenge(id: string): Promise<{ error: any }> {
    try {
      // Deletar participações do desafio
      await this.supabase
        .from('challenge_participations')
        .delete()
        .eq('challenge_id', id)

      // Deletar o desafio
      const { error } = await this.supabase
        .from('challenges')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar desafio:', error)
      return { error }
    }
  }

  // PARTICIPAÇÕES EM DESAFIOS
  async joinChallenge(challengeId: string, profileId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('challenge_participations')
        .insert({
          challenge_id: challengeId,
          profile_id: profileId,
          progress: 0,
          completed: false
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao participar do desafio:', error)
      return { data: null, error }
    }
  }

  async updateChallengeProgress(challengeId: string, profileId: string, progress: number): Promise<{ data: any; error: any }> {
    try {
      const { data: challenge } = await this.getChallengeById(challengeId)
      const maxProgress = challenge?.requirements?.max_progress || 100
      const completed = progress >= maxProgress

      const updateData: UpdateParticipationData = {
        progress,
        completed
      }

      const { data, error } = await this.supabase
        .from('challenge_participations')
        .update(completed ? {
          ...updateData,
          completed_at: new Date().toISOString()
        } : updateData)
        .eq('challenge_id', challengeId)
        .eq('profile_id', profileId)
        .select()
        .single()

      // Se completou o desafio, adicionar pontos
      if (completed && challenge) {
        await this.addPoints(profileId, challenge.points_reward, `Desafio completado: ${challenge.name}`)
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar progresso do desafio:', error)
      return { data: null, error }
    }
  }

  async getUserChallenges(profileId: string): Promise<{ data: ChallengeParticipation[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('challenge_participations')
        .select(`
          *,
          challenge_name:challenges(name),
          points_reward:challenges(points_reward)
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(participation => ({
        ...participation,
        challenge_name: participation.challenge_name?.name,
        points_reward: participation.points_reward?.points_reward
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar desafios do usuário:', error)
      return { data: null, error }
    }
  }

  // RANKING
  async getLeaderboard(limit: number = 10): Promise<{ data: GamificationProfile[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('gamification_ranking')
        .select('*')
        .order('points', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar ranking:', error)
      return { data: null, error }
    }
  }

  async getUserRanking(profileId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('gamification_ranking')
        .select('ranking, points, level')
        .eq('profile_id', profileId)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar ranking do usuário:', error)
      return { data: null, error }
    }
  }

  // ESTATÍSTICAS
  async getGamificationStats(): Promise<{ data: any; error: any }> {
    try {
      const { data: profiles, error: profilesError } = await this.supabase
        .from('gamification')
        .select('points, level, badges, achievements')

      if (profilesError) {
        return { data: null, error: profilesError }
      }

      const { data: challenges, error: challengesError } = await this.supabase
        .from('challenges')
        .select('id, type')
        .eq('active', true)

      if (challengesError) {
        return { data: null, error: challengesError }
      }

      const { data: participations, error: participationsError } = await this.supabase
        .from('challenge_participations')
        .select('completed')

      if (participationsError) {
        return { data: null, error: participationsError }
      }

      const totalUsers = profiles?.length || 0
      const totalPoints = profiles?.reduce((sum, p) => sum + p.points, 0) || 0
      const averageLevel = totalUsers > 0 ? profiles.reduce((sum, p) => sum + p.level, 0) / totalUsers : 0
      const totalBadges = profiles?.reduce((sum, p) => sum + p.badges.length, 0) || 0
      const totalAchievements = profiles?.reduce((sum, p) => sum + p.achievements.length, 0) || 0

      const activeChallenges = challenges?.length || 0
      const completedChallenges = participations?.filter(p => p.completed).length || 0
      const totalParticipations = participations?.length || 0

      const stats = {
        totalUsers,
        totalPoints,
        averagePoints: totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0,
        averageLevel: Math.round(averageLevel * 100) / 100,
        totalBadges,
        totalAchievements,
        activeChallenges,
        completedChallenges,
        totalParticipations,
        completionRate: totalParticipations > 0 ? Math.round((completedChallenges / totalParticipations) * 100) : 0
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de gamificação:', error)
      return { data: null, error }
    }
  }

  // LOG DE ATIVIDADES
  private async logActivity(profileId: string, action: string, details: any): Promise<void> {
    try {
      await this.supabase
        .from('activity_logs')
        .insert({
          profile_id: profileId,
          action,
          entity_type: 'gamification',
          details
        })
    } catch (error) {
      console.error('Erro ao registrar atividade:', error)
    }
  }
}

export const gamificationAPI = new GamificationAPI()
