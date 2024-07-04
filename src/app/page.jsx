import Image from "next/image";
export default function Home() {

  return (
    <div>
      <Image className="w-full h-full" src="/images/hero.jpg" alt="Hero image display" height={1000} width={1000}/>
    </div>
  );
}
