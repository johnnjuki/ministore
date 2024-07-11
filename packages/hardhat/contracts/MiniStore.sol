// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import {ERC20} from "./MiniStoreInterfaces.sol";

contract MiniStore {
    address public cUSDTokenAddress;

    constructor(address _cUSDTokenAddress) {
        cUSDTokenAddress = _cUSDTokenAddress;
    }

    struct Product {
        uint256 id;
        string imageIpfsCid;
        string name;
        uint256 price;
        address owner;
        address[] customers;
    }

    // Tracks the number of products added by each user
    mapping(address => uint256) public productCount;

    // Stores the products added by each user
    mapping(address => mapping(uint256 => Product)) public products;

    // Array to store all products
    Product[] public allProducts;

    // Mapping to track purchased products by each customer
    mapping(address => Product[]) public purchasedProducts;

    /**
     * LOYALTY PROGRAM
     */

    // Mapping to store points for each customer
    mapping(address => uint256) public customerPoints;

    // Total number of points awarded
    uint256 public totalPointsAwarded;

    // List of all customers who have points
    // Change to customers who have purchased
    address[] public customers;

    event ProductAdded(
        address indexed owner,
        uint256 productId,
        string imageIpfsCid,
        string name,
        uint256 price
    );

    event ProductPurchased(
        address indexed customer,
        address indexed seller,
        uint256 productId,
        uint256 price,
        uint256 points
    );

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
            owner: msg.sender,
            customers: new address[](0)
        });

        products[msg.sender][productId] = newProduct;
        allProducts.push(newProduct);

        productCount[msg.sender]++;

        emit ProductAdded(msg.sender, productId, _imageIpfsCid, _name, _price);
    }

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

    function getAllProducts() public view returns (Product[] memory) {
        return allProducts;
    }

    function getProduct(
        address _owner,
        uint256 _productId
    ) public view returns (Product memory) {
        require(_productId < productCount[_owner], "Product does not exist");
        return products[_owner][_productId];
    }

    function purchaseProducts(
        address[] memory _owners,
        uint256[] memory _productIds,
        uint256[] memory _points
    ) public {
        require(
            _owners.length == _productIds.length,
            "Owners and product IDs length mismatch"
        );
        require(
            _productIds.length == _points.length,
            "Product IDs and points length mismatch"
        );

        ERC20 cUSDToken = ERC20(cUSDTokenAddress);
        uint256 totalCost = 0;

        for (uint256 i = 0; i < _productIds.length; i++) {
            Product storage product = products[_owners[i]][_productIds[i]];
            require(product.id == _productIds[i], "Product does not exist");
            totalCost += product.price;
        }

        require(
            cUSDToken.transferFrom(
                msg.sender,
                address(this),
                totalCost / (10 ** cUSDToken.decimals())
            ),
            "Token transfer failed"
        );

        for (uint256 i = 0; i < _productIds.length; i++) {
            Product storage product = products[_owners[i]][_productIds[i]];
            require(
                cUSDToken.transfer(
                    product.owner,
                    product.price / (10 ** cUSDToken.decimals())
                ),
                "Token transfer to owner failed"
            );
            product.customers.push(msg.sender);
            purchasedProducts[msg.sender].push(product);

            // Award points
            uint256 points = _points[i];
            customerPoints[msg.sender] += points;
            totalPointsAwarded += points;

            // Add customer to list if they're a new customer
            bool isCustomer = false;
            for (uint256 j = 0; j < customers.length; j++) {
                if (customers[j] == msg.sender) {
                    isCustomer = true;
                    break;
                }
            }

            if (!isCustomer) {
                customers.push(msg.sender);
            }

            emit ProductPurchased(
                msg.sender,
                _owners[i],
                _productIds[i],
                product.price,
                points
            );
        }
    }

    function getPurchasedProducts(
        address _customer
    ) public view returns (Product[] memory) {
        return purchasedProducts[_customer];
    }

    /**
     * LOYALTY PROGRAM FUNCTIONS
     */

    function getCustomerPoints(
        address _customer
    ) external view returns (uint256) {
        return customerPoints[_customer];
    }

    function getTotalPointsAwarded() external view returns (uint256) {
        return totalPointsAwarded;
    }

    function getNumberOfCustomersWithPoints() external view returns (uint256) {
        return customers.length;
    }

    function getPointsAndCustomers() external view returns (uint256[2] memory) {
        return [totalPointsAwarded, customers.length];
    }
}
