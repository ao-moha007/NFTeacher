# NFTeacher 
# (NFT-based Learning Progress Tracker)

##  Overview
NFTeacher is a blockchain-based platform that leverages NFTs to track students' progress through educational modules. Each NFT represents a student's progress, including completed modules, scores, and certification status.

##  Features
- Mint NFTs that represent student progress.
- Track completion of up to **10 learning modules** per NFT.
- Assign and update module scores.
- Certify students upon completion of all modules.
- Store and retrieve NFT metadata and progress records via IPFS.
- Verify student achievements on-chain.

##  Tech Stack
- **Blockchain:** Ethereum
- **Smart Contract Language:** Solidity (OpenZeppelin ERC721, Ownable)
- **Frameworks:** Truffle
- **Frontend:**  Next.js (Optional)
- **Storage:** IPFS via Pinata
- **APIs & Libraries:** Web3.js, Axios, dotenv

##  Prerequisites & Installations
Ensure you have the following installed before running the project:
- **Node.js:** v20.19.0
- **npm:** 10.8.2
- **Truffle:** v5.11.5
- **Ganache (Optional):** v7.9.1 (For local blockchain testing)
- **Web3.js:** v1.10.0 (To interact with the Ethereum blockchain)
- **axios:** v0.21.4


##  Smart Contract Details
- **Contract Name:** `NFTeacher`
- **Contract Address:** (To be added after deployment)
- **Network:** Ethereum Mainnet / Testnet (Goerli, Sepolia, etc.)
- **Explorer:** (To be added after deployment)
- **ABI Location:** `./build/contracts/NFTeacher.json`

##  Installation & Setup
```bash
# Clone the repository
git clone https://github.com/ao-moha007/NFTeacher.git
cd your-repo

# Install dependencies
npm install

# Install Truffle globally (if not installed)
npm install -g truffle

# Create an environment file
cp .env.example .env

# Compile smart contracts
truffle compile
```

##  Deployment
```bash
# Deploy to a local/test network
truffle migrate --network development
```

## How to Use the dApp
1. **Mint an NFT:** Admin mints an NFT for a student.
2. **Complete Modules:** Admin updates module scores.
3. **Track Progress:** Users view their completion status.
4. **Certification:** Once all modules are completed, the NFT is certified.
5. **Retrieve NFT Metadata:** Fetch NFT details from IPFS.

##  Testing
```bash
# Run smart contract tests
truffle test
```

##  Smart Contract Functions
### NFT Minting
```solidity
function mintNFT(address _to, uint256 _tokenId, string memory _baseURI)
```
- Mints an NFT with a unique token ID and base URI.

###  Track Progress
```solidity
function getProgress(uint256 tokenId) public view returns (uint256, bool, bool[10] memory, uint256[10] memory)
```
- Retrieves student progress, including scores and completion status.

###  Complete Modules
```solidity
function completeModule(uint256 _tokenId, uint256 _moduleNum, uint256 _score)
```
- Updates the module score and marks it as completed if the score is **≥10**.

###  Certification
```solidity
function certify(uint256 _tokenId) public onlyOwner returns (bool)
```
- Certifies the student if all 10 modules are completed.

###  Set Token URI
```solidity
function setTokenURI(uint256 _tokenId, string memory _ipfsUrl) public onlyOwner
```
- Stores the NFT metadata on IPFS and links it to the token.



##  Contributing
1. Fork the repo and create a new branch.
2. Make your changes and commit them.
3. Open a pull request for review.

##  License
This project is licensed under the MIT License.



