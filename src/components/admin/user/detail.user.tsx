
import { FORMATE_DATE_DEFAULT } from '@/services/helper';
import { Avatar, Descriptions, DescriptionsProps, Drawer } from 'antd';
import { Badge } from 'antd/lib';
import dayjs from 'dayjs';

interface IProps {
    isOpenDetailUser: boolean;
    setIsOpenDetailUser: (v: boolean) => void;
    detailUser: IUserTable | null;
}

const DetailUser = (props: IProps) => {
    const { isOpenDetailUser, setIsOpenDetailUser, detailUser } = props;
    const avatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${detailUser?.avatar}`;
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'id',
            children: detailUser?._id ?? 'empty',
        },
        {
            key: '2',
            label: 'Full Name',
            children: detailUser?.fullName ?? 'empty',
            span: 2,
        },
        {
            key: '3',
            label: 'Email',
            children: detailUser?.email ?? 'empty',
        },
        {
            key: '4',
            label: 'Phone',
            children: detailUser?.phone ?? 'empty',
            span: 2
        },
        {
            key: '5',
            label: 'Role',
            children: <Badge status='success' text={detailUser?.role} />,
        },
        {
            key: '7',
            label: 'Avatar',
            children: <Avatar size={40} src={avatar} />,
            span: 2
        },
        {
            key: '6',
            label: 'Created at',
            children: dayjs(detailUser?.createdAt).format(FORMATE_DATE_DEFAULT),
        },
        {
            key: '8',
            label: 'Update at',
            children: dayjs(detailUser?.updatedAt).format(FORMATE_DATE_DEFAULT),
        }
    ];
    return (
        <>
            <Drawer
                width={850}
                title="Detail User"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => setIsOpenDetailUser(false)}
                open={isOpenDetailUser}
            >
                <Descriptions title="User Info" bordered items={items} size='default' />
            </Drawer >
        </>
    )
}

export default DetailUser