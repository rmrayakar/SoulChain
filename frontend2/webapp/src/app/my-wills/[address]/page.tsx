"use client";
import { useState, useEffect } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { WillCard } from "@/app/components/WillCard";
import { SMART_WILL_FACTORY } from "@/app/constants/contracts";

export default function MyWills({ params }: { params: { address: string } }) {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [wills, setWills] = useState<string[]>([]);

  const factoryContract = getContract({
    client: client,
    chain: sepolia,
    address: SMART_WILL_FACTORY,
  });

  // Read user's wills from the factory contract
  const { data: userWills, isLoading: isLoadingWills } = useReadContract({
    contract: factoryContract,
    method: "getUserWills", // Use just the function name
    params: [params.address],
  });
  console.log(userWills);
;
  useEffect(() => {
    if (!isLoadingWills && userWills) {
      setWills(userWills as string[]);
      setIsLoading(false);
    }
  }, [isLoadingWills, userWills]);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="w-full bg-gradient-to-b from-purple-50 to-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wills</h1>
          <p className="text-gray-600 mb-8">
            Manage and monitor your digital wills
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : wills && wills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wills.map((willAddress) => (
                <WillCard key={willAddress} willAddress={willAddress} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No wills found. Create your first will to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
