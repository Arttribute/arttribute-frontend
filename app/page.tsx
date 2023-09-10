"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useState } from "react";
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

  return (
    <main className={styles.main}>
      <Button onClick={signMessage}>Sign Message</Button>
      <Button onClick={createUser}>Create User</Button>
    </main>
  );
}
