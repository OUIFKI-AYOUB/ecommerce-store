import { motion } from "framer-motion";
import getBillboards from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import Container from "@/components/ui/container";
import Slider from "@/components/slider";
import ProductSlider from "@/components/product-slider";
import CommentsSection from "@/components/comments-section";
import getComments from "@/actions/get-comments";
import Link from "next/link";
import { MotionDiv } from "@/components/animations/motion-wrapper";
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const billboards = await getBillboards();
  const categories = await getCategories();
  const comments = await getComments();
  const t = await getTranslations('navigation'); 
  
  const newProducts = products.filter(p => {
    const productDate = new Date(p.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate >= thirtyDaysAgo;
  });


  
  return (
    <Container>
    <MotionDiv 
      className="space-y-16 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        {billboards.length > 0 && (
          <MotionDiv
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Slider billboards={billboards} />
          </MotionDiv>
        )}

        
        <MotionDiv 
          className="py-8"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t('newArrivals')}</h2>
            <Link 
              href="/new-arrivals"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white dark:bg-white text-black dark:text-black hover:text-pink-600 dark:hover:text-pink-600 transition border border-gray-400 dark:border-gray-400 shadow-sm"
            >
               {t('shopCollection')} →
            </Link>
          </div>
          <ProductSlider products={newProducts} />
        </MotionDiv>

        {categories
          .filter(category => 
            products.some(product => 
              product.categories.some(c => c.id === category.id)
            )
          )
          .map((category, index) => (
            <MotionDiv 
              key={category.id} 
              className="py-8"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link 
                  href={`/category/${category.id}`}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-white dark:bg-white text-black dark:text-black hover:text-pink-600 dark:hover:text-pink-600 transition border border-gray-400 dark:border-gray-400 shadow-sm"
                >
                 {t('shopCollection')} →
                </Link>
              </div>
              <ProductSlider 
                products={products.filter(p => p.categories.some(c => c.id === category.id))}
              />
            </MotionDiv>
          ))}

        {comments.length > 0 && (
          <MotionDiv
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CommentsSection comments={comments} />
          </MotionDiv>
        )}
      </MotionDiv>
    </Container>
  );
}

export default HomePage;
