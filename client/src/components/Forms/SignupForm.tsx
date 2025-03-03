import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './Form'
import { Input } from '../Input'
import { Button } from '../Button'
import { signupConfig } from './inputConfig'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/trpc'

const formSchema = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().trim().toLowerCase().email(),
    password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
    repeatPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
}).refine(
  (data) => data.password === data.repeatPassword, 
  {
    message: "Passwords do not match",
    path: ["repeatPassword"], // error will appear under "repeatPassword" field
  }
)

export default function SignupForm() {
  const navigate = useNavigate();
    const { toast } = useToast()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async ({firstName, lastName, email, password}: z.infer<typeof formSchema>) => {
        try {
          await trpc.user.signup.mutate({email, password, firstName, lastName})
          toast({
            title: "Account created successfully",
            description: "You can now log in."
          })
          form.reset()
          navigate('/login?activeTab=login')
        } catch {
          form.setError('email', {
            type: "manual",
            message: ""
          })
          toast({
            title: "Cannot use this email",
            description: "A user with email address might already exist. Try logging in.",
            variant: "destructive"
          })
        }
    }

  return (
    <Form {... form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {signupConfig.map(({ name, label, placeholder, type }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} type={type} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
        <Button type="submit" size='full'>Submit</Button>
        </form>
    </Form>
  )
}
