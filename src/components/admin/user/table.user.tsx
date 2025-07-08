import { getUserAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useRef, useState } from 'react';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}


const TableUser = () => {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    const onChangePage = (page: number) => {
        setPage(page)
    }

    const onPageSizeChange = (page: number, pageSize: number) => {
        setPageSize(pageSize)
    }

    const onResetSearchForm = () => {
        setPage(1);
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            title: "STT",
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_, record, index) => {
                return <span>{index + 1 + (page - 1) * pageSize}</span>
            },

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
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
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
            <ProTable<IUserTable, TSearch>
                onReset={onResetSearchForm}
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }

                    }
                    const resultAPI = await getUserAPI(query);
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