'use client';
import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type WillCardProps = {
    willAddress: string;
};

export const WillCard: React.FC<WillCardProps> = ({ willAddress }) => {
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: willAddress,
    });

    // Get Will Owner
    const { data: owner } = useReadContract({
        contract: contract,
        method: "function owner() view returns (address)",
        params: []
    });

    // Get Will Status
    const { data: willDetails } = useReadContract({
        contract: contract,
        method: "function getWillDetails() view returns (address owner, bool deathVerified, bool assetsTransferred, uint256 deathApprovalCount, uint256 deathApprovalThreshold)",
        params: []
    });

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow">
            <div>
                <h5 className="mb-2 text-2xl font-bold tracking-tight">Digital Will</h5>
                <div className="mb-4 space-y-2">
                    <p className="font-normal text-gray-700">
                        <span className="font-semibold">Address:</span>{' '}
                        {willAddress.slice(0, 6)}...{willAddress.slice(-4)}
                    </p>
                    {willDetails && (
                        <>
                            <p className="font-normal text-gray-700">
                                <span className="font-semibold">Status:</span>{' '}
                                {willDetails[1] ? 'Verified' : 'Pending'}
                            </p>
                            <p className="font-normal text-gray-700">
                                <span className="font-semibold">Assets:</span>{' '}
                                {willDetails[2] ? 'Transferred' : 'Pending Transfer'}
                            </p>
                            <p className="font-normal text-gray-700">
                                <span className="font-semibold">Approvals:</span>{' '}
                                {willDetails[3].toString()}/{willDetails[4].toString()}
                            </p>
                        </>
                    )}
                </div>
            </div>
            
            <div className="flex gap-2 mt-4">
                <Link
                    href={`/will/${willAddress}`}
                    passHref={true}
                >
                    <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300">
                        View Details
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </p>
                </Link>

                <Link
                    href={`/verify-death/${willAddress}`}
                    passHref={true}
                >
                    <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-purple-600 bg-white border border-purple-600 rounded-lg hover:bg-purple-50">
                        Verify Death
                    </p>
                </Link>
            </div>
        </div>
    );
}; 