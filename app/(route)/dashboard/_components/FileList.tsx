'use client'
import { FileListContext } from '@/app/_context/FilesListContext'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Archive,  DeleteIcon, MoreHorizontal  } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from 'convex/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { api } from '@/convex/_generated/api';
// import { deleteTask } from '@/convex/files';
export interface FILE{
  archive:boolean,
  createdBt:string,
  document:string,
  fileName:string,
  teamId:string,
  whiteboard:string,
  _id:string,
  _creationTime:number
}
export interface VALUE{
  value:string
}
function FileList({value}:VALUE) {
  const delFile=useMutation(api.files.deleteTask)
  const {fileList_,setFileList_}=useContext(FileListContext);
  const [fileList,setFileList]=useState<any>();

  const {user}:any=useKindeBrowserClient();
  const router=useRouter();
  const deleteFile = async (delId: any) => {
    try {
      await delFile({ id: delId });
      // Remove the deleted file from the list
      const updatedFileList = fileList.filter((file: { _id: any; }) => file._id !== delId);
      setFileList(updatedFileList);
      setFileList_(updatedFileList); // Update the context as well if necessary
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  useEffect(() => {
    if (fileList_) {
      // Filter fileList_ based on the value prop
      const filteredFiles = fileList_.filter((file: FILE) =>
        file.fileName.toLowerCase().includes(value.toLowerCase())
      );
      setFileList(filteredFiles);
    }
  }, [fileList_, value]);

  return (
    <div className='mt-10'>
 

<div className="overflow-x-auto">
  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
    <thead className="ltr:text-left rtl:text-right">
      <tr>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">File Name</td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Created At</td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Edited</td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author</td>

      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {fileList&&fileList.map((file:FILE,index:number)=>(
        
        <tr key={index} className="odd:bg-gray-50 cursor-pointer"
        onClick={()=>router.push('/workspace/'+file._id)}
        >
        
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900" >
          {file.fileName}</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
          {moment(file._creationTime).format('DD MMM YYYY')} </td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
        {moment(file._creationTime).format('DD MMM YYYY')}
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
         {user&& <Image src= {user?.picture}
          alt='user'
          width={30}
          height={30}
          className='rounded-full'
          />}
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700"
        onClick={(e) => e.stopPropagation()}  
        >
     
          <DropdownMenu>
  <DropdownMenuTrigger>
  <MoreHorizontal/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
   
    <DropdownMenuItem className='gap-3'>
       <Archive className='h-4 w-4'/> Archive</DropdownMenuItem>
       <DropdownMenuItem className='gap-3' onClick={()=>deleteFile(file._id)}>
       <DeleteIcon className='h-4 w-4' /> Delete</DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>

        </td>
      </tr>
      ))}
      

    
    </tbody>
  </table>
</div>
    </div>
  )
}

export default FileList
