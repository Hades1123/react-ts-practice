import { useCurrentApp } from "@/components/context/app.context"
import { DeleteOutlined } from "@ant-design/icons";
import { Col, Divider, InputNumber, Row } from "antd"
import { useEffect, useState } from "react";

export const DetailOrder = () => {

    const { shoppingCart, setShoppingCart } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);

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
                <div className="mx-[20px]">
                    <Row gutter={[10, 10]}>
                        <Col md={18} xs={24}>
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
                        <Col md={6} xs={24}>
                            <div className="bg-white my-4 p-4 rounded-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl">Tạm tính</span>
                                    <span>{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                                <Divider />
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl">Tổng tiền</span>
                                    <span className="text-2xl text-red-500">{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                                <Divider />
                                <div>
                                    <button className="bg-red-500 w-[100%] p-4 text-[1rem] text-white hover:cursor-pointer active:scale-95">Thanh toán</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}