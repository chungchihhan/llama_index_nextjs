import Header from "@/app/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
      {/* <Header /> */}
      <h1 className="text-5xl font-bold text-gray-800">ISDM chatbot</h1>
      <h1 className="text-mg font-bold text-gray-800">
        "I am a chatbot about smart manufacturing"
      </h1>
      <Link href="/auth/signin">
        <div className="p-4 mt-5 rounded-2xl text-gray-800 text-3xl hover:text-blue-800 transition duration-100 ease-in-out shadow-md hover:shadow-lg">
          已經有帳號
        </div>
      </Link>
      <Link href="/auth/signup">
        <div className="p-4 rounded-2xl text-gray-800text-xl hover:text-blue-800 transition duration-100 ease-in-out shadow-md hover:shadow-lg">
          還沒有帳號?
        </div>
      </Link>
    </main>
  );
}
