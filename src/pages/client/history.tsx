import { DetailHistory } from "@/components/clients/history/drawer.detail";
import { getOrderHistoryAPI } from "@/services/api";
import { Col, message, Row, Table } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";


export const HistoryPage = () => {
    const [currentHistory, setCurrentHistory] = useState<IOrderType[]>([]);
    const [openDetailHistory, setOpenDetailHistory] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<{
        bookName: string;
        quantity: number;
        _id: string;
    }[]>([]);

    const columns: TableProps<IOrderType>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => <span>{index + 1}</span>
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, record) => <span>{dayjs(record.createdAt).format("DD-MM-YYYY")}</span>
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => <span>{record.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => <span>{record.paymentStatus}</span>
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: 'detail',
            render: (_, record) => <a href="#!" onClick={() => {
                setCurrentData(record.detail);
                setOpenDetailHistory(true);
            }}>Xem chi tiết</a>
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            const result = await getOrderHistoryAPI();
            if (result.data) {
                setCurrentHistory(result.data);
            }
        }
        loadData();
    }, [])

    return (
        <>
            <div>
                <div className="text-4xl text-center mb-4 font-bold">Lịch sử mua hàng</div>
                <div className="mx-auto my-0 max-w-[1440px]">
                    <Row align={'middle'} justify={'center'}>
                        <Col span={20}>
                            <Table dataSource={currentHistory} columns={columns} rowKey={'stt'} />;
                        </Col>
                    </Row>
                </div>
            </div>
            <DetailHistory
                openDetailHistory={openDetailHistory}
                setOpenDetailHistory={setOpenDetailHistory}
                currentData={currentData}
            />
        </>
    )
}