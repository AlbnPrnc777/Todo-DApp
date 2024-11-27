const hre = require("hardhat");

const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory('TaskContract');
    
    const contract = await contractFactory.deploy();
    
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();

    console.log("Contract deployed to:", contractAddress);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();
