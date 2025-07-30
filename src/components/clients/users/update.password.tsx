import { useCurrentApp } from "@/components/context/app.context";
import { changePasswordAPI } from "@/services/api";
import { Button, Form, Input, message, notification } from "antd"
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";


type FieldType = {
    email: string;
    password: string;
    newPassword: string;
};

interface IProps {
    setOpenUserModal: (v: boolean) => void;
}

export const UpdatePassword = (props: IProps) => {
    const { setOpenUserModal } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        setLoading(true);
        const result = await changePasswordAPI(values.email, values.password, values.newPassword);
        if (result.data) {
            message.success('Change password successfully');
            setLoading(false);
            setOpenUserModal(false);
        }
        else {
            notification.error({
                message: 'Error',
                description: JSON.stringify(result.message),
            })
        }
        setLoading(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
            })
        }
    }, [])
    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    label="New password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Button
                    onClick={() => form.submit()}
                    type="primary"
                    loading={loading}
                >
                    Update</Button>
            </Form>
        </>
    )
}