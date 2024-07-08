// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MiniStore {
    struct Product {
        uint256 id;
        string imageIpfsCid;
        string name;
        uint256 price;
    }

    // Tracks the number of products added by each user
    mapping(address => uint256) public productCount;

    // Stores the products added by each user
    mapping(address => mapping(uint256 => Product)) public products;

    event ProductAdded(
        address indexed owner,
        uint256 productId,
        string imageIpfsCid,
        string name,
        uint256 price
    );

    // Adds a new product
    function addProduct(
        string memory _imageIpfsCid,
        string memory _name,
        uint256 _price
    ) public {
        uint256 productId = productCount[msg.sender];
        products[msg.sender][productId] = Product({
            id: productId,
            imageIpfsCid: _imageIpfsCid,
            name: _name,
            price: _price
        });

        productCount[msg.sender]++;

        emit ProductAdded(msg.sender, productId, _imageIpfsCid, _name, _price);
    }

    // Gets the list of products they've added
    function getProductsByOwner(
        address _owner
    ) public view returns (Product[] memory) {
        uint256 count = productCount[_owner];
        Product[] memory userProducts = new Product[](count);
        for (uint256 i = 0; i < count; i++) {
            userProducts[i] = products[_owner][i];
        }
        return userProducts;
    }
}
