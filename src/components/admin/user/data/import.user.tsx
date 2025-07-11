import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, TableProps } from 'antd';
import { message, Modal, Upload, Table } from 'antd';

interface IProps {
    isOpenImportModal: boolean;
    setIsOpenImportModal: (v: boolean) => void;
}

interface DataType {
    fullName: string;
    email: string;
    phone: string;
}

const { Dragger } = Upload;

const propsUpload: UploadProps = {
    maxCount: 1,
    accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    name: 'file',
    multiple: false,
    customRequest({ file, onSuccess }) {
        setTimeout(() => {
            if (onSuccess) onSuccess("ok");
        }, 1000);
    },
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const ImportUser = (props: IProps) => {
    const { isOpenImportModal, setIsOpenImportModal } = props

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];
    const dataSource: DataType[] = [
        {
            fullName: 'vansi',
            email: 'dp1.1a7.si@gamil.com',
            phone: '213213213',
        }
    ]

    return (
        <Modal
            title="Import data user"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isOpenImportModal}
            onOk={() => setIsOpenImportModal(false)}
            onCancel={() => setIsOpenImportModal(false)}
            width={800}
            maskClosable={false}
            okText={'Import data'}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single support. Only accept .csv, .xls, .xlsx
                </p>
            </Dragger>
            <Table columns={columns} className='pt-5' dataSource={dataSource} />
        </Modal >
    );
}
export default ImportUser;