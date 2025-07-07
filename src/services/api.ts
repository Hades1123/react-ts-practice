import axios from 'services/axios.customize';

const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    const data = {
        username: username,
        password: password
    }
    return axios.post<IBackendRes<ILogin>>(urlBackend, data, {
        headers: {
            delay: 3000
        }
    });
}

const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone });
}

const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 2000
        }
    })
}

export { loginAPI, registerAPI, fetchAccountAPI }