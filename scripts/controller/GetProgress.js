import Web3 from 'web3';
import { web3, contract, deployerAccount, getContractOwner } from "../utils/contractConfig.js";

/**
 * Fetches progress data for a specific token ID from the smart contract.
 * This includes completed modules, certification status, number of completed modules, 
 * and module scores.
 * 
 * @async
 * @param {number} tokenId - The ID of the token for which to fetch progress data.
 * @returns {Promise<void>} - Resolves when the progress data is successfully retrieved and logged.
 * @throws {Error} - Throws an error if the contract call fails.
 */
export async function getProgressData(tokenId) {
    try {
        // Call the contract function to get the progress data for a specific tokenId
        const progress = await contract.methods.getProgress(tokenId).call();
        console.log(progress);

        // Destructure the response to retrieve specific progress details
        const [completedModules, isCertified, moduleCompletedNum] = progress[0,1,2];
        const moduleScores = progress.moduleScores;

        console.log('Completed Modules:', completedModules);
        console.log('Is Certified:', isCertified);
        console.log('Module Completed:', moduleCompletedNum);  // This is the boolean array
        console.log('Module Scores:', moduleScores);  // This is the uint256 array

        // You can iterate over the arrays if needed
        moduleScores.forEach((score, index) => {
            console.log(`Module ${index + 1} Score:`, score);
        });
    } catch (error) {
        console.error('Error fetching progress data:', error);
    }
}

// Call the function with a tokenId, e.g., tokenId = 1
// getProgressData(1);
