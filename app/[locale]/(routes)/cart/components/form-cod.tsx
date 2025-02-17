import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Currency from "@/components/ui/currency";
import { CartItem } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FormCodProps {
  onClose: () => void;
  items: CartItem[];
}

const FormCod: React.FC<FormCodProps> = ({ onClose, items }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const t = useTranslations('codForm');


    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        cityship: 'other'
    });
    
    const [shippingCost, setShippingCost] = useState(40);
    const removeAll = useCart((state) => state.removeAll);
    
    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0) + shippingCost;
    
    const finalTotal = totalPrice + shippingCost;

   const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cityship = e.target.value;
        const cost = cityship === 'tanger' ? 20 : 40;
        setShippingCost(cost);
        setFormData(prev => ({ ...prev, cityship }));
    }

     /*   const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const cityship = e.target.value;
            const cost = 40; // Fixed cost for all cities
            setShippingCost(cost);
            setFormData(prev => ({ ...prev, cityship }));
        }*/

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.cityship) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true)


        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds: items.map((item) => item.id),
                quantities: items.map((item) => item.quantity),
                prices: items.map((item) => item.price),
                colors: items.map((item) => item.selectedColor?.id),
                sizes: items.map((item) => item.selectedSize?.id),
                paymentMethod: 'COD',
                customerInfo: {
                    ...formData,
                    shippingCost
                }
            });

            toast.success("Order placed successfully! You'll pay on delivery.");
            removeAll();
            window.location.href = '/success';
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="relative">
            <button 
                onClick={onClose}
                className="absolute right-0 top-0 p-2"
            >
                <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-6">{t('title')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">{t('fullName')}</label>
                    <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder={t('fullNamePlaceholder')}
                    />
                </div>

                <div>
                    <label className="block mb-2">{t('phone')}</label>
                    <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder={t('phonePlaceholder')}
                    />
                </div>

                <div>
                    <label className="block mb-2">{t('city')}</label>
                    <Input
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder={t('cityPlaceholder')}
                    />
                </div>

                <div>
    <label className="block mb-2">{t('deliveryCost')}</label>
    <div className="space-y-2">
        <div>
            <input
                type="radio"
                id="other"
                name="cityship"
                value="other"
                checked={formData.cityship === 'other'}
                onChange={handleCityChange}
                required
            />
            <label htmlFor="other" className="ml-2">{t('allCities')}</label>
        </div>
        <div>
            <input
                type="radio"
                id="tanger"
                name="cityship"
                value="tanger"
                checked={formData.cityship === 'tanger'}
                onChange={handleCityChange}
                required
            />
            <label htmlFor="tanger" className="ml-2">Tanger (20 MAD)</label>
        </div>
    </div>
</div>


                <div>
                    <label className="block mb-2">{t('address')}</label>
                    <Input
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder={t('addressPlaceholder')}
                    />
                </div>

                <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
                <span>{t('subtotal')}:</span>
                <Currency value={totalPrice - shippingCost} />
            </div>
            <div className="flex justify-between mb-2">
                <span>{t('deliveryCost')}:</span>
                <Currency value={shippingCost} />
            </div>
            <div className="flex justify-between font-bold">
                <span>{t('total')}:</span>
                <Currency value={totalPrice} />
            </div>
        </div>
                <Button 
            type="submit" 
            className="w-full hover:bg-black dark:hover:bg-white" 
            disabled={isSubmitting}
        >
           {isSubmitting ? t('processing') : t('confirmOrder')}   
             </Button>
            </form>
        </div>
    );
};

export default FormCod;