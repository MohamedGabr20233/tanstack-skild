import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { ArrowLeft } from 'lucide-react'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { submitSkillSchema } from '../../../schema/skill.schema'
import { submitSkill } from '../../../server/skill.api'
import { authMiddleware } from '../../../middlewear';
import { getCurrentUser } from '../../../server/auth.api'
import { useRouter } from '@tanstack/react-router'


// define the type of the submit with our zod schema
type SubmitSkillFormValues = z.input<typeof submitSkillSchema>

const defaultFormValues: SubmitSkillFormValues = {
  title: "",
  description: "",
  category: "",
  tags: "",
  installationCommand: "",
  promptConfig: '',
  usageExample: '',
}

export const Route = createFileRoute('/skills/new')({
  component: RouteComponent,

  // beforeLoad runs on SSR *and* on client-side navigation, so the guard holds either way.
  // server.middleware alone only fires on real server requests, which a SPA nav never makes.
  beforeLoad: async () => {
    const user = await getCurrentUser()

    if (!user) {
      throw redirect({ to: '/sign-in/$', params: { _splat: '' } })
    }

    return { user }
  },

  // kept as defence in depth for direct hits on the route's server request
  server: {
    middleware: [authMiddleware]
  }
})

function RouteComponent() {
  const redirect = Route.useNavigate()
  const router = useRouter()

  const form = useForm({
    defaultValues: defaultFormValues,
    validators: {
      onSubmit: submitSkillSchema,
      onBlur: submitSkillSchema,
    },


    onSubmit: async ({ value }) => {
      const result = await submitSkill({ data: value })
      if (!result.success) {
        toast.error(result.message)
        console.error(result.message)
        return;
      }
      toast.success("Skill submitted successfully")
      redirect({
        to: "/"
      })
    }
    ,
  })


  return (
    <div id='new-skill'>
      <button
        type="button"
        onClick={() => router.history.back()}
        className="back"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="intro">
        <h2>Submit a New Skill</h2>
        <p>Share your skills with the community</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }} className='content'>

        <div className="block">
          <FieldGroup >
            <form.Field name='title'>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Title
                    </FieldLabel>
                    <Input
                      className='dark:text-white'
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Firebase Authentication Helper"
                      autoComplete="on"
                    />
                    {
                      isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )
                    }
                  </Field>
                )
              }
              }
            </form.Field>
            <form.Field name='description'>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      className='dark:text-white'
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="describe what your skill do"
                      autoComplete="on"
                    />
                    {
                      isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )
                    }
                  </Field>
                )
              }
              }
            </form.Field>
            <form.Field name='category'>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Category
                    </FieldLabel>
                    <Input
                      className='dark:text-white'
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="provide your tags separated with commas like : tanstack , query , route ,"
                      autoComplete="on"
                    />
                    {
                      isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )
                    }
                  </Field>
                )
              }
              }
            </form.Field>
            <form.Field name='tags'>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Tags
                    </FieldLabel>
                    <Input
                      className='dark:text-white'
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="provide your tags separated with commas like : tanstack , query , route ,"
                      autoComplete="on"
                    />
                    {
                      isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )
                    }
                  </Field>
                )
              }
              }
            </form.Field>

          </FieldGroup>

          <hr className='w-full bg-neutral-50/20 block h-0.5 my-6' />

          <FieldGroup >
            <form.Field name='installationCommand'>
              {
                field => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Installation Command
                      </FieldLabel>
                      <Input
                        className='dark:text-white'
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='firebase init'
                        autoComplete="false"
                      />
                      {
                        isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )
                      }
                    </Field>
                  )
                }
              }
            </form.Field>
            <form.Field name='promptConfig'>
              {
                field => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Prompt Usage
                      </FieldLabel>
                      <Textarea
                        className='dark:text-white'

                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='Describe how the skill should be configured in the AI prompt'
                        autoComplete="false"
                      />
                      {
                        isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )
                      }
                    </Field>
                  )
                }
              }
            </form.Field>
            <form.Field name='usageExample'>
              {
                field => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Usage Example
                      </FieldLabel>
                      <Textarea
                        className='dark:text-white'
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='Show a real example of how to use this skill'
                        autoComplete="false"
                      />
                      {
                        isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )
                      }
                    </Field>
                  )
                }
              }
            </form.Field>
          </FieldGroup>

          <div className='my-4'>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="w-full text-2xl cursor-pointer py-8">
                  {isSubmitting ? "Submitting..." : "Submit Skill"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form >
    </div>
  )

}
