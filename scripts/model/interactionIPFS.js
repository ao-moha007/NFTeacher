import { web3, contract, deployerAccount, getContractOwner, PRIVATE_KEY } from "../utils/contractConfig.js";
import axios from 'axios';
import { setTokenURI, completeModule, checkModuleCompletion } from '../controller/ContractConnect.js';
import dotenv from "dotenv";
import { mintNFT } from "../controller/MintNFT.js";
dotenv.config();

/**
 * Lists the pinned files from Pinata's IPFS API.
 * 
 * @async
 * @param {string} baseURI - The base URI of the Pinata IPFS gateway.
 * @returns {Promise<Array>} - A promise that resolves to an array of pinned files.
 * @throws {Error} - Throws an error if the API request fails.
 */
export async function listPinnedFiles(baseURI) {
  try {
    const url = `${baseURI}data/pinList`;
    console.log("process.env.PINATA_API_KEY", process.env.NEXT_PUBLIC_PINATA_API_KEY);
    console.log("process.env.PINATA_API_SECRET", process.env.NEXT_PUBLIC_PINATA_API_SECRET);
    
    // Make the API request
    const response = await axios.get(url, {
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
      },
    });

    return response.data.rows;
  } catch (error) {
    console.error("Error listing pinned files:", error);
  }
}

/**
 * Fetches the content of a file from IPFS using its CID (Content Identifier).
 * 
 * @async
 * @param {string} cid - The Content Identifier (CID) of the file to fetch.
 * @returns {Promise<Object>} - The content of the file fetched from IPFS.
 * @throws {Error} - Throws an error if fetching the file fails.
 */
export async function fetchFileContent(cid) {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching file with CID ${cid}:`, error);
  }
}

/**
 * Creates metadata JSON for the NFT based on the progress and certification status.
 * 
 * @param {number} tokenId - The ID of the token.
 * @param {number} completedModules - The number of completed modules.
 * @param {boolean} isCertified - The certification status.
 * @param {Array<number>} scores - An array of scores for each module.
 * @returns {Object} - The metadata object for the NFT.
 */
export function createMetadata(tokenId, completedModules, isCertified, scores) {
  return {
    name: `NFTeacher #${tokenId}`,
    description: "This NFT represents the educational achievements of the holder, including completed modules and certification status.",
    image: `https://example.com/images/education_nft_${tokenId}.png`,
    attributes: [
      {
        "trait_type": "Completed Modules",
        "value": completedModules
      },
      {
        "trait_type": "Certification Status",
        "value": isCertified ? "Certified" : "Not Certified"
      },
      ...scores.map((score, index) => ({
        "trait_type": `Module ${index + 1} Score`,
        "value": score
      }))
    ]
  };
}

/**
 * Uploads metadata to Pinata and returns the IPFS hash of the uploaded metadata.
 * 
 * @async
 * @param {Object} metadata - The metadata object to be uploaded.
 * @param {number} _tokenId - The ID of the token associated with the metadata.
 * @param {string} baseURI - The base URI of the Pinata IPFS gateway.
 * @returns {Promise<string>} - A promise that resolves to the IPFS hash of the uploaded metadata.
 * @throws {Error} - Throws an error if uploading to Pinata fails.
 */
export async function uploadMetadataToPinata(metadata, _tokenId, baseURI) {
  const form = new FormData();
  const jsonMetadata = JSON.stringify(metadata);
  const jsonBuffer = Buffer.from(jsonMetadata);
  const blobMetadata = new Blob([jsonMetadata], { type: "application/json" });

  form.append('file', blobMetadata, `Token_${_tokenId}.json`);

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
      }
    });

    const ipfsHash = response.data.IpfsHash;
    console.log(`Metadata uploaded successfully! IPFS URL: ${baseURI}${ipfsHash}`);
    const metadataUrl = baseURI + ipfsHash;
    setTokenURI(_tokenId, ipfsHash);
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    throw error;
  }
}

/**
 * Retrieves data from IPFS for a specific tokenId and returns its progress and scores.
 * 
 * @async
 * @param {number} _tokenId - The ID of the token to retrieve data for.
 * @param {string} baseURI - The base URI of the Pinata IPFS gateway.
 * @returns {Promise<Array>} - A promise that resolves to an array containing progress data and scores.
 * @throws {Error} - Throws an error if the process fails.
 */
export async function retrieveDataFromIpfs(_tokenId, baseURI) {
  for (let i = 1; i < 11; i++) {
    if (i == _tokenId) {
      const tokenId = i;

      const exists = await contract.methods.ownerOf(tokenId).call().catch(() => null);
      console.log("exists :", exists);
      if (exists) {
        console.log(`Token ${tokenId} already does exist!`);
      } else {
        console.log(`Token ${tokenId} doesn't exist!`);
      }

      const deployerAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
      web3.eth.accounts.wallet.add(deployerAccount);
      web3.eth.defaultAccount = deployerAccount.address;

      const files = await listPinnedFiles(baseURI);
      let response;

      if (files.length > 0) {
        let token = files.find(f => f.metadata?.name === `Token_${i}.json`);
        if (!token) { continue; }
        const cid = token.ipfs_pin_hash;
        console.log(`Fetching content for CID: ${cid}`);
        response = await fetchFileContent(cid);
      }

      const moduleScores = [];
      const modules = response.attributes.filter(attr => attr.trait_type.startsWith('Module') && attr.trait_type.includes('Score'));
      const completMod = response.attributes.filter(attr => attr.trait_type.startsWith('Completed'));
      const isCertif = response.attributes.filter(attr => attr.trait_type.startsWith('Certification'));

      for (const module of modules) {
        moduleNumber = module.trait_type.split(' ')[1];
        const score = parseInt(module.value);
        moduleScores.push({ moduleNumber: moduleNumber, score: score });
      }

      console.log("moduleScores :", moduleScores);
      console.log("completMod :", completMod);
      console.log("isCertif :", isCertif);
      return [completMod, isCertif, {}, moduleScores];
    }
  }
}

/**
 * Example function to upload metadata for 10 tokens to IPFS.
 * It fetches the progress for each token, creates metadata, uploads it to Pinata,
 * and sets the token URI.
 * 
 * @async
 * @returns {Promise<void>} - Resolves once the metadata for all tokens is uploaded.
 * @throws {Error} - Throws an error if the process fails.
 */
async function fetchAndUploadToIpfs() {
  try {
    for (let i = 1; i < 11; i++) {
      const tokenId = i;
      const progressData = await contract.methods.getProgress(tokenId).call();
      const completedModules = progressData.numCompletedModules;
      const isCertified = progressData.isCertified;
      const moduleScores = progressData.moduleScores;
      const metadata = createMetadata(tokenId, completedModules, isCertified, moduleScores);
      const metadataUrl = await uploadMetadataToPinata(metadata, tokenId);
      console.log('Metadata URL:', metadataUrl);
    }
  } catch (error) {
    console.error(`Failed to fetch Token URI for Token ID 1:`, error.message);
  }
}

(async () => {
  // Uncomment the following line to run the function
  // retrieveDataFromIpfs(1);
})();
