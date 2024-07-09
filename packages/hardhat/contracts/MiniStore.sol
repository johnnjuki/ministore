// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MiniStore {
    struct Product {
        uint256 id;
        string imageIpfsCid;
        string name;
        uint256 price;
        address owner;
    }

    // Tracks the number of products added by each user
    mapping(address => uint256) public productCount;

    // Stores the products added by each user
    mapping(address => mapping(uint256 => Product)) public products;

    // Array to store all products
    Product[] public allProducts;

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
        Product memory newProduct = Product({
            id: productId,
            imageIpfsCid: _imageIpfsCid,
            name: _name,
            price: _price,
            owner: msg.sender
        });

        products[msg.sender][productId] = newProduct;
        allProducts.push(newProduct);

        productCount[msg.sender]++;

        emit ProductAdded(msg.sender, productId, _imageIpfsCid, _name, _price);
    }

    // Gets the list of products added by a specific user
    function getProducts(
        address _owner
    ) public view returns (Product[] memory) {
        uint256 count = productCount[_owner];
        Product[] memory userProducts = new Product[](count);
        for (uint256 i = 0; i < count; i++) {
            userProducts[i] = products[_owner][i];
        }
        return userProducts;
    }

    // Gets the list of all products
    function getAllProducts() public view returns (Product[] memory) {
        return allProducts;
    }

    // Gets a specific product by owner's address and product ID
    function getProduct(
        address _owner,
        uint256 _productId
    ) public view returns (Product memory) {
        require(_productId < productCount[_owner], "Product does not exist");
        return products[_owner][_productId];
    }
}
