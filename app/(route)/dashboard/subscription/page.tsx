'use client'
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button';
import axios from 'axios'
import { Loader2Icon } from 'lucide-react';
import { api } from '@/convex/_generated/api'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useMutation } from 'convex/react'

import moment from 'moment';
function Payment() {
  const router = useRouter();

  const [loading,setLoading]=useState(false);
  const createPayment=useMutation(api.user.createPayment);
  const {user}:any=useKindeBrowserClient();
 
  useEffect(() => {
    // Dynamically load the Razorpay script
   console.log(user);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => console.log('Razorpay script loaded');
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);

    return () => {
      // Cleanup the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);
  const createSubscription=()=>{
    
    setLoading(true);
    axios.post('/api/create-subscription', {})
    .then((resp) => {
      console.log(resp);
      onPayment(resp.data.id);
    })
    .catch((error) => {
      setLoading(false);
      console.error('Payment Error:', error);
    });
  }
  const onPayment=(subId:string)=>{
        const options={
          key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id:subId,
          name:"Raksh Apps",
          description:"Monthly Subscription",
          handler:async(resp:any)=>{
            console.log(resp);
            if(resp){
              SaveSubscription(resp?.razorpay_payment_id)
            }
            setLoading(false);
          }

        }
        //@ts-ignore
        if (window.Razorpay) {
            //@ts-ignore
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          console.error('Razorpay script is not loaded');
          setLoading(false);
        }
  }
  const SaveSubscription=async(paymentId:string)=>{
         createPayment({
           email: user?.email,
           username: user?.given_name,
           active: true,
           paymentId: paymentId,
           joinDate: moment().format('DD/MM/yyyy')
         }).then((resp)=>{
          router.replace('/dashboard');

         }).catch((error) => {
          console.error('Error saving subscription:', error);
        });
  }
  return (
         
       <div>
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-4 sm:py-6 lg:px-6">
          
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:items-center md:gap-4">
              <div
                className="rounded-xl border border-indigo-600 p-4 shadow-sm ring-1 ring-indigo-600 sm:order-last sm:px-6 lg:p-8"
              >
                <div className="text-center">
                  <h2 className="text-md font-medium text-gray-900">
                    Professional
                    <span className="sr-only">Plan</span>
                  </h2>
                  <p className="mt-2 sm:mt-3">
                    <strong className="text-2xl font-bold text-gray-900 sm:text-3xl"> 4.99$ </strong>
                    <span className="text-xs font-medium text-gray-700">/month</span>
                  </p>
                </div>

                <ul className="mt-4 space-y-1">
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Everything included in free, plus: </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Unlimited Team Files </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Exclusive access to Tubeguruji.com content </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> More document features </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Email Support </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Instagram support </span>
                  </li>
                </ul>

                <Button disabled={loading} onClick={createSubscription}
                  className="mt-6 flex gap-2 items-centerblock rounded-full border border-indigo-600 bg-indigo-600 px-8 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500">
                    {loading && <Loader2Icon className='animate-spin'/>}
                  Upgrade
                </Button>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 shadow-sm sm:px-6 lg:p-8">
                <div className="text-center">
                  <h2 className="text-md font-medium text-gray-900">
                    Free
                    <span className="sr-only">Plan</span>
                  </h2>
                  <p className="mt-2 sm:mt-3">
                    <strong className="text-2xl font-bold text-gray-900 sm:text-3xl"> Free </strong>
                    <span className="text-xs font-medium text-gray-700">/month</span>
                  </p>
                </div>

                <ul className="mt-4 space-y-1">
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> 5 Team files </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Limited Access to Tubeguruji.com </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Limited Document feature </span>
                  </li>
                  <li className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-700 text-sm"> Email Support </span>
                  </li>
                </ul>

                <a href="#" className="mt-6 block rounded-full border border-indigo-600 bg-white px-8 py-2 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500">
                  Get Started
                </a>
              </div>
            </div>
          </div>
      
    </div>
  )
}

export default Payment;
