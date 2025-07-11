"use client"

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { Fragment } from "react"
import IconButton from "@/components/ui/icon-button"
import { X } from "lucide-react"
import { useLocale } from "next-intl";

interface ModalProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}


const Modal: React.FC<ModalProps> =({
    open,
    onClose,
    children

})=>{

    const locale = useLocale();

    return(
        <Transition show={open} appear as={Fragment}>

       <Dialog as="div" className={"relative z-50"} onClose={onClose} >
       <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" />

       <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">

            <TransitionChild as={Fragment} 
            enter="ease-out duration-300" 
            enterFrom="opacity-0 scale-95" 
            enterTo="opacity-100 scale-100"
             leave="ease-in duration-200" 
             leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">

                <DialogPanel className={" w-full max-w-3xl  overflow-hidden rounded-lg  text-left align-middle "}>
                <div className="relative flex w-full items-center overflow-hidden bg-white dark:bg-gray-900 px-4 pb-8 pt-14 shadow-2xl dark:shadow-gray-900 sm:px-6 sm:pt-8 md:p-6 lg:p-8">

                <div className={`${locale === "ar" ? "left-4" : "right-4"} absolute top-4`}>
                <IconButton 
    onClick={onClose} 
    icon={<X size={20} className="dark:text-gray-200" />} 
    className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-full p-1"
    aria-label="Close modal"
/>


                        </div>
                        {children}


                    </div>

                </DialogPanel>

            </TransitionChild>

        </div>

       </div>

       </Dialog>

        </Transition>
    )
}

export default Modal