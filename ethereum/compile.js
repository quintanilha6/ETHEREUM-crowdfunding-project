const path = require("path"); //nodejs ’path’ module
const solc = require("solc"); //solidity compiler module
const fs = require("fs-extra"); //file system module

// Feth path of build
const buildPath = path.resolve(__dirname, "build");
const contractspath = path.resolve(__dirname, "contracts");

// Removes folder build and every file in it
fs.removeSync(buildPath);

// Fetch all Contract files in Contracts folder
const fileNames = fs.readdirSync(contractspath);

// Gets ABI of all contracts into variable input
const input = fileNames.reduce(
  (input, fileName) => {
    const filePath = path.resolve(__dirname, "contracts", fileName);
    const source = fs.readFileSync(filePath, "utf8");
    return { sources: { ...input.sources, [fileName]: source } };
  },
  { sources: {} }
);

// Compile all contracts
const output = solc.compile(input, 1).contracts;

// Re-Create build folder for output files from each contract
fs.ensureDirSync(buildPath);

// Output contains all objects from all contracts
// Write the contents of each to different files
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.split(":")[1] + ".json"),
    output[contract]
  );
}
