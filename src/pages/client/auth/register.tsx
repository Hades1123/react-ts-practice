import { registerAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Col, Form, Input, Row, App } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { notification, message } = App.useApp();
    const [registerForm] = Form.useForm();

    type FieldType = {
        fullName: string;
        email: string;
        password: string;
        phone: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true)
        const result = await registerAPI(values.fullName, values.email, values.password, values.phone);
        setLoading(false)
        if (result.data) {
            message.success('Register successfully');
            registerForm.resetFields();
            navigate('/login');
        }
        else {
            notification.error({
                message: 'Error',
                description: result.message
            })
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Row justify={'center'}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset className='border-2 border-gray-300 rounded-sm p-8 mt-[80px]'>
                        <legend className='font-bold text-2xl'>Register</legend>
                        <Form
                            form={registerForm}
                            name="registerForm"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout='vertical'
                        >
                            <Form.Item<FieldType>
                                label="Fullname"
                                name="fullName"
                                rules={[{ required: true, message: 'Please input your fullName!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{
                                    required: true,
                                    message: 'Please input your email!',
                                }]}

                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    // {
                                    //     min: 6,
                                    //     message: "Độ dài mật khẩu phải lớn hơn 5",
                                    // },
                                    // {
                                    //     validator: (_, value) => {
                                    //         if (value && !/[A-Z]/.test(value)) {
                                    //             return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 ký tự in hoa.'));
                                    //         }
                                    //         return Promise.resolve();
                                    //     },
                                    // },
                                    // {
                                    //     validator: (_, value) => {
                                    //         const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/;
                                    //         if (value && !specialChars.test(value)) {
                                    //             return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.'));
                                    //         }
                                    //         return Promise.resolve();
                                    //     },
                                    // },
                                    // {
                                    //     validator: (_, value) => {
                                    //         if (value && !/[0-9]/.test(value)) {
                                    //             return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ số.'))
                                    //         }
                                    //         return Promise.resolve();
                                    //     }
                                    // }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your phone number!',
                                    },
                                    // {
                                    //     validator: (_, value) => {
                                    //         if (value && !/^\d{10}$/.test(value)) {
                                    //             return Promise.reject(new Error('Số điện thoại chỉ gồm chữ số và có độ dài là 10'));
                                    //         }
                                    //         return Promise.resolve();
                                    //     }
                                    // }
                                ]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" onClick={() => registerForm.submit()} loading={loading}>
                                    Register
                                </Button>
                            </Form.Item>

                        </Form>
                    </fieldset>
                </Col>
            </Row >

        </>
    )
}

export default RegisterPage