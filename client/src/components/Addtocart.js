import { useEffect, useState } from "react";
import Addtocartcard from "./Addtocartcard";
import Billtocart from "./Billtocart";
import { toast } from "react-toastify";
import axios from "axios";

const Addtocart = () => {
    const [data, setData] = useState([]);
    const [totalquantity,setTotalQuantity]=useState(0);
    const [totalamount,setTotalAmount]=useState(0);
    const [change,setChange]=useState(false);

    useEffect(() => {
        async function getdata() {
            try {
                const user = sessionStorage.getItem('username')
                const response = await axios.post('https://hackathon-r38q.onrender.com/addtocart', { user });
                if (response.status === 200) {
                    setData(response.data);
                    // console.log(response.data);
                    setChange(false);
                }
            } catch (err) {
                toast.error(err.message);
            }
        }
        getdata();
    }, [change]);

    useEffect(()=>{
        try{
        console.log(data)
        let quantity=0;
        let amount=0;
        data.forEach((item)=>{
            quantity=quantity+item.quantity;
            let num=parseFloat(item.price)
            amount=amount+(num*item.quantity);
        });
        setTotalAmount(amount)
        setTotalQuantity(quantity)
    }
    catch(err){
        console.log(err.message)
    }
    },[data,change])

    return (
        <div className="container-fluid min-vh-100">
            <div className='row g-0' style={{ marginBottom: '10px' }}>
                <div className="col-md-7">
                    <div className="me-2">
                        <div className="card mt-2 mb-2 p-3 fs-5 fw-bold">
                            My Cart ({data.length})
                        </div>
                        {
                            data.length > 0 && data.map((item) => (
                                <Addtocartcard key={item._id} item={item} setChange={setChange}/>
                            ))
                        }
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="ms-2 sticky-top z-1">
                        <Billtocart totalquantity={totalquantity} totalamount={totalamount} length={data.length}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addtocart;
