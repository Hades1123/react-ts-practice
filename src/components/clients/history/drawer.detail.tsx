import { Divider, Drawer } from "antd";

interface IProps {
    currentData: {
        bookName: string;
        quantity: number;
        _id: string;
    }[];
    openDetailHistory: boolean;
    setOpenDetailHistory: (v: boolean) => void;
}

export const DetailHistory = (props: IProps) => {
    const { currentData, openDetailHistory, setOpenDetailHistory } = props;
    return (
        <>
            <Drawer
                title="Detail"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => setOpenDetailHistory(false)}
                open={openDetailHistory}
            >
                {currentData.map(item => {
                    return (
                        <>
                            <div className="mt-4">Tiêu đề : <span className="text-[16px] font-bold italic">{item.bookName}</span></div>
                            <div>Số lượng : <span className="text-[16px] text-red-600">{item.quantity}</span></div>
                            <Divider />
                        </>
                    )
                })}
            </Drawer>
        </>
    )
}