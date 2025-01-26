import { Card } from "@/components/Card";
import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Toaster } from "@/components/toast/Toaster";
import { useSearchParams } from "react-router-dom";

export default function LoginSignupPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('activeTab') ?? 'login'

  const handleTabChange = (newTabValue: string) => {
    searchParams.set("activeTab", newTabValue);
    setSearchParams(searchParams);
  };
  return (
    <div className="grid grid-cols-1">
      <div>
      </div>
      <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[400px]">
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
      </div>
      <Toaster />
    </div>
  )
}
