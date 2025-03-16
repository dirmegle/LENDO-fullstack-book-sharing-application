import Cookies from 'js-cookie'

export const setAccessTokenCookie = (accessToken: string, expirationDate: string) => {
    const date = new Date(expirationDate)
    Cookies.set('access_token', accessToken, {expires: date})
}

export const getAccessToken = () => Cookies.get('access_token')

export const isAuthenticated = () => !!getAccessToken()

export const removeAccessTokenCookie = () => {
    if(getAccessToken()) {
        Cookies.remove('access_token')
    }
}