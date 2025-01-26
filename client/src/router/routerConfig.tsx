import AuthPageLayout from "@/layouts/AuthPageLayout"
import pagesConfig from "./pagesConfig"
import PrivateRoute from "./privateRoute"
import LoginSignupPage from "@/pages/LoginSignupPage"

const routerConfig = [
    {
    path: '/', 
    element: (
        <PrivateRoute>
            <AuthPageLayout />
        </PrivateRoute>
    ),
    // TODO: create error page
    errorElement: <>404 not found page</>,
    children: pagesConfig.private,
},
{
    path: '/', 
    element: (
        <LoginSignupPage />
    ),
    children: pagesConfig.public,
}
]

export default routerConfig