import { BookComponent } from '@/components/admin/book/book.component';
import { getBookData, getCategoryAPI } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, notification } from 'antd';
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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPage, setTotalPage] = useState<number>(500);
    const [bookList, setBookList] = useState<IBookTable[]>([]);

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log(">>> check handleChangeFilter", changedValues, values)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    }

    const onChange = (key: string) => {
        console.log(key);
    };

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    }

    const onShowSizeChange = (page: number, pageSize: number) => {
        setPageSize(pageSize);
    }

    useEffect(() => {
        const loadCategory = async () => {
            const result = await getCategoryAPI();
            if (result.data) {
                setCategoryList(result.data);
            }
        }

        const loadBookTableData = async () => {
            const result = await getBookData(`current=${currentPage}&pageSize=${pageSize}&sort=-sold`);
            if (result && result.data) {
                setBookList(result.data.result);
                setTotalPage(result.data.meta.total);
            }
            else {
                notification.error({
                    message: 'Call API get book with paginate failed',
                    description: JSON.stringify(result.message),
                })
            }
        }
        loadCategory();
        loadBookTableData();
    }, [])

    useEffect(() => {
        const loadBookTableData = async () => {
            const result = await getBookData(`current=${currentPage}&pageSize=${pageSize}&sort=-sold`);
            if (result && result.data) {
                setBookList(result.data.result);
                setTotalPage(result.data.meta.total);
            }
            else {
                notification.error({
                    message: 'Call API get book with paginate failed',
                    description: JSON.stringify(result.message),
                })
            }
        }
        loadBookTableData();
    }, [currentPage, pageSize])

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
                        {bookList.map((item, index) => {
                            return (
                                <BookComponent
                                    key={index}
                                    thumbnail={item.thumbnail}
                                    mainText={item.mainText}
                                    price={item.price}
                                    rating={5}
                                    sold={item.sold}
                                />
                            )
                        })}
                    </Row>
                    <Divider />
                    <Row className='flex justify-center'>
                        <Pagination
                            total={totalPage}
                            pageSize={pageSize}
                            current={currentPage}
                            responsive
                            onChange={(page) => onChangePage(page)}
                            onShowSizeChange={(page, pageSize) => onShowSizeChange(page, pageSize)}
                            showSizeChanger
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage;