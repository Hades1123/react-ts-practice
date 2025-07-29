import { useCurrentApp } from "@/components/context/app.context";
import { Divider, Form, Input, Radio } from "antd"
import TextArea from "antd/es/input/TextArea";
import { FormProps } from "antd/lib";
import { useEffect } from "react";

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
    const { user, shoppingCart } = useCurrentApp();
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
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
                                >Thanh toán ({shoppingCart.length})</button>
                            )
                        }
                    </div>
                </>
            )}
        </>
    )
}