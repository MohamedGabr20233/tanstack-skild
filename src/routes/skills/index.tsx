import { Await, createFileRoute, Link, type ErrorComponentProps } from '@tanstack/react-router'
import { getSearchSkillsInputSchema } from '../../../schema/skill.schema'
import NoResults from '#/components/NoResults'
import { SkillsGridPending } from '#/components/SkillCardPending'
import { searchSkills } from '../../../server/skill.api';
import SkillCard from '#/components/SkillCard'
import Search from '#/components/ui/Search'
import { Suspense } from 'react';

export const Route = createFileRoute('/skills/')({
  component: RouteComponent,
  errorComponent: SkillsPageError,

  validateSearch: (search) => getSearchSkillsInputSchema.parse(search),

  // q only: the loader re-runs on a search term change and nothing else
  loaderDeps: ({ search }) => ({ q: search.q }),

  loader: ({ deps }) => ({
    skillsPromise: searchSkills({ data: { q: deps.q, page: 1 } }).then(result => {
      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    }),
  }),
})

function RouteComponent() {
  // Search Params
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { skillsPromise } = Route.useLoaderData()

  const handleQueryChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, q: value, page: 1 }),
      replace: true,
    })
  }

  return (
    <div className='skill-page px-4 space-y-5 min-h-screen'>

      <section className="intro">
        <header className='flex items-center flex-col'>
          <div className='w-full mb-4 flex '>
            <div className='w-full'>
              <h1 className='text-4xl mb-2'>Explore <span className='text-gradient'>Skills</span></h1>
              <p>Browser , filter and inspect reusable AI capabilities from a single registry</p>
            </div>

            <div className='w-full flex flex-col'>
              <Link to="/skills/new" className='btn-secondary self-end max-w-[40%] my-2'>
                Submit Skill
              </Link>
            </div>
          </div>


        </header>
        <Search
          query={q ?? ''}
          resultCount={
            <Suspense fallback={<span>...</span>}>
              <Await promise={skillsPromise}>
                {(skills) => {
                  const count = skills.length
                  return (
                    <span>
                      {count} {count === 1 ? "result" : "results"}
                    </span>
                  )
                }}
              </Await>
            </Suspense>
          }
          onQueryChange={handleQueryChange}
        />

      </section>

      <section className='results'>
        <Suspense fallback={<SkillsGridPending />}>
          <Await promise={skillsPromise}>
            {skills =>
              skills.length > 0 ? (
                <div className='skills-grid w-full '>
                  {skills.map((skill) => (
                    <SkillCard skill={skill} key={skill.id} />
                  ))}
                </div>
              ) : (
                <p className='empty-state'>
                  {q ? `No skills found for "${q}"` : `no skills have been created yet`}
                </p>
              )
            }
          </Await>
        </Suspense>
      </section>
    </div>
  )
}

function SkillsPageError({ error, reset }: ErrorComponentProps) {
  return (
    <div className='skills-page'>
      <NoResults title="Couldn't load skills" message={error.message} />
      <div className="mt-4 flex justify-center">
        <button type="button" onClick={reset} className="btn-secondary">
          Try again
        </button>
      </div>
    </div>
  )
}
