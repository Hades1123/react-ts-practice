import { useState } from 'react';
import { Badge, Descriptions, Drawer, Image, Upload } from 'antd';
import type { DescriptionsProps, UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';
import { GetProp } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';

interface IProps {
    openDetailDescription: boolean;
    setOpenDetailDescription: (v: boolean) => void;
    currentBook: IBookTable | null;
    fileList: UploadFile[];
    setFileList: (v: UploadFile[]) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const DetailBook = (props: IProps) => {
    const { openDetailDescription, setOpenDetailDescription, currentBook, fileList, setFileList } = props;
    const onClose = () => {
        setOpenDetailDescription(false);
    }
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: currentBook?._id,
        },
        {
            key: '2',
            label: 'mainText',
            children: currentBook?.mainText,
            span: 2
        },
        {
            key: '3',
            label: 'Author',
            children: currentBook?.author,
        },
        {
            key: '4',
            label: 'Price',
            children: currentBook?.price,
            span: 2,
        },
        {
            key: '5',
            label: 'Category',
            children: <Badge status="processing" text={currentBook?.category} />,
            span: 3
        },
        {
            key: '6',
            label: 'Created At',
            children: dayjs(currentBook?.createdAt).format('DD/MM/YYYY'),
        },
        {
            key: '7',
            label: 'Updated At',
            children: dayjs(currentBook?.updatedAt).format('DD/MM/YYYY'),
        },
    ];
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <Drawer
                title="Detail book"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailDescription}
                width={900}
            >
                <Descriptions title="Book Information" bordered items={items} size='middle' />
                <div>
                    <h1 className='my-8 text-2xl font-bold'>Images</h1>
                    <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        showUploadList={{
                            showRemoveIcon: false,
                        }}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </div>
            </Drawer>

        </>
    )
}