"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import ky from "ky";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { HiOutlineClipboard } from "react-icons/hi2";
import Cookie from "js-cookie";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

const apiURL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

const GenerateAPIKeySchema = z.object({
  projectId: z.string().uuid().min(1),
  // description: z.string().optional(),
  // startAt: z.date().optional(),
  // location: z.string().optional(),
});

export default function Home() {
  async function signMessage() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const api = ky.extend({ prefixUrl: apiURL });
    const { message } = await api
      .post("v1/auth/request", {
        json: {
          address,
        },
      })
      .json<{ message: string }>();
    const signature = await signer.signMessage(message);
    //post to server
    const data = await api
      .post("v1/auth", {
        json: { address, message, signature },
      })
      .json<{ token: string }>();

    Cookie.set("accessToken", data.token);

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
    const data = await ky
      .post("v1/users", {
        json: { address, message, signature, name: userName },
        prefixUrl: apiURL,
      })
      .json();
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

  const form = useForm<z.infer<typeof GenerateAPIKeySchema>>({
    resolver: zodResolver(GenerateAPIKeySchema),
    // defaultValues,
    defaultValues: { projectId: "" },
  });

  const [apiKey, setApiKey] = useState("");

  const onReset = useCallback(() => {}, []);
  const onSubmit = useCallback(
    (values: z.infer<typeof GenerateAPIKeySchema>) => {
      const { projectId } = values;
      ky.post(`v1/auth/api-key/${projectId}`, {
        // credentials: "include",
        prefixUrl: apiURL,
        headers: { Authorization: `Bearer ${Cookie.get("accessToken")}` },
      })
        .json<{ apiKey: string }>()
        .then(({ apiKey }) => {
          setApiKey(apiKey);
        });
    },
    []
  );

  return (
    <>
      <main
        className={cn(
          "grid h-screen w-screen overflow-hidden lg:grid-cols-[4rem_1fr] lg:grid-rows-[4rem_1fr]"
          // styles.main
        )}
      >
        <div className="col-span-1 col-start-2 row-start-2 p-6">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
                <div className="grid grid-cols-[40%_60%] p-8">
                  <div>
                    <FormLabel>Authentication</FormLabel>
                  </div>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">
                            Project
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Project ID"
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        API Key
                      </FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input
                            // placeholder="Event name"
                            disabled
                            className="disabled:cursor-default"
                            value={apiKey}
                          />
                        </FormControl>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey).then(() =>
                              toast({
                                description: "Copied to Clipboard!",
                              })
                            );
                          }}
                        >
                          <HiOutlineClipboard className="mr-2 h-4 w-4" />
                          <span>Copy</span>
                        </Button>
                      </div>
                      {/* <FormDescription>
					This is your public display name.
				</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end px-8 py-4 space-x-2">
                  {/* <Button type="reset" variant="secondary">
                  Cancel
                </Button> */}
                  <Button type="submit">Generate</Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
        <div className="flex col-span-1 col-start-2 row-span-1 row-start-1 justify-end items-center gap-2 px-6">
          {/* 
			  I think these two should basically happen at the same time
			  Like when someone connects their wallet,
			  auth service would create a default user or
			  the user would go through a flow to add details
			  */}
          <Button onClick={signMessage}>Connect Wallet</Button>
          <Button onClick={createUser}>Create User</Button>
          <Button onClick={makePayment}> Make payment</Button>
          <Button onClick={mintCertificate}> mintCertificate </Button>
        </div>
        <div className="col-span-1 col-start-1 row-span-2 row-start-1"></div>
      </main>
      <Toaster />
    </>
  );
}
