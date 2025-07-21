import { getCategoryAPI } from "@/services/api";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, InputNumber, Rate, Tabs } from "antd"
import { GetProp } from "antd/lib";
import { useEffect, useState } from "react";

const HomePage = () => {
    const [category, setCategory] = useState<string[]>([])
    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };
    const onChangeTab = (key: string) => {
        console.log(key);
    };

    useEffect(() => {
        const loadCategory = async () => {
            const result = await getCategoryAPI();
            if (result.data) {
                setCategory(result.data);
            }
        }
        loadCategory();
    }, [])

    return (
        <>
            <div className="flex justify-around">
                {/* left-page  */}
                <div className="w-[20%] border-2 border-sky-300 p-2">
                    <div className="flex justify-between">
                        <h1 className="mb-2"><FilterOutlined style={{ color: 'blue' }} /> Bộ lọc tìm kiếm</h1>
                        <ReloadOutlined />
                    </div>
                    <h1 className="mb-2">Danh mục sản phẩm</h1>
                    <Checkbox.Group options={category} defaultValue={['Apple']} onChange={onChange} className="w-[20%]" />
                    <Divider />
                    <div className="flex flex-col gap-4">
                        <h1>Khoảng giá</h1>
                        <div className="flex items-center">
                            <InputNumber
                                addonAfter={'₫'}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                            <span className="px-2">-</span>
                            <InputNumber
                                addonAfter={'₫'}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            /> <br />
                        </div>
                        <Button type="primary">Áp dụng</Button>
                    </div>
                    <Divider />
                    <div>
                        <h1>Đánh giá</h1>
                        <Rate allowHalf defaultValue={5} /> <br />
                        <Rate allowHalf defaultValue={4} /> <span>trở lên</span> <br />
                        <Rate allowHalf defaultValue={3} /> <span>trở lên</span> <br />
                        <Rate allowHalf defaultValue={2} /> <span>trở lên</span> <br />
                        <Rate allowHalf defaultValue={1} /> <span>trở lên</span> <br />
                    </div>
                </div>
                {/* right - page  */}
                <div className="border-2 border-pink-300 w-[75%] p-2">
                    <Tabs
                        onChange={onChangeTab}
                        defaultActiveKey="1"
                        items={[
                            {
                                label: 'Phổ biến',
                                key: '1',
                            },
                            {
                                label: 'Hàng mới',
                                key: '2',
                            },
                            {
                                label: 'Từ thấp đến cao',
                                key: '3',
                            },
                            {
                                label: 'Từ cao đến thấp',
                                key: '4',
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    )
}

export default HomePage