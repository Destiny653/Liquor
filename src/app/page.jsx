'use client'
import Image from "next/image";
import Hero from "./components/Hero/Hero";
import { useEffect, useState } from "react";
import AOS from 'aos';
 

export default function Home() {


  useEffect(() => {
    AOS.init();
  }, [])
 

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
    </div>
  );
}
