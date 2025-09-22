import { createClient } from '../supabase/client'

export interface ChatChannel {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'direct'
  company_id: string
  created_by: string
  created_at: string
  updated_at: string
  // Dados relacionados
  member_count?: number
  last_message?: string
  last_message_at?: string
}

export interface ChatMember {
  id: string
  channel_id: string
  profile_id: string
  role: 'admin' | 'member'
  joined_at: string
  // Dados relacionados
  full_name?: string
  avatar_url?: string
}

export interface Message {
  id: string
  channel_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'file' | 'image'
  file_url?: string
  reply_to?: string
  edited_at?: string
  created_at: string
  // Dados relacionados
  sender_name?: string
  sender_avatar?: string
  reply_content?: string
}

export interface CreateChannelData {
  name: string
  description?: string
  type: 'public' | 'private' | 'direct'
  company_id: string
  created_by: string
}

export interface UpdateChannelData {
  name?: string
  description?: string
}

export interface CreateMessageData {
  channel_id: string
  sender_id: string
  content: string
  message_type?: 'text' | 'file' | 'image'
  file_url?: string
  reply_to?: string
}

export interface UpdateMessageData {
  content: string
}

class ChatAPI {
  private supabase = createClient()

  // CANAIS
  async getAllChannels(): Promise<{ data: ChatChannel[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_channels')
        .select(`
          *,
          member_count:chat_members(count)
        `)
        .order('updated_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar canais:', error)
      return { data: null, error }
    }
  }

  async getChannelById(id: string): Promise<{ data: ChatChannel | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_channels')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar canal:', error)
      return { data: null, error }
    }
  }

  async createChannel(channelData: CreateChannelData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_channels')
        .insert(channelData)
        .select()
        .single()

      if (data && !error) {
        // Adicionar o criador como admin do canal
        await this.addMemberToChannel(data.id, channelData.created_by, 'admin')
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar canal:', error)
      return { data: null, error }
    }
  }

  async updateChannel(id: string, channelData: UpdateChannelData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_channels')
        .update(channelData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar canal:', error)
      return { data: null, error }
    }
  }

  async deleteChannel(id: string): Promise<{ error: any }> {
    try {
      // Deletar mensagens do canal
      await this.supabase
        .from('messages')
        .delete()
        .eq('channel_id', id)

      // Deletar membros do canal
      await this.supabase
        .from('chat_members')
        .delete()
        .eq('channel_id', id)

      // Deletar o canal
      const { error } = await this.supabase
        .from('chat_channels')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar canal:', error)
      return { error }
    }
  }

  // MEMBROS
  async getChannelMembers(channelId: string): Promise<{ data: ChatMember[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_members')
        .select(`
          *,
          full_name:profiles(full_name),
          avatar_url:profiles(avatar_url)
        `)
        .eq('channel_id', channelId)
        .order('joined_at')

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(member => ({
        ...member,
        full_name: member.full_name?.full_name,
        avatar_url: member.avatar_url?.avatar_url
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar membros do canal:', error)
      return { data: null, error }
    }
  }

  async addMemberToChannel(channelId: string, profileId: string, role: 'admin' | 'member' = 'member'): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_members')
        .insert({
          channel_id: channelId,
          profile_id: profileId,
          role
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao adicionar membro ao canal:', error)
      return { data: null, error }
    }
  }

  async removeMemberFromChannel(channelId: string, profileId: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('chat_members')
        .delete()
        .eq('channel_id', channelId)
        .eq('profile_id', profileId)

      return { error }
    } catch (error) {
      console.error('Erro ao remover membro do canal:', error)
      return { error }
    }
  }

  async updateMemberRole(channelId: string, profileId: string, role: 'admin' | 'member'): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('chat_members')
        .update({ role })
        .eq('channel_id', channelId)
        .eq('profile_id', profileId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar papel do membro:', error)
      return { data: null, error }
    }
  }

  // MENSAGENS
  async getChannelMessages(channelId: string, limit: number = 50): Promise<{ data: Message[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select(`
          *,
          sender_name:profiles(full_name),
          sender_avatar:profiles(avatar_url),
          reply_content:reply_to(content)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(limit)

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(message => ({
        ...message,
        sender_name: message.sender_name?.full_name,
        sender_avatar: message.sender_avatar?.avatar_url,
        reply_content: message.reply_content?.content
      })).reverse() // Reverter para ordem cronológica

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar mensagens do canal:', error)
      return { data: null, error }
    }
  }

  async sendMessage(messageData: CreateMessageData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          ...messageData,
          message_type: messageData.message_type || 'text'
        })
        .select()
        .single()

      // Atualizar o timestamp do canal
      if (data && !error) {
        await this.supabase
          .from('chat_channels')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', messageData.channel_id)
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return { data: null, error }
    }
  }

  async updateMessage(id: string, messageData: UpdateMessageData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .update({
          content: messageData.content,
          edited_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error)
      return { data: null, error }
    }
  }

  async deleteMessage(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('messages')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      return { error }
    }
  }

  // BUSCA
  async searchMessages(channelId: string, query: string): Promise<{ data: Message[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select(`
          *,
          sender_name:profiles(full_name),
          sender_avatar:profiles(avatar_url)
        `)
        .eq('channel_id', channelId)
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(message => ({
        ...message,
        sender_name: message.sender_name?.full_name,
        sender_avatar: message.sender_avatar?.avatar_url
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return { data: null, error }
    }
  }

  // ESTATÍSTICAS
  async getChatStats(): Promise<{ data: any; error: any }> {
    try {
      const { data: channels, error: channelsError } = await this.supabase
        .from('chat_channels')
        .select('id, type')

      if (channelsError) {
        return { data: null, error: channelsError }
      }

      const { data: messages, error: messagesError } = await this.supabase
        .from('messages')
        .select('id, created_at')

      if (messagesError) {
        return { data: null, error: messagesError }
      }

      const { data: members, error: membersError } = await this.supabase
        .from('chat_members')
        .select('id')

      if (membersError) {
        return { data: null, error: membersError }
      }

      // Mensagens do último mês
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      
      const recentMessages = messages?.filter(m => 
        new Date(m.created_at) > lastMonth
      ).length || 0

      // Canais por tipo
      const channelsByType = channels?.reduce((acc: any, channel: any) => {
        acc[channel.type] = (acc[channel.type] || 0) + 1
        return acc
      }, {}) || {}

      const stats = {
        totalChannels: channels?.length || 0,
        totalMessages: messages?.length || 0,
        totalMembers: members?.length || 0,
        recentMessages,
        channelsByType
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas do chat:', error)
      return { data: null, error }
    }
  }

  // TEMPO REAL
  subscribeToChannel(channelId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        callback
      )
      .subscribe()
  }

  unsubscribeFromChannel(subscription: any) {
    return this.supabase.removeChannel(subscription)
  }
}

export const chatAPI = new ChatAPI()
