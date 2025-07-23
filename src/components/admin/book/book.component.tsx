import { Rate } from "antd"

export const BookComponent = (props: IBookComponent) => {
    const { thumbnail, mainText, price, rating, sold, onClick } = props;
    return (
        <div className="column" onClick={onClick}>
            <div className='wrapper'>
                <div className='thumbnail'>
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${thumbnail}`} alt="thumbnail book" />
                </div>
                <div className='text'>{mainText}</div>
                <div className='price'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </div>
                <div className='rating'>
                    <Rate value={rating} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                    <span>Đã bán {sold ?? 0}</span>
                </div>
            </div>
        </div>
    )
}