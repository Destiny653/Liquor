 import UpdateForm from '@/app/components/UpdateForm/UpdateForm'
import React from 'react'


const getProductId= async (id)=> {

  try{
    const res = await fetch(`api/posts/${id}`)

    if(!res.ok){
      throw new Error('Failed to fetch data')
    }

    return res.json();

  }catch(error){
    console.log(error);
  }
 
}

 
 export default async function Page({params}) {
    const {id} = params;
    const {product} = await getProductId(id);
    const {title, content, price, img} = product;
    
   return (
     <div>
       <UpdateForm id={id} title={title} content={content} price={price} img={img} />
     </div>
   )
 }
 