import { useCurrentApp } from "@/components/context/app.context"
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, InputNumber, Radio, Row, Steps, theme } from "antd"
import TextArea from "antd/es/input/TextArea";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

type FieldType = {
    deliveryMethod?: string;
    fullName?: string;
    phone?: string;
    address?: string;
};

export const DetailOrder = () => {

    const { shoppingCart, setShoppingCart } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Đơn hàng',
            content: '',
        },
        {
            title: 'Đặt hàng',
            content: '',
        },
        {
            title: 'Thanh toán',
            content: '',
        },
    ];
    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        let sum = 0;
        shoppingCart.forEach(item => {
            sum += item.quantity * item.detail?.price!;
        })
        setTotalPrice(sum);
    }, [shoppingCart])

    return (
        <>
            <div className="bg-gray-200">
                <div className="md:mx-[150px]">
                    <Row gutter={[20, 10]}>
                        <Col span={24} className="mt-4">
                            <div className="bg-white rounded-sm p-2">
                                <Steps current={current} items={items} onChange={(value) => setCurrent(value)} />
                            </div>
                        </Col>
                        <Col md={16} xs={24}>
                            {
                                shoppingCart.map((item) => {
                                    let currentPrice = item.quantity * item.detail?.price!;;
                                    return (
                                        <div className="flex items-center justify-between bg-white p-4 rounded-sm my-4" key={item._id}>
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail?.thumbnail}`} alt="image"
                                                className="w-[100px] h-[100px]"
                                            />
                                            <div className="w-[30%]">{item.detail?.mainText}</div>
                                            <div className="w-[10%]">{item.detail?.price.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}</div>
                                            <InputNumber
                                                style={{ width: '10%' }}
                                                value={item.quantity}
                                                onChange={(value) => {
                                                    if (!value || value < 1) {
                                                        return;
                                                    }
                                                    const localCart = localStorage.getItem('cart');
                                                    if (value && !isNaN(value) && value <= item.detail?.quantity! && localCart) {
                                                        const storingCart = JSON.parse(localCart) as IShoppingCart[];
                                                        storingCart.forEach(storingCartEle => {
                                                            if (storingCartEle._id == item._id) {
                                                                storingCartEle.quantity = value;
                                                                localStorage.setItem('cart', JSON.stringify(storingCart));
                                                                setShoppingCart(storingCart);
                                                            }
                                                        })
                                                    }
                                                }}
                                            />
                                            <div className="w-[15%]">Tổng : {currentPrice.toLocaleString(
                                                'vi',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }
                                            )} </div>
                                            <DeleteOutlined
                                                style={{ color: 'red', cursor: 'pointer', padding: '2px' }}
                                                onClick={() => {
                                                    const newShoppingCart = shoppingCart.filter(shoppingCartEle => shoppingCartEle._id != item._id);
                                                    localStorage.setItem('cart', JSON.stringify(newShoppingCart));
                                                    setShoppingCart(newShoppingCart);
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </Col>
                        <Col md={8} xs={24}>
                            <div className="bg-white my-4 p-4 rounded-sm">
                                {current == 1 && (
                                    <>
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            name="Thanh toán"
                                            onFinish={onFinish}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                            initialValues={{ "deliveryMethod": "BANKING" }}
                                        >
                                            <Form.Item<FieldType>
                                                label="Hình thức thanh toán"
                                                name="deliveryMethod"
                                                rules={[{ required: true, message: 'Vui lòng chọn hình thức thanh toán!' }]}
                                            >
                                                <Radio.Group>
                                                    <Radio value={'COD'} style={{ width: '100%' }}>Thanh toán khi nhận hàng</Radio>
                                                    <Radio value={'BANKING'}>Thanh toán bằng tài khoản ngân hàng</Radio>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item<FieldType>
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[{ required: true, message: 'Please input your full name!' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item<FieldType>
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item<FieldType>
                                                label="Địa chỉ"
                                                name="address"
                                                rules={[{ required: true, message: 'Please input your address!' }]}
                                            >
                                                <TextArea rows={4} placeholder="Tối đa 200 kí tự" maxLength={200} />
                                            </Form.Item>
                                        </Form>
                                    </>
                                )}
                                {(current == 0 || current == 1) && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[16px]">Tạm tính</span>
                                            <span>{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                        </div>
                                        <Divider />
                                        <div className="flex justify-between items-center">
                                            <span className="text-[20px]">Tổng tiền</span>
                                            <span className="text-2xl text-red-500">{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                        </div>
                                        <Divider />
                                        <div>
                                            {current == 0 && (
                                                <button
                                                    className="bg-red-500 w-[100%] p-4 text-[1rem] text-white hover:cursor-pointer active:scale-95"
                                                    onClick={() => {
                                                        setCurrent(current + 1);
                                                    }}
                                                >Mua hàng ({shoppingCart.length})</button>
                                            )}
                                            {
                                                current == 1 && (
                                                    <button
                                                        className="bg-red-500 w-[100%] p-4 text-[1rem] text-white hover:cursor-pointer active:scale-95"
                                                        onClick={() => {
                                                            // setCurrent(current + 1);
                                                            form.submit();
                                                        }}
                                                    >Mua hàng ({shoppingCart.length})</button>
                                                )
                                            }
                                        </div>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}