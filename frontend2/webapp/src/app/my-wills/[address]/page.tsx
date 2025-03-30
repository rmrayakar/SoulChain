"use client";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { WillCard } from "@/app/components/WillCard";

// Test data for demonstration
const TEST_WILLS = [
    {
        address: "0x1234567890123456789012345678901234567890",
        owner: "0x9876543210987654321098765432109876543210",
        details: {
            deathVerified: false,
            assetsTransferred: false,
            deathApprovalCount: 1,
            deathApprovalThreshold: 3
        }
    },
    {
        address: "0x2345678901234567890123456789012345678901",
        owner: "0x9876543210987654321098765432109876543210",
        details: {
            deathVerified: true,
            assetsTransferred: true,
            deathApprovalCount: 3,
            deathApprovalThreshold: 3
        }
    }
];

export default function MyWills({ params }: { params: { address: string } }) {
    const account = useActiveAccount();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <div className="w-full bg-gradient-to-b from-purple-50 to-white py-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wills</h1>
                    <p className="text-gray-600 mb-8">
                        Manage and monitor your digital wills
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TEST_WILLS.map((will) => (
                            <WillCard key={will.address} willAddress={will.address} />
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> This is test data being displayed for demonstration purposes. 
                            Due to reaching the limit of Thirdweb's free tier for contract deployments, 
                            we are unable to show live contract data at this time. In production, this page 
                            would display actual will contracts from the blockchain.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
