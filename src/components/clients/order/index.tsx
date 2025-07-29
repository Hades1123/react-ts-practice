import { useCurrentApp } from "@/components/context/app.context"
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Col, InputNumber, Row, Steps } from "antd"
import { useEffect, useState } from "react";
import { Payment } from "./paymentForm";


export const DetailOrder = () => {
    const { shoppingCart, setShoppingCart } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [current, setCurrent] = useState(0);

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

    useEffect(() => {
        let sum = 0;
        shoppingCart.forEach(item => {
            sum += item.quantity * item.detail?.price!;
        })
        setTotalPrice(sum);
    }, [shoppingCart])

    return (
        <>
            <div className="bg-gray-200 h-[100vh]">
                <div className="md:mx-[150px]">
                    {shoppingCart.length === 0 ? (

                        <Row>
                            <Col span={24}>
                                <div className=" bg-white flex justify-center items-center rounded-2xl mt-4 h-[60vh]">
                                    <ShoppingCartOutlined style={{ fontSize: '100px' }} />
                                    <div className="text-2xl text-black">
                                        Empty
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    )
                        :
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
                                                    disabled={current == 0 ? false : true}
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
                                                    hidden={current == 0 ? false : true}
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
                                    <Payment
                                        current={current}
                                        setCurrent={setCurrent}
                                        totalPrice={totalPrice}
                                    />
                                </div>
                            </Col>
                        </Row>}
                </div>
            </div>
        </>
    )
}