import UpdateForm from '@/app/components/UpdateForm/UpdateForm'

export default async function Page({params}) {

const getProductId = async (id)=> {

  try{
    const res = await fetch(`http://localhost:3000/api/buffalos/${id}`, {
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

    const {id} = params;
    const product = await getProductId(id);
    console.log(product);
    const {title, content, price, img, rate} = product;

    if(product){
      return (
        <div>
          <UpdateForm id={id} title={title} content={content} price={price} img={img} rate={rate} />
        </div>
      )
    }
    return(
    <div>
      Product not found.
    </div>
    )
 }
 