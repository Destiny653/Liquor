 import UpdateForm from '@/app/components/UpdateForm/UpdateForm'

 const getProductId = async (option, id)=> {
  
 
   try{
     const res = await fetch(`https://liquorluxx.vercel.app/api/${option.toLowerCase()}s/${id}`, {
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
  // // let fulUrl = null
  // if(typeof window !== 'undefined'){
  //  const fulUrl = `${window.location.protocol}//${window.location.hostname}`
  //   console.log(fulUrl);
  // } 
  // console.log(fulUrl);

    const {option, id} = params; 
    console.log('option: '+ option.toLowerCase(), 'id: '+id);
    
    const product = await getProductId(option, id);
    console.log(product);
    if(product){
      'hello'
    }
    const {title, content, price, img, rate} = product;
    
   return ( 
     <div className='nav-obscure-view'>
       <UpdateForm id={id} title={title} content={content} price={price} img={img} rate={rate} option={option.toLowerCase()} />
     </div>
   )
 }
 