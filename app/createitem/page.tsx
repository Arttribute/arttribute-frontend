"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  title: string;
  description: string;
  url: string;
  tags: string[];
  author: string;
  source: string;
  price: { amount: number; currency: string };
  license: string[];
  needsRequest: boolean;
  file: File | null;
}

const CreateItem = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    url: "",
    tags: [],
    author: "",
    source: "",
    price: { amount: 0, currency: "" },
    license: [],
    needsRequest: false,
    file: null,
  });

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle tags input changes
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      tags: value.split(",").map((tag) => tag.trim()), // Assuming tags are comma-separated
    });
  };

  // Handle price input changes
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      price: {
        ...formData.price,
        [name]: value,
      },
    });
  };

  // Handle license input changes
  const handleLicenseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      license: value.split(",").map((license) => license.trim()), // Assuming licenses are comma-separated
    });
  };

  // Handle needsRequest checkbox change
  const handleNeedsRequestChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      needsRequest: checked,
    });
  };

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fData = new FormData();
    if (formData.file) {
      fData.append("file", formData.file, formData.file.name);
    }
    fData.append("title", formData.title);
    fData.append("description", formData.description);
    for (var i = 0; i < formData.tags.length; i++) {
      fData.append("tags[]", formData.tags[i]);
    }
    fData.append("author", formData.author);
    fData.append("source", formData.source);
    fData.append("price_amount", formData.price.amount.toString());
    fData.append("price_currency", formData.price.currency);
    for (var i = 0; i < formData.license.length; i++) {
      fData.append("license[]", formData.license[i]);
    }
    fData.append("needsRequest", formData.needsRequest.toString());

    // for (let [key, value] of Array.from(fData)) {
    //   console.log(`${key}: ${value}`);
    // }
    const res = await fetch("http://localhost:5000/v1/items", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIweDA0NzdlMGNlM2Y5N2NjMDMzODE1NTgxYzQwNGMzMDM5MjE1MTdiZDhiZjlkZjMyYWIxMjlmMzMyY2E3MWJkMTFjYzU0MTNhMGUxNTE1MWYwYzdhZmYwZjI3ZDA5ODIxNGNmZWU5NTc0MjZlZTg5ZGVmYWYxNzI4ZTk0OTkzYTk3OTciLCJ3YWxsZXRfYWRkcmVzcyI6IjB4ODc0ODNDOTc3REFCY0IwMTcyMjY5ZjM0NkQyNTk3RGM0NDNmMEU2YiIsImlhdCI6MTY5NDYyNjA2MiwiZXhwIjoxNjk0NzEyNDYyfQ.jKXJWBTeBnobAB8WqtCRTaxZAn20Ack9xT2FyqvxIQ0",
        ProjectAuthorization: "Bearer 17eoF8wkSIiCrcGFArlpfg==",
      },
      body: fData,
    }).then((res) => res.json());

    console.log(res);
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            className="border"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            className="border"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            className="border"
            value={formData.url}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="border"
            value={formData.tags.join(", ")}
            onChange={handleTagsChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            className="border"
            value={formData.author}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            name="source"
            className="border"
            value={formData.source}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="priceAmount">Price Amount:</label>
          <input
            type="number"
            id="priceAmount"
            name="amount"
            className="border"
            value={formData.price.amount}
            onChange={handlePriceChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="priceCurrency">Price Currency:</label>
          <input
            type="text"
            id="priceCurrency"
            name="currency"
            className="border"
            value={formData.price.currency}
            onChange={handlePriceChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="licenses">Licenses (comma-separated):</label>
          <input
            type="text"
            id="licenses"
            name="licenses"
            className="border"
            value={formData.license.join(", ")}
            onChange={handleLicenseChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="needsRequest">Needs Request:</label>
          <input
            type="checkbox"
            id="needsRequest"
            name="needsRequest"
            className="border"
            checked={formData.needsRequest}
            onChange={handleNeedsRequestChange}
          />
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="file">File:</label>
          <input
            type="file"
            id="file"
            name="file"
            className="border"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </main>
  );
};

export default CreateItem;

// const createdItem = await this.itemCollection.create([
//     id,
//     createItem.title,
//     createItem.description,
//     createItem.url,
//     createItem.tags,
//     createItem.author,
//     this.db.collection('User').record(userId),
//     createItem.source,
//     createItem.license.join(''),
//     createItem.license.map((license_id) =>
//       LicenseCollection.record(license_id),
//     ),
//     createItem.price?.amount || 0,
//     createItem.price?.currency || 'none',
//     createItem.needsRequest,
//     current_time,
//     current_time,
//   ]);
//   return createdItem;
// }
