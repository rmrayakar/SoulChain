'use client';
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

// Test data
const TEST_WILLS = [
    {
        address: "0x1234567890123456789012345678901234567890",
        owner: "0x9876543210987654321098765432109876543210",
        status: "Active",
        createdAt: "2024-02-15"
    },
    {
        address: "0x2345678901234567890123456789012345678901",
        owner: "0x9876543210987654321098765432109876543210",
        status: "Active",
        createdAt: "2024-03-01"
    }
];

export default function RevokeWill() {
    const [isRevoking, setIsRevoking] = useState(false);

    const handleRevoke = async (willAddress: string) => {
        setIsRevoking(true);
        try {
            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Will revocation simulated successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Revocation simulation failed");
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <div className="w-full bg-gradient-to-b from-purple-50 to-white py-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Revoke Will</h1>
                    <p className="text-gray-600 mb-8">
                        Manage and revoke your active wills
                    </p>

                    <div className="space-y-4">
                        {TEST_WILLS.map((will) => (
                            <div key={will.address} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Will Address:</span>{' '}
                                            {will.address.slice(0, 6)}...{will.address.slice(-4)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Created:</span>{' '}
                                            {will.createdAt}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Status:</span>{' '}
                                            {will.status}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRevoke(will.address)}
                                        disabled={isRevoking}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {isRevoking ? 'Revoking...' : 'Revoke Will'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

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