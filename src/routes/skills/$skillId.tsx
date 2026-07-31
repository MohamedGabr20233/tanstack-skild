import { usePostHog } from '@posthog/react'
import { createFileRoute, Link, type ErrorComponentProps } from '@tanstack/react-router'
import { ArrowLeft, Bookmark, Calendar, Code2, Download, FileText, Star, Terminal, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CodeBlock from '#/components/CodeBlock'
import NoResults from '#/components/NoResults'
import { useCopyToClipBoard } from '#/lib/utils'
import { getSkillById, recordSkillInstall } from '../../../server/skill.api'

const SAVED_SKILLS_KEY = 'skild:saved-skills'

/** 12400 -> "12.4k" */
function formatCount(value: number) {
  if (value < 1000) return String(value)
  return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

/**
 * Rating and usage have no source of truth yet. Derive them from the skill id so the
 * numbers stay stable per skill instead of jittering on every render.
 */
function placeholderMetrics(id: string) {
  let hash = 0
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return {
    rating: (3.5 + ((hash % 15) / 10)).toFixed(1), // 3.5 - 4.9
    usage: 5000 + (hash % 95000),
  }
}

export const Route = createFileRoute('/skills/$skillId')({
  component: RouteComponent,
  errorComponent: SkillDetailError,
  loader: async ({ params }) => {
    const result = await getSkillById({ data: { id: params.skillId } })

    if (!result.success) {
      throw new Error(result.message)
    }

    return { skill: result.data }
  }
})

function RouteComponent() {
  const { skill } = Route.useLoaderData()
  const {
    id: skillId,
    title,
    description,
    category,
    tags,
    install_command,
    prompt_config,
    usage_example,
    created_at,
    author_email,
    author_image,
  } = skill

  const authorName = author_email?.split('@')[0] ?? 'unknown'
  const published = created_at
    ? new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown'

  const metrics = placeholderMetrics(skillId)

  const [installs, setInstalls] = useState(skill.installs_count ?? 0)

  // save is frontend only for now — localStorage, nothing persisted server side
  const [isSaved, setIsSaved] = useState(false)

  const { state: installState, copy: copyFunction } = useCopyToClipBoard()
  const posthog = usePostHog()

  // saved skills live in localStorage — read after mount so SSR and the client agree
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_SKILLS_KEY) ?? '[]') as string[]
      setIsSaved(saved.includes(skillId))
    } catch {
      setIsSaved(false)
    }
  }, [skillId])

  const handleInstall = async () => {
    copyFunction(install_command)
    posthog.capture('skill_install_command_copied', {
      skill_id: skillId,
      skill_title: title,
      install_command,
      source: 'detail_page',
    })

    const result = await recordSkillInstall({ data: { id: skillId } })

    if (!result.success) {
      console.error('recordSkillInstall failed:', result.message)
      toast.error(result.message)
      return
    }

    setInstalls(result.installsCount)

    if (result.alreadyInstalled) {
      toast.info('Already in your installs — command copied again')
    }
  }

  const handleSave = () => {
    const next = !isSaved
    setIsSaved(next)

    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_SKILLS_KEY) ?? '[]') as string[]
      const updated = next ? [...new Set([...saved, skillId])] : saved.filter((id) => id !== skillId)
      localStorage.setItem(SAVED_SKILLS_KEY, JSON.stringify(updated))
    } catch {
      // storage unavailable (private mode, quota) — the toggle stays visual for this session
    }

    posthog.capture(next ? 'skill_saved' : 'skill_unsaved', { skill_id: skillId, skill_title: title })
  }

  return (
    <div id="skill-detail">
      <Link search={{ q: "", page: 1 }} to="/skills" className="back">
        <ArrowLeft size={16} />
        <span>Back to explore</span>
      </Link>

      <div className="layout">
        <div className="main">
          <header className="intro">
            <h1>{title}</h1>
            <p>{description}</p>

            <div className="tags">
              <span className="category">{category}</span>
              {tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="divider" />

          <CodeBlock title="Installation" icon={<Terminal size={14} />} code={install_command} onCopy={handleInstall} />

          <CodeBlock title="Configuration" icon={<Code2 size={14} />} code={prompt_config} />

          <CodeBlock title="Usage Example" icon={<FileText size={14} />} code={usage_example} />
        </div>

        <aside className="sidebar">
          <div className="panel">
            <div className="author">
              {/* google throttles avatar hotlinks that send a referrer — no-referrer keeps them loading */}
              <img
                src={author_image || '/logo512.png'}
                alt={`${authorName}'s avatar`}
                className="avatar"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/logo512.png'
                }}
              />
              <div className="author-copy">
                <p className="name">{authorName}</p>
                <p className="role">Author</p>
              </div>
            </div>

            <dl className="stats">
              <div className="stat">
                <dt>
                  <Calendar size={14} />
                  <span>Published</span>
                </dt>
                <dd>{published}</dd>
              </div>

              <div className="stat">
                <dt>
                  <Download size={14} />
                  <span>Installs</span>
                </dt>
                <dd>{formatCount(installs)}</dd>
              </div>

              <div className="stat">
                <dt>
                  <Star size={14} />
                  <span>Rating</span>
                </dt>
                <dd>{metrics.rating}</dd>
              </div>

              <div className="stat">
                <dt>
                  <TrendingUp size={14} />
                  <span>Usage</span>
                </dt>
                <dd>{formatCount(metrics.usage)}</dd>
              </div>
            </dl>

            <button type="button" className="btn-primary install" onClick={handleInstall}>
              <Download size={16} />
              <span>{installState === 'success' ? 'Command copied' : installState === 'failed' ? 'Copy failed' : 'Install Skill'}</span>
            </button>

            <div className="engagement">
              <button type="button" className={`save ${isSaved ? 'active' : ''}`} onClick={handleSave} aria-pressed={isSaved}>
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SkillDetailError({ error, reset }: ErrorComponentProps) {
  return (
    <div id="skill-detail">
      <NoResults title="Couldn't load skill" message={error.message} />
      <div className="mt-4 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-secondary">
          Try again
        </button>
        <Link search={{ q: "", page: 1 }} to="/skills" className="btn-secondary">
          Back to explore
        </Link>
      </div>
    </div>
  )
}
