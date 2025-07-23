import { Row, Col, Rate, Divider, InputNumber } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'styles/book.scss';
import buttonStyles from 'styles/button.module.scss'
import { ModalGallery } from './modal.gallery';


interface IProps {

}

export const DetailBook = (props: IProps) => {
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);
    const refGalleryDesktop = useRef<ImageGallery>(null);
    const images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
    ];

    const handleOnClickImageDesktop = () => {
        console.log(refGalleryDesktop.current?.getCurrentIndex())
        setIsOpenModalGallery(true);
        setCurrentIndex(refGalleryDesktop.current?.getCurrentIndex() ?? 0);
    }

    const handleOnClickImageMobile = () => {
        console.log(refGallery.current?.getCurrentIndex())
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0);
    }

    return (
        <>
            <div className='bg-[#efefef] p-5'>
                <div className='mx-auto min-h-[calc(100vh-150px)]'>
                    <div className='p-5 bg-[#fff] rounded-[5px]'>
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGalleryDesktop}
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick={handleOnClickImageDesktop}
                                />
                            </Col>

                            {/* display in iphone 14 pro max :D  */}
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                        onClick={handleOnClickImageMobile}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='mt-2'>Author : <a href="#!">Hades</a></div>
                                    <div className='font-bold text-2xl'>How Psychology Works - Hiểu Hết Về Tâm Lý Học</div>
                                    <div className=''>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='font-bold'>
                                            <Divider type="vertical" />
                                            Đã bán 6969</span>
                                    </div>
                                    <div className='bg-gray-200/50 p-4 mt-2 text-red-600 text-2xl'>
                                        <span className=''>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(696966666)}
                                        </span>
                                    </div>
                                    <div className='py-5 text-gray-400'>Delivery : <strong>Free</strong></div>

                                    <span className='py-5 text-gray-400'>Quantity: </span>
                                    <InputNumber /><br />
                                    <div className='flex gap-8 mt-16'>
                                        <button className={buttonStyles.cart}><ShoppingCartOutlined /> Add to cart</button>
                                        <button className={buttonStyles.buy}>Buy</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                items={images}
                title='hardcode'
                currentIndex={currentIndex}
            />
        </>
    )
}