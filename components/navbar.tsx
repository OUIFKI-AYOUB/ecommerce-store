import Container from "@/components/ui/container";
import Link from "next/link";
import MainNav from "@/components/main-nav";
import getCategories from "@/actions/get-categories";
import NavbarActions from "@/components/navbar-actions";
import SearchBar from "@/components/ui/search-bar";
import { ThemeToggle } from "./theme-toggle";


export const revalidate = 0
const Navbar = async () => {
    const categories = await getCategories()
    return ( 
        <div className="border-b">
            <Container >
            <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
            <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2" >
            <p className="font-bold text-xl">Store</p>
            
            </Link>
            <MainNav data={categories} />
            <div className="mr-auto flex items-center space-x-4">
            <SearchBar />
            <NavbarActions />
            <ThemeToggle />
            </div>
            
            </div>
          
            </Container>

        </div>
     );
}
 
export default Navbar;