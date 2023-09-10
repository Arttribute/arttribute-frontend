"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const rootURL = "http://localhost:5000";
import { Button } from "@/components/ui/button";

const rootURL = "http://localhost:5000";

export default function Home() {
  async function signMessage() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const message = "Hello world";
    const signature = await signer.signMessage(message);
    //post to server
    const response = await fetch(`${rootURL}/v1/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, message, signature }),
    });
    const data = await response.json();
    console.log(data);
  }

  async function createUser() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const message = "Create user";
    const userName = "Baranaba";
    const signature = await signer.signMessage(message);
    //post to server
    const response = await fetch(`${rootURL}/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, message, signature, name: userName }),
    });
    const data = await response.json();
    console.log(data);
  }

  async function makePayment() {
    //should prompt user to pay to given address and return transaction hash
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const accounts = await provider.listAccounts();

    // Set up the payment details
    const receiverAddress = "0x362aF015FD7A4917CAaf0955b3b5042c9220e61F"; // Replace with the receiver's Ethereum address
    const amountToSend = ethers.parseEther("0.01"); // Convert to wei value

    // Create and send the transaction
    const transaction = {
      to: receiverAddress,
      value: amountToSend,
    };

    const tx = await signer.sendTransaction(transaction);
    console.log("Transaction hash:", tx.hash);
  }

  async function mintCertificate() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const message = "Mint certificate";
    const signature = await signer.signMessage(message);
    console.log(signature);
  }

  return (
    <main className={styles.main}>
      <Button onClick={signMessage}>Sign Message</Button>
      <Button onClick={createUser}>Create User</Button>
      <Button onClick={makePayment}> Make payment</Button>
      <Button onClick={mintCertificate}> mintCertificate </Button>
    </main>
  );
}
