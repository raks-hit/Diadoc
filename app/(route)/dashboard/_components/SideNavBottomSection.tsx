'use client'
import { Button } from '@/components/ui/button'
import { Archive, Flag, Github } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useConvex } from 'convex/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Constant from '@/app/_constant/Constant'
import PricingDialog from './PricingDialog'
import { UserSubscriptionContext } from '@/app/_context/UserSubscriptionContext'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { api } from '@/convex/_generated/api'
import { FileListContext } from '@/app/_context/FilesListContext'
import Link from 'next/link'

function SideNavBottomSection({onFileCreate, totalFiles}: any) {
  const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext)
  const {fileList_,setFileList_}=useContext(FileListContext);
  const { user }: any = useKindeBrowserClient();
  const [totalFiles_,setTotalFiles_]=useState(totalFiles);
  const convex = useConvex()

  const isSubscribed = async () => {
    const result = await convex.query(api.user.getStatus, { email: user?.email });
    console.log(result[0]?.active);
    setUserSubscription(result[0]?.active);
  }

  const menuList = [
    {
      id: 1,
      name: 'Getting Started',
      icon: Flag,
      path: ''
    },
    {
      id: 2,
      name: 'Github',
      icon: Github,
      path: ''
    },
    {
      id: 3,
      name: 'Archive',
      icon: Archive,
      path: ''
    }
  ]

  const [fileInput, setFileInput] = useState('');

  useEffect(() => {
    if (user) {
      isSubscribed();
    }
  }, [user])
  useEffect(() => {
    setTotalFiles_(fileList_.length)
  }, [fileList_]);
  
  const isFileLimitReached = totalFiles_ >= Constant.MAX_FREE_FILE && !userSubscription;

  return (
    <div>
      {menuList.map((menu, index) => (
        <h2 key={index} className='flex gap-2 p-1 px-2 text-[14px] 
        hover:bg-gray-100 rounded-md cursor-pointer'>
          <menu.icon className='h-5 w-5' />
          {menu.name}
        </h2>
      ))}

      {/* Add New File Button  */}
      <Dialog>
        <DialogTrigger className='w-full' asChild>
          <Button className='w-full bg-blue-600 
      hover:bg-blue-700 justify-start mt-3'>New File</Button>
        </DialogTrigger>
        {!isFileLimitReached ? 
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New File</DialogTitle>
              <DialogDescription>
                <Input placeholder='Enter File Name' 
                className='mt-3'
                onChange={(e) => setFileInput(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="">
              <DialogClose asChild>
                <Button type="button" 
                className='bg-blue-600
            hover:bg-blue-700'
                disabled={!(fileInput && fileInput.length > 3)}
                onClick={() => onFileCreate(fileInput)}
                >
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
          : 
          <PricingDialog />}
      </Dialog>

      {/* Progress Bar  */}
      <div className='h-4 w-full bg-gray-200 rounded-full mt-5'>
        <div className={`h-4 rounded-full ${isFileLimitReached ? 'bg-red-600' : 'bg-green-600'}`}
          style={{ width: userSubscription ? '100%' : `${(totalFiles_ / Constant.MAX_FREE_FILE) * 100}%` }}
        >
        </div>
      </div>

      <h2 className='text-[12px] mt-3'>
        {/* <strong>{userSubscription ? "You have Unlimited access" : totalFiles + "out of" + Constant.MAX_FREE_FILE }</strong> */}
        <strong>{userSubscription ? totalFiles_ : totalFiles_}</strong> out of <strong>{userSubscription ? 'Unlimited' : Constant.MAX_FREE_FILE}</strong> files used
      </h2>
      {userSubscription ? (
        <h2 className='text-[12px] mt-1'>You have unlimited file access with your current plan.</h2>
      ) : (
        <Link href={'/dashboard/subscription'} className='text-[12px] mt-1' >Upgrade your plan for unlimited access.</Link>
      )}
    </div>
  )
}

export default SideNavBottomSection
