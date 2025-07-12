import { deleteUserAPI } from "@/services/api";
import { App, notification, Popconfirm } from "antd"
import { PopconfirmProps } from "antd/lib";

interface IProps {
    detailUser: IUserTable | null;
    children: React.ReactNode;
    setPage: (v: number) => void;
    pageSize: number;
    totalPage: number;
    page: number;
    refreshTable: () => void;
}

export const DeleteUser = (props: IProps) => {
    const { detailUser, refreshTable, setPage, totalPage, pageSize, page } = props;
    const { message } = App.useApp();

    const confirm: PopconfirmProps['onConfirm'] = async () => {
        const result = await deleteUserAPI(detailUser?._id!);
        if (result.data) {
            message.success('Delete user successfully');
            setPage(totalPage % pageSize === 1 ? (page > 1 ? page - 1 : 1) : page);
            refreshTable();
        }
        else {
            notification.error({
                message: 'Delete failed',
                description: JSON.stringify(result.message),
            })
        }
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
    };

    return (
        <>
            <Popconfirm
                title="Delete the user"
                description="Are you sure to delete this user?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Delete"
                cancelText="No"
                placement="leftTop"
            >
                {props.children}
            </Popconfirm>
        </>
    )
}