'use client';
import { client } from "@/app/client";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import Image from 'next/image';
import thirdwebIcon from "@public/logo1.jpg";

const Navbar = () => {
    const account = useActiveAccount();

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <Image 
                                src={thirdwebIcon} 
                                alt="SmartWill" 
                                width={32} 
                                height={32} 
                                style={{
                                    filter: "drop-shadow(0px 0px 24px #a726a9a8)",
                                }}
                            />
                            <span className="ml-2 text-lg font-semibold text-gray-900">SmartWill</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href={'/'}>
                                    <p className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                        Home
                                    </p>
                                </Link>
                                {account && (
                                    <>
                                        <Link href={`/create-will/${account.address}`}>
                                            <p className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                                Create Will
                                            </p>
                                        </Link>
                                        <Link href={`/my-wills/${account.address}`}>
                                            <p className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                                My Wills
                                            </p>
                                        </Link>
                                        <Link href={`/verify-death/${account.address}`}>
                                            <p className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                                Oracle Verification
                                            </p>
                                        </Link>
                                        <Link href={`/revoke-will/${account.address}`}>
                                            <p className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                                Revoke Will
                                            </p>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <ConnectButton 
                            client={client}
                            theme={{
                                ...lightTheme(),
                                colors: {
                                    ...lightTheme().colors,
                                    accentText: '#7C3AED', // purple-600
                                    accentButtonBg: '#7C3AED',
                                    accentButtonText: '#FFFFFF',
                                },
                            }}
                            detailsButton={{
                                style: {
                                    maxHeight: "50px",
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Link href={'/'}>
                        <p className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                            Home
                        </p>
                    </Link>
                    {account && (
                        <>
                            <Link href={`/create-will/${account.address}`}>
                                <p className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                    Create Will
                                </p>
                            </Link>
                            <Link href={`/my-wills/${account.address}`}>
                                <p className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                    My Wills
                                </p>
                            </Link>
                            <Link href={`/verify-death/${account.address}`}>
                                <p className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                    Oracle Verification
                                </p>
                            </Link>
                            <Link href={`/revoke-will/${account.address}`}>
                                <p className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors">
                                    Revoke Will
                                </p>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;
