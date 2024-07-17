import React, { useEffect, useState } from 'react'
import './NewCollections.css'
// import new_collection from '../Assets/new_collections'
import Item from '../Item/Item'
const NewCollections = () => {
  const [new_collection,setNew_collection] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:4000/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
  },[])

  return (
    <div className='new-collection'>
        <h1>NEW COLLECTION</h1>
        <hr/>
        <div className='collection'>
            {new_collection.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.newprice} old_price={item.old_price}/>
            })}
        </div>
      
    </div>
  )
}

export default NewCollections
