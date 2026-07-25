const DEFAULT_SSO_LOGIN_PATH = '/auth/sso/login'

export const SSO_LOGIN_PATH: string = import.meta.env.VITE_SSO_LOGIN_PATH ?? DEFAULT_SSO_LOGIN_PATH

export const HOME_PATH = '/'

export const LOGIN_ROUTE_PATH = '/login'

export const RETURN_URL_QUERY_KEY = 'returnUrl'

export const ERROR_QUERY_KEY = 'error'
