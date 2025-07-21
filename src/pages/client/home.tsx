import { BookComponent } from '@/components/admin/book/book.component';
import { getCategoryAPI } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination } from 'antd';
import type { FormProps } from 'antd';
import { useEffect, useState } from 'react';
import 'styles/home.scss';

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};


const HomePage = () => {

    const [form] = Form.useForm();
    const [categoryList, setCategoryList] = useState<string[]>([]);

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log(">>> check handleChangeFilter", changedValues, values)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    }

    const onChange = (key: string) => {
        console.log(key);
    };

    useEffect(() => {
        const loadCategory = async () => {
            const result = await getCategoryAPI();
            if (result.data) {
                setCategoryList(result.data);
            }
        }
        loadCategory();
    }, [])

    const items = [
        {
            key: '1',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: '2',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: '3',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: '4',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} className='border-2 border-sky-400 p-2'>
                    <div className='flex justify-between'>
                        <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                        <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
                    </div>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                    >
                        <Form.Item
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{ span: 24 }}
                        >
                            <Checkbox.Group>
                                <Row>
                                    {categoryList.map((item, index) => {
                                        return (
                                            <Col span={24} key={index}>
                                                <Checkbox value={item}>
                                                    {item}
                                                </Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{ span: 24 }}
                        >
                            <div className='flex justify-around'>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="from VND"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span>-</span>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="to VND"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{ span: 24 }}
                        >
                            {new Array(5).fill(0).map((item, index, arr) => {
                                return (
                                    <div key={index}>
                                        <Rate value={arr.length - index} disabled style={{ color: '', fontSize: 15 }} />
                                        <span className="ant-rate-text">{index !== 0 ? <span> trở lên</span> : ''}</span>
                                    </div>
                                )
                            })}
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} xs={24} className='border-2 border-red-500'>
                    <Row>
                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            onChange={onChange}
                        />
                    </Row>
                    <Row className='customize-row'>
                        {new Array(8).fill(0).map((item, index) => {
                            return (
                                <BookComponent
                                    key={index}
                                    thumbnail='3-931186dd6dcd231da1032c8220332fea.jpg'
                                    mainText='Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn'
                                    price={70000}
                                    rating={5}
                                    sold={1000}
                                />
                            )
                        })}
                    </Row>
                    <Divider />
                    <Row className='flex justify-center'>
                        <Pagination
                            defaultCurrent={1}
                            total={500}
                            responsive
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage;