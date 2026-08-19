import Login from "@/Components/Auth/Login";
import Register from "@/Components/Auth/Register";
import Modal from "@/Components/Modal";
import ReportingOptions from "@/Pages/Guest/ReportingOptions";
import { useHeaderStore } from "@/utils/store/headerStore";
import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { TelephoneOutboundFill, X, List } from "react-bootstrap-icons";

export default function Guest({ children }: { children: any }) {
    const tabs = ["Overview", "About", "Contact Us", "Help"];

    // Global state
    const { activeTab, setActiveTab } = useHeaderStore();
    const { showLogin, showRegister, setShowLogin, setShowRegister } = useLoginRegisterStore();

    // Local state
    const [showReportingOptions, setShowReportingOptions] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
                <nav className="border-gray-200">
                    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-3 group">
                                <img 
                                    src="/images/logo/e-blotter.png" 
                                    className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" 
                                    alt="E-Blotter Logo" 
                                />
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    E-Blotter
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-8">
                                {/* Report Incident Button */}
                                <button
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                                    onClick={() => setShowReportingOptions(true)}
                                >
                                    <TelephoneOutboundFill className="w-4 h-4" />
                                    <span className="font-medium">Report Incident</span>
                                </button>

                                {/* Navigation Links */}
                                <div className="hidden lg:flex items-center space-x-6">
                                    <Link
                                        href="/"
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        Overview
                                    </Link>
                                    <Link
                                        href="/faq"
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        FAQ
                                    </Link>
                                    <Link
                                        href="/contact-us"
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        Contact Us
                                    </Link>
                                </div>

                                {/* Auth Buttons */}
                                <div className="flex items-center space-x-3">
                                    <button
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                                        onClick={() => setShowRegister(true)}
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="mobile-menu-button lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <List className="w-6 h-6" />
                                )}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        <div className={`mobile-menu-container lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            <div className="py-4 space-y-4">
                                {/* Report Incident Button - Mobile */}
                                <button
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                                    onClick={() => {
                                        setShowReportingOptions(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <TelephoneOutboundFill className="w-4 h-4" />
                                    <span className="font-medium">Report Incident</span>
                                </button>

                                {/* Navigation Links - Mobile */}
                                <div className="space-y-2">
                                    <Link
                                        href="/"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Overview
                                    </Link>
                                    <Link
                                        href="/faq"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        FAQ
                                    </Link>
                                    <Link
                                        href="/contact-us"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Contact Us
                                    </Link>
                                </div>

                                {/* Auth Buttons - Mobile */}
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <button
                                        className="w-full px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
                                        onClick={() => {
                                            setShowLogin(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-200 shadow-md"
                                        onClick={() => {
                                            setShowRegister(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>

            {/* Modals */}
            <Modal show={showLogin} maxWidth="4xl" onClose={() => setShowLogin(false)}>
                <Login />
            </Modal>

            <Modal show={showRegister} maxWidth="5xl" onClose={() => setShowRegister(false)}>
                <Register />
            </Modal>

            <Modal
                show={showReportingOptions}
                maxWidth="2xl"
                onClose={() => setShowReportingOptions(false)}
            >
                <ReportingOptions />
            </Modal>
        </div>
    );
}
