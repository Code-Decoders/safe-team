
# SafeTeam

![Logo](https://i.imgur.com/TSh8KKs.png)
> SafeTeam is a secure and user-friendly platform for managing cryptocurrency wallets.
> It eliminates the need for trust by using a multi-sig wallet and account abstraction.
> SafeTeam leverages the power of the Safe Core SDK to provide a solution for the problem of lost private keys and unsecure EOA wallets.
> By using SafeTeam, you can secure your cryptocurrency funds and have peace of mind knowing that your private keys are safe and accessible.

## Inspiration

> Safe{Team} isn't just another project. It's the culmination of our shared experiences, sleepless nights, and relentless pursuit of excellence. It's our vision of what treasury and asset management in the Web3 world should look like - innovative, intuitive, secure, and heck, even fun!

> The crown jewel of our project, developed during this hackathon, is our implementation of crosschain transfers using Axelar GMP. With this feature, protocols across multiple blockchains can transfer funds to the winning teams on the chain of their choice - be it Filecoin, Ethereum, or any other. Safe{Team} takes care of all the bridging and transferring in the backend, allowing sponsors to send prizes seamlessly, and recipients to enjoy the convenience of receiving funds directly on their preferred blockchain.
 
## Features

- Multi-signature wallet functionality for enhanced security.
- User-friendly interface for easy use.
- 2FA using SocialConnect
- View your soulnames in the dashboard
- Cross-Chain Transfers using Axelar.
- Decnetralized Database using Polybase
- Stream money evenly between all memebers using SuperFluid.
- Gas-Less Transactions using Gelato Relayer via Relay Kit.
- Sign In using socials using Web3Auth via Auth Kit.
- Add funds using your Credit-Card using the Stripe SDK via On-Ramp kit.
- Integration with the Safe Core SDK for improved account abstraction.
- Support for various cryptocurrencies, including Ether and ERC-20 tokens.
- Every team member needs to approve the transaction in order for it to execute.
- Transaction history and notification system for easy tracking of funds.
- Gnosis Multi Send transactions implemented. 

## Demo

Live Website (https://safeteam-bwc.netlify.app/)

Youtube Video Demo

[![Youtube Video](https://img.youtube.com/vi/87M7Y3jMxfA/sddefault.jpg)](https://youtu.be/87M7Y3jMxfA)



## Tech Stack

**Frontend:** Masa SDK, NEXT.JS, ethers.js, Web3Auth, Axelar SDK, Polybase Client SDK

**Backend:** Social Connect Protocol, PolyBase, Safe Core SDK, Gelato, Celo Testnet, Stripe SDK

## Roadmap

- [x]  Social Logins
- [x]  Gasless Transactions
- [x]  Add funds using Credit Card
- [x]  Split Funds evenly on one click
- [x]  **OnChain 2FA Authentication System**
- [x]  Multi Chain support using Axelar
- [ ]  Option to stake funds
- [ ]  Gasless Creation of Safes
- [ ]  Pitch the product to various Hackathon Platforms

## Run Locally

Clone the project

```bash
  git clone https://github.com/Code-Decoders/safe-team
```

Change the branch to axelar-bridge

```bash
  git checkout celo
```

Go to the project directory

```bash
  cd safe-team
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```


## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes 
    ```sh
    git commit -m 'Add some AmazingFeature'
    ```
4. Push to the Branch 
   ```sh
    git push origin feature/AmazingFeature
    ```
6. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.md` for more information.
    
## Feedback & Contact

If you have any feedback or contact, please reach out to us at info@codedecoders.io


## Authors

- [@Maadhav](https://www.github.com/Maadhav)
