import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Modal, Tabs } from "antd";
import { UpdateUser } from "./update.user";
import { UpdatePassword } from "./update.password";
import { useMediaQuery } from "react-responsive";

interface IProps {
    openUserModal: boolean;
    setOpenUserModal: (v: boolean) => void;
}

export const ManageUser = (props: IProps) => {
    const { openUserModal, setOpenUserModal } = props;
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return (
        <>
            <Modal
                title="Quản lí tài khoản"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openUserModal}
                onCancel={() => setOpenUserModal(false)}
                footer={[]}
                width={isMobile ? '80vw' : '60vw'}
                destroyOnClose={true}
                maskClosable={false}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: 'Cập nhật thông tin',
                            key: '1',
                            children: <UpdateUser
                                setOpenUserModal={setOpenUserModal}
                            />,
                            icon: <UserOutlined />
                        },
                        {
                            label: 'Thay đổi mật khẩu',
                            key: '2',
                            children: <UpdatePassword
                                setOpenUserModal={setOpenUserModal}
                            />,
                            icon: <KeyOutlined />
                        },
                    ]}
                />
            </Modal>
        </>
    )
}