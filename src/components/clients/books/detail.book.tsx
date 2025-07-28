import { Row, Col, Rate, Divider } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'styles/book.scss';
import buttonStyles from 'styles/button.module.scss'
import { ModalGallery } from './modal.gallery';


interface IProps {
    currentBook: IBookTable | null;
}

export const DetailBook = (props: IProps) => {
    const { currentBook } = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);
    const refGalleryDesktop = useRef<ImageGallery>(null);
    const [quantity, setQuantity] = useState<number | string>(1);

    const images = [currentBook?.thumbnail, ...currentBook?.slider ?? []].map((item) => {
        return {
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        }
    })

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

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value == '') {
            setQuantity('');
        }
        else if (+value > currentBook?.quantity! || +value <= 0) {
            setQuantity(currentBook?.quantity!);
        }
        else {
            setQuantity(+value)
        }
    }

    const increaseQuantity = () => {
        if (+quantity < currentBook?.quantity!) {
            if (+quantity == 0) {
                setQuantity(1);
            }
            setQuantity(+quantity + 1);
        }
    }

    const decreaseQuantity = () => {
        if (+quantity > 1) {
            setQuantity(+quantity - 1)
        }
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
                                    additionalClass='w-[80%]'
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
                                        showThumbnails={false}
                                        onClick={handleOnClickImageMobile}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='mt-2'>Author : <a href="#!">{currentBook?.author}</a></div>
                                    <div className='font-bold text-2xl'>{currentBook?.mainText}</div>
                                    <div className=''>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='font-bold'>
                                            <Divider type="vertical" />
                                            Đã bán {currentBook?.sold}</span>
                                    </div>
                                    <div className='bg-gray-200/50 p-4 mt-2 text-red-600 text-2xl'>
                                        <span className=''>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price!)}
                                        </span>
                                    </div>
                                    <div className='py-5 text-gray-400'>Delivery : <strong>Free</strong></div>

                                    <span className='py-5 text-gray-400'>Quantity</span>
                                    <span className='mx-8'>
                                        <button
                                            className='bg-white border-1 border-gray-200 p-2 hover:cursor-pointer'
                                            onClick={increaseQuantity}
                                        ><PlusOutlined /></button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            className='border-1 p-2 border-gray-200 text-center w-[50px] no-spinner'
                                            onChange={onChange}

                                        />
                                        <button
                                            className='bg-white border-1 border-gray-200 p-2 hover:cursor-pointer'
                                            onClick={decreaseQuantity}
                                        ><MinusOutlined /></button>
                                    </span>
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
                currentIndex={currentIndex}
            />
        </>
    )
}