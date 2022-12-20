import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Paper, Tab, Tabs, Typography } from '@mui/material';
import { styles } from './styles.js';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ordersState, userState } from '~/store/selectors';
import { ordersActions } from '~/store/actions';
import OrderItem from '~/components/elements/OrderItem';
import { fetchAllOrders } from '~/apis/index.js';
import SpinnerLoader from '~/components/common/SpinnerLoader/Spinner.jsx';

function ManagementOrders() {
  const [loading, setLoading] = useState(false);
  const [ordersOwn, setOrdersOwn] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(userState);

  const handleChangeIdxPanel = useCallback((event, newValue) => {
    setCurrentIdx(newValue);
  }, []);

  const fetchUserOrders = async (token) => {
    setLoading(true);
    const rs = await fetchAllOrders(token);
    if (rs) {
      setOrdersOwn(rs?.data);
    }
  }

  useEffect(() => {
    const tokenUser = localStorage.getItem("token");
    if (tokenUser) {
      // dispatch(ordersActions.fetchAllOrdersRequest());
      fetchUserOrders(tokenUser)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, []);

  const checkOrders = () => {
    return {
      type0: ordersOwn.type0.length > 0 ? true : false,
      type1: ordersOwn.type1.length > 0 ? true : false,
      type2: ordersOwn.type2.length > 0 ? true : false,
      type3: ordersOwn.type3.length > 0 ? true : false,
      type4: ordersOwn.type4.length > 0 ? true : false
    };
  };
  
  const TextElmPanel = ({ text }) => {
    let numOrder;
    switch (text) {
      case 'Chờ thanh toán':
        numOrder = ordersOwn.type0.length;
        break;
      case 'Chờ xác nhận':
        numOrder = ordersOwn.type1.length;
        break;
      case 'Đang xử lý':
        numOrder = ordersOwn.type2.length;
        break;
      case 'Đang vận chuyển':
        numOrder = ordersOwn.type3.length;
        break;
      case 'Đã giao':
        numOrder = ordersOwn.type4.length;
        break;
      default:
        break;
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{text}</Typography>
        <Typography sx={{ color: '#b4b7c6 !important', pl: '6px' }}>{numOrder}</Typography>
      </div>
    );
  }

  const HaveNotOrders = () => {
    return (
      <Paper sx={Object.assign({ ...styles.paper }, { m: '0' })}>
        <div style={styles.part1}>
          <div>
            <AiOutlineShoppingCart style={styles.icon} />
          </div>
          <Typography sx={{ fontWeight: 'bold', p: '4px' }}>Chưa có đơn hàng</Typography>
          <Typography sx={{ p: '4px' }}>Mời bạn quẹo lựa sản phẩm giá tốt</Typography>
          <div style={styles.group_btn}>
            <Link to="/product/laptops" style={{ textDecoration: 'none' }}>
              <Button sx={styles.btn} onClick={() => navigate('/product/laptops')}>
                <Typography sx={styles.text_btn}>Laptop</Typography>
              </Button>
            </Link>
            <Link to="/product/monitors" style={{ textDecoration: 'none' }}>
              <Button sx={styles.btn} onClick={() => navigate('/product/monitors')}>
                <Typography sx={styles.text_btn}>Màn hình máy tính</Typography>
              </Button>
            </Link>
            <Link to="/product/keyboards" style={{ textDecoration: 'none' }}>
              <Button sx={styles.btn} onClick={() => navigate('/product/keyboards')}>
                <Typography sx={styles.text_btn}>Bàn phím</Typography>
              </Button>
            </Link>
          </div>
        </div>
      </Paper>
    );
  };

  const HaveOrders = ({ idx }) => {
    return (
      <div style={styles.part2}>
        {ordersOwn[`type${idx}`].map((_order, index) => (
          <OrderItem key={_order._id} data={_order} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <>
      <SpinnerLoader open={loading} />
    </>
  }

  console.log('info order', ordersOwn);

  return (
    <>
      <Paper sx={styles.paper}>
        <div style={styles.wrap_paper}>
          <Typography sx={styles.text1}>Quản lý đơn hàng</Typography>
          <Box sx={{ width: '100%', pt: '16px' }}>
            <Tabs value={currentIdx} onChange={handleChangeIdxPanel} aria-label="tabs">
              <Tab
                // onClick={() => handleClickTab('1')}
                disableRipple
                label={<TextElmPanel text="Chờ thanh toán" />}
                id="tab-0"
                aria-controls="tabpanel-0"
                sx={styles.tab}
              />
              <Tab
                // onClick={() => handleClickTab('2')}
                disableRipple
                label={<TextElmPanel text="Chờ xác nhận" />}
                id="tab-0"
                aria-controls="tabpanel-0"
                sx={styles.tab}
              />
              <Tab
                // onClick={() => handleClickTab('3')}
                disableRipple
                label={<TextElmPanel text="Đang xử lý" />}
                id="tab-1"
                aria-controls="tabpanel-1"
                sx={styles.tab}
              />
              <Tab
                // onClick={() => handleClickTab('4')}
                disableRipple
                label={<TextElmPanel text="Đang vận chuyển" />}
                id="tab-2"
                aria-controls="tabpanel-2"
                sx={styles.tab}
              />
              <Tab
                // onClick={() => handleClickTab('5')}
                disableRipple
                label={<TextElmPanel text="Đã giao" />}
                id="tab-4"
                aria-controls="tabpanel-4"
                sx={styles.tab}
              />
            </Tabs>
          </Box>
        </div>
      </Paper>
      {checkOrders[`type${currentIdx}`] ? <HaveOrders idx={currentIdx} /> : <HaveNotOrders />}
    </>
  );
}

export default ManagementOrders;
