import Header from "@/app/components/header";
// import ChatSection from "./components/chat-section";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
      <Header />
      {/* <ChatSection /> */}
      <h1>i am a chatbot about smart manufacturing</h1>
      <Link href="/auth/signin">
        <div className="text-blue-600 text-3xl hover:text-blue-800">
          已經有帳號
        </div>
      </Link>
      <Link href="/auth/signup">
        <div className="text-blue-600 text-xl hover:text-blue-800">
          還沒有帳號?
        </div>
      </Link>
    </main>
  );
}
