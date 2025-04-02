import { web3, contract, deployerAccount, getContractOwner } from "../utils/contractConfig.js";

/**
 * Mints a new NFT with the specified tokenId and base URI.
 * This function estimates the gas required for the minting transaction, 
 * sends the minting transaction, and logs the success or failure of the operation.
 *
 * @async
 * @param {string} deployer - The address of the deployer (usually the account calling the minting function).
 * @param {number} tokenId - The ID of the NFT token to mint.
 * @param {string} baseURI - The base URI (usually for IPFS or similar storage) where the NFT's metadata is stored.
 * @returns {Promise<void>} - Resolves when the minting process is complete.
 * @throws {Error} - Throws an error if the minting transaction fails.
 */
export async function mintNFT(deployer, tokenId, baseURI) {
    try {
        // Estimate the gas required for the minting transaction
        const gasEstimate = await contract.methods.mintNFT(deployer, tokenId, baseURI).estimateGas({ from: deployer });
        console.log("Minting NFT with estimated gas:", gasEstimate);

        // Send the transaction to mint the NFT
        await contract.methods.mintNFT(deployer, tokenId, baseURI).send({ from: deployer, gas: gasEstimate });
        console.log(`NFT minted with tokenId: ${tokenId}`);
    } catch (error) {
        console.error("Error minting NFT:", error.data.reason); // Logs the reason for the failure
    }
}

const baseURI = "https://tomato-changing-cougar-906.mypinata.cloud/ipfs/";
console.log("Deployer Address:", deployerAccount.address);

// Run the minting test (uncomment to test)
// mintNFT(deployerAccount.address, 1, baseURI);
