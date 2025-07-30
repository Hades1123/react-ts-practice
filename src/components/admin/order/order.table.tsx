import { deleteBookAPI, getBookData, getCategoryAPI, getOrderAPI } from '@/services/api';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, notification, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { UploadFile } from 'antd/lib';
import { v4 as uuidv4 } from 'uuid';
import { CSVLink } from 'react-csv';

interface ISearch {
    name?: string;
    address?: string;
}


export const OrderTable = () => {
    const [metaData, setMetaData] = useState<{ query: string, page: number, pageSize: number, totalPage: number }>({
        query: '',
        page: 1,
        pageSize: 5,
        totalPage: 0,
    });

    const columns: ProColumns<IOrderType>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (_, record) => <a href="#!">{record._id}</a>,
            hideInSearch: true,
        },
        {
            title: 'Full name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            sorter: true,
            hideInSearch: true,
            render: (_, record) => <span>{record.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            sorter: true,
            hideInSearch: true,
            render: (_, record) => <span>{dayjs(record.createdAt).format('DD-MM-YYYY')}</span>
        },
    ];

    const actionRef = useRef<ActionType>();

    return (
        <>
            <ProTable<IOrderType, ISearch>
                bordered
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    console.log({ params, sort });
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    if (params.name) {
                        query += `&name=/${params.name}/i`;
                    }
                    if (params.address) {
                        query += `&address=/${params.address}/i`;
                    }

                    if (Object.keys(sort).length !== 0) {
                        const key = Object.keys(sort)[0];
                        const value = sort[key] === 'ascend' ? `${key}` : `-${key}`;
                        query += `&sort=${value}`;
                    }
                    else {
                        query += `&sort=-createdAt`;
                    }

                    const result = await getOrderAPI(query);

                    if (result.data) {
                        setMetaData({
                            query: query,
                            page: result.data.meta.current,
                            pageSize: result.data.meta.pageSize,
                            totalPage: result.data.meta.total,
                        })
                    }

                    return {
                        data: result.data?.result,
                        "page": result.data!.meta.current,
                        "success": true,
                        "total": result.data!.meta.total,
                    }
                }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 5,
                }}
                dateFormatter="string"
                headerTitle="Order Table"
                toolBarRender={() => [
                ]}
            />
        </>
    );
};
