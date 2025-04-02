// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFTeacher
 * @dev This contract implements an ERC721 token for an educational progress tracker.
 * Each NFT represents an individual learner's progress in a course consisting of 10 modules.
 * The owner can mint NFTs, assign scores, mark modules as complete, and issue certifications.
 */
contract NFTeacher is ERC721, Ownable {
    /** 
     * @dev A struct representing a student's progress in the course.
     * @param numCompletedModules The number of modules completed by the student.
     * @param isCertified Whether the student has completed all the modules and received certification.
     * @param isCompleted An array tracking whether each module (1-10) is completed by the student.
     * @param moduleScores An array tracking the scores for each module (1-10).
     */
    struct Progress {
        uint256 numCompletedModules;
        bool isCertified;
        bool[10] isCompleted;
        uint256[10] moduleScores;
    }

    // Mapping from token ID to student's progress.
    mapping(uint256 => Progress) public progressData;
    // Mapping from token ID to token URI (metadata URI).
    mapping(uint256 => string) public _tokenURI;
    // Base URI for token metadata.
    string public baseURI;

    // Events to track state changes.
    event NFTMinted(address indexed owner, uint256 tokenId);
    event ModuleCompleted(uint256 indexed tokenId, uint256 moduleNum);
    event ModuleScoreUpdated(uint256 indexed tokenId, uint256 moduleNum, uint256 score);
    event TokenCertified(uint256 indexed tokenId, bool isCertified);
    event MetadataUpdated(uint256 indexed tokenId, string uri);

    // Modifier to ensure that the token exists.
    modifier tokenExists(uint256 tokenId) {
        require(_exists(tokenId), "NFT does not exist");
        _;
    }

    /**
     * @dev Constructor to initialize the contract with the name and symbol.
     */
    constructor() ERC721("NFTeacher", "EDU") {}

    /**
     * @dev Returns the progress of a student associated with a given token ID.
     * @param tokenId The ID of the token (student).
     * @return numCompletedModules The number of completed modules by the student.
     * @return isCertified Whether the student is certified.
     * @return isCompleted Array representing the completion status of each module.
     * @return moduleScores Array representing the score for each module.
     */
    function getProgress(uint256 tokenId) 
        public view returns (
            uint256 numCompletedModules,
            bool isCertified,
            bool[10] memory isCompleted,
            uint256[10] memory moduleScores
        ) 
    {
        return (
            progressData[tokenId].numCompletedModules,
            progressData[tokenId].isCertified,
            progressData[tokenId].isCompleted,
            progressData[tokenId].moduleScores
        );
    }

    /**
     * @dev Mints a new NFT to represent a student's progress.
     * @param _to The address to mint the NFT to.
     * @param _tokenId The token ID (must be between 1 and 10).
     * @param _baseURI The base URI for the token metadata.
     */
    function mintNFT(address _to, uint256 _tokenId, string memory _baseURI) public onlyOwner {
        require(_tokenId <= 10 && _tokenId >= 1, "Invalid token ID");
        require(!_exists(_tokenId), "Token already exists");

        _safeMint(_to, _tokenId);
        progressData[_tokenId] = Progress(0, false, [false, false, false, false, false, false, false, false, false, false], [uint256(0), 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        baseURI = _baseURI;

        emit NFTMinted(_to, _tokenId);
    }

    /**
     * @dev Sets the URI for a specific token ID.
     * @param _tokenId The ID of the token.
     * @param _uri The URI to be set for the token.
     */
    function setTokenURI(uint256 _tokenId, string memory _uri) public onlyOwner tokenExists(_tokenId) {
        _tokenURI[_tokenId] = string(abi.encodePacked(baseURI, _uri));
        emit MetadataUpdated(_tokenId, _tokenURI[_tokenId]);
    }

    /**
     * @dev Retrieves the URI associated with a specific token ID.
     * @param _tokenId The ID of the token.
     * @return The URI for the token.
     */
    function getTokenURI(uint256 _tokenId) public view tokenExists(_tokenId) returns (string memory) {
        return _tokenURI[_tokenId];
    }

    /**
     * @dev Marks a module as completed for the student.
     * @param _tokenId The ID of the token (student).
     * @param _moduleNum The module number to mark as completed (1-10).
     */
    function completeModule(uint256 _tokenId, uint256 _moduleNum) public onlyOwner tokenExists(_tokenId) {
        require(_moduleNum >= 1 && _moduleNum <= 10, "Invalid module number");
        require(!progressData[_tokenId].isCompleted[_moduleNum - 1], "Module already completed");

        if (progressData[_tokenId].moduleScores[_moduleNum - 1] >= 10) {
            progressData[_tokenId].isCompleted[_moduleNum - 1] = true;
            progressData[_tokenId].numCompletedModules += 1;
            emit ModuleCompleted(_tokenId, _moduleNum);
        }

        checkAndCertify(_tokenId);
    }

    /**
     * @dev Returns the completion status and score for a specific module.
     * @param _tokenId The ID of the token (student).
     * @param _moduleNum The module number (1-10).
     * @return A boolean indicating whether the module is completed and the score.
     */
    function IsCompleted(uint256 _tokenId, uint256 _moduleNum) public view tokenExists(_tokenId) returns (bool, uint256) {
        require(_moduleNum >= 1 && _moduleNum <= 10, "Invalid module number");
        return (progressData[_tokenId].isCompleted[_moduleNum - 1], progressData[_tokenId].moduleScores[_moduleNum - 1]);
    }

    /**
     * @dev Certifies the student if all modules are completed.
     * @param _tokenId The ID of the token (student).
     * @return Whether the student has been certified.
     */
    function certify(uint256 _tokenId) public onlyOwner tokenExists(_tokenId) returns (bool) {
        bool certified = (progressData[_tokenId].numCompletedModules == 10);
        progressData[_tokenId].isCertified = certified;
        emit TokenCertified(_tokenId, certified);
        return certified;
    }

    /**
     * @dev Updates the score for a specific module.
     * @param _tokenId The ID of the token (student).
     * @param _moduleNum The module number (1-10).
     * @param _score The new score (0-20).
     */
    function updateModuleScore(uint256 _tokenId, uint256 _moduleNum, uint256 _score) public onlyOwner tokenExists(_tokenId) {
        require(_moduleNum >= 1 && _moduleNum <= 10, "Invalid module number");
        require(!progressData[_tokenId].isCompleted[_moduleNum - 1], "Module already completed");
        require(_score >= 0 && _score <= 20, "Invalid score");

        progressData[_tokenId].moduleScores[_moduleNum - 1] = _score;
        emit ModuleScoreUpdated(_tokenId, _moduleNum, _score);
        completeModule(_tokenId, _moduleNum);
    }

    /**
     * @dev Checks if all modules are completed and certifies the student.
     * @param _tokenId The ID of the token (student).
     */
    function checkAndCertify(uint256 _tokenId) public onlyOwner tokenExists(_tokenId) {
        for (uint256 i = 0; i < 10; i++) {
            if (!progressData[_tokenId].isCompleted[i]) {
                return;
            }
        }
        progressData[_tokenId].isCertified = true;
        emit TokenCertified(_tokenId, true);
    }
}
