"use client";
import TXTUploader from "@/app/ui/TXT/txtupload";
import TXTChatComponent from "@/app/ui/TXT/txtchat";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <>
      <div className="flex background-gradient min-h-screen justify-evenly">
        <div className="w-9/12">
          <TXTChatComponent />
        </div>
        <TXTUploader />
      </div>
    </>
  );
}
