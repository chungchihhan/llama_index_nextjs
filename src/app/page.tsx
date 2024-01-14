import Header from "@/app/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
      {/* <Header /> */}
      <h1 className="text-5xl font-bold text-gray-800">ISDM chatbot</h1>
      <h1 className="text-mg font-bold text-gray-800">
        &quot;I am a chatbot about smart manufacturing&quot;
      </h1>
      <Link href="/api/auth/signin">
        <div className="p-4 mt-5 rounded-2xl text-gray-800 text-3xl hover:text-blue-800 transition duration-100 ease-in-out shadow-md hover:shadow-lg">
          登入
        </div>
      </Link>
      <Link href="/api/auth/signout">
        <div className="p-4 rounded-2xl text-gray-800 text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
          登出
        </div>
      </Link>
      <Link href="/MainPage">
        <div className="p-4 rounded-2xl text-gray-800 text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
          我想問問題!
        </div>
      </Link>
    </main>
  );
}
