

export default function NavbarUsr() {
return (
<nav className="w-full bg-blue-600 text-white p-4 shadow-md">
<div className="container mx-auto flex items-center justify-between">
{/* Logo */}
<a href="/" className="text-xl font-bold tracking-wide">
BengkelApp
</a>


{/* Menu */}
<div className="flex items-center gap-6 text-sm font-medium">
<a href="/about" className="hover:text-gray-300 transition">About</a>
<a href="/marketplace" className="hover:text-gray-300 transition">Marketplace</a>
<a href="/booking" className="hover:text-gray-300 transition">Booking</a>
<a href="/profile" className="hover:text-gray-300 transition">Profile</a>
</div>
</div>
</nav>
);
}