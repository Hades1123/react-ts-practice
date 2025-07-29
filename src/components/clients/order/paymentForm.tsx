import { useCurrentApp } from "@/components/context/app.context";
import { createOrderBookAPI } from "@/services/api";
import { App, Button, Divider, Form, Input, Radio } from "antd"
import TextArea from "antd/es/input/TextArea";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

type UserMethod = "COD" | "BANKING";

type FieldType = {
    deliveryMethod?: UserMethod;
    fullName?: string;
    phone?: string;
    address?: string;
};

interface IProps {
    current: number;
    totalPrice: number;
    setCurrent: (v: number) => void;
}

export const Payment = (props: IProps) => {
    const { current, totalPrice, setCurrent } = props;
    const { user, shoppingCart, setShoppingCart } = useCurrentApp();
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const detail = shoppingCart.map(item => {
            return {
                bookName: item.detail?.mainText ?? 'Unknown name',
                quantity: item.quantity,
                _id: item._id
            }
        })
        setIsLoading(true);
        const result = await createOrderBookAPI({
            name: values.fullName!,
            address: values.address!,
            phone: values.phone!,
            type: values.deliveryMethod,
            totalPrice: totalPrice,
            detail: detail,
        })
        setIsLoading(false);
        if (result.data) {
            message.success('order successfully !!!');
            setCurrent(current + 1);
            localStorage.removeItem('cart');
            setShoppingCart([]);
        }
        else {
            notification.error({
                message: 'Error',
                description: JSON.stringify(result.message)
            })
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    useEffect(() => {
        if (user && current == 1) {
            form.setFieldsValue({
                deliveryMethod: 'BANKING',
                fullName: user.fullName,
                phone: user.phone,
            })
        }
    }, [user, current])

    return (
        <>
            {
                current !== 2 && (
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
                                            <>
                                                <Button
                                                    style={{ width: '100%' }}
                                                    color="danger"
                                                    variant="solid"
                                                    onClick={() => {
                                                        // setCurrent(current + 1);
                                                        form.submit();
                                                    }}
                                                    loading={isLoading}
                                                >
                                                    Đặt hàng ({shoppingCart.length})
                                                </Button>
                                                <Button
                                                    className="mt-4" style={{ width: '100%' }}
                                                    onClick={() => setCurrent(current - 1)}
                                                >Quay lại</Button>
                                            </>
                                        )
                                    }
                                </div>
                            </>
                        )}
                    </div>
                )
            }

        </>
    )
}