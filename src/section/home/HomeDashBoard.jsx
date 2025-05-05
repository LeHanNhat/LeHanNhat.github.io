import { useEffect, useState } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { exportReport, reportProductPerDate, reportProductPerMonth, reportStats } from "../../component/services/reportService";
import Dropdown from "../../component/table/Dropdown";
import ChartByMonth from "../../component/table/ChartMonthlyRevenue";
import ChartByDate from "../../component/table/ChartDailyRevenue";
import "../home/HomeDashBoard.css";
import Momo from "../../assets/images/logo/momo.jpg";
import COD from "../../assets/images/logo/cod.png";

const HomeDashBoard = () => {
    const [dataByMonth, setdataByMonth] = useState([]);
    const [dataByDate, setdataByDate] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    console.log("baby: ", stats);

    const [stompClient, setStompClient] = useState(null);
    const [discountCode, setDiscountCode] = useState('');
    const [originalPrice, setOriginalPrice] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    

    const username = 'admin';
    const password = 'admin123';
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            login: username,
            passcode: password,
          },
          debug: (str) => console.log(str),
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });
    
        client.onConnect = () => {
          console.log('Connected to WebSocket');
          client.subscribe('/api/discount-codes', (message) => {
            const response = JSON.parse(message.body);
            setOriginalPrice(response.originalPrice);
            setDiscountedPrice(response.discountedPrice);
            setMessage(response.message);
            setError('');
          });
        };
    
        client.onStompError = (frame) => {
          console.error('STOMP error:', frame);
          setError('WebSocket connection failed');
        };
    
        client.activate();
        setStompClient(client);
    
        // Cleanup on unmount
        return () => {
          if (client) {
            client.deactivate();
          }
        };
      }, []);




    const fetchReportByMonth = async () => {
        const result = await reportProductPerMonth(year);
        if (result) {
            setdataByMonth(result);
            setLoading(true);
        }
    }
    const fetchReportStats= async () => {
        const result = await reportStats();
        if (result) {
            setStats(result);
        }
    }
    const fetchReportByDate = async () => {
        const result = await reportProductPerDate(month, year);
        if (result) {
            setdataByDate(result);
            setLoading(true);
        }
  
    }
    const fetchExportReport = async () => {
        try {
            setIsExporting(true);
            const result = await exportReport();
          
        } catch (error) {
            console.error("Export failed:", error);

        } finally {
            setIsExporting(false);
        }
    };
    useEffect(() => {
        fetchReportByMonth();
        fetchReportStats();                                                                  
    }, [])
    useEffect(() => {
        if (month && year) {
            fetchReportByDate();
        }
    }, [month, year])
    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <div className="layout-page">
                        <div className="content-wrapper">
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <div className="row">
                                    <div className="col-xxl-8 mb-6 order-0">
                                        <div className="card">
                                            <div className="d-flex align-items-start row">
                                                <div className="col-sm-7">
                                                    <div className="card-body">
                                                        <h5 className="card-title text-primary mb-3">Congratulations Baki! 🎉</h5>
                                                        <p className="mb-6">
                                                            You have done 72% more sales today.<br />Check your new badge in your profile.
                                                        </p>

                                                        <a href="javascript:;" className="btn btn-sm btn-outline-primary">View Badges</a>
                                                    </div>
                                                </div>
                                                <div className="col-sm-5 text-center text-sm-left">
                                                    <div className="card-body pb-0 px-0 px-md-6">
                                                        <img
                                                            src="../assets/img/illustrations/man-with-laptop.png"
                                                            height="175"
                                                            className="scaleX-n1-rtl"
                                                            alt="View Badge User" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 order-1">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 col-6 mb-6">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                                            <div className="avatar flex-shrink-0">
                                                                <img
                                                                    src="../assets/img/icons/unicons/chart-success.png"
                                                                    alt="chart success"
                                                                    className="rounded" />
                                                            </div>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn p-0"
                                                                    type="button"
                                                                    id="cardOpt3"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                    <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="mb-1">Total Revenue</p>
                                                        <h4 className="card-title mb-3">${stats?.TotalRevenue?.thisMonthRevenue&&(stats.TotalRevenue.thisMonthRevenue)}</h4>
                                                        <small className="text-success fw-medium"><i className="bx bx-up-arrow-alt"></i> {stats?.TotalRevenue?.percentChange&&(stats.TotalRevenue.percentChange)}%</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-6 mb-6">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                                            <div className="avatar flex-shrink-0">
                                                                <img
                                                                    src="../assets/img/icons/unicons/wallet-info.png"
                                                                    alt="wallet info"
                                                                    className="rounded" />
                                                            </div>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn p-0"
                                                                    type="button"
                                                                    id="cardOpt6"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                    <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="mb-1">Sales</p>
                                                        <h4 className="card-title mb-3">${stats?.TotalQuantitySold?.thisMonthQuantity&&(stats.TotalQuantitySold.thisMonthQuantity)}</h4>
                                                        <small className="text-success fw-medium"><i className="bx bx-up-arrow-alt"></i> {stats?.TotalQuantitySold?.percentChange&&(stats.TotalQuantitySold.percentChange)}%</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-xxl-8 order-2 order-md-3 order-xxl-2 mb-6">
                                        <div className="card">
                                            <div className="row row-bordered g-0">
                                                <div className="col-lg-12">
                                                    <div className="card-header d-flex align-items-center justify-content-between">
                                                        <div className="card-title mb-0">
                                                            <h5 className="m-0 me-2">Total Revenue</h5>
                                                        </div>
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn p-0"
                                                                type="button"
                                                                id="totalRevenue"
                                                                data-bs-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false">
                                                                <i className="bx bx-dots-vertical-rounded bx-lg text-muted"></i>
                                                            </button>
                                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="totalRevenue">
                                                                <a className="dropdown-item" href="javascript:void(0);">Select All</a>
                                                                <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                                                                <a
                                                                    className={`dropdown-item ${isExporting ? 'disabled' : ''}`}
                                                                    onClick={!isExporting ? fetchExportReport : undefined}
                                                                >
                                                                    {isExporting ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                            Exporting...
                                                                        </>
                                                                    ) : (
                                                                        'Export'
                                                                    )}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="totalRevenueChart" className="px-3">
                                                        <div className="selectDate">
                                                            <Dropdown month={month} year={year} setYear={setYear} setMonth={setMonth} />
                                                        </div>
                                                        <div className="container-xxl">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    {loading ? (<ChartByMonth dataset={dataByMonth} />) : (<p>Loading....</p>)}
                                                                </div>
                                                                <div className="col-md-6">
                                                                    {loading ? (<ChartByDate dataset={dataByDate} />) : (<p>Loading....</p>)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-8 col-lg-12 col-xxl-4 order-3 order-md-2">
                                        <div className="row">
                                            <div className="col-6 mb-6">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                                            <div className="payments">
                                                                <img src={Momo} alt="momo" className="payment-method" />
                                                            </div>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn p-0"
                                                                    type="button"
                                                                    id="cardOpt4"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                    <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="mb-1">Payments</p>
                                                        <h4 className="card-title mb-3">${stats?.MOMO?.thisMonthRevenue&&(stats.MOMO.thisMonthRevenue)}</h4>
                                                        <small className="text-danger fw-medium"><i className="bx bx-down-arrow-alt"></i> {stats?.MOMO?.percentChange&&(stats.MOMO.percentChange.toFixed(2))}%</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6 mb-6">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                                            <div className="payments">
                                                                <img src={COD} alt="COD" className="payment-method" />
                                                            </div>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn p-0"
                                                                    type="button"
                                                                    id="cardOpt1"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                    <i className="bx bx-dots-vertical-rounded text-muted"></i>
                                                                </button>
                                                                <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="mb-1">Transactions</p>
                                                        <h4 className="card-title mb-3">${stats?.COD?.thisMonthRevenue&&(stats.COD.thisMonthRevenue)}</h4>
                                                        <small className="text-success fw-medium"><i className="bx bx-up-arrow-alt"></i> {stats?.COD?.percentChange&&(stats.COD.percentChange)}%</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 mb-6">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-center flex-sm-row flex-column gap-10">
                                                            <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                                                                <div className="card-title mb-6">
                                                                    <h5 className="text-nowrap mb-1">Profile Report</h5>
                                                                    <span className="badge bg-label-warning">YEAR 2022</span>
                                                                </div>
                                                                <div className="mt-sm-auto">
                                                                    <span className="text-success text-nowrap fw-medium"
                                                                    ><i className="bx bx-up-arrow-alt"></i> 68.2%</span
                                                                    >
                                                                    <h4 className="mb-0">$84,686k</h4>
                                                                </div>
                                                            </div>
                                                            <div id="profileReportChart"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row">

                                    <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-6">
                                        <div className="card h-100">
                                            <div className="card-header d-flex justify-content-between">
                                                <div className="card-title mb-0">
                                                    <h5 className="mb-1 me-2">Order Statistics</h5>
                                                    <p className="card-subtitle">42.82k Total Sales</p>
                                                </div>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn text-muted p-0"
                                                        type="button"
                                                        id="orederStatistics"
                                                        data-bs-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false">
                                                        <i className="bx bx-dots-vertical-rounded bx-lg"></i>
                                                    </button>
                                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">
                                                        <a className="dropdown-item" href="javascript:void(0);">Select All</a>
                                                        <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                                                        <a className="dropdown-item" href="javascript:void(0);">Share</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-6">
                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                        <h3 className="mb-1">8,258</h3>
                                                        <small>Total Orders</small>
                                                    </div>
                                                    <div id="orderStatisticsChart"></div>
                                                </div>
                                                <ul className="p-0 m-0">
                                                    <li className="d-flex align-items-center mb-5">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <span className="avatar-initial rounded bg-label-primary"
                                                            ><i className="bx bx-mobile-alt"></i
                                                            ></span>
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <h6 className="mb-0">Electronic</h6>
                                                                <small>Mobile, Earbuds, TV</small>
                                                            </div>
                                                            <div className="user-progress">
                                                                <h6 className="mb-0">82.5k</h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center mb-5">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <span className="avatar-initial rounded bg-label-success"><i className="bx bx-closet"></i></span>
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <h6 className="mb-0">Fashion</h6>
                                                                <small>T-shirt, Jeans, Shoes</small>
                                                            </div>
                                                            <div className="user-progress">
                                                                <h6 className="mb-0">23.8k</h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center mb-5">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <span className="avatar-initial rounded bg-label-info"><i className="bx bx-home-alt"></i></span>
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <h6 className="mb-0">Decor</h6>
                                                                <small>Fine Art, Dining</small>
                                                            </div>
                                                            <div className="user-progress">
                                                                <h6 className="mb-0">849k</h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <span className="avatar-initial rounded bg-label-secondary"
                                                            ><i className="bx bx-football"></i
                                                            ></span>
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <h6 className="mb-0">Sports</h6>
                                                                <small>Football, Cricket Kit</small>
                                                            </div>
                                                            <div className="user-progress">
                                                                <h6 className="mb-0">99</h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="col-md-6 col-lg-4 order-1 mb-6">
                                        <div className="card h-100">
                                            <div className="card-header nav-align-top">
                                                <ul className="nav nav-pills" role="tablist">
                                                    <li className="nav-item">
                                                        <button
                                                            type="button"
                                                            className="nav-link active"
                                                            role="tab"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#navs-tabs-line-card-income"
                                                            aria-controls="navs-tabs-line-card-income"
                                                            aria-selected="true">
                                                            Income
                                                        </button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button type="button" className="nav-link" role="tab">Expenses</button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button type="button" className="nav-link" role="tab">Profit</button>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="card-body">
                                                <div className="tab-content p-0">
                                                    <div className="tab-pane fade show active" id="navs-tabs-line-card-income" role="tabpanel">
                                                        <div className="d-flex mb-6">
                                                            <div className="avatar flex-shrink-0 me-3">
                                                                <img src="../assets/img/icons/unicons/wallet.png" alt="User" />
                                                            </div>
                                                            <div>
                                                                <p className="mb-0">Total Balance</p>
                                                                <div className="d-flex align-items-center">
                                                                    <h6 className="mb-0 me-1">$459.10</h6>
                                                                    <small className="text-success fw-medium">
                                                                        <i className="bx bx-chevron-up bx-lg"></i>
                                                                        42.9%
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="incomeChart"></div>
                                                        <div className="d-flex align-items-center justify-content-center mt-6 gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div id="expensesOfWeek"></div>
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0">Income this week</h6>
                                                                <small>$39k less than last week</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 order-2 mb-6">
                                        <div className="card h-100">
                                            <div className="card-header d-flex align-items-center justify-content-between">
                                                <h5 className="card-title m-0 me-2">Transactions</h5>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn text-muted p-0"
                                                        type="button"
                                                        id="transactionID"
                                                        data-bs-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false">
                                                        <i className="bx bx-dots-vertical-rounded bx-lg"></i>
                                                    </button>
                                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                                                        <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                                                        <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                                                        <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body pt-4">
                                                <ul className="p-0 m-0">
                                                    <li className="d-flex align-items-center mb-6">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="../assets/img/icons/unicons/paypal.png" alt="User" className="rounded" />
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <small className="d-block">Paypal</small>
                                                                <h6 className="fw-normal mb-0">Send money</h6>
                                                            </div>
                                                            <div className="user-progress d-flex align-items-center gap-2">
                                                                <h6 className="fw-normal mb-0">+82.6</h6>
                                                                <span className="text-muted">USD</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center mb-6">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="../assets/img/icons/unicons/wallet.png" alt="User" className="rounded" />
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <small className="d-block">Wallet</small>
                                                                <h6 className="fw-normal mb-0">Mac'D</h6>
                                                            </div>
                                                            <div className="user-progress d-flex align-items-center gap-2">
                                                                <h6 className="fw-normal mb-0">+270.69</h6>
                                                                <span className="text-muted">USD</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center mb-6">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="../assets/img/icons/unicons/chart.png" alt="User" className="rounded" />
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <small className="d-block">Transfer</small>
                                                                <h6 className="fw-normal mb-0">Refund</h6>
                                                            </div>
                                                            <div className="user-progress d-flex align-items-center gap-2">
                                                                <h6 className="fw-normal mb-0">+637.91</h6>
                                                                <span className="text-muted">USD</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center mb-6">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="../assets/img/icons/unicons/cc-primary.png" alt="User" className="rounded" />
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <small className="d-block">Credit Card</small>
                                                                <h6 className="fw-normal mb-0">Ordered Food</h6>
                                                            </div>
                                                            <div className="user-progress d-flex align-items-center gap-2">
                                                                <h6 className="fw-normal mb-0">-838.71</h6>
                                                                <span className="text-muted">USD</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center mb-6">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="../assets/img/icons/unicons/wallet.png" alt="User" className="rounded" />
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <small className="d-block">Wallet</small>
                                                                <h6 className="fw-normal mb-0">Starbucks</h6>
                                                            </div>
                                                            <div className="user-progress d-flex align-items-center gap-2">
                                                                <h6 className="fw-normal mb-0">+203.33</h6>
                                                                <span className="text-muted">USD</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex align-items-center">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="../assets/img/icons/unicons/cc-warning.png" alt="User" className="rounded" />
                                                        </div>
                                                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                            <div className="me-2">
                                                                <small className="d-block">Mastercard</small>
                                                                <h6 className="fw-normal mb-0">Ordered Food</h6>
                                                            </div>
                                                            <div className="user-progress d-flex align-items-center gap-2">
                                                                <h6 className="fw-normal mb-0">-92.45</h6>
                                                                <span className="text-muted">USD</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div> */}
                            </div>
                            <div className="content-backdrop fade"></div>
                        </div>

                    </div>

                </div>


                <div className="layout-overlay layout-menu-toggle"></div>
            </div>

        </>)

}
export default HomeDashBoard