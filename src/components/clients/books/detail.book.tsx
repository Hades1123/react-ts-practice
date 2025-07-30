import { Row, Col, Rate, Divider, App, Breadcrumb } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'styles/book.scss';
import buttonStyles from 'styles/button.module.scss'
import { ModalGallery } from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { useNavigate } from 'react-router-dom';


interface IProps {
    currentBook: IBookTable | null;
}

enum UserAction {
    'MINUS', 'PLUS'
}

export const DetailBook = (props: IProps) => {
    const { currentBook } = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);
    const refGalleryDesktop = useRef<ImageGallery>(null);
    const [quantity, setQuantity] = useState<number | string>(1);
    const { setShoppingCart, isAuthenticated } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();

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
            setQuantity(0);
        }
        else {
            setQuantity(+value)
        }
    }

    const handleInputBtn = (userAction: UserAction) => {
        if (userAction == UserAction.MINUS) {
            if (+quantity > 1) {
                setQuantity(+quantity - 1);
            }
        }
        else if (userAction == UserAction.PLUS) {
            if (+quantity < currentBook?.quantity!) {
                setQuantity(+quantity + 1);
            }
        }
    }

    const onClickCart = (isBuyNow: boolean) => {
        if (!isAuthenticated) {
            message.error('You must login first');
        } else {
            let storeShoppingCart = localStorage.getItem('cart')
            if (!storeShoppingCart) {
                localStorage.setItem('cart', JSON.stringify([{
                    _id: currentBook?._id!,
                    quantity: +quantity,
                    detail: currentBook
                }]))
                setShoppingCart([{
                    _id: currentBook?._id!,
                    quantity: +quantity,
                    detail: currentBook
                }])
            }
            else {
                let found = false;
                const currentStorage = JSON.parse(localStorage.getItem('cart')!) as IShoppingCart[];
                currentStorage.forEach(item => {
                    if (item._id === currentBook?._id) {
                        item.quantity += +quantity;
                        found = true;
                        localStorage.setItem('cart', JSON.stringify(currentStorage))
                    }
                })
                if (!found) {
                    localStorage.setItem('cart', JSON.stringify([...currentStorage, {
                        _id: currentBook?._id,
                        quantity: +quantity,
                        detail: currentBook,
                    }]))
                }
                setShoppingCart(JSON.parse(localStorage.getItem('cart')!));
            }
            if (!isBuyNow) {
                message.success('Thêm vào giỏ hàng thành công!')
            }
            else {
                navigate('/order');
            }
        }
    }

    return (
        <>
            <div className='bg-[#efefef] p-5'>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: 'Home',
                            href: '/',
                        },
                        {
                            title: 'Detail book',
                        },
                    ]}
                />
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
                                            onClick={() => handleInputBtn(UserAction.PLUS)}
                                        ><PlusOutlined /></button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            className='border-1 p-2 border-gray-200 text-center w-[50px] no-spinner'
                                            onChange={onChange}

                                        />
                                        <button
                                            className='bg-white border-1 border-gray-200 p-2 hover:cursor-pointer'
                                            onClick={() => handleInputBtn(UserAction.MINUS)}
                                        ><MinusOutlined /></button>
                                    </span>
                                    <div className='flex gap-8 mt-16'>
                                        <button className={buttonStyles.cart} onClick={() => onClickCart(false)}><ShoppingCartOutlined /> Add to cart</button>
                                        <button className={buttonStyles.buy} onClick={() => onClickCart(true)}>Buy now</button>
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