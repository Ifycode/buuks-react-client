import { ChangeEvent, useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { createContainer } from "unstated-next";
import { AuthForm, AuthFormContent, User } from "../interfaces/auth";
import { formBody } from "../lib/auth";

export const useAuth = () => {
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();
  const pageRoute: string = location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [unAuthorizedError, setUnAuthorizedError] = useState<boolean>(false);
  const initialAuthFormContent = {
    formTitle: '',
    buttonText: '',
    spanText: '',
    LinkText: '',
    apiEndpoint: '',
    destinationPage: ''
  };
  const initialUser = {
    email: '',
    name: '',
    _id: ''
  };
  const initialForm = {
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  };
  const [authFormContent, setAuthFormContent] = useState<AuthFormContent>(initialAuthFormContent);
  const [user, setUser] = useState<User>(initialUser);
  const [form, setForm] = useState<AuthForm>(initialForm);

  const authenticateUser = async (e: any, apiEndpoint: string, destinationPage: string) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formBody({ form, pageRoute }))
    });
    const data = await response.json();
    if (data.user) {
      if (pageRoute === '/login') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('_user', JSON.stringify(data.user));
        setUser(JSON.parse(localStorage.getItem('_user') as string));
        setIsAuthenticated(true);
      }
      navigate(destinationPage);
      resetForm(initialForm);
    }
    if (response.status === 400) {
      handleError(true, data[0].message);
    }
    if (response.status === 409) {
      if (data.error === 'Duplicate key') handleError(true, 'Email already exists. Use a different email.');
      if (data.error === 'ValidationError: name: Path `name` is required.') handleError(true, 'First name is required.');
    }
    if (response.status === 401) {
      handleError(true, data.error.message);
    }
    // console.log(data)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as Pick<AuthForm, keyof AuthForm>);
    handleError(false, '');
  }

  const handleLogIn = () => {
    setIsAuthenticated(true);
    localStorage.getItem('accessToken');
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUnAuthorizedError(false);
    navigate('/login');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('_user');
    setUser(initialUser);
  }

  const resetForm = (initialForm: AuthForm) => {
    setForm(initialForm);
    handleError(false, '');
  }

  const handleError = (boolean: boolean, string: string) => {
    setError(boolean);
    setErrorMessage(string);
  }

  const handleAppLinks = (to: string) => {
    handleError(false, '');
    if (to === '/login') {
      setForm({
        email: '',
        password: ''
      } as AuthForm);
      setAuthFormContent({
        formTitle: 'Login form',
        buttonText: 'Login',
        spanText: 'Don\'t have an account yet?',
        LinkText: 'Signup!',
        apiEndpoint: 'users/login',
        destinationPage: '/books'
      });
    }
    else if (to === '/signup') {
      setForm(initialForm);
      setAuthFormContent({
        formTitle: 'Signup form',
        buttonText: 'Signup',
        spanText: 'Have an account already?',
        LinkText: 'Login.',
        apiEndpoint: 'users/signup',
        destinationPage: '/login'
      });
    } else {
      setForm({} as AuthForm);
      setAuthFormContent({} as AuthFormContent);
    }
  }

  return {
    form,
    pageRoute,
    authenticateUser,
    handleInputChange,
    handleLogIn,
    handleLogout,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    isLoading,
    error,
    errorMessage,
    setIsLoading,
    handleError,
    unAuthorizedError,
    setUnAuthorizedError,
    handleAppLinks,
    authFormContent
  }
}

export const AuthContainer = createContainer(useAuth);