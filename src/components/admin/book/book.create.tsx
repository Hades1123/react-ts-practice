import { getCategoryAPI } from "@/services/api";
import { MAX_SIZE_IMAGE_FILE } from "@/services/helper";
import { PlusOutlined } from "@ant-design/icons";
import { App, Form, GetProp, Image, Input, InputNumber, Modal, Select, Upload, UploadFile, UploadProps } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    isOpenCreateModal: boolean;
    setIsOpenCreateModal: (v: boolean) => void;
}

export const CreateBookModal = (props: IProps) => {
    const { isOpenCreateModal, setIsOpenCreateModal } = props;
    const [createForm] = Form.useForm();
    const [categoryList, setCategoryList] = useState<{ value: string, label: string }[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);
    const [isAllowUpload, setIsAllowUpload] = useState<boolean>(false);
    const { message } = App.useApp();

    const onFinish: FormProps<IBookTable>['onFinish'] = (values) => {
        console.log('Success:', values);
    };


    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_SIZE_IMAGE_FILE;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        setIsAllowUpload(isJpgOrPng && isLt2M);
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChangeThumbnailList: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (isAllowUpload) {
            setThumbnailList(newFileList);
            console.log(newFileList)
        }
        else {
            setThumbnailList(newFileList.slice(0, -1));
        }
    }

    const handleChangeSliderList: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (isAllowUpload) {
            setSliderList(newFileList);
            console.log(newFileList)
        }
        else {
            setSliderList(newFileList.slice(0, -1))
        }
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    useEffect(() => {
        const loadCategory = async () => {
            const result = await getCategoryAPI();
            if (result.data) {
                setCategoryList(result.data.map(item => {
                    return {
                        value: item,
                        label: item,
                    }
                }))
            }
        }
        loadCategory();
    }, [])

    return (
        <>
            <Modal
                title="Create new book"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpenCreateModal}
                onOk={() => setIsOpenCreateModal(false)}
                onCancel={() => setIsOpenCreateModal(false)}
                maskClosable={false}
            >
                <Form
                    layout="vertical"
                    form={createForm}
                    name="Create book form"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<IBookTable>
                        label="Title"
                        name="mainText"
                        rules={[{ required: true, message: 'Please input your title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<IBookTable>
                        label="Author"
                        name="author"
                        rules={[{ required: true, message: 'Please input your author!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<IBookTable>
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input your price!' }]}
                    >
                        <InputNumber
                            addonAfter={'₫'}
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item<IBookTable>
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please input your category!' }]}
                    >
                        <Select
                            style={{ width: 120 }}
                            options={categoryList}
                        />
                    </Form.Item>

                    <Form.Item<IBookTable>
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please input your quantity!' }]}
                    >
                        <InputNumber
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item<IBookTable>
                        label="Thumbnail"
                        name="thumbnail"
                        rules={[{ required: true, message: 'Please input your thumbnail!' }]}
                    >
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            onPreview={handlePreview}
                            onChange={handleChangeThumbnailList}
                            beforeUpload={beforeUpload}
                            fileList={thumbnailList}
                        >
                            {thumbnailList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item<IBookTable>
                        label="Slider"
                        name="slider"
                        rules={[{ required: true, message: 'Please input your slider!' }]}
                    >
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            onPreview={handlePreview}
                            onChange={handleChangeSliderList}
                            beforeUpload={beforeUpload}
                            fileList={sliderList}
                        >
                            {sliderList.length >= 3 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

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
                </Form>
            </Modal>
        </>
    )
}