import { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from 'services/api';


const AppHeader = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { isAuthenticated, setIsAuthenticated, user, setUser, shoppingCart } = useCurrentApp();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logoutAPI();
        if (result.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
        }
    }

    const onClick = () => {
        navigate('/order');
    }

    let items = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <>
                <div className='w-[400px]'>
                    <div className='max-h-[440px] overflow-y-auto pr-2 mb-2'>
                        {
                            shoppingCart.map(item => {
                                return (
                                    <div className='flex' key={item._id}>
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail?.thumbnail}`} alt="image"
                                            className='w-[80px] h-[80px] object-contain mb-2'
                                        />
                                        <div>
                                            <h1 className='overflow-hidden'>{item.detail?.mainText}</h1>
                                            <div className='text-red-500'>{item.detail?.price.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='flex justify-end'>
                        <button
                            className='bg-red-500 text-white p-4 text-[1rem] rounded-sm hover:cursor-pointer active:scale-95 active:bg-red-500/50'
                            onClick={onClick}
                        >
                            Xem giỏ hàng
                        </button>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span onClick={() => navigate('/')}> <FaReact className='rotate icon-react' /></span>
                                <span className='relative left-10 -top-[5px]'>Hades</span>
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                            // value={props.searchTerm}
                            // onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge
                                        count={shoppingCart.length}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space >
                                            <Avatar src={urlAvatar} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />

                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider />
            </Drawer>

        </>
    )
}

export default AppHeader