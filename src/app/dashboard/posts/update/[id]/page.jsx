 import UpdateForm from '@/app/components/UpdateForm/UpdateForm'
import React from 'react'


const getProductId = async (id)=> {

  try{
    const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
      cache: "no-store",
    })

    console.log(res);
    
    if(!res.ok){
      throw new Error('Failed to fetch data')
    }

    return await res.json();

  }catch(error){
    console.log(error);
  }
 
}

 
 export default async function Page({params}) {
    const {id} = params;
    const product = await getProductId(id);
    console.log(product);
    const {title, content, price, img} = product;
    
   return (
     <div>
       <UpdateForm id={id} title={title} content={content} price={price} img={img} />
     </div>
   )
 }
 