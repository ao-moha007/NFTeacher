

## NFTeacher

_This contract implements an ERC721 token for an educational progress tracker.
Each NFT represents an individual learner's progress in a course consisting of 10 modules.
The owner can mint NFTs, assign scores, mark modules as complete, and issue certifications._

### Contract
NFTeacher : contracts/NFT/NFTeach.sol

This contract implements an ERC721 token for an educational progress tracker.
Each NFT represents an individual learner's progress in a course consisting of 10 modules.
The owner can mint NFTs, assign scores, mark modules as complete, and issue certifications.

 --- 
### Modifiers:
### tokenExists

```solidity
modifier tokenExists(uint256 tokenId)
```

 --- 
### Functions:
### constructor

```solidity
constructor() public
```

_Constructor to initialize the contract with the name and symbol._

### getProgress

```solidity
function getProgress(uint256 tokenId) public view returns (uint256 numCompletedModules, bool isCertified, bool[10] isCompleted, uint256[10] moduleScores)
```

_Returns the progress of a student associated with a given token ID._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token (student). |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| numCompletedModules | uint256 | The number of completed modules by the student. |
| isCertified | bool | Whether the student is certified. |
| isCompleted | bool[10] | Array representing the completion status of each module. |
| moduleScores | uint256[10] | Array representing the score for each module. |

### mintNFT

```solidity
function mintNFT(address _to, uint256 _tokenId, string _baseURI) public
```

_Mints a new NFT to represent a student's progress._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address | The address to mint the NFT to. |
| _tokenId | uint256 | The token ID (must be between 1 and 10). |
| _baseURI | string | The base URI for the token metadata. |

### setTokenURI

```solidity
function setTokenURI(uint256 _tokenId, string _uri) public
```

_Sets the URI for a specific token ID._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token. |
| _uri | string | The URI to be set for the token. |

### getTokenURI

```solidity
function getTokenURI(uint256 _tokenId) public view returns (string)
```

_Retrieves the URI associated with a specific token ID._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The URI for the token. |

### completeModule

```solidity
function completeModule(uint256 _tokenId, uint256 _moduleNum) public
```

_Marks a module as completed for the student._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token (student). |
| _moduleNum | uint256 | The module number to mark as completed (1-10). |

### IsCompleted

```solidity
function IsCompleted(uint256 _tokenId, uint256 _moduleNum) public view returns (bool, uint256)
```

_Returns the completion status and score for a specific module._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token (student). |
| _moduleNum | uint256 | The module number (1-10). |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean indicating whether the module is completed and the score. |
| [1] | uint256 |  |

### certify

```solidity
function certify(uint256 _tokenId) public returns (bool)
```

_Certifies the student if all modules are completed._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token (student). |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Whether the student has been certified. |

### updateModuleScore

```solidity
function updateModuleScore(uint256 _tokenId, uint256 _moduleNum, uint256 _score) public
```

_Updates the score for a specific module._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token (student). |
| _moduleNum | uint256 | The module number (1-10). |
| _score | uint256 | The new score (0-20). |

### checkAndCertify

```solidity
function checkAndCertify(uint256 _tokenId) public
```

_Checks if all modules are completed and certifies the student._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The ID of the token (student). |

inherits Ownable:
### owner

```solidity
function owner() public view virtual returns (address)
```

_Returns the address of the current owner._

### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

_Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner._

### transferOwnership

```solidity
function transferOwnership(address newOwner) public virtual
```

_Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner._

inherits ERC721:
### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

### balanceOf

```solidity
function balanceOf(address owner) public view virtual returns (uint256)
```

_See {IERC721-balanceOf}._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) public view virtual returns (address)
```

_See {IERC721-ownerOf}._

### name

```solidity
function name() public view virtual returns (string)
```

_See {IERC721Metadata-name}._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_See {IERC721Metadata-symbol}._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

_See {IERC721Metadata-tokenURI}._

### _baseURI

```solidity
function _baseURI() internal view virtual returns (string)
```

_Base URI for computing {tokenURI}. If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, can be overriden in child contracts._

### approve

```solidity
function approve(address to, uint256 tokenId) public virtual
```

_See {IERC721-approve}._

### getApproved

```solidity
function getApproved(uint256 tokenId) public view virtual returns (address)
```

_See {IERC721-getApproved}._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

_See {IERC721-setApprovalForAll}._

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool)
```

_See {IERC721-isApprovedForAll}._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public virtual
```

_See {IERC721-transferFrom}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public virtual
```

_See {IERC721-safeTransferFrom}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) public virtual
```

_See {IERC721-safeTransferFrom}._

### _safeTransfer

```solidity
function _safeTransfer(address from, address to, uint256 tokenId, bytes _data) internal virtual
```

_Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
are aware of the ERC721 protocol to prevent tokens from being forever locked.

`_data` is additional data, it has no specified format and it is sent in call to `to`.

This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
implement alternative mechanisms to perform token transfer, such as signature-based.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### _exists

```solidity
function _exists(uint256 tokenId) internal view virtual returns (bool)
```

_Returns whether `tokenId` exists.

Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.

Tokens start existing when they are minted (`_mint`),
and stop existing when they are burned (`_burn`)._

### _isApprovedOrOwner

```solidity
function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool)
```

_Returns whether `spender` is allowed to manage `tokenId`.

Requirements:

- `tokenId` must exist._

### _safeMint

```solidity
function _safeMint(address to, uint256 tokenId) internal virtual
```

_Safely mints `tokenId` and transfers it to `to`.

Requirements:

- `tokenId` must not exist.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.

Emits a {Transfer} event._

### _safeMint

```solidity
function _safeMint(address to, uint256 tokenId, bytes _data) internal virtual
```

_Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
forwarded in {IERC721Receiver-onERC721Received} to contract recipients._

### _mint

```solidity
function _mint(address to, uint256 tokenId) internal virtual
```

_Mints `tokenId` and transfers it to `to`.

WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible

Requirements:

- `tokenId` must not exist.
- `to` cannot be the zero address.

Emits a {Transfer} event._

### _burn

```solidity
function _burn(uint256 tokenId) internal virtual
```

_Destroys `tokenId`.
The approval is cleared when the token is burned.

Requirements:

- `tokenId` must exist.

Emits a {Transfer} event._

### _transfer

```solidity
function _transfer(address from, address to, uint256 tokenId) internal virtual
```

_Transfers `tokenId` from `from` to `to`.
 As opposed to {transferFrom}, this imposes no restrictions on msg.sender.

Requirements:

- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.

Emits a {Transfer} event._

### _approve

```solidity
function _approve(address to, uint256 tokenId) internal virtual
```

_Approve `to` to operate on `tokenId`

Emits a {Approval} event._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual
```

_Hook that is called before any token transfer. This includes minting
and burning.

Calling conditions:

- When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, ``from``'s `tokenId` will be burned.
- `from` and `to` are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

inherits IERC721Metadata:
inherits IERC721:
inherits ERC165:
inherits IERC165:

 --- 
### Events:
### NFTMinted

```solidity
event NFTMinted(address owner, uint256 tokenId)
```

### ModuleCompleted

```solidity
event ModuleCompleted(uint256 tokenId, uint256 moduleNum)
```

### ModuleScoreUpdated

```solidity
event ModuleScoreUpdated(uint256 tokenId, uint256 moduleNum, uint256 score)
```

### TokenCertified

```solidity
event TokenCertified(uint256 tokenId, bool isCertified)
```

### MetadataUpdated

```solidity
event MetadataUpdated(uint256 tokenId, string uri)
```

inherits Ownable:
### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

inherits ERC721:
inherits IERC721Metadata:
inherits IERC721:
### Transfer

```solidity
event Transfer(address from, address to, uint256 tokenId)
```

_Emitted when `tokenId` token is transferred from `from` to `to`._

### Approval

```solidity
event Approval(address owner, address approved, uint256 tokenId)
```

_Emitted when `owner` enables `approved` to manage the `tokenId` token._

### ApprovalForAll

```solidity
event ApprovalForAll(address owner, address operator, bool approved)
```

_Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets._

inherits ERC165:
inherits IERC165:

