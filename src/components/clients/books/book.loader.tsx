import { FileImageOutlined } from '@ant-design/icons';
import { Skeleton, Row, Col } from 'antd';

export const LoaderSkeleton = () => {
    return (
        <>
            <div className='bg-[#efefef] p-5'>
                <div className='mx-auto min-h-[calc(100vh-150px)]'>
                    <div className='p-5 bg-[#fff] rounded-[5px]'>
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <div>
                                    <div className='flex justify-center'>
                                        <Skeleton.Node active={true} style={{ width: 400, height: 400 }} className='mb-2'>
                                            <FileImageOutlined style={{ fontSize: 100 }} />
                                        </Skeleton.Node>
                                    </div>
                                    <div className='flex gap-8 justify-center'>
                                        <Skeleton.Image active={true} />
                                        <Skeleton.Image active={true} />
                                        <Skeleton.Image active={true} />
                                    </div>
                                </div>
                            </Col>
                            {/* display in iphone 14 pro max :D  */}
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <div className='flex justify-center'>
                                        <Skeleton.Node active={true} style={{ width: 250, height: 300 }} className='mb-2'>
                                            <FileImageOutlined style={{ fontSize: 50 }} />
                                        </Skeleton.Node>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <Skeleton.Input size='small' active={true} block={true} className='mb-2' />
                                    <Skeleton.Input size='small' active={true} block={true} className='mb-2' />
                                    <Skeleton.Input size='small' active={true} block={true} className='mb-4' />
                                    <Skeleton.Input size='small' active={true} block={false} className='mb-16' />
                                    <div className='flex gap-4'>
                                        <Skeleton.Button active={true} size='small' />
                                        <Skeleton.Button active={true} size='small' />
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}