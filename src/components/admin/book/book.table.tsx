import { getBookData } from '@/services/api';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { DetailBook } from './book.detail';
import { UploadFile } from 'antd/lib';
import { v4 as uuidv4 } from 'uuid';

interface ISearch {
    mainText: string;
    author: string;
}

export const BookTable = () => {
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [openDetailDescription, setOpenDetailDescription] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onClickViewDetail = (record: IBookTable) => {
        const mergeImagesList = [record.thumbnail, ...record.slider];
        let newFileList: UploadFile[] = [];
        for (const item of mergeImagesList) {
            newFileList.push({
                uid: uuidv4(),
                name: 'image.png',
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
            })
        }
        setFileList(newFileList)
        setCurrentBook(record);
        setOpenDetailDescription(true);
    }

    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (_, record) => <a href="#!" onClick={() => onClickViewDetail(record)}>{record._id}</a>,
            hideInSearch: true,
        },
        {
            title: 'Title',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (_, record) => <span>{record.price.toLocaleString('vi', {
                style: 'currency',
                currency: 'VND',
            })}</span>,
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Update at',
            dataIndex: 'updatedAt',
            hideInSearch: true,
            render: (_, record) => <span>{dayjs(record.updatedAt).format('DD/MM/YYYY')}</span>,
            sorter: true,
        },
        {
            title: "Action",
            render: () => {
                return (
                    <>
                        <Space size="middle">
                            <EditOutlined style={{ color: 'orange', cursor: 'pointer' }} className='p-1' />
                            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} className='p-1' />
                        </Space>
                    </>
                )
            },
            hideInSearch: true,
        }
    ];
    const actionRef = useRef<ActionType>();
    return (
        <>
            <ProTable<IBookTable, ISearch>
                bordered
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log({ params, sort, filter });
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    if (params.mainText) {
                        query += `&mainText=/${params.mainText}/i`;
                    }
                    if (params.author) {
                        query += `&author=/${params.author}/i`;
                    }

                    if (Object.keys(sort).length !== 0) {
                        const key = Object.keys(sort)[0];
                        const value = sort[key] === 'ascend' ? `${key}` : `-${key}`;
                        query += `&sort=${value}`;
                    }

                    const result = await getBookData(query);

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
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    defaultValue: {
                        option: { fixed: 'right', disable: true },
                    },
                    onChange(value) {
                        console.log('value: ', value);
                    },
                }}
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 5,
                }}
                dateFormatter="string"
                headerTitle="Book Table"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        Export
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,
                ]}
            />
            <DetailBook
                openDetailDescription={openDetailDescription}
                setOpenDetailDescription={setOpenDetailDescription}
                currentBook={currentBook}
                fileList={fileList}
                setFileList={setFileList}
            />
        </>
    );
};
