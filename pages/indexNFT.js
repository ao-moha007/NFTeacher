'use client';
import { Header, Footer, Preloader } from "../components/index.js";

import { useState } from 'react';
import { useEffect } from "react";
import { ethers } from 'ethers';
import dotenv from "dotenv";

import NFTeacherABI from '../build/contracts/NFTeacher.json';
import Head from 'next/head';
import { getTokenURI } from "../scripts/controller/ContractConnect.js";
import { web3, contract, deployerAccount, getContractOwner } from "../scripts/utils/contractConfig.js";
import { retrieveDataFromIpfs, uploadMetadataToPinata, createMetadata, fetchFileContent, listPinnedFiles } from "../scripts/model/interactionIPFS.js";
const CONTRACT_ADDRESS = contract;
dotenv.config();
export default function indexTest() {
    const [tokenId, setTokenId] = useState('');
    const [baseURI, setBaseURI] = useState('https://gateway.pinata.cloud/ipfs/');
    const [URI, setURI] = useState('');
    const [tokenNumb, setTokenNumb] = useState('');
    const [moduleNum, setModuleNum] = useState('');
    const [score, setScore] = useState('');
    const [progress, setProgress] = useState(null);
    const [progressMeta, setProgressMeta] = useState(null);
    const [activeSection, setActiveSection] = useState("nft"); // Default active section


    async function getProviderOrSigner() {

        const provider = deployerAccount;

    }

    async function getURI() {
        try {
            console.log("token uri : ");
            let temp = await getTokenURI(tokenId);
            console.log("token uri : ", temp.toString());
            setURI(temp);
        } catch (error) {
            console.log(error);
        }

    }

    async function uploadTokenData() {
        try {
            const metadata = createMetadata(tokenId, progress.numCompletedModules, progress.isCertified, score)
            const ipfsHash = await uploadMetadataToPinata(metadata, tokenId, baseURI);
            console.log(`Metadata uploaded successfully! IPFS URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
            alert(`Metadata uploaded successfully! IPFS URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        }
        catch (error) {
            console.error(error);
        }


    }

    async function retrieveTokenData() {
        try {
            console.log("process.env.PINATA_API_KEY", process.env.PINATA_API_KEY);
            console.log("process.env.PINATA_API_SECRET", process.env.PINATA_API_SECRET);
            console.log(`deployer : `, deployerAccount.address);
            const p = await retrieveDataFromIpfs(tokenId, baseURI);
            console.log(`Metadata retrieved successfully!`, p);
            setProgressMeta(p);

        }
        catch (error) {
            console.error(error);
        }


    }
    async function mintNFT() {
        console.log("rika");
        if (tokenNumb > 10) {
            alert("you are allowed to mint less than 10 tokens");
            console.log("you are allowed to mint less than 10 tokens");
            return;
        } baseURI
        if (!baseURI) {
            alert("please enter a valid URL base for the IPFS metadata file");
            console.log("please enter a valid URL base for the IPFS metadata file");
            return;
        }

        for (let i = 1; i <= tokenNumb; i++) {

            try {
                console.log(deployerAccount.address);
                const gasEstimate = await contract.methods.mintNFT(deployerAccount.address, i, baseURI).estimateGas({ from: deployerAccount.address });
                console.log("Minting NFT with estimated gas:", gasEstimate);

                await contract.methods.mintNFT(deployerAccount.address, i, baseURI).send({ from: deployerAccount.address, gas: gasEstimate });
                console.log(`NFT minted with tokenId: ${i}`);
            } catch (error) {
                //console.error("Error minting NFT:", error);
                if (error?.message?.includes("Token already exists")) {
                    console.warn(`Token ${i} already exists. Skipping.`);
                    alert(`Token ${i} already exists.`);
                } else {
                    alert(`Failed to mint NFT ${i}: ${error?.data?.reason || error.message}`);
                }
            }
        }

    }

    async function getProgress() {
        try {

            // Call the contract function to get the progress data for a specific tokenId
            const p = await contract.methods.getProgress(tokenId).call();

            console.log(p);
            setProgress(p);

            // Destructure the response

            const completedModules = p.numCompletedModules.toString();
            const isCertified = p.isCertified;
            const moduleCompletedNum = p.isCompleted;
            const moduleScores = p.moduleScores;
            setScore(moduleScores);

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

    async function updateScore() {
        for (let i = 1; i < 11; i++) {
            try {
                console.log(`is module ${i} completed : `, progress.isCompleted[i - 1]);
                if (!progress.isCompleted[i - 1]) {

                    const gasEstimate = await contract.methods.updateModuleScore(tokenId, i, score[i - 1]).estimateGas({ from: deployerAccount.address });
                    const tx = await contract.methods.updateModuleScore(tokenId, i, score[i - 1]).send({ from: deployerAccount.address, gas: gasEstimate });

                }

            } catch (error) {
                console.error('Error completing module:', error);
                //alert('Error completing module:', error);
            }
        }


    }

    async function certifyToken() {
        // const signer = await getProviderOrSigner();
        // const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTeacherABI.abi, signer);
        // try {
        //   const tx = await contract.certify(tokenId);
        //   await tx.wait();
        //   alert("Token Certified!");
        // } catch (error) {
        //   console.error(error);
        //   alert("Certification failed");
        // }
    }

    const handleClick = async () => {
        try {
            await getProgress();  // Wait for getProgress to finish first
            await getURI();       // Then wait for getURI to finish
        } catch (error) {
            console.error("Error executing functions:", error);
        }
    };

    useEffect(() => {
        if (progress) {
            console.log("Updated progress state:", progress);
        }
    }, [progress]);
    return (
        <>
            <Header />
            <div style={{ backgroundSize: "cover", backgroundImage: `url("assets/img/banner-bg.png")` }}>

                <div className="banner"
                    id="home"
                >
                    <div className="illustration">
                        <img src="assets/img/banner-bg-1.png" className="one" alt="" />
                        <img src="assets/img/banner-bg-2.png" className="two" alt="" />
                        <img src="assets/img/banner-map.png" className="three" alt="" />
                    </div>
                    <div className="hero-area">
                        <div className="container">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-xl-4 col-lg-6 ">
                                    <div className="banner-content wow fadInUp"
                                        data-wow-duration="0.5s"
                                        data-wow-delay="0.3s">
                                        <h3 className="subtitle"> unchained learning </h3>
                                        <h1 className="head"> NFTeacher</h1>
                                        <p className="text">
                                            NFT-Based Learning Progress Tracker
                                        </p>

                                    </div>
                                    <div className="button-container">
                                        <a onClick={() => setActiveSection("nft")}

                                            className="button button-1">
                                            NFT
                                        </a>
                                        <a onClick={() => setActiveSection("score")}

                                            className="button button-1">
                                            Scores
                                        </a>
                                        <a onClick={() => setActiveSection("mint")}

                                            className="button button-1">
                                            MInt
                                        </a>
                                    </div>
                                </div>
                                <div className="col-xl-7 col-lg-6 wow fadeInRightBig"
                                    data-wow-delay="0.3s"
                                    data-wow-duration="0.5s">
                                    {activeSection === "nft" && <div className="exchange">
                                        <h5 className="ex-head"> NFT </h5>

                                        <div className="exchange-box">
                                            <div className="selector">

                                                <div className="coin">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="form-group">
                                                    <span >TokenId</span>
                                                    <input type="text"
                                                        placeholder={"Token ID"}
                                                        className="form-control"
                                                        value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
                                                </div>
                                            </div>

                                        </div>
                                        {progressMeta && (
                                            <div>
                                                <h3>Retrieved progress  Details</h3>
                                                <p>Completed Modules: {progressMeta[0][0].value.toString()}</p>
                                                <p>Certified: {progressMeta[1][0].value.toString()}</p>
                                                <ul>
                                                    {progressMeta[3].map((module, index) => (
                                                        <li key={index}>
                                                            <strong>Module {index + 1}:</strong> {module.score.toString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p>Token URI :
                                                    <a href={URI} target="_blank" rel="noopener noreferrer">
                                                        {URI.length > 20 ? `${URI.substring(0, 10)}...${URI.substring(URI.length - 10)}` : URI}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                        {progress && (
                                            <div>
                                                <h3>Progress Details</h3>
                                                <p>Completed Modules: {progress[0].toString()}</p>
                                                <p>Certified: {progress[1] ? 'Yes' : 'No'}</p>
                                                <ul>
                                                    {progress.moduleScores.map((module, index) => (
                                                        <li key={index}>
                                                            <strong>Module {index + 1}:</strong> {module.toString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p>Token URI :
                                                    <a href={URI} target="_blank" rel="noopener noreferrer">
                                                        {URI.length > 20 ? `${URI.substring(0, 10)}...${URI.substring(URI.length - 10)}` : URI}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                        <a onClick={handleClick}

                                            className="button button-1">
                                            Get Progress
                                        </a>
                                        <a onClick={uploadTokenData}

                                            className="button button-1">
                                            Upload Progress
                                        </a>
                                        <a onClick={retrieveTokenData}

                                            className="button button-1">
                                            Retrieve Progress
                                        </a>
                                    </div>}
                                    {activeSection === "score" && <div className="mint">
                                        <h5 className="ex-head"> Scores </h5>

                                        <div className="mint-box">
                                            <div className="selector">
                                                <div className="coin">
                                                    <span></span>
                                                </div>
                                            </div>


                                            <div className="module-container">
                                                {Array.from({ length: 10 }, (_, index) => (
                                                    <div key={index} className="form-group module-score">
                                                        <span>Module {index + 1}</span>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Score"
                                                            className="form-control"
                                                            value={score[index] || ''}
                                                            onChange={(e) => {
                                                                const updatedScores = [...score];
                                                                updatedScores[index] = e.target.value;
                                                                setScore(updatedScores);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                        <a onClick={updateScore} className="button button-1">
                                            Update Scores
                                        </a>


                                    </div>}
                                    {activeSection === "mint" && <div className="mint">
                                        <h5 className="ex-head"> Mint </h5>

                                        <div className="mint-box">
                                            <div className="selector">

                                                <div className="coin">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="form-group">
                                                    <span >Number of tokens </span>
                                                    <input type="text"
                                                        placeholder={"0"}
                                                        className="form-control"
                                                        value={tokenNumb} onChange={(e) => setTokenNumb(e.target.value)} />
                                                </div>
                                            </div>


                                        </div>

                                        <a onClick={mintNFT}

                                            className="button button-1">
                                            mint
                                        </a>
                                    </div>}





                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="footer">
                    <div className="container">

                        <div className="row">
                            <div className="col-12 tet-center wow fadeInUp"
                                data-wow-duration="0.4s"
                                data-wow-delay="0.4s"
                            >
                                <div className="footer-bottom">
                                    <p className="text">
                                        Copyright &copy;
                                        <a
                                            href="#">aouichmed</a>
                                        <a href="#">2025</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>



        </>

    )

};


