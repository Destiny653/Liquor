'use client'
import Image from "next/image";
import Hero from "./components/Hero/Hero";
import { useContext, useEffect, useState } from "react";
import AOS from 'aos';
import Contact from "./contact/page";
import { AiFillMessage } from "react-icons/ai";
import { SearchContext } from "../../context/SearchContext";

export default function Home() {

  const {setMessage} = useContext(SearchContext)

  useEffect(() => {
    AOS.init();
  }, [])


  const [effect, setEffect] = useState(false)
  setMessage(effect)

  const hero = [
    {
      title: "Introducing",
      description: "ANGEL'S ENVY",
      image: "/images/banner3.jpg",
      btn: "Shop Now"
    },
    {
      title: "Limited Quantities",
      description: "W.L. WELLER",
      short: "Get it while supplies last!",
      image: "/images/banner2.jpg",
      btn: "Shop Now"
    },
    {
      title: "PGA CHAMPIONSHIP",
      description: "LIMITED EDITION",
      short: "OFFICIAL BOURBON",
      image: "/images/banner4.jpg",
      btn: "Shop Now"
      
    },
    {
      title: "Pappy Van Winkle",
      description: `RARE PAPPY COLLECTION`,
      short: "Dilivered to your door",
      image: "/images/banner1.jpg",
      btn: "Shop Now"
    },
  ]
  const interval = 8000
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        setFade(false)
      }, 7000);
      setFade(true)
      setCurrentIndex((next) => (next + 1) % hero.length)
    }, interval);

    return () => clearInterval(timer);

  }, [hero.length, interval])

  console.log(currentIndex);

  return (
    <div>
      <div className=" mb-[60px] relative">
        <Image className={`w-full h-full imgTransform ${fade ? 'fade-in' : 'fade-out'}`} src={hero[currentIndex].image} alt="Hero image display" height={10000} width={10000} />
        <div className="details">
          <h1 className="text-[27px]">{hero[currentIndex].title}</h1>
          <p className="text-[50px] text-center font-[600]">{hero[currentIndex].description}</p>
          <h1 className="text-[27px]">{hero[currentIndex].short}</h1>
        </div>
        <div className="indicators" >
          {
            hero.map((_,index)=>(
              <div key={index} onClick={()=>setCurrentIndex(index)} className={`indicator ${index === currentIndex ? 'active' : ''}`}></div>
            ))
          }
        </div>
      </div>
      <Hero />
      {
        effect && <Contact />  // conditionally render the contact page when effect is true.
      }
      <div onClick={() => effect === false ? setEffect(true) : setEffect(false)} className={`${effect ? 'btnActive' : ''} fixed right-[20px] bottom-[25px] bg-[#500d0d] cursor-pointer text-white chatBtn`}> <AiFillMessage className="inline msgBtn" size={25} /> Chat with us</div>
    </div>
  );
}
