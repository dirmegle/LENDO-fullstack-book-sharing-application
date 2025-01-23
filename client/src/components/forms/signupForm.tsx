import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from '../input'
import { Button } from '../button'
import { signupConfig } from './inputConfig'

// See if schemas can be shared
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
})

export default function SignupForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
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
