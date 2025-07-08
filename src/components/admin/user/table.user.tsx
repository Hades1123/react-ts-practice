import { getUserAPI } from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';


const TableUser = () => {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    const onChangePage = (page: number) => {
        setPage(page)
    }

    const onPageSizeChange = (page: number, pageSize: number) => {
        setPageSize(pageSize)
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            title: "STT",
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_, record, index) => {
                return <span>{index + 1 + (page - 1) * pageSize}</span>
            }
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

    const actionRef = useRef<ActionType>();
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log('render')
                    const resultAPI = await getUserAPI(page, pageSize);
                    return {
                        data: resultAPI.data?.result,
                        "page": page,
                        "success": true,
                        "total": resultAPI.data?.meta.total,
                    }

                }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="_id"
                pagination={{
                    pageSize: pageSize,
                    current: page,
                    showSizeChanger: true,
                    onChange: onChangePage,
                    onShowSizeChange: onPageSizeChange,
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