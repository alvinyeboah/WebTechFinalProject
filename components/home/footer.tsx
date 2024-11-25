import React from 'react'
import { Poppins } from 'next/font/google'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

const poppins = Poppins({
subsets: ['latin'],
weight: ['400', '600'],
variable: '--font-poppins',
})

export default function Footer() {
return (
    <footer className={`bg-[#1A1C20] text-[#E6D5B8] py-12 ${poppins.variable} font-sans`}>
    <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-[#F0A500]">Art Vista Gallery</h3>
            <p className="text-sm">Showcasing the finest in contemporary and classical art.</p>
            <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="text-[#E6D5B8] hover:text-[#F0A500]">
                <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-[#E6D5B8] hover:text-[#F0A500]">
                <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-[#E6D5B8] hover:text-[#F0A500]">
                <Instagram size={20} />
            </a>
            </div>
        </div>
        <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#F0A500] transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-[#F0A500] transition-colors">Exhibitions</a></li>
            <li><a href="#" className="hover:text-[#F0A500] transition-colors">Artists</a></li>
            <li><a href="#" className="hover:text-[#F0A500] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#F0A500] transition-colors">Contact</a></li>
            </ul>
        </div>
        <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-2">
            <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>123 Art Street, Islamabad, Pakistan</span>
            </li>
            <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (123) 456-7890</span>
            </li>
            <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@artvista.com</span>
            </li>
            </ul>
        </div>
        <div className="space-y-4">
            <h4 className="text-lg font-semibold">Subscribe to Our Newsletter</h4>
            <p className="text-sm">Stay updated with our latest exhibitions and events.</p>
            <form className="space-y-2">
            <input
                type="text"
                placeholder="Your Name"
                className="w-full px-3 py-2 bg-[#2A2C30] text-[#E6D5B8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                required
            />
            <input
                type="email"
                placeholder="Your Email"
                className="w-full px-3 py-2 bg-[#2A2C30] text-[#E6D5B8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                required
            />
            <button
                type="submit"
                className="w-full px-4 py-2 bg-[#F0A500] text-[#1A1C20] rounded-md font-semibold hover:bg-[#E6D5B8] transition-colors"
            >
                Subscribe
            </button>
            </form>
        </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#2A2C30] text-center text-sm">
        <p>&copy; 2023 Hallery Vault brought by ArtVista . All rights reserved.</p>
        </div>
    </div>
    </footer>
)
}