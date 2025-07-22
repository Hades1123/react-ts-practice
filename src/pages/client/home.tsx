import { BookComponent } from '@/components/admin/book/book.component';
import { getBookData, getCategoryAPI } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, notification, Spin } from 'antd';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const [sortQuery, setSortQuery] = useState<string>('-sold');

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log(">>> check handleChangeFilter", changedValues, values)
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    }

    const onChangePage = (page: number) => {
        setCurrentPage(page);
    }

    const onShowSizeChange = (page: number, pageSize: number) => {
        setPageSize(pageSize);
    }

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${currentPage}&pageSize=${pageSize}`;
        if (filter) {
            query += `&filter=${filter}`;
        }
        if (sortQuery) {
            query += `&sort=${sortQuery}`;
        }
        const result = await getBookData(query);
        if (result && result.data) {
            setBookList(result.data.result);
            setTotalPage(result.data.meta.total);
        }
        else {
            notification.error({
                message: 'Call getBookData API failed',
                description: JSON.stringify(result.message),
            })
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const loadCategory = async () => {
            const result = await getCategoryAPI();
            if (result.data) {
                setCategoryList(result.data);
            }
        }
        loadCategory();
    }, [])

    useEffect(() => {
        fetchBook();
    }, [currentPage, pageSize, filter, sortQuery])

    const items = [
        {
            key: '-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: '-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: '-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    return (
        <div className='bg-[#efefef] py-5'>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div className='p-5 bg-[#fff] rounded-[5px]'>
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
                                                    <Col span={24} key={index} className='py-[7px]'>
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
                                    <Row gutter={[10, 10]} style={{ width: '100%' }}>
                                        <div className='flex justify-around'>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={["range", 'from']}>
                                                    <InputNumber
                                                        name='from'
                                                        min={0}
                                                        placeholder="from VND"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xl={2} md={0}>
                                                <span>-</span>
                                            </Col>
                                            <Col xl={11} md={24}>
                                                <Form.Item name={["range", 'to']}>
                                                    <InputNumber
                                                        name='to'
                                                        min={0}
                                                        placeholder="to VND"
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </div>
                                    </Row>
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
                                                <Rate value={arr.length - index} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                                <span className="ant-rate-text">{index !== 0 ? <span> trở lên</span> : ''}</span>
                                            </div>
                                        )
                                    })}
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>

                    <Col md={20} xs={24}>
                        <div className='bg-[#fff] p-5 rounded-[5px]'>
                            <Row>
                                <Tabs
                                    defaultActiveKey="sort=-sold"
                                    items={items}
                                    onChange={(value) => setSortQuery(value)}
                                    style={{ overflowX: "auto" }}
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
                            <Row className='flex justify-center mt-10'>
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
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default HomePage;