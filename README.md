# MiniStore

A web3 online store deployed on the Celo blockchain, featuring a loyalty program that attracts and retains customers.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup](#setup)
5. [Usage](#usage)


## Overview

MiniStore offers a user-friendly online shopping experience, store management, and loyalty management. It has an admin dashboard which provides comprehensive store management, where the admin can add products, see and withdraw the revenue the store has made, and launch loyalty programs. For the loyalty feature, customers are rewarded for various actions such as placing orders, engaging with the store brand on their socials, connecting their socials/creating an account, and through referrals. Rewards include coupons, discounts, free shipping, and many more. 

## Technology Stack

### Backend
- **Solidity**
- **Hardhat**
- **JavaScript & TypeScript**

### Frontend
- **React**
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**
- **Viem & Wagmi**: Libraries for smart contract interaction

### Storage
- **Pinata**: IPFS product images management

## Setup

To set up MiniStore, follow these steps:

1. Clone the repository: `git clone https://github.com/johnnjuki/ministore.git`
2. Install dependencies: `npm install` in both `packages/hardhat` and `packages/react-app`
3. In the hardhat directory, run `npx hardhat run scripts/deploy.ts --network alfajores` to deploy to Celo testnet and `--network celo` to deploy to Celo mainnet.
4. Set up the environment variables: Create a `.env` file in the root hardhat and react-app directories and refer to the `.env.example` files for the required variables.
4. Start the development server in react-app directory: `npm run dev`

## Usage

To use MiniStore, you can check the [demo](https://youtu.be/xe3Q8-jbXe8) or follow these steps:

1. Visit the admin dashboard: Navigate to `http://localhost:3000/admin`.
2. Manage products: Add products from the admin dashboard.
3. Place an order on the store.
3. View and withdraw the revenue generated by the store in the admin dashboard.
5. Launch loyalty programs: Create and manage loyalty programs to reward customers for various actions.


## Roadmap

**Comprehensive e-commerce builder for businesses:**

The most significant addition to our roadmap is transforming
MiniStore into a comprehensive e-commerce builder app on
MiniPay. 
This will empower MiniPay users to establish their own online
stores seamlessly, leveraging the robust features and
functionalities of MiniStore. 

**Loyalty Programs:**

Adding more ways MiniPay users can reward their most loyal customers.
One way already implemented, but working on embedding it to the MiniStore app, is tracking the most active customer and distributing rewards. This implementation uses Olas and SubQuery, and you can find the SubQuery indexer [here](https://github.com/johnnjuki/ministore-subquery).