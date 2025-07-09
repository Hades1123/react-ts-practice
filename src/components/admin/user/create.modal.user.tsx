import { createUserAPI } from "@/services/api";
import { ActionType } from "@ant-design/pro-components";
import { Form, Input, Modal, Button, App } from "antd";


interface IProps {
    isOpenCreateUser: boolean;
    setIsOpenCreateUser: (value: boolean) => void;
    page: number;
    pageSize: number;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    setCreateSuccess: (v: boolean) => void;
}

interface IUserCreate {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}

const CreateUserModal = (props: IProps) => {
    const { isOpenCreateUser, setIsOpenCreateUser, actionRef, setCreateSuccess } = props;
    const [createUserForm] = Form.useForm();
    const { notification, message } = App.useApp();

    const resetAndClose = () => {
        createUserForm.resetFields();
        setIsOpenCreateUser(false);
    }

    const onFinish = async (values: IUserCreate) => {
        const result = await createUserAPI(values);
        if (result.data) {
            resetAndClose();
            message.success('Create user successfully');
            setCreateSuccess(true);
            actionRef.current?.reload();
        }
        else {
            notification.error({
                message: 'Create user failed',
                description: JSON.stringify(result.message),
            })
        }
    }

    return (
        <>
            <Modal
                title="Create User"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpenCreateUser}
                maskClosable={false}
                footer={[]}
                onCancel={resetAndClose}
            >
                <Form
                    name="CreateUserForm"
                    layout="vertical"
                    form={createUserForm}
                    onFinish={onFinish}
                >
                    <Form.Item<IUserCreate>
                        label="Username"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<IUserCreate>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<IUserCreate>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<IUserCreate>
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <div className="flex gap-1 justify-end">
                        <Button type='default' onClick={resetAndClose}>Cancel</Button>,
                        <Button type='primary' htmlType="submit">Create</Button>
                    </div>
                </Form>
            </Modal >
        </>
    )
}

export default CreateUserModal