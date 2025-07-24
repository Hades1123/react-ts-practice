import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from 'react-image-gallery';
import { useMediaQuery } from "react-responsive";
import 'styles/book.scss'

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]
}

export const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex])

    return (
        <>
            <Modal
                width={isMobile ? '100vw' : '60vw'}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={null}
                className="modal-gallery"
            >
                <Row gutter={[20, 20]}>
                    <Col md={16}>
                        <ImageGallery
                            ref={refGallery}
                            items={items}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            startIndex={currentIndex}
                            showThumbnails={false}
                            onSlide={(i) => setActiveIndex(i)}
                            slideDuration={0}
                            lazyLoad={true}
                        />
                    </Col>
                    <Col md={8} sm={0} xs={0}>
                        <Row gutter={[20, 20]}>
                            {
                                items.map((item, index) => {
                                    return (
                                        <Col key={index}>
                                            <Image
                                                wrapperClassName='img-normal'
                                                width={100}
                                                height={100}
                                                src={item.original}
                                                preview={false}
                                                onClick={() => {
                                                    refGallery.current?.slideToIndex(index)
                                                }}
                                            />
                                            <div className={activeIndex === index ? "active" : ""}></div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}