'use client';
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

interface Oracle {
    wallet: string;
    aadhaarNumber: string;
    hasApproved: boolean;
}

// Test data
const TEST_ORACLES = [
    {
        wallet: "0x3456789012345678901234567890123456789012",
        aadhaarNumber: "XXXX-XXXX-1234",
        hasApproved: false
    },
    {
        wallet: "0x4567890123456789012345678901234567890123",
        aadhaarNumber: "XXXX-XXXX-5678",
        hasApproved: true
    },
    {
        wallet: "0x5678901234567890123456789012345678901234",
        aadhaarNumber: "XXXX-XXXX-9012",
        hasApproved: false
    }
];

export default function VerifyDeath({ params }: { params: { address: string } }) {
    const account = useActiveAccount();
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyDeath = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Death verification simulated successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Verification simulation failed");
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <div className="w-full bg-gradient-to-b from-purple-50 to-white py-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Death</h1>
                    <p className="text-gray-600 mb-8">
                        Oracle verification for will at {params.address}
                    </p>

                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Oracle Details</h2>
                                <div className="space-y-4">
                                    {TEST_ORACLES.map((oracle, index) => (
                                        <div key={index} className="p-4 border rounded-lg">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Wallet:</span>{' '}
                                                {oracle.wallet.slice(0, 6)}...{oracle.wallet.slice(-4)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Aadhaar:</span>{' '}
                                                {oracle.aadhaarNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Status:</span>{' '}
                                                {oracle.hasApproved ? 'Verified' : 'Pending'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {account && TEST_ORACLES.some(o => o.wallet === account.address) && !TEST_ORACLES.find(o => o.wallet === account.address)?.hasApproved && (
                                <button
                                    onClick={handleVerifyDeath}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Verify Death
                                </button>
                            )}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> This is test data being displayed for demonstration purposes. 
                            Due to reaching the limit of Thirdweb's free tier for contract deployments, 
                            we are unable to show live contract data at this time.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
} 