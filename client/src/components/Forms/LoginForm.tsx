import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './Form'
import { Input } from '../Input'
import { Button } from '../Button'
import { loginConfig } from './inputConfig'
import { trpc } from '@/trpc'
import { setAccessTokenCookie } from '@/utils/isAuthenticated'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import useUserContext from '@/context/UserContext'

const formSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string()
})

export default function LoginForm() {

  const { fetchUserData } = useUserContext()
  const navigate = useNavigate();
    const { toast } = useToast()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })


    const onSubmit = async (userLogin: z.infer<typeof formSchema>) => {
      try {
        const {accessToken, expirationDate} = await trpc.user.login.mutate(userLogin)
        setAccessTokenCookie(accessToken, expirationDate)
        await fetchUserData()
        navigate('/')
      } catch {
        const fields = ["email", "password"] as const
        fields.forEach((field) => {
          form.setError(field, {
            type: "manual",
            message: ""
          })
        })
        toast({
          title: "Could not log in",
          description: "Your email or password are incorrect",
          variant: "destructive"
        })
      }
    }

  return (
    <Form {... form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {loginConfig.map(({ name, label, placeholder, type }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} type={type} {...field}/>
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
