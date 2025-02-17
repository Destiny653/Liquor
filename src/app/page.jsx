'use client' 
import Hero from "./components/Hero/Hero";
import { useEffect, useState } from "react";
import AOS from 'aos';

export default function Home() {


  // useEffect(() => {
  //   AOS.init();
  // }, [])


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
  const [count, setCount] = useState(0)
  const [fade, setFade] = useState(true)
  
  useEffect(() => { 
   const timer = setInterval(()=>{
      setCount((num)=>(num+1)%(4))
    },7000)
    return ()=>clearInterval(timer)
  }, [])

  console.log(count);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        AOS.init();
        setFade(false)
      }, 7000);
      setFade(true)
      setCurrentIndex((next) => (next + 1) % hero.length)
    }, interval);

    return () => clearInterval(timer);

  }, [hero.length, interval, AOS])

  console.log(currentIndex);


  return (
    <div className="box-border px-[1px] w-full nav-obscure-view">
      <div className="relative mb-[60px] hero-dis-p">
        <img className={`w-full h-full img-transform ${fade ? 'fade-in' : 'fade-out'}`} src={hero[currentIndex].image} alt="Hero image display" height={10000} width={10000} />
        <div className={`details ${fade? 'trans-in' : 'trans-out'}`} >
          <h1 className="text-[27px] details-h1">{hero[currentIndex].title}</h1>
          <p className="font-[600] text-[50px] text-center details-pg">{hero[currentIndex].description}</p>
          <h1 className="text-[27px] details-h2">{hero[currentIndex].short}</h1>
        </div>
        <div className="indicators" >
          {
            hero.map((_, index) => (
              <div key={index} onClick={() => setCurrentIndex(index)} className={`indicator ${index === currentIndex ? 'active' : ''}`}></div>
            ))
          }
        </div>
      </div>
      <Hero />
    </div>
  );
}
