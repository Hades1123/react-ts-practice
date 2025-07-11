export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            "email": string
            "phone": string
            "fullName": string
            "role": string
            "avatar": string
            "id": string
        }
    }

    interface IRegister {
        "_id": string;
        "email": string;
        "fullName": string;
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser;
    }

    interface IUserTable {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IUserCreate {
        fullName: string;
        email: string;
        password: string;
        phone: string;
    }

    interface IErrorCreateUserList {
        error: {
            index: number
            code: number
            errmsg: string
            op: IUserTable
        }
        index: number
    }

    interface ICreateUserList {
        countSuccess: number
        countError: number
        detail: string | IErrorCreateUserList[]
    }

    interface IDataImport {
        fullName: string;
        email: string;
        password?: string;
        phone: string;
    }
}