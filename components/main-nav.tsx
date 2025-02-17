"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';

interface MainNavProps {
    data: Category[];
    className?: string;
    messages: any;
    locale: string;  // Add this line
}

const MainNav: React.FC<MainNavProps> = ({ data, className, messages, locale }) => {  
    const pathname = usePathname();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>  
            <NavigationContent data={data} className={className} pathname={pathname} />
        </NextIntlClientProvider>
    );
};

const NavigationContent = ({ data, className, pathname }: { data: Category[], className?: string, pathname: string }) => {
    const t = useTranslations('navigation');

    const mainRoutes = [
        {
            href: '/',
            label: t('home'),
            active: pathname === '/'
        },
    ];

    const categoryRoutes = data.map((route) => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname.includes(`/category/${route.id}`)
    }));

    const allRoutes = [...mainRoutes, ...categoryRoutes];

    const firstLineRoutes = allRoutes.slice(0, 7);
    const secondLineRoutes = allRoutes.slice(7);

    return (
        <nav className={cn("mx-6 flex flex-col space-y-2", className)}> 
            <div className="flex items-center space-x-4 lg:space-x-6">
                {firstLineRoutes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm font-medium transition-all relative group py-2",
                            route.active 
                                ? "text-pink-600 dark:text-pink-500" 
                                : "text-neutral-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500"
                        )}
                    >
                        {route.label}
                        <span className={cn(
                            "absolute inset-x-0 bottom-0 h-0.5 bg-pink-600 dark:bg-pink-500 transform transition-transform duration-200",
                            route.active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )} />
                    </Link>
                ))}
            </div>
            {secondLineRoutes.length > 0 && (
                <div className="flex items-center space-x-4 lg:space-x-6">
                    {secondLineRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-all relative group py-2",
                                route.active 
                                    ? "text-pink-600 dark:text-pink-500" 
                                    : "text-neutral-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500"
                            )}
                        >
                            {route.label}
                            <span className={cn(
                                "absolute inset-x-0 bottom-0 h-0.5 bg-pink-600 dark:bg-pink-500 transform transition-transform duration-200",
                                route.active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            )} />
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default MainNav;