import { useCurrentApp } from '@/components/context/app.context';
import { loginAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Col, Form, Input, Row, App } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { notification, message } = App.useApp();
    const [LoginForm] = Form.useForm();
    const { setIsAuthenticated, setUser } = useCurrentApp();
    type FieldType = {
        email: string;
        password: string;
    };
    const handleEnter = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' && !loading) {
            LoginForm.submit();
        }
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true)
        const result = await loginAPI(values.email, values.password);
        setLoading(false)
        if (result.data) {
            localStorage.setItem('access_token', result.data.access_token);
            message.success("Login successfully");
            LoginForm.resetFields();
            setIsAuthenticated(true);
            setUser(result.data.user);
            navigate('/');
        }
        else {
            notification.error({
                message: 'Login failed',
                description: result.message,
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
                        <legend className='font-bold text-2xl'>Login</legend>
                        <Form
                            form={LoginForm}
                            name="LoginForm"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout='vertical'
                        >
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                    {
                                        validator: (_, value) => {
                                            const reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
                                            if (value && !reg.test(value)) {
                                                return Promise.reject(new Error('Invalid format email'));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}

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
                                ]}
                            >
                                <Input.Password onKeyDown={handleEnter} />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" onClick={() => LoginForm.submit()}
                                    style={{ width: "100%" }}
                                    loading={loading}
                                >
                                    Login
                                </Button>
                            </Form.Item>

                            <div>
                                <p className='inline'>Do not have account ? </p>
                                <Link to={'/register'}>Register now</Link>
                            </div>
                        </Form>
                    </fieldset>
                </Col>
            </Row >

        </>
    )
}

export default LoginPage