type LoginField = {
    name: "email" | "password";
    label: string;
    placeholder: string;
    type: string
  };

  type SignupField = {
    name: "firstName" | "lastName" | "email" | "password" | "repeatPassword";
    label: string;
    placeholder: string;
    type: string
  }

export const loginConfig: LoginField[] = [
    {name: 'email', label: 'Email', placeholder: 'example@site.com', type: 'email'},
    {name: 'password', label: 'Password', placeholder: 'superstrongpassword123!', type: 'password'}
]

export const signupConfig: SignupField[] = [
    {name: 'firstName', label: 'First name', placeholder: 'John', type: 'text'},
    {name: 'lastName', label: 'Last name', placeholder: 'Doe', type: 'text'},
    {name: 'email', label: 'Email', placeholder: 'example@site.com', type: 'email'},
    {name: 'password', label: 'Password', placeholder: 'superstrongpassword123', type: 'password'},
    {name: 'repeatPassword', label: 'Repeat password', placeholder: 'superstrongpassword123', type: 'password'},
]