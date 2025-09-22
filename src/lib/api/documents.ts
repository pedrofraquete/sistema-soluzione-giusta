import { createClient } from '../supabase/client'

export interface Document {
  id: string
  name: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  folder?: string
  tags: string[]
  company_id: string
  uploaded_by: string
  is_public: boolean
  version: number
  created_at: string
  updated_at: string
  // Dados relacionados
  company_name?: string
  uploaded_by_name?: string
  permission?: 'read' | 'write' | 'admin'
}

export interface DocumentPermission {
  id: string
  document_id: string
  profile_id: string
  permission: 'read' | 'write' | 'admin'
  granted_by: string
  created_at: string
  // Dados relacionados
  profile_name?: string
  granted_by_name?: string
}

export interface CreateDocumentData {
  name: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  folder?: string
  tags?: string[]
  company_id: string
  uploaded_by: string
  is_public?: boolean
}

export interface UpdateDocumentData {
  name?: string
  description?: string
  folder?: string
  tags?: string[]
  is_public?: boolean
}

export interface CreatePermissionData {
  document_id: string
  profile_id: string
  permission: 'read' | 'write' | 'admin'
  granted_by: string
}

class DocumentsAPI {
  private supabase = createClient()

  // DOCUMENTOS
  async getAllDocuments(): Promise<{ data: Document[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          company_name:companies(name),
          uploaded_by_name:profiles(full_name)
        `)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(document => ({
        ...document,
        company_name: document.company_name?.name,
        uploaded_by_name: document.uploaded_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      return { data: null, error }
    }
  }

  async getDocumentById(id: string): Promise<{ data: Document | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          company_name:companies(name),
          uploaded_by_name:profiles(full_name)
        `)
        .eq('id', id)
        .single()

      if (data) {
        data.company_name = data.company_name?.name
        data.uploaded_by_name = data.uploaded_by_name?.full_name
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar documento:', error)
      return { data: null, error }
    }
  }

  async createDocument(documentData: CreateDocumentData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .insert({
          ...documentData,
          tags: documentData.tags || [],
          is_public: documentData.is_public || false,
          version: 1
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      return { data: null, error }
    }
  }

  async updateDocument(id: string, documentData: UpdateDocumentData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar documento:', error)
      return { data: null, error }
    }
  }

  async deleteDocument(id: string): Promise<{ error: any }> {
    try {
      // Deletar permissões do documento
      await this.supabase
        .from('document_permissions')
        .delete()
        .eq('document_id', id)

      // Deletar o documento
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
      return { error }
    }
  }

  // BUSCA E FILTROS
  async searchDocuments(query: string): Promise<{ data: Document[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          company_name:companies(name),
          uploaded_by_name:profiles(full_name)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(document => ({
        ...document,
        company_name: document.company_name?.name,
        uploaded_by_name: document.uploaded_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      return { data: null, error }
    }
  }

  async getDocumentsByFolder(folder: string): Promise<{ data: Document[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          company_name:companies(name),
          uploaded_by_name:profiles(full_name)
        `)
        .eq('folder', folder)
        .order('name')

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(document => ({
        ...document,
        company_name: document.company_name?.name,
        uploaded_by_name: document.uploaded_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar documentos por pasta:', error)
      return { data: null, error }
    }
  }

  async getDocumentsByType(fileType: string): Promise<{ data: Document[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          company_name:companies(name),
          uploaded_by_name:profiles(full_name)
        `)
        .eq('file_type', fileType)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(document => ({
        ...document,
        company_name: document.company_name?.name,
        uploaded_by_name: document.uploaded_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar documentos por tipo:', error)
      return { data: null, error }
    }
  }

  async getDocumentsByTag(tag: string): Promise<{ data: Document[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          *,
          company_name:companies(name),
          uploaded_by_name:profiles(full_name)
        `)
        .contains('tags', [tag])
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(document => ({
        ...document,
        company_name: document.company_name?.name,
        uploaded_by_name: document.uploaded_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar documentos por tag:', error)
      return { data: null, error }
    }
  }

  // PERMISSÕES
  async getDocumentPermissions(documentId: string): Promise<{ data: DocumentPermission[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('document_permissions')
        .select(`
          *,
          profile_name:profiles(full_name),
          granted_by_name:granted_by(full_name)
        `)
        .eq('document_id', documentId)
        .order('created_at')

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(permission => ({
        ...permission,
        profile_name: permission.profile_name?.full_name,
        granted_by_name: permission.granted_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar permissões do documento:', error)
      return { data: null, error }
    }
  }

  async grantPermission(permissionData: CreatePermissionData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('document_permissions')
        .upsert(permissionData, {
          onConflict: 'document_id,profile_id'
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao conceder permissão:', error)
      return { data: null, error }
    }
  }

  async revokePermission(documentId: string, profileId: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('document_permissions')
        .delete()
        .eq('document_id', documentId)
        .eq('profile_id', profileId)

      return { error }
    } catch (error) {
      console.error('Erro ao revogar permissão:', error)
      return { error }
    }
  }

  async updatePermission(documentId: string, profileId: string, permission: 'read' | 'write' | 'admin'): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('document_permissions')
        .update({ permission })
        .eq('document_id', documentId)
        .eq('profile_id', profileId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error)
      return { data: null, error }
    }
  }

  // ESTATÍSTICAS
  async getDocumentStats(): Promise<{ data: any; error: any }> {
    try {
      const { data: documents, error: documentsError } = await this.supabase
        .from('documents')
        .select('file_type, file_size, folder, created_at')

      if (documentsError) {
        return { data: null, error: documentsError }
      }

      // Calcular estatísticas
      const totalDocuments = documents?.length || 0
      const totalSize = documents?.reduce((sum, doc) => sum + doc.file_size, 0) || 0

      // Documentos por tipo
      const documentsByType = documents?.reduce((acc: any, doc: any) => {
        acc[doc.file_type] = (acc[doc.file_type] || 0) + 1
        return acc
      }, {}) || {}

      // Documentos por pasta
      const documentsByFolder = documents?.reduce((acc: any, doc: any) => {
        const folder = doc.folder || 'Sem pasta'
        acc[folder] = (acc[folder] || 0) + 1
        return acc
      }, {}) || {}

      // Documentos recentes (último mês)
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      
      const recentDocuments = documents?.filter(doc => 
        new Date(doc.created_at) > lastMonth
      ).length || 0

      const stats = {
        totalDocuments,
        totalSize,
        averageSize: totalDocuments > 0 ? Math.round(totalSize / totalDocuments) : 0,
        recentDocuments,
        documentsByType,
        documentsByFolder
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de documentos:', error)
      return { data: null, error }
    }
  }

  // PASTAS
  async getFolders(): Promise<{ data: string[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('folder')
        .not('folder', 'is', null)

      if (error) {
        return { data: null, error }
      }

      // Extrair pastas únicas
      const folders = [...new Set(data?.map(doc => doc.folder).filter(Boolean))] as string[]

      return { data: folders, error: null }
    } catch (error) {
      console.error('Erro ao buscar pastas:', error)
      return { data: null, error }
    }
  }

  // TAGS
  async getTags(): Promise<{ data: string[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('tags')

      if (error) {
        return { data: null, error }
      }

      // Extrair todas as tags únicas
      const allTags = data?.flatMap(doc => doc.tags || []) || []
      const uniqueTags = [...new Set(allTags)] as string[]

      return { data: uniqueTags, error: null }
    } catch (error) {
      console.error('Erro ao buscar tags:', error)
      return { data: null, error }
    }
  }

  // VERSIONING
  async createNewVersion(documentId: string, fileUrl: string, uploadedBy: string): Promise<{ data: any; error: any }> {
    try {
      // Buscar documento atual
      const { data: currentDoc, error: fetchError } = await this.getDocumentById(documentId)
      
      if (fetchError || !currentDoc) {
        return { data: null, error: fetchError || new Error('Documento não encontrado') }
      }

      // Criar nova versão
      const { data, error } = await this.supabase
        .from('documents')
        .update({
          file_url: fileUrl,
          version: currentDoc.version + 1,
          uploaded_by: uploadedBy
        })
        .eq('id', documentId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar nova versão:', error)
      return { data: null, error }
    }
  }
}

export const documentsAPI = new DocumentsAPI()
