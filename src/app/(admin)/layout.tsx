// import { getSession } from "@/app/lib/session";
// import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const session = await getSession();

    // if (!session || !session.user) {
    //     redirect("/login");
    // }

    // if (session.user.role !== "ADMIN") {
    //     return null;
    // }

    return <>{children}</>;
}