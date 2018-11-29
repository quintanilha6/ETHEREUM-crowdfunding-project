pragma solidity ^0.4.22;

contract  Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    
    modifier restricted() {
        require(msg.sender == manager, "This is not the manager");
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution, "Value is smaller than the minimum contribution");
        approvers[msg.sender] = true;
        approversCount++;
        
    }
    
    function createRequest(string d, uint v, address r) public restricted {
        Request memory newRequest = Request({
            description: d, 
            value: v,
            recipient: r,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);  
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender], "Sender is not a contributer");
        require(!request.approvals[msg.sender], "Sender alreadr approves this request");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(!request.complete, "This request was completed already");
        require(request.approvalCount > (approversCount/2), "There are not enough approvals");
        
        request.recipient.transfer(request.value);
        
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    
}
