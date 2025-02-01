import { Card } from "@/components/Card";
import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Toaster } from "@/components/toast/Toaster";
import { useSearchParams } from "react-router-dom";
import AbstractOne from "@/assets/icons/abstractOne.svg?react"
import styles from './LoginSignupPage.module.css'

export default function LoginSignupPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('activeTab') ?? 'login'

  const handleTabChange = (newTabValue: string) => {
    searchParams.set("activeTab", newTabValue);
    setSearchParams(searchParams);
  };
  return (
    <>    
    <div className="grid rid-cols-1 md:grid-cols-3 h-[100vh] grid-rows-[auto,1fr] md:grid-rows-[1fr]">
      <div className="flex flex-col items-center md:items-start md:pt-40 md:pb-0 pt-20 pb-20 md:justify-start justify-center max-h-[max-content] md:max-h-none" >
        <h1 className="text-5xl">Headline</h1>
        <p>Description</p>
      </div>
      <div className="bg-red-300 h-full flex md:pt-40 justify-center md:col-span-2 items-start px-2 relative">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="sm:w-[400px] w-[350px] z-20">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <LoginForm />
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <SignupForm />
          </Card>
        </TabsContent>
      </Tabs>
        <AbstractOne className={styles.abstractOne}/>
      </div>
    </div>
    <Toaster />
    </>

  )
}
