import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



const Profile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [data, setData] = useState([]);
    const [date, setDate] = useState("");

    useEffect(() => {
        async function fetch() {
            try {
                let response = await axios.post('http://localhost:3001/recentorder');
                if (response.status === 200) {
                    // console.log(response.data);
                    setData(response.data);
                    
                }
            }
            catch (err) {
                toast.error(err.data);
            }
        }
        fetch();
    }, [])

    useEffect(()=>{
        if(data.length>0){
            const date=new Date(data[0].createdDate);
            const dateobj=date.toDateString();
            setDate(dateobj);
        }
    },[data])

    const handleCancel=()=>{
        toast.info("Feature not available");
    }

    return (
        <div className="container  mt-2 mb-2 border border-2 border-dark-subtle rounded min-vh-100">
            <div className="container ms-3 me-3 mt-5">
                <div className="d-flex">
                    <i className="fas fa-user me-3 fs-1 mt-1"></i>
                    <div className="text-light-emphasis">
                        <p className="mb-0 fw-bold">{data.length > 0 ? data[0].customer_name : ""}</p>
                        <p className="mt-0">Email: {data.length > 0 ? data[0].customer_email : ""}</p>
                    </div>
                </div>
                <hr />
                <div>
                    <p className="border border-2 p-2">Address</p>
                </div>
                <hr />
                <div>
                    <h1 className="fs-4">
                        Your Recent Order
                    </h1>
                    <div className="card mt-2 mb-2">
                        <div className="m-3 ">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="text-light-emphasis fw-bold mb-0">Order ID : <span className="fw-normal">{data.length > 0 ? data[0].id : 0}</span></p>
                                    <p className="text-light-emphasis fw-bold mb-0">
                                        Status :&nbsp;
                                        <span className="fw-normal">
                                            {status || "Created"}
                                        </span>
                                    </p>
                                    <p className="text-light-emphasis fw-bold mb-0">Date : <span className="fw-normal">{date}</span></p>
                                </div>
                                <div className="ms-4 ms-lg-0">
                                    <button className="btn btn-outline-danger" onClick={handleCancel}>Cancel Order</button>
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex flex-1 flex-wrap">
                                <div className="border-end me-4">
                                    <div className="me-5 text-light-emphasis">
                                        <p className="fw-bold mb-0">Contact</p>
                                        <p className="mb-0 text-capitalize">{sessionStorage.getItem('username')}</p>
                                        <p className="mb-0">Email : {sessionStorage.getItem('email')}</p>
                                    </div>
                                </div>
                                <div className="border-end me-4">
                                    <div className="me-5 text-light-emphasis">
                                        <p className="fw-bold mb-0">Shipping Details</p>
                                        <p className="mb-0 text-capitalize">Digtal on Mail</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="text-light-emphasis">
                                        <p className="fw-bold mb-0">Payment</p>
                                        <p className="mb-0 text-capitalize">Method : Card</p>
                                        <p className="mb-0 text-capitalize">Amount : <span className="fw-bold text-success">Rs. {data.length > 0 ? data[0].amount : 0}</span></p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div>
                                {
                                    data.map(item => {
                                        const image = item.img.split(',')
                                        let count = 0;
                                        return (
                                            < div key={item._id} className="d-flex overflow-scroll">
                                                {image.map(data => {
                                                    const img_1 = String(data);
                                                    return (
                                                        <div className="card me-2" key={count++} style={{ width: '10rem' }}>
                                                            <img src={img_1} className="card_img" />
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Profile;