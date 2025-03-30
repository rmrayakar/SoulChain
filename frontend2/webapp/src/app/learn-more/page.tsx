'use client';

export default function LearnMore() {
    return (
        <main className="flex min-h-screen flex-col bg-white">
            {/* Hero Section */}
            <div className="w-full bg-gradient-to-b from-purple-50 to-white py-16">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Understanding <span className="text-purple-600">SmartWill</span>
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        A comprehensive guide to creating and managing your digital legacy using blockchain technology
                    </p>

                    {/* Content Sections */}
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* Overview Section */}
                        <section>
                            <div className="flex items-center justify-center mb-8">
                                <div className="bg-purple-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Overview</h2>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <p className="text-gray-600 leading-relaxed">
                                    SmartWill is a decentralized application (dApp) that revolutionizes the way digital assets are inherited. 
                                    Built on blockchain technology, it ensures transparent, secure, and automated execution of digital wills 
                                    through smart contracts.
                                </p>
                            </div>
                        </section>

                        {/* Key Features Section */}
                        <section>
                            <div className="flex items-center justify-center mb-8">
                                <div className="bg-purple-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Key Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Will Support</h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-purple-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Create and manage multiple digital wills
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-purple-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Different beneficiaries for each will
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Asset Support</h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-purple-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            ETH, ERC20, and ERC721 tokens
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-purple-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Off-chain asset documentation
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How to Use Section */}
                        <section>
                            <div className="flex items-center justify-center mb-8">
                                <div className="bg-purple-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">How to Use</h2>
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Creating a Will</h3>
                                    <div className="pl-6 border-l-2 border-purple-200">
                                        <ul className="space-y-4 text-gray-600">
                                            <li>Connect your MetaMask wallet</li>
                                            <li>Navigate to &quot;Create Will&quot; section</li>
                                            <li>Add beneficiary addresses and their shares</li>
                                            <li>Specify assets to be included</li>
                                            <li>Add trusted oracles with their details</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Oracle Verification</h3>
                                    <div className="pl-6 border-l-2 border-purple-200">
                                        <ul className="space-y-4 text-gray-600">
                                            <li>Designated oracles verify through the platform</li>
                                            <li>Multiple confirmations required</li>
                                            <li>Automatic asset distribution on threshold reach</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Managing Wills</h3>
                                    <div className="pl-6 border-l-2 border-purple-200">
                                        <ul className="space-y-4 text-gray-600">
                                            <li>View all wills in &quot;My Wills&quot; section</li>
                                            <li>Track oracle verification status</li>
                                            <li>Revoke wills if needed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
} 