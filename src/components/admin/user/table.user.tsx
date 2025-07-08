import { getUserAPI } from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef } from 'react';


const customizeTime = (value: string) => {

}

const onChangePagination = async (page: number, pagesize: number) => {
    const result = await getUserAPI(page, pagesize);
    if (result.data) {

    }
}
const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'id',
        dataIndex: '_id',
        render: (_, record) => <a>{record._id}</a>,
        search: false,
    },
    {
        title: 'Full name',
        dataIndex: 'fullName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        copyable: true,
    },
    {
        title: 'Created at',
        dataIndex: 'createdAt',
        valueType: 'date',
    },
    {

        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <EditOutlined style={{ color: 'orange', cursor: 'pointer' }} />
                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
            </Space>
        ),
        search: false,
    }
];

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(sort, filter);
                    const resultAPI = await getUserAPI(1, 5);
                    return {
                        data: resultAPI.data?.result,
                        "page": 1,
                        "success": true,
                        "total": resultAPI.data?.meta.total,
                    }

                }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="_id"
                pagination={{
                    pageSize: 5,
                    onChange: (page, pagesize) => console.log({ page, pagesize }),
                    showSizeChanger: true,
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;