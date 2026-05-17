export default function Footer() {
    return (
        <footer className="bg-[#0A1930] text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-8">
                    
                    <div className="col-span-1 md:col-span-1">
                        <img 
                            src="/logo.png" 
                            alt="bdMart" 
                            className="h-16 w-auto object-contain mb-6" 
                        />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your ultimate shopping destination for quality products, seamless ordering, and reliable delivery.
                        </p>
                    </div>

                    <div>
                        <h6 className="text-lg font-bold mb-6 text-white tracking-wide">Quick Links</h6>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
                            <li><a href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">Products</a></li>
                            <li><a href="/orders" className="text-gray-400 hover:text-white transition-colors text-sm">Orders</a></li>
                            <li><a href="/cart" className="text-gray-400 hover:text-white transition-colors text-sm">Cart</a></li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="text-lg font-bold mb-6 text-white tracking-wide">Customer Service</h6>
                        <ul className="space-y-4">
                            <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                            <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="text-lg font-bold mb-6 text-white tracking-wide">Connect With Us</h6>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0047FF] hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                </svg>
                            </a>

                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                                </svg>
                            </a>

                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <hr/>

                <div className="pt-8 text-center md:text-left flex flex-col md:flex-row justify-center items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} bdMart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}