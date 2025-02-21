


"use client"

import usePreviewModal from "@/hooks/use-preview-modal"
import Modal from "@/components/ui/modal"
import Gallery from "@/components/gallery"
import Info from "@/components/info"

import {useLocale } from 'next-intl';


const PreviewModal = () => {

    const previewModal = usePreviewModal()
    const product = usePreviewModal((state)=> state.data)
    const locale = useLocale();
    const isRTL = locale === 'ar';

    if(!product) return null

    return (  

        
        <Modal open={previewModal.isOpen} onClose={previewModal.onClose}>

            <div className={`grid w-full grid-cols-1 items-center gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 ${isRTL ? 'rtl' : ''}`}>

            <div className="sm:col-span-4 lg:col-span-5">
                <Gallery media={product.media} />
            </div>
            <div className="sm:col-span-8 lg:col-span-7">
            <Info data={product} showDescription={false} /> 
            </div>

            
            </div>

        </Modal>
    )
}

export default PreviewModal