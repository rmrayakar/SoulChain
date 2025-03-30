"use client";
import { useState } from "react";
import {
  useActiveAccount,
  useSendTransaction,
  useReadContract,
} from "thirdweb/react";
import { client } from "@/app/client";
import { sepolia } from "thirdweb/chains";
import { prepareContractCall, getContract } from "thirdweb";
import { ETH_ADDRESS, SMART_WILL_FACTORY } from "../constants/contracts";

interface Beneficiary {
  address: string;
  share: number;
}

interface Oracle {
  address: string;
  aadhaarNumber: string;
}

interface Asset {
  assetType: number; // 0: ETH, 1: ERC20, 2: ERC721, 3: OffChain
  tokenAddress: string;
  tokenId: string;
  amount: string;
  metadataURI: string;
}

type CreateWillModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

export const CreateWillModal = ({
  setIsModalOpen,
  refetch,
}: CreateWillModalProps) => {
  const account = useActiveAccount();
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const { mutate: sendTransaction } = useSendTransaction();

  // Example read: last deployed will (if you need it)
  const { data: lastWillAddress } = useReadContract({
    contract: getContract({
      client,
      chain: sepolia,
      address: SMART_WILL_FACTORY,
    }),
    method: "getLastDeployedWill",
    params: [],
  });

  // Form states
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { address: "", share: 0 },
  ]);
  const [oracles, setOracles] = useState<Oracle[]>([
    { address: "", aadhaarNumber: "" },
  ]);
  const [assets, setAssets] = useState<Asset[]>([
    {
      assetType: 0,
      tokenAddress: ETH_ADDRESS,
      tokenId: "0",
      amount: "50000000000000",
      metadataURI: "",
    },
  ]);

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { address: "", share: 0 }]);
  };

  const addOracle = () => {
    setOracles([...oracles, { address: "", aadhaarNumber: "" }]);
  };

  const addAsset = () => {
    setAssets([
      ...assets,
      {
        assetType: 0,
        tokenAddress: ETH_ADDRESS,
        tokenId: "0",
        amount: "0",
        metadataURI: "",
      },
    ]);
  };

  const updateBeneficiary = (
    index: number,
    field: keyof Beneficiary,
    value: string | number
  ) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
    setBeneficiaries(newBeneficiaries);
  };

  const updateOracle = (index: number, field: keyof Oracle, value: string) => {
    const newOracles = [...oracles];
    newOracles[index] = { ...newOracles[index], [field]: value };
    setOracles(newOracles);
  };

  const updateAsset = (
    index: number,
    field: keyof Asset,
    value: string | number
  ) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    if (field === "assetType") {
      // Reset token address for ETH when asset type changes
      newAssets[index].tokenAddress = value === 0 ? ETH_ADDRESS : "";
    }
    setAssets(newAssets);
  };

  const handleCreateWill = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsDeploying(true);
    try {
      const contract = getContract({
        client,
        chain: sepolia,
        address: SMART_WILL_FACTORY,
      });

      // Deploy the will contract first
      alert("Please confirm the first transaction to deploy the will contract...");
      const deployTransaction = prepareContractCall({
        contract,
        method: "function deployDigitalWill() payable returns (address)",
        params: [],
        value: BigInt(0),
      });

      await sendTransaction(deployTransaction);
      // Wait a short period to let the blockchain update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Format assets
      const formattedAssets = assets.map((asset) => ({
        assetType: Number(asset.assetType),
        tokenAddress: asset.tokenAddress,
        tokenId: BigInt(asset.tokenId),
        amount: BigInt(asset.amount),
        metadataURI: asset.metadataURI,
      }));

      alert("Will contract deployed! Please confirm the second transaction to create the will...");
      const createTransaction = prepareContractCall({
        contract,
        method: "function createWillOnDigitalWill(address digitalWillAddress, address[] _beneficiaries, uint256[] _shares, (uint8 assetType, address tokenAddress, uint256 tokenId, uint256 amount, string metadataURI)[] _assets, address[] _oracles, string[] _aadhaarNumbers) payable returns (uint256)",
        params: [
          account.address,
          beneficiaries.map((b) => b.address),
          beneficiaries.map((b) => BigInt(b.share)),
          formattedAssets,
          oracles.map((o) => o.address),
          oracles.map((o) => o.aadhaarNumber),
        ],
        value: assets.reduce(
          (sum, asset) => asset.assetType === 0 ? sum + BigInt(asset.amount) : sum,
          BigInt(0)
        ),
      });

      await sendTransaction(createTransaction);
      alert("Will created successfully! You can view it in My Wills section.");
      // Optionally, trigger a refetch for parent data
      refetch();
      // Redirect user to My Wills page
      window.location.href = `/my-wills/${account.address}`;
    } catch (error: any) {
      console.error("Error creating will:", error);
      alert("Failed to create will. Check console for details.");
    } finally {
      setIsDeploying(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md overflow-y-auto">
      <div className="w-2/3 bg-white p-6 rounded-lg shadow-xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Will</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsModalOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Beneficiaries Section */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Beneficiaries
              </h3>
              <button
                onClick={addBeneficiary}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                + Add Beneficiary
              </button>
            </div>
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={beneficiary.address}
                    onChange={(e) =>
                      updateBeneficiary(index, "address", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Share (in basis points)
                  </label>
                  <input
                    type="number"
                    value={beneficiary.share}
                    onChange={(e) =>
                      updateBeneficiary(
                        index,
                        "share",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="50000 = 50%"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Assets Section */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
              <button
                onClick={addAsset}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                + Add Asset
              </button>
            </div>
            {assets.map((asset, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Asset Type
                  </label>
                  <select
                    value={asset.assetType}
                    onChange={(e) =>
                      updateAsset(index, "assetType", parseInt(e.target.value))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value={0}>ETH</option>
                    <option value={1}>ERC20</option>
                    <option value={2}>ERC721</option>
                    <option value={3}>Off-chain</option>
                  </select>
                </div>
                {asset.assetType !== 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Token Address
                    </label>
                    <input
                      type="text"
                      value={asset.tokenAddress}
                      onChange={(e) =>
                        updateAsset(index, "tokenAddress", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="0x..."
                    />
                  </div>
                )}
                {asset.assetType === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Token ID
                    </label>
                    <input
                      type="text"
                      value={asset.tokenId}
                      onChange={(e) =>
                        updateAsset(index, "tokenId", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}
                {(asset.assetType === 0 || asset.assetType === 1) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={asset.amount}
                      onChange={(e) =>
                        updateAsset(index, "amount", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}
                {asset.assetType === 3 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Metadata URI
                    </label>
                    <input
                      type="text"
                      value={asset.metadataURI}
                      onChange={(e) =>
                        updateAsset(index, "metadataURI", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Oracles Section */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Oracles</h3>
              <button
                onClick={addOracle}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                + Add Oracle
              </button>
            </div>
            {oracles.map((oracle, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Oracle Address
                  </label>
                  <input
                    type="text"
                    value={oracle.address}
                    onChange={(e) =>
                      updateOracle(index, "address", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={oracle.aadhaarNumber}
                    onChange={(e) =>
                      updateOracle(index, "aadhaarNumber", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter Aadhaar number"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateWill}
            disabled={isDeploying}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isDeploying ? "Creating Will..." : "Create Will"}
          </button>
        </div>
      </div>
    </div>
  );
};
