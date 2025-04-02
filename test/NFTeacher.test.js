import { expect } from "chai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const NFTeacher = require("../build/contracts/NFTeacher.json");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545"); 

contract("NFTeacher", (accounts) => {
    const [owner, user1] = accounts;
    let nfTeacher;

    beforeEach(async () => {
        const Contract = new web3.eth.Contract(NFTeacher.abi);
        nfTeacher = await Contract.deploy({ data: NFTeacher.bytecode })
            .send({ from: owner, gas: 5000000 });
    });

    it("Should deploy the contract successfully", async () => {
        const name = await nfTeacher.methods.name().call();
        const symbol = await nfTeacher.methods.symbol().call();
        expect(name).to.equal("NFTeacher");
        expect(symbol).to.equal("EDU");
    });

    it("Should mint an NFT successfully", async () => {
        const tokenId = 2;
        const gasEstimate = await nfTeacher.methods.mintNFT(user1, tokenId,"https://example.com/").estimateGas({ from: owner });
      console.log("Minting NFT with estimated gas:", gasEstimate);
  
      await nfTeacher.methods.mintNFT(user1, tokenId,"https://example.com/").send({ from: owner, gas: gasEstimate });
      console.log(`NFT minted with tokenId: ${tokenId}`);
      
        const ownerOfToken = await nfTeacher.methods.ownerOf(tokenId).call();
        console.log("user1",user1);
        console.log("ownerOfToken",ownerOfToken);
        expect(ownerOfToken).to.equal(user1);
    });

    it("Should allow owner to update token URI", async () => {
        const tokenId = 1;
        const gasEstimate = await nfTeacher.methods.mintNFT(user1, tokenId,"https://example.com/").estimateGas({ from: owner });
        console.log("Minting NFT with estimated gas:", gasEstimate);
    
        await nfTeacher.methods.mintNFT(user1, tokenId,"https://example.com/").send({ from: owner, gas: gasEstimate });
        console.log(`NFT minted with tokenId: ${tokenId}`);

        const gasEstimateURI = await nfTeacher.methods.setTokenURI(tokenId, "metadata.json").estimateGas({ from: owner });
        console.log("Minting NFT with estimated gas:", gasEstimateURI);

        await nfTeacher.methods.setTokenURI(tokenId, "metadata.json").send({ from: owner, gas: gasEstimateURI });
        
        const updatedUri = await nfTeacher.methods.getTokenURI(tokenId).call();
        expect(updatedUri).to.equal("https://example.com/metadata.json");
    });

    it("Should certify the token when all modules are completed", async () => {
        const tokenId = 1;
        const gasEstimate = await nfTeacher.methods.mintNFT(user1, tokenId,"https://example.com/").estimateGas({ from: owner });
        console.log("Minting NFT with estimated gas:", gasEstimate);
    
        await nfTeacher.methods.mintNFT(user1, tokenId,"https://example.com/").send({ from: owner, gas: gasEstimate });
        console.log(`NFT minted with tokenId: ${tokenId}`);
        
        

        for (let i = 1; i <= 10; i++) {
            const gasEstimateMod = await nfTeacher.methods.updateModuleScore(tokenId, i, 15).estimateGas({ from: owner });
            await nfTeacher.methods.updateModuleScore(tokenId, i, 15)
            .send({ from: owner, gas: gasEstimateMod });
        }
        
        const gasEstimateCert = await nfTeacher.methods.certify(tokenId).estimateGas({ from: owner });
        await nfTeacher.methods.certify(tokenId).send({ from: owner, gas: gasEstimateCert });

        const progress = await nfTeacher.methods.getProgress(tokenId).call();
        expect(progress.isCertified).to.be.true;
    });
});
