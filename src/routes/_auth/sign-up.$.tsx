import { GoogleButton } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeClosed, } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { supabase } from '#/utils/supabase'
import { signup } from '../../../server/auth.api'

export const Route = createFileRoute('/_auth/sign-up/$')({
  component: RouteComponent,
})

const SignUpSchema = z
  .object({
    email: z
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );


type typeDefaultFormValues = z.infer<typeof SignUpSchema>

const defaultFormValues: typeDefaultFormValues = {
  email: '',
  password: '',
  confirmPassword: ''
}
function RouteComponent() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  // ================== the form ===================
  const form = useForm({
    defaultValues: defaultFormValues,
    validators: {
      onBlur: SignUpSchema,
      onSubmit: SignUpSchema
    },
    onSubmit: async ({ value }) => {
      try {
        // call the api function
        await signup({
          data: value
        })

        // if success start the toast
        toast.success("signed up user successfully")

        //  navigate to the sing in page
        await navigate({
          to: "/sign-in/$",
        });

      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create account"
        )
      }
    }
  })

  // ====================== supabase OAuth ============
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // No navigation is needed here.
      // Supabase redirects the browser to Google automatically.
    } catch (error) {
      setIsGoogleLoading(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google",
      );
    }
  };

  return (
    <section id="sign-in">
      <div className='flex flex-col  px-12 py-12 items-center gap-4 w-full max-w-180 border'>

        <div className='w-full text-center mb-2 text-4xl font-bold font-mono'>
          <h3>Sign In</h3>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }} className='w-full ' >
          <FieldGroup>
            <form.Field name='email'>
              {(field) => {
                return (
                  <Field >
                    <FieldLabel htmlFor={field.name}>
                      email
                    </FieldLabel>
                    <Input
                      className='text-white'
                      type="text"
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="example@gmail.com"
                    />
                  </Field>
                )
              }}
            </form.Field>

            {/* the password */}

            <form.Field name='password'>
              {(field) => {
                return (
                  <Field >
                    <FieldLabel htmlFor={field.name}>
                      password
                    </FieldLabel>
                    <div className='flex items-center gap-2 relative'>
                      <Input
                        className='text-white'
                        type={!showPassword ? 'password' : 'text'}
                        name={field.name}
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder=""
                      />
                      <button type='button' onClick={() => setShowPassword(value => !value)} className=' cursor-pointer flex absolute p-2 inset-e-4'>
                        {
                          !showPassword ?
                            <EyeClosed size={18} />
                            :
                            <Eye size={18} />
                        }
                      </button>
                    </div>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name='confirmPassword'>
              {(field) => {
                return (
                  <Field >
                    <FieldLabel htmlFor={field.name}>
                      password
                    </FieldLabel>
                    <div className='flex items-center gap-2 relative'>
                      <Input
                        className='text-white'
                        type={!showPassword ? 'password' : 'text'}
                        name={field.name}
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder=""
                      />
                      <button type='button' onClick={() => setShowPassword(value => !value)} className=' cursor-pointer flex absolute p-2 inset-e-4'>
                        {
                          !showPassword ?
                            <EyeClosed size={18} />
                            :
                            <Eye size={18} />
                        }
                      </button>
                    </div>
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <div className='w-full gap-4  flex my-2 mt-10 items-center'>
            <hr className='w-[50%] h-0.5' />
            <p className='mb-1 min-w-fit'>or</p>
            <hr className='w-[50%] h-0.5' />
          </div>

          {/* google sign in */}
          <div className="mt-4">
            <GoogleButton
              disabled={isGoogleLoading}
              onClick={() => { handleGoogleSignIn() }}
            >
              {isGoogleLoading ? <circle className='animate-spin' /> : <span>Continue with Google</span>
              }
            </GoogleButton>
          </div>
        </form>

        {/* create account link */}
        <p className='text-xs text-neutral-500'>don't have account ? {' '}
          <span className='text-primary hover:underline'>
            <Link to='/sign-in/$'>
              sign in
            </Link>
          </span>
        </p>
      </div>

    </section>)
}