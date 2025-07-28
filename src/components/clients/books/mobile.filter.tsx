import { Button, Checkbox, Col, Divider, Drawer, Form, InputNumber, Rate, Row } from "antd"
import { FormProps } from "antd/lib";

interface IProps {
    showMobileFilter: boolean;
    setShowMobileFilter: (v: boolean) => void;
    categoryList: string[];
    setPriceRange: (v: string) => void;
    setFilter: (v: string) => void;
}

type FieldType = {
    category: string[];
    range: {
        from: number,
        to: number,
    };
};

export const MobileFilter = (props: IProps) => {
    const { showMobileFilter, setShowMobileFilter, categoryList, setPriceRange, setFilter } = props;
    const [filterForm] = Form.useForm();

    const handleChangeFilter = (changedValues: any) => {
        if (changedValues && changedValues['category'].length !== 0) {
            setFilter(`category=${changedValues['category'].toString()}`);
        }
        else {
            setFilter('');
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('>>> check values', values.range.from, values.range.to);
        let query = String('&price>=' + (values.range.from ? values.range.from : '0') + '&price<' + (values.range.to ? values.range.to : '0'));
        setPriceRange(query);
    }

    return (
        <>
            <Drawer
                title="Filter"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => setShowMobileFilter(false)}
                open={showMobileFilter}
            >
                <Form
                    onFinish={onFinish}
                    form={filterForm}
                    onValuesChange={(changedValues) => handleChangeFilter(changedValues)}
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
                        <Row style={{ width: '100%' }}>
                            <Col span={24}>
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
                            <Col span={24}>
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
                        </Row>
                        <div>
                            <Button onClick={() => filterForm.submit()}
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
            </Drawer>
        </>
    )
}