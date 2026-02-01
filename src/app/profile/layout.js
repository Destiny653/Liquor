export const metadata = {
    title: "My Profile",
    description: "Manage your Velvet Casks account, view your order history, and update your personal collection settings.",
    robots: {
        index: false,
        follow: false
    }
};

export default function ProfileLayout({ children }) {
    return <>{children}</>;
}
