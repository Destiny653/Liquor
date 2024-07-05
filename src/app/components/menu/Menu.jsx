import React from 'react'
import './menu.css'

export default function Menu() {
  return (
    <div>
      <section className="menu-p flex flex-col gap-7 box-border px-4  text-white w-[230px] h-[75vh]">
       <div className="mt-3 menu-title">
        <h1 className="py-1 pl-2">LiquorLuxx</h1>
        </div>
        <ul>
            <h1 className="menu-t">MANAGEMENT</h1>
        <h1 className="">Dashboard</h1>
            <li>Upload product</li>
            <li>Product menu</li>
            <li>Orders</li> 
        </ul>
        <ul>
            <h1 className="menu-t">ACCOUNTS</h1>
            <li>Admin</li>
            <li>Clients</li>
        </ul>
      </section>
    </div>
  )
}
