import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import Card from './Card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Addbooks.css'
function Cardcall() {

  const [post,setPost]=useState([])

useEffect(()=>{
  async function handleContent(){
    try{
      const result=await axios.get('https://hackathon-r38q.onrender.com/getmovies');
      if(result.status===200){
        setPost(result.data)
      }
    }
    catch(err){
      alert(err.response.message)
    }
  }
  handleContent();
},[])

  return (  
    <div className='min-vh_100' style={{marginBottom:'10px'}}>
      {/* <img src={require('./banner.jpg')} className='img-fluid w-100 banner' style={{height:'28rem'}}/> */}
      {/* <h1 className='text-center mt-4 fs-1 fw-bold p-3'>Our Products</h1> */}
    <div className="d-flex flex-wrap app ms-sm-auto me-sm-auto">
      {(post.map((Movie)=>(
        <Card 
        key={Movie._id}
        title={Movie.title}
        price={Movie.price}
        url_cover={Movie.url1}
        url_bg={Movie.url2}
        cast={Movie.cast}
        director={Movie.director}
        description={Movie.description}
        genre={Movie.genre}
        id={Movie._id}
        language={Movie.language}
        time={Movie.time}
        />
      )))}
    </div>
    </div>
  );
}

export default Cardcall;


// stripe id : alksyx5u2h@vvatxiy.com
// cluster id :alksyx5u2h
// cluster password:aBVKeDU5OyvKJQOr
