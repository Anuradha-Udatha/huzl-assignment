# Wallet and Escrow Backend API

This is a backend application built using NestJS that implements a **wallet system** with **escrow functionality**. The application supports **user authentication**, **fund transfers**, and **escrow management** to facilitate secure transactions.

---

## **Table of Contents**
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Wallet Endpoints](#wallet-endpoints)
  - [Escrow Endpoints](#escrow-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [License](#license)

---

## **Features**
- **User Authentication**: Signup, login with JWT token-based authentication.
- **Wallet System**: Add funds, withdraw funds, and check balance.
- **Escrow System**: Securely hold funds between users with conditions for release or refund.
- **Robust Error Handling**: Provides clear error messages and status codes.

---

## **Setup Instructions**

### **1. Clone the Repository**
Clone this repository to your local machine:
```bash
git clone https://github.com/your-username/wallet-escrow-app.git
cd wallet-escrow-app

## **2. Install Dependencies**
npm install

