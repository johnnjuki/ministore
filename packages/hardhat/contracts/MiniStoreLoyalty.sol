// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MiniStoreLoyalty {
    mapping(address => uint256) public pointsBalance;
    address[] public customers;
    uint256 public totalPointsAwarded;

    event PointsAwarded(address indexed customer, uint256 points);

    function awardPoints(address _customer, uint256 _points) external {
        if (pointsBalance[_customer] == 0) {
            customers.push(_customer);
        }
        pointsBalance[_customer] += _points;
        totalPointsAwarded += _points;
        emit PointsAwarded(_customer, _points);
    }

    function getPointsBalance(address _customer) external view returns (uint256) {
        return pointsBalance[_customer];
    }

    function getTotalPointsAwarded() external view returns (uint256) {
        return totalPointsAwarded;
    }

    function getCustomerCount() external view returns (uint256) {
        return customers.length;
    }
}
