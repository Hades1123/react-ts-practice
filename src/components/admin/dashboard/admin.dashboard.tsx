import { getDashboardAPI } from "@/services/api";
import { App, Card, Col, Row, Statistic } from "antd"
import { StatisticProps } from "antd/lib";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export const DashBoard = () => {
    const [data, setData] = useState<IDashboardType | null>(null);
    const { notification } = App.useApp();

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );

    useEffect(() => {
        const loadData = async () => {
            const result = await getDashboardAPI();
            if (result.data) {
                setData(result.data);
            }
            else {
                notification.error({
                    message: 'Error',
                    description: JSON.stringify(result.message)
                })
            }
        }
        loadData();
    }, [])

    return (
        <>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Orders">
                        <Statistic value={data?.countOrder ?? 0} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Users">
                        <Statistic value={data?.countUser ?? 0} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Books">
                        <Statistic value={data?.countBook ?? 0} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}