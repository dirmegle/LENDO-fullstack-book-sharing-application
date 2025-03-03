import { Card } from "@/components/Card";
import LoginForm from "@/components/Forms/LoginForm";
import SignupForm from "@/components/Forms/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Toaster } from "@/components/Toast/Toaster";
import { useSearchParams } from "react-router-dom";
import AbstractOne from "@/assets/icons/abstractOne.svg?react"
import AbstractTwo from "@/assets/icons/abstractTwo.svg?react"
import styles from './LoginSignupPage.module.css'
import { cn } from "@/lib/utils";
import { Separator } from "@/components/Separator";

export default function LoginSignupPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('activeTab') ?? 'login'

  const handleTabChange = (newTabValue: string) => {
    searchParams.set("activeTab", newTabValue);
    setSearchParams(searchParams);
  };

  return (
    <>    
    <div className="grid rid-cols-1 lg:grid-cols-3 h-[100vh] grid-rows-[auto,1fr] lg:grid-rows-[1fr] overflow-hidden">
      <div className="bg-background flex flex-col items-center px-10 lg:items-start lg:pt-40 lg:pb-0 pt-20 pb-20 lg:justify-start justify-center max-h-[max-content] lg:max-h-none" >
        <h1 className="text-5xl mb-4 text-center lg:text-left">Discover Books, Share Stories</h1>
        <Separator />
        <p className="text-center lg:text-left">Every page is a new opportunity to connect. Reserve must-read titles, dive into engaging discussions, and build meaningful connections with your friends.</p>
      </div>
      <div className={cn("h-full flex lg:pt-40 pt-20 justify-center lg:col-span-2 items-start px-2 relative", styles.formBackground)}>
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
        <AbstractTwo className={styles.abstractTwo}/>
      </div>
    </div>
    <Toaster />
    </>

  )
}
