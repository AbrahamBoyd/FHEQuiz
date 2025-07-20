// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

type ebool is bytes32;

contract FHEQuiz {
    bytes32 public correctEncrypted;

    mapping(address => ebool) public result;
    mapping(address => bool) public submitted;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setCorrectAnswer(bytes calldata encrypted) external onlyOwner {
        correctEncrypted = bytes32(encrypted);
    }

    function submitAnswer(bytes calldata encrypted) external {
        require(!submitted[msg.sender], "Already answered");

        // Сравнение по байтам
        bool isCorrect = keccak256(encrypted) == keccak256(abi.encodePacked(correctEncrypted));

        result[msg.sender] = isCorrect ? ebool.wrap(bytes32(uint256(1))) : ebool.wrap(bytes32(uint256(0)));
        submitted[msg.sender] = true;
    }

    function getResult() external view returns (ebool) {
        require(submitted[msg.sender], "No submission");
        return result[msg.sender];
    }

    function resetAnswer() external {
        submitted[msg.sender] = false;
        result[msg.sender] = ebool.wrap(bytes32(0));
    }

    function resetCorrect() external onlyOwner {
        correctEncrypted = bytes32(0);
    }
}
