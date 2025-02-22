import Container from "@/components/ui/container";
import Link from "next/link";
import MainNav from "@/components/main-nav";
import getCategories from "@/actions/get-categories";
import NavbarActions from "@/components/navbar-actions";
import SearchBar from "@/components/ui/search-bar";
import MobileNav from "@/components/ui/mobile-nav";
import MobileSearch from "@/components/ui/mobile-search";
import Image from "next/image";
import LanguageSwitcher from './language-switcher';
import { useLocale } from 'next-intl';

export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();
  const locale = useLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <div className="border-b fixed top-0 w-full bg-white dark:bg-gray-900 z-50">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-20 items-center "  dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="lg:hidden flex items-center gap-x-2 rtl:space-x-reverse">
        <MobileNav data={categories} />
            <LanguageSwitcher />
          </div>
          <Link href="/" className="lg:static lg:transform-none lg:left-0 absolute left-1/2 transform -translate-x-1/2">
          <Image
              src="/images/mat.png"
              alt="Logo"
              width={180}
              height={60}
              className="h-20 w-auto"
            />
          </Link>

          <div className="hidden lg:block rtl:ml-4">
          <MainNav data={categories} messages={messages} locale={locale} />
          </div>

          <div className="hidden lg:block flex-1 rtl:mr-4">
          <SearchBar />
          </div>

          <div className="flex items-center gap-x-4 rtl:mr-auto rtl:ml-0 ml-auto">
          <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  );
};


export default Navbar;