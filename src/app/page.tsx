// import Header from "@/app/components/header";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(options);
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
        <h1 className="text-5xl font-bold text-gray-800">ISDM chatbot</h1>
        {session ? (
          <>
            {/* <div className="text-3xl">user information</div> */}
            <div className="flex flex-col items-center content-center">
              <img src={session?.user?.image ?? ""} alt="" className="w-20" />
              <p className="text-3xl font-bold text-gray-800">
                Hi! {session?.user?.name},{" "}
              </p>
              {/* <h1>{session?.user?.email}</h1> */}
              {/* <h1>{session?.user?.image}</h1> */}
            </div>
            <div className="flex flex-col text-mg font-bold text-gray-800 items-center content-center">
              <p className="">
                &quot;I am a chatbot about smart manufacturing&quot;
              </p>
              <p className="">How can I help you today!</p>
            </div>
            <div className="flex">
              <Link href="/MainPage">
                <div className="flex p-4 rounded-2xl text-gray-800 font-bold text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
                  我想問問題!
                </div>
              </Link>
              <Link href="/ScrapePage">
                <div className="flex p-4 rounded-2xl text-gray-800 font-bold text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
                  我想問網站!
                </div>
              </Link>
            </div>
            <Link href="/api/auth/signout">
              <div className="p-4 rounded-2xl text-gray-800 text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
                登出
              </div>
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col text-mg font-bold text-gray-800 items-center content-center">
              <p className="">
                &quot;I am a chatbot about smart manufacturing&quot;
              </p>
              <p className="">How about signing in first!</p>
            </div>
            <Link href="/api/auth/signin">
              <div className="p-4 mt-5 rounded-2xl text-gray-800 text-3xl hover:text-blue-800 transition duration-100 ease-in-out shadow-md hover:shadow-lg">
                登入
              </div>
            </Link>
          </>
        )}

        {/* <Link href="/api/auth/signin">
          <div className="p-4 mt-5 rounded-2xl text-gray-800 text-3xl hover:text-blue-800 transition duration-100 ease-in-out shadow-md hover:shadow-lg">
            登入
          </div>
        </Link>
        <Link href="/api/auth/signout">
          <div className="p-4 rounded-2xl text-gray-800 text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
            登出
          </div>
        </Link> */}
        {/* <Link href="/MainPage">
          <div className="p-4 rounded-2xl text-gray-800 text-xl hover:text-blue-800 transition duration-100 ease-in-out hover:shadow-lg">
            我想問問題!
          </div>
        </Link> */}
      </main>
    </>
  );
}
