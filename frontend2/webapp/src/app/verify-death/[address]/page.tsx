'use client';
import { useState, useEffect } from "react";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";
import { SMART_WILL_FACTORY } from "@/app/constants/contracts";

interface Oracle {
    wallet: string;
    aadhaarNumber: string;
    hasApproved: boolean;
}

export default function VerifyDeath({ params }: { params: { address: string } }) {
    const account = useActiveAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [oracles, setOracles] = useState<Oracle[]>([]);
    const { mutate: sendTransaction } = useSendTransaction();

    const factoryContract = getContract({
        client: client,
        chain: sepolia,
        address: SMART_WILL_FACTORY,
    });

    // Get will details
    const { data: willDetails } = useReadContract({
        contract: factoryContract,
        method: "function getWillOraclesFromDigitalWill(address digitalWillAddress, uint256 willId) view returns ((address wallet, string aadhaarNumber)[])",
        params: [params.address, BigInt(0)] // willId is always 0 in this case
    });

    // Get oracle approval status
    const { data: oracleCount } = useReadContract({
        contract: factoryContract,
        method: "function getOracleCountFromDigitalWill(address digitalWillAddress, uint256 willId) view returns (uint256)",
        params: [params.address, BigInt(0)]
    });

    useEffect(() => {
        const fetchOracleDetails = async () => {
            if (oracleCount && willDetails) {
                const count = Number(oracleCount);
                const oracleDetails = [];

                for (let i = 0; i < count; i++) {
                    const { data: oracle } = await useReadContract({
                        contract: factoryContract,
                        method: "function getOracleDetailsFromDigitalWill(address digitalWillAddress, uint256 willId, uint256 oracleIndex) view returns (address wallet, string aadhaarNumber, bool hasApproved)",
                        params: [params.address, BigInt(0), BigInt(i)]
                    });

                    if (oracle) {
                        oracleDetails.push({
                            wallet: oracle[0],
                            aadhaarNumber: oracle[1],
                            hasApproved: oracle[2]
                        });
                    }
                }

                setOracles([...oracleDetails]);
                setIsLoading(false);
            }
        };

        fetchOracleDetails();
    }, [oracleCount, willDetails, params.address, factoryContract]);

    const handleVerifyDeath = async () => {
        try {
            const transaction = prepareContractCall({
                contract: factoryContract,
                method: "function verifyDeathViaFactory(address digitalWillAddress, uint256 willId)",
                params: [params.address, BigInt(0)],
            });
            await sendTransaction(transaction);
            alert("Death verification submitted successfully!");
        } catch (error) {
            console.error("Error verifying death:", error);
            alert("Failed to verify death. Check console for details.");
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
                                    {oracles.map((oracle, index) => (
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

                            {account && oracles.some(o => o.wallet === account.address) && !oracles.find(o => o.wallet === account.address)?.hasApproved && (
                                <button
                                    onClick={handleVerifyDeath}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Verify Death
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 