"use client";
import Link from "next/link";
import Image from 'next/image'
import { useActiveAccount } from "thirdweb/react";

export default function Home() {
  const account = useActiveAccount();

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-6 py-16 text-center md:py-24">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Secure Your Digital Legacy with
            <span className="text-purple-600"> SmartWill</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Create, manage, and secure your digital assets with blockchain-powered smart wills. 
            Ensure your digital legacy reaches the right hands.
          </p>
          <div className="flex justify-center gap-4">
            {account ? (
              <>
                <Link 
                  href={`/create-will/${account.address}`}
                  className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  Create Your Will
                </Link>
                <Link 
                  href={`/create-will/${account.address}`}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <p className="text-gray-600 font-medium">
                Please connect your wallet to create a will
              </p>
            )}
            <Link 
              href="/learn-more" 
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why Choose SmartWill?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Secure & Immutable</h3>
              <p className="text-gray-600">
                Built on blockchain technology ensuring your will remains tamper-proof and secure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Multiple Beneficiaries</h3>
              <p className="text-gray-600">
                Easily distribute your digital assets among multiple beneficiaries with custom allocations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Choose your Trusted Oracles</h3>
              <p className="text-gray-600">
                Trusted oracle system ensures proper verification and timely execution of your will.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl bg-purple-600 px-6 py-12 text-center md:py-16">
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              Ready to Secure Your Digital Legacy?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-purple-100">
              Join thousands of users who trust SmartWill to protect and manage their digital assets.
            </p>
            <Link 
              href="/create-will" 
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-600 shadow-sm hover:bg-purple-50"
            >
              Get Started Now
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

