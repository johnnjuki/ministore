// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.26;

contract MiniStore {
    address public cUSDTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // constructor(address _cUSDTokenAddress) {
    //     cUSDTokenAddress = _cUSDTokenAddress;
    // }

    ERC20 cUSDToken = ERC20(cUSDTokenAddress);

    struct Product {
        uint256 id;
        string imageIpfsCid;
        string name;
        uint256 price;
        address owner;
        address[] customers;
    }

    Product[] public products;

    mapping(address => Product[]) public purchasedProducts;

    address[] public customers;

    address[] public sellers;

    // users who have connected their socials
    address[] public members;

    uint256 public payout;

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
        uint256 price
    );

    /**
     * LOYALTY PROGRAM VARIABLES
     */

    mapping(address => uint256) public customerPoints;

    uint256 public purchasePointsAwarded;

    uint256 public totalPointsAwarded;

    struct SocialWayToEarn {
        string name;
        string url;
        uint256 points;
        uint256 numberOfUsersRewarded;
        address[] usersRewarded;
    }

    SocialWayToEarn[] public socialWaysToEarn;

    event SocialWayToEarnAdded(string name, string url, uint256 points);

    event SocialWayToEarnCompleted(
        address indexed user,
        string name,
        uint256 points
    );

    struct WayToRedeem {
        string name;
        string description;
        uint256 points;
        uint256 numberOfUsersRewarded;
        address[] usersRewarded;
    }

    WayToRedeem[] public waysToRedeem;

    event WayToRedeemAdded(string name, string description, uint256 points);

    event PointsRedeemed(address indexed user, uint256 indexed wayToRedeemId);

    function addProduct(
        string memory _imageIpfsCid,
        string memory _name,
        uint256 _price
    ) public {
        uint256 productId = products.length;
        Product memory newProduct = Product({
            id: productId,
            imageIpfsCid: _imageIpfsCid,
            name: _name,
            price: _price * 10 ** 18,
            owner: msg.sender,
            customers: new address[](0)
        });

        products.push(newProduct);

        bool isSeller = false;
        for (uint256 i = 0; i < sellers.length; i++) {
            if (sellers[i] == msg.sender) {
                isSeller = true;
                break;
            }
        }

        if (!isSeller) {
            sellers.push(msg.sender);
        }

        emit ProductAdded(msg.sender, productId, _imageIpfsCid, _name, _price);
    }

    function getProducts() public view returns (Product[] memory) {
        return products;
    }

    function getProduct(
        uint256 _productId
    ) public view returns (Product memory) {
        require(_productId < products.length, "Product does not exist");
        return products[_productId];
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
            _owners.length == _points.length,
            "Owners and points length mismatch"
        );

        for (uint256 i = 0; i < _productIds.length; i++) {
            Product storage product = products[_productIds[i]];
            require(product.id == _productIds[i], "Product does not exist");

            payout += product.price;

            product.customers.push(msg.sender);
            purchasedProducts[msg.sender].push(product);

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

            // Award points
            uint256 points = _points[i];
            customerPoints[msg.sender] += points;
            purchasePointsAwarded += points;
            totalPointsAwarded += points;

            emit ProductPurchased(
                msg.sender,
                _owners[i],
                _productIds[i],
                product.price
            );
        }
    }

    function getPurchasedProducts(
        address _customer
    ) public view returns (Product[] memory) {
        return purchasedProducts[_customer];
    }

    function processPayout(
        address _seller,
        uint256 _amount
    ) public returns (bool) {
        require(_amount > 0, "Amount must be greater than 0");

        bool isPayoutProcessed = false;
        for (uint256 i = 0; i < sellers.length; i++) {
            if (sellers[i] == _seller) {
                require(
                    cUSDToken.transfer(_seller, _amount),
                    "Failed to process payout"
                );

                payout -= _amount;

                isPayoutProcessed = true;
                break;
            }
        }

        return isPayoutProcessed;
    }

    function getPayout() public view returns (uint256) {
        return payout;
    }

    function addMember() public {
        bool isMember = false;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }

        if (!isMember) {
            customerPoints[msg.sender] += 500;
            members.push(msg.sender);
        }
    }

    function getMembers() public view returns (address[] memory) {
        return members;
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

    function getCustomers() external view returns (uint256) {
        return customers.length;
    }

    function getPurchasePointsAndCustomers()
        external
        view
        returns (uint256[2] memory)
    {
        return [purchasePointsAwarded, customers.length];
    }

    /**
     * SOCIAL EARNING FUNCTIONS
     */

    function addSocialWayToEarn(
        string memory _name,
        string memory _url,
        uint256 _points
    ) public {
        SocialWayToEarn memory newSocialWayToEarn = SocialWayToEarn({
            name: _name,
            url: _url,
            points: _points,
            numberOfUsersRewarded: 0,
            usersRewarded: new address[](0)
        });

        socialWaysToEarn.push(newSocialWayToEarn);

        emit SocialWayToEarnAdded(_name, _url, _points);
    }

    function getSocialWaysToEarn()
        public
        view
        returns (SocialWayToEarn[] memory)
    {
        return socialWaysToEarn;
    }

    function completeSocialWayToEarn(uint256 _socialWayToEarnId) public {
        require(
            _socialWayToEarnId < socialWaysToEarn.length,
            "Social way to earn does not exist"
        );

        SocialWayToEarn storage socialWayToEarn = socialWaysToEarn[
            _socialWayToEarnId
        ];

        socialWayToEarn.numberOfUsersRewarded++;
        socialWayToEarn.usersRewarded.push(msg.sender);
        customerPoints[msg.sender] += socialWayToEarn.points;
        totalPointsAwarded += socialWayToEarn.points;

        emit SocialWayToEarnCompleted(
            msg.sender,
            socialWayToEarn.name,
            socialWayToEarn.points
        );
    }

    /**
     * REDEEMING FUNCTIONS
     */

    function addWayToRedeem(
        string memory _name,
        string memory _description,
        uint256 _points
    ) public {
        WayToRedeem memory newWayToRedeem = WayToRedeem({
            name: _name,
            description: _description,
            points: _points,
            numberOfUsersRewarded: 0,
            usersRewarded: new address[](0)
        });

        waysToRedeem.push(newWayToRedeem);

        emit WayToRedeemAdded(_name, _description, _points);
    }

    function getWaysToRedeem() public view returns (WayToRedeem[] memory) {
        return waysToRedeem;
    }

    function redeemPoints(uint256 _wayToRedeemId) public {
        require(
            _wayToRedeemId < waysToRedeem.length,
            "Way to redeem does not exist"
        );
        WayToRedeem storage wayToRedeem = waysToRedeem[_wayToRedeemId];

        require(customerPoints[msg.sender] > 0, "Not enough points to redeem");

        wayToRedeem.usersRewarded.push(msg.sender);
        wayToRedeem.numberOfUsersRewarded++;
        customerPoints[msg.sender] -= wayToRedeem.points;

        emit PointsRedeemed(msg.sender, _wayToRedeemId);
    }
}

interface ERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}
