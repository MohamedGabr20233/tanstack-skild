import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { ArrowLeft } from 'lucide-react'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { FormLabel } from '#/components/ui/form'


const submitSkillSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(80, "Title must be 80 characters or fewer"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long")
    .max(500, "Description must be 500 characters or fewer"),
  // refine is used to make callback function to the string
  tags: z
    .string()
    .trim()
    .min(1, 'Please add at least one tag')
    .refine((str) =>
      str.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean).length > 0,

      { message: "Tags must be comma-separated values (e.g. firebase , auth)" }
    ),
  installationCommand: z
    .string()
    .trim()
    .min(3, 'Install command is required')
    .max(200, "Install command must be 200 characters or fewer"),

  promptConfig: z
    .string()
    .trim()
    .min(10, "Prompt configuration must be at least 10 characters long")
    .max(4000, "Prompt configuration must be 4000 characters or fewer"),

  usageExample: z
    .string()
    .trim()
    .min(20, "Usage example must be at least 20 characters long")
    .max(4000, "Usage example must be 4000 characters or fewer"),

})

// define the type of the submit with our zod schema
type SubmitSkillFormValues = z.infer<typeof submitSkillSchema>

const defaultFormValues: SubmitSkillFormValues = {
  title: "",
  description: "",
  tags: "",
  installationCommand: "",
  promptConfig: '',
  usageExample: '',
}

export const Route = createFileRoute('/skills/new')({
  component: RouteComponent,
})

function RouteComponent() {

  const form = useForm({
    defaultValues: defaultFormValues,
    validators: {
      onSubmit: submitSkillSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Skill submitted successfully")
    }
  })
  return (
    <div id='new-skill'>
      <Link to={"/skills" as string} search={{ q: "", page: 1 }} className='back'>
        <ArrowLeft size={16} />
        <span>Back to Skills</span>
      </Link>

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
