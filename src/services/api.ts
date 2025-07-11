import axios from 'services/axios.customize';

const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    const data = {
        username: username,
        password: password
    }
    return axios.post<IBackendRes<ILogin>>(urlBackend, data, {
        headers: {
            delay: 1000
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
            delay: 1000
        }
    })
}

const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}

const getUserAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

const createUserAPI = (value: IUserCreate) => {
    const urlBackend = '/api/v1/user';
    return axios.post<IBackendRes<IUserTable>>(urlBackend, value);
}

const createListUsers = (value: IDataImport[]) => {
    const urlBackend = '/api/v1/user/bulk-create';
    return axios.post<IBackendRes<ICreateUserList>>(urlBackend, value);
}

export { loginAPI, registerAPI, fetchAccountAPI, logoutAPI, getUserAPI, createUserAPI, createListUsers }