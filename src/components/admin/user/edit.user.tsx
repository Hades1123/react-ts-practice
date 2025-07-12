import { updateUserAPI } from "@/services/api";
import { Form, Input, Modal, App } from "antd"
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IProps {
    isOpenEditModal: boolean;
    setIsOpenEditModal: (v: boolean) => void;
    detailUser: IUserTable | null;
    setDetailUser: (v: IUserTable | null) => void;
    refreshTable: () => void;
}

export const EditUser = (props: IProps) => {
    const { message } = App.useApp();
    const { isOpenEditModal, setIsOpenEditModal, detailUser, setDetailUser, refreshTable } = props;
    const [editForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish: FormProps<IUserTable>['onFinish'] = async (values) => {
        setLoading(true);
        const result = await updateUserAPI(detailUser?._id!, values.fullName, values.phone);
        if (result.data) {
            message.success('Update user successfully');
            setIsOpenEditModal(false);
            setDetailUser(null);
            refreshTable();
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpenEditModal) {
            editForm.setFieldsValue({
                email: detailUser?.email,
                fullName: detailUser?.fullName,
                phone: detailUser?.phone,
            })
        }
    }, [detailUser])

    const onOk = () => {
        editForm.submit();
    }

    const onCancel = () => {
        setIsOpenEditModal(false);
        setDetailUser(null);
    }

    return (
        <>
            <Modal
                title="Edit modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpenEditModal}
                onOk={onOk}
                onCancel={onCancel}
                maskClosable={false}
                okButtonProps={{
                    loading: loading
                }}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    name="edit-form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<IUserTable>
                        label="Email"
                        name="email"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<IUserTable>
                        label="Full name"
                        name="fullName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<IUserTable>
                        label="Phone"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}
