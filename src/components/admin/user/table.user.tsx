import { getUserAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUserModal from './create.modal.user';
import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';
import { EditUser } from './edit.user';
import { DeleteUser } from './delete.user.popUp';


type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}


const TableUser = () => {

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isOpenDetailUser, setIsOpenDetailUser] = useState<boolean>(false);
    const [detailUser, setDetailUser] = useState<IUserTable | null>(null);
    const [isOpenCreateUser, setIsOpenCreateUser] = useState<boolean>(false);
    const [isOpenImportModal, setIsOpenImportModal] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [currentUserTable, setCurrentUserTable] = useState<IUserTable[]>([]);
    const [openExportModal, setOpenExportModal] = useState<boolean>(false)
    const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);

    const onChangePage = (page: number) => {
        setPage(page)
    }

    const onPageSizeChange = (page: number, pageSize: number) => {
        setPageSize(pageSize)
    }

    const onResetSearchForm = () => {
        setPage(1);
    }

    const handleOpenDetailUser = (record: IUserTable) => {
        setIsOpenDetailUser(true);
        setDetailUser(record);
    }

    const onClickAddNew = () => {
        setIsOpenCreateUser(true);
    }

    const handleButtonExport = async () => {
        setOpenExportModal(true);
        const result =
            await getUserAPI(query
                .replace(`pageSize=${pageSize}`, `pageSize=${totalPage}`)
                .replace(`current=${page}`, `current=${1}`));
        if (result.data) {
            setCurrentUserTable(result.data.result);
        }
    }

    const handleEditButton = (record: IUserTable) => {
        setIsOpenEditModal(true);
        setDetailUser(record);
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
            render: (_, record) => <a onClick={() => handleOpenDetailUser(record)}>{record._id}</a>,
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
            render: (_, record, index) => (
                <Space size="middle">
                    <EditOutlined style={{ color: 'orange', cursor: 'pointer' }} onClick={() => handleEditButton(record)} />
                    <DeleteUser
                        detailUser={detailUser}
                        refreshTable={refreshTable}
                        setPage={setPage}
                        totalPage={totalPage}
                        pageSize={pageSize}
                        page={page}
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => {
                                setDetailUser(record);
                            }}
                        />
                    </DeleteUser>
                </Space>
            ),
            search: false,
        }
    ];

    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef.current?.reload();
    }

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

                    if (Object.keys(sort).length !== 0) {
                        const assign = Object.values(sort)[0] === 'ascend' ? '' : '-';
                        const key = Object.keys(sort)[0];
                        query += `&sort=${assign}${key}`;
                    }
                    else {
                        query += '&sort=-createdAt';
                    }

                    const resultAPI = await getUserAPI(query);
                    if (resultAPI.data) {
                        setQuery(query);
                        setTotalPage(resultAPI.data.meta.total);
                    }
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
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={handleButtonExport}
                    >
                        Export
                    </Button>,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined />}
                        onClick={() => setIsOpenImportModal(true)}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={onClickAddNew}
                        type="primary"
                    >
                        Add new
                    </Button>,
                ]}
            />
            <DetailUser
                isOpenDetailUser={isOpenDetailUser}
                setIsOpenDetailUser={setIsOpenDetailUser}
                detailUser={detailUser}
            />
            <CreateUserModal
                isOpenCreateUser={isOpenCreateUser}
                setIsOpenCreateUser={setIsOpenCreateUser}
                refreshTable={refreshTable}
            />
            <ImportUser
                isOpenImportModal={isOpenImportModal}
                setIsOpenImportModal={setIsOpenImportModal}
                refreshTable={refreshTable}
            />
            {/* export modal  */}
            <Modal
                title="Export modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openExportModal}
                onCancel={() => setOpenExportModal(false)}
                footer={[
                    <Button type='primary' onClick={() => setOpenExportModal(false)}>Cancel</Button>,
                    <Button type='primary'>
                        <CSVLink data={currentUserTable} filename='user.csv' onClick={() => setOpenExportModal(false)}>Export</CSVLink>
                    </Button>,
                ]}
            >
                Do you want to export this user.csv file ?
            </Modal>,

            <EditUser
                isOpenEditModal={isOpenEditModal}
                setIsOpenEditModal={setIsOpenEditModal}
                detailUser={detailUser}
                setDetailUser={setDetailUser}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableUser;