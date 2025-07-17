import { getCategoryAPI } from "@/services/api";
import { MAX_SIZE_IMAGE_FILE } from "@/services/helper";
import { PlusOutlined } from "@ant-design/icons";
import { App, Col, Form, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd";
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
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };


    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onOk = () => {
        createForm.submit();
    }

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleUploadRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess!('Ok');
        }, 0);
    }

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
                onOk={onOk}
                onCancel={() => setIsOpenCreateModal(false)}
                maskClosable={false}
                width={'50vw'}
            >
                <Form
                    layout="vertical"
                    form={createForm}
                    name="Create book form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={30} >
                        <Col xs={24} sm={24} lg={12}>
                            <Form.Item<IBookTable>
                                label="Title"
                                name="mainText"
                                rules={[{ required: true, message: 'Please input your title!' }]}
                            >
                                <Input />
                            </Form.Item>

                        </Col>

                        <Col xs={24} sm={24} lg={12}>
                            <Form.Item<IBookTable>
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: 'Please input your author!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={12} lg={6}>
                            <Form.Item<IBookTable>
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Please input your price!' }]}
                            >
                                <InputNumber
                                    addonAfter={'₫'}
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={12} lg={6}>
                            <Form.Item<IBookTable>
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input your category!' }]}
                            >
                                <Select
                                    options={categoryList}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} lg={12}>
                            <Form.Item<IBookTable>
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: 'Please input your quantity!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '40%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={12}>
                            <Form.Item<IBookTable>
                                label="Thumbnail"
                                name="thumbnail"
                                rules={[{ required: true, message: 'Please input your thumbnail!' }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    customRequest={handleUploadRequest}
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                    maxCount={1}
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} lg={12}>
                            <Form.Item<IBookTable>
                                label="Slider"
                                name="slider"
                                rules={[{ required: true, message: 'Please input your slider!' }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    customRequest={handleUploadRequest}
                                    multiple
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

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
            </Modal >
        </>
    )
}