import { useCurrentApp } from "@/components/context/app.context"
import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Col, Form, Input, Row, Upload, UploadProps } from "antd"
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import type { RcFile as OriRcFile, UploadRequestOption as RcCustomRequestOptions, UploadProps as RcUploadProps, UploadRequestOption } from 'rc-upload/lib/interface';
import { UpdateUserInfo, uploadFileAPI } from "@/services/api";

type FieldType = {
    fullName: string;
    email: string;
    phone: string;
};

interface IProps {
    setOpenUserModal: (v: boolean) => void;
}

export const UpdateUser = (props: IProps) => {
    const { setOpenUserModal } = props;
    const { user, setUser } = useCurrentApp();
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [currentAvatar, setCurrentAvatar] = useState<string>(user?.avatar ?? '');
    const [upLoadBtnLoading, setUpLoadBtnLoading] = useState<boolean>(false);
    const [isLoadingUpdateBtn, setIsLoadingUpdateBtn] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        setIsLoadingUpdateBtn(true);
        const result = await UpdateUserInfo(values.fullName, values.phone, currentAvatar, user?.id!);
        if (result.data) {
            message.success('Update user information successfully');
            if (user) {
                const newUserInfo: IUser = {
                    ...user,
                    ...values,
                    avatar: currentAvatar,
                    role: user?.role ?? 'USER',
                }
                setUser(newUserInfo);
            }
            setIsLoadingUpdateBtn(false);
            setOpenUserModal(false);
        }
        else {
            notification.error({
                message: 'Update user info failed',
                description: JSON.stringify(result.message),
            })
        }
        setIsLoadingUpdateBtn(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCustomRequest = (options: UploadRequestOption<any>) => {
        // Simulate a successful upload
        const { onSuccess } = options;
        if (onSuccess) {
            setTimeout(() => {
                onSuccess("ok");
            }, 1000);
        }
    };

    const uploadBtnProps: UploadProps = {
        showUploadList: false,
        maxCount: 1,
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        async onChange(info) {
            setUpLoadBtnLoading(true);
            if (info.file.status !== 'uploading') {
                console.log(info.file);
                if (info.file.originFileObj) {

                    const result = await uploadFileAPI(info.file.originFileObj, 'avatar');
                    if (result.data) {
                        setCurrentAvatar(result.data.fileUploaded);
                    }
                    else {
                        message.error('Upload avatar failed');
                    }
                    setUpLoadBtnLoading(false);
                }
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    useEffect(() => {
        form.setFieldsValue({
            fullName: user?.fullName,
            email: user?.email,
            phone: user?.phone,
        })
    }, [])

    return (
        <>
            <div className="p-4 mt-2">
                <Row gutter={[20, 20]}>
                    <Col md={12} xs={24}>
                        <div className="flex justify-center">
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${currentAvatar}`}
                                className="w-[100px] h-[100px] rounded-[999px]"
                            ></img>
                        </div>
                        <div className="text-center mt-4">
                            <Upload {...uploadBtnProps} customRequest={handleCustomRequest}>
                                <Button icon={<UploadOutlined />} loading={upLoadBtnLoading}>Click to Upload</Button>
                            </Upload>
                        </div>
                    </Col>

                    <Col md={12} xs={24}>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item<FieldType>
                                label="Full name"
                                name="fullName"
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Button
                                onClick={() => form.submit()}
                                type="primary"
                                loading={isLoadingUpdateBtn}
                            >
                                Update</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    )
}