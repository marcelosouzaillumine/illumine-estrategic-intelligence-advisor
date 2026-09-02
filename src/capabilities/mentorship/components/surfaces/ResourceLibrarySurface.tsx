import React, { useState } from 'react';
import {
  BookOpen, Video, FileText, Link2, Star, ExternalLink,
  Search, Filter,
} from 'lucide-react';

type ResourceCategory = 'ALL' | 'ARTICLE' | 'VIDEO' | 'TEMPLATE' | 'TOOL';
type ResourceRole = 'MENTOR' | 'MENTEE' | 'BOTH';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: Exclude<ResourceCategory, 'ALL'>;
  role: ResourceRole;
  url: string;
  duration?: string;
  tags: string[];
  featured?: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Framework GROW para Sessões de Mentoria',
    description: 'Como usar o modelo Goal-Reality-Options-Will para estruturar conversas de desenvolvimento.',
    category: 'ARTICLE',
    role: 'MENTOR',
    url: '#',
    tags: ['Sessões', 'Framework', 'Coaching'],
    featured: true,
  },
  {
    id: '2',
    title: 'Escuta Ativa e Perguntas Poderosas',
    description: 'Técnicas para aprofundar o diálogo e ajudar o mentorado a descobrir suas próprias respostas.',
    category: 'VIDEO',
    role: 'MENTOR',
    url: '#',
    duration: '18 min',
    tags: ['Comunicação', 'Escuta', 'Perguntas'],
  },
  {
    id: '3',
    title: 'Template de Plano de Desenvolvimento Individual',
    description: 'Documento base para co-criar o PDI com seu mentorado, incluindo OKRs e milestones.',
    category: 'TEMPLATE',
    role: 'BOTH',
    url: '#',
    tags: ['PDI', 'OKR', 'Planejamento'],
    featured: true,
  },
  {
    id: '4',
    title: 'Como Dar Feedback Efetivo',
    description: 'Modelos SBI e STAR para feedback construtivo que gera crescimento sem defensividade.',
    category: 'ARTICLE',
    role: 'BOTH',
    url: '#',
    tags: ['Feedback', 'Comunicação'],
  },
  {
    id: '5',
    title: 'Definindo OKRs Ambiciosos e Mensuráveis',
    description: 'Aprenda a escrever Objectives and Key Results que motivam e orientam o desenvolvimento.',
    category: 'VIDEO',
    role: 'MENTEE',
    url: '#',
    duration: '12 min',
    tags: ['OKR', 'Metas', 'Desenvolvimento'],
    featured: true,
  },
  {
    id: '6',
    title: 'Aproveitando Ao Máximo Sua Mentoria',
    description: 'Guia prático: como se preparar para sessões, fazer perguntas certas e implementar insights.',
    category: 'ARTICLE',
    role: 'MENTEE',
    url: '#',
    tags: ['Mentorado', 'Preparação', 'Sessões'],
  },
  {
    id: '7',
    title: 'Matriz de Priorização de Decisões',
    description: 'Ferramenta interativa para ajudar mentorados a priorizar desafios e oportunidades.',
    category: 'TOOL',
    role: 'BOTH',
    url: '#',
    tags: ['Decisão', 'Priorização', 'Estratégia'],
  },
  {
    id: '8',
    title: 'Conversas Difíceis: Como Navegar Conflito',
    description: 'Framework para abordar situações tensas de forma assertiva e compassiva.',
    category: 'ARTICLE',
    role: 'BOTH',
    url: '#',
    tags: ['Liderança', 'Conflito', 'Comunicação'],
  },
];

const CATEGORY_META: Record<Exclude<ResourceCategory, 'ALL'>, { icon: React.ElementType; label: string; color: string }> = {
  ARTICLE: { icon: FileText, label: 'Artigo', color: 'text-blue-500 bg-blue-500/10' },
  VIDEO: { icon: Video, label: 'Vídeo', color: 'text-rose-500 bg-rose-500/10' },
  TEMPLATE: { icon: BookOpen, label: 'Template', color: 'text-violet-500 bg-violet-500/10' },
  TOOL: { icon: Link2, label: 'Ferramenta', color: 'text-amber-500 bg-amber-500/10' },
};

interface ResourceLibrarySurfaceProps {
  role: 'MENTOR' | 'MENTEE';
}

export const ResourceLibrarySurface: React.FC<ResourceLibrarySurfaceProps> = ({ role }) => {
  const [category, setCategory] = useState<ResourceCategory>('ALL');
  const [search, setSearch] = useState('');

  const visible = RESOURCES.filter(r =>
    (r.role === role || r.role === 'BOTH') &&
    (category === 'ALL' || r.category === category) &&
    (search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  const featured = visible.filter(r => r.featured);
  const rest = visible.filter(r => !r.featured);

  const FILTERS: { value: ResourceCategory; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'ARTICLE', label: 'Artigos' },
    { value: 'VIDEO', label: 'Vídeos' },
    { value: 'TEMPLATE', label: 'Templates' },
    { value: 'TOOL', label: 'Ferramentas' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Biblioteca de Recursos</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Materiais selecionados para apoiar sua jornada de {role === 'MENTOR' ? 'mentoria' : 'desenvolvimento'}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar recursos..."
          className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setCategory(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Filter size={28} className="text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum recurso encontrado.</p>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star size={13} className="text-amber-500" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destaques</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {featured.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div className="space-y-3">
          {featured.length > 0 && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mais Recursos</p>
          )}
          <div className="grid gap-3 lg:grid-cols-2">
            {rest.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource: r }) => {
  const meta = CATEGORY_META[r.category];
  const Icon = meta.icon;

  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted/30 transition-colors group"
    >
      <div className={`w-9 h-9 rounded-xl ${meta.color} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
            {r.title}
          </p>
          <ExternalLink size={12} className="text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 mt-0.5 transition-colors" />
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{r.description}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${meta.color}`}>{meta.label}</span>
          {r.duration && (
            <span className="text-[10px] text-muted-foreground">{r.duration}</span>
          )}
          {r.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};
