'use client';

import React, { useState, useEffect } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image' | 'other';
  size: string;
  author: string;
  modified: string;
  tags: string[];
  folder: string;
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Relatório Financeiro Q3 2025',
      type: 'pdf',
      size: '2.4 MB',
      author: 'Renata Bariani',
      modified: 'hoje',
      tags: ['Confidencial', 'Financeiro'],
      folder: 'financeiro'
    },
    {
      id: '2',
      name: 'Manual do Sistema Journey 100k',
      type: 'docx',
      size: '1.8 MB',
      author: 'André Luiz',
      modified: 'Há 2 horas',
      tags: ['Documentação', 'Sistema'],
      folder: 'tech'
    },
    {
      id: '3',
      name: 'Planilha de Projetos Ativos',
      type: 'xlsx',
      size: '876 KB',
      author: 'Camila Mantovani',
      modified: 'Ontem',
      tags: ['Projetos', 'Planilha'],
      folder: 'projetos'
    },
    {
      id: '4',
      name: 'Apresentação Marketing Digital',
      type: 'pptx',
      size: '5.2 MB',
      author: 'Caroline Lanzilotti',
      modified: 'Há 3 dias',
      tags: ['Marketing', 'Digital'],
      folder: 'marketing'
    },
    {
      id: '5',
      name: 'Logo Soluzione Giusta Oficial',
      type: 'image',
      size: '432 KB',
      author: 'Pedro Fraquete',
      modified: 'Há 1 semana',
      tags: ['Logo', 'Oficial'],
      folder: 'soluzione'
    },
    {
      id: '6',
      name: 'Contrato Cliente ABC Corp',
      type: 'pdf',
      size: '1.2 MB',
      author: 'Roberto Silva',
      modified: 'Há 2 semanas',
      tags: ['Importante', 'Contrato'],
      folder: 'juridico'
    }
  ];

  const folders = [
    { id: 'all', name: 'Todos os Documentos', icon: 'fas fa-folder', count: 2847 },
    { id: 'favorites', name: 'Favoritos', icon: 'fas fa-star', count: 34 },
    { id: 'recent', name: 'Recentes', icon: 'fas fa-clock', count: 67 },
    { id: 'shared', name: 'Compartilhados', icon: 'fas fa-share-alt', count: 156 },
    { id: 'soluzione', name: 'Soluzione Giusta', icon: 'fas fa-building', count: 892 },
    { id: 'tech', name: 'SG Tech', icon: 'fas fa-code', count: 456 },
    { id: 'marketing', name: 'SG Marketing', icon: 'fas fa-bullhorn', count: 234 },
    { id: 'consultoria', name: 'SG Consultoria', icon: 'fas fa-handshake', count: 189 },
    { id: 'financeiro', name: 'Financeiro', icon: 'fas fa-chart-line', count: 321 },
    { id: 'rh', name: 'RH', icon: 'fas fa-users', count: 167 },
    { id: 'juridico', name: 'Jurídico', icon: 'fas fa-gavel', count: 89 },
    { id: 'trash', name: 'Lixeira', icon: 'fas fa-trash', count: 12 }
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
  }, []);

  const getDocumentIcon = (type: string) => {
    const icons = {
      pdf: 'fas fa-file-pdf',
      docx: 'fas fa-file-word',
      xlsx: 'fas fa-file-excel',
      pptx: 'fas fa-file-powerpoint',
      image: 'fas fa-file-image',
      other: 'fas fa-file-archive'
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  const getDocumentIconColor = (type: string) => {
    const colors = {
      pdf: 'linear-gradient(135deg, #ef4444, #dc2626)',
      docx: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      xlsx: 'linear-gradient(135deg, #10b981, #059669)',
      pptx: 'linear-gradient(135deg, #f59e0b, #d97706)',
      image: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      other: 'linear-gradient(135deg, #64748b, #475569)'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f8fafc', color: '#334155', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <nav style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        padding: '20px 0',
        zIndex: 1000,
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '0 25px 30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
          <i className="fas fa-rocket" style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
            marginBottom: '10px'
          }}></i>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '10px' }}>Journey 100k</h1>
        </div>
        
        <ul style={{ listStyle: 'none', padding: '0 15px' }}>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/dashboard'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-chart-pie" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Dashboard</span>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/funcionarios'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-users" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Funcionários</span>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/projetos'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Projetos</span>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/financeiro'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <i className="fas fa-dollar-sign" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Financeiro</span>
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}></div>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/chat'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <i className="fas fa-comments" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Chat</span>
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}></div>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/ponto'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-clock" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Ponto Digital</span>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: '#3b82f6',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transform: 'translateX(5px)'
            }}>
              <i className="fas fa-file-alt" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Documentos</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '280px', minHeight: '100vh' }}>
        {/* HEADER */}
        <header style={{
          background: 'white',
          padding: '20px 40px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>Documentos</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Sistema de gerenciamento de documentos corporativos - Journey 100k</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>PF</div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Pedro Fraquete</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>CEO • Online</p>
            </div>
          </div>
        </header>

        {/* DOCUMENTS CONTENT */}
        <div style={{ padding: '40px' }}>
          {/* STATISTICS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '5px' }}>2,847</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Total de Documentos</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '5px' }}>23</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Adicionados Hoje</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '5px' }}>156</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Compartilhados</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '5px' }}>47.2 GB</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Armazenamento Usado</div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div style={{
            background: 'white',
            padding: '25px 30px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ position: 'relative', minWidth: '300px' }}>
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 45px 12px 15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="fas fa-search" style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}></i>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: viewMode === 'grid' ? '#3b82f6' : '#64748b',
                    boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: viewMode === 'list' ? 'white' : 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: viewMode === 'list' ? '#3b82f6' : '#64748b',
                    boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 25px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-upload"></i>
                Fazer Upload
              </button>
            </div>
          </div>

          {/* UPLOAD DROPZONE */}
          <div
            onClick={() => setShowUploadModal(true)}
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px' }}></i>
            <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>Arraste arquivos aqui</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ou clique para selecionar arquivos do seu computador</p>
          </div>

          {/* MAIN LAYOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
            {/* FOLDERS SIDEBAR */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              height: 'fit-content',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-folder-open"></i>
                Pastas
              </div>
              <ul style={{ listStyle: 'none' }}>
                {folders.map((folder) => (
                  <li key={folder.id} style={{ marginBottom: '8px' }}>
                    <div
                      onClick={() => setSelectedFolder(folder.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 15px',
                        color: selectedFolder === folder.id ? '#3b82f6' : '#64748b',
                        background: selectedFolder === folder.id ? '#f0f9ff' : 'transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className={folder.icon} style={{ fontSize: '1rem', minWidth: '16px' }}></i>
                      <span>{folder.name}</span>
                      <span style={{
                        marginLeft: 'auto',
                        background: selectedFolder === folder.id ? '#3b82f6' : '#e2e8f0',
                        color: selectedFolder === folder.id ? 'white' : '#64748b',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>{folder.count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* DOCUMENTS AREA */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>
                  {folders.find(f => f.id === selectedFolder)?.name || 'Todos os Documentos'}
                </h3>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {filteredDocuments.length} documentos encontrados
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
                gap: '20px'
              }}>
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      border: '2px solid #f1f5f9',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      background: '#fff'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f1f5f9';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '10px',
                        background: getDocumentIconColor(doc.type),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.3rem'
                      }}>
                        <i className={getDocumentIcon(doc.type)}></i>
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          marginBottom: '8px',
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{doc.name}</h4>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                        <i className="fas fa-calendar" style={{ fontSize: '0.8rem', minWidth: '12px' }}></i>
                        <span>Modificado {doc.modified}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                        <i className="fas fa-user" style={{ fontSize: '0.8rem', minWidth: '12px' }}></i>
                        <span>{doc.author}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                        <i className="fas fa-file" style={{ fontSize: '0.8rem', minWidth: '12px' }}></i>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {doc.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '3px 8px',
                            background: tag === 'Importante' ? '#fef2f2' : tag === 'Confidencial' ? '#fffbeb' : '#f1f5f9',
                            color: tag === 'Importante' ? '#ef4444' : tag === 'Confidencial' ? '#f59e0b' : '#64748b',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>Fazer Upload de Documento</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  width: '35px',
                  height: '35px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b' }}>
                Nome do Documento
              </label>
              <input
                type="text"
                placeholder="Digite o nome do documento..."
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b' }}>
                Pasta de Destino
              </label>
              <select style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}>
                <option value="">Selecione uma pasta...</option>
                {folders.filter(f => f.id !== 'all' && f.id !== 'favorites' && f.id !== 'recent' && f.id !== 'shared' && f.id !== 'trash').map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              marginTop: '30px'
            }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '12px 25px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  // Aqui seria implementada a lógica de upload
                }}
                style={{
                  padding: '12px 25px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Fazer Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
