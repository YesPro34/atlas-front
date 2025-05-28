import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/navBar";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return <>
        <NavBar />
           {children}
        <Footer />
       </>;
}