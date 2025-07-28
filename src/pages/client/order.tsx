import { useCurrentApp } from "@/components/context/app.context"
import { DeleteOutlined } from "@ant-design/icons";
import { Col, Divider, InputNumber, Row } from "antd"
import { useState } from "react";

export const UserOrder = () => {
    const [sum, setSum] = useState<number>(0);
    const { shoppingCart, setShoppingCart } = useCurrentApp();
    return (
        <>
            <div className="bg-gray-200">
                <div className="mx-[20px]">
                    <Row gutter={[10, 10]}>
                        <Col md={18} xs={24}>
                            {
                                shoppingCart.map((item, index) => {
                                    const [count, setCount] = useState<number>(item.quantity);
                                    return (
                                        <div className="flex items-center justify-between bg-white p-4 rounded-sm my-4">
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
                                                value={count}
                                                onChange={(value) => {
                                                    if (value && value < item.detail?.quantity!) {
                                                        setCount(value);
                                                    }
                                                }}
                                            />
                                            <div className="w-[15%]">Tổng : {(item.detail?.price! * count).toLocaleString(
                                                'vi',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }
                                            )} </div>
                                            <DeleteOutlined />
                                        </div>
                                    )
                                })
                            }
                        </Col>
                        <Col md={6} xs={24}>
                            <div className="bg-white my-4 p-4 rounded-sm">
                                <div className="flex justify-between">
                                    <span className="text-2xl">Tạm tính</span>
                                    <span>{sum}</span>
                                </div>
                                <Divider />
                                <div>
                                    <span className="text-2xl">Tổng tiền</span>
                                    <span className="">10000000</span>
                                </div>
                                <Divider />
                                <div>
                                    <button>Click me</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}