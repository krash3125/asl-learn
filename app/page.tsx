import Link from 'next/link'

export default function Page({
  searchParams,
}: {
  searchParams: { step: string };
}) {
  const step = parseInt(searchParams.step ?? "1");

  return (
    <div className="bg-indigo-500 h-screen w-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl text-white font-bold mb-32">Welcome to ASL Learn</h1>

      <div className="flex flex-row items-center">

        <div className={`flex items-center justify-center border-[8px] p-4 aspect-square rounded-full border-white`} >
          <div className={`text-center h-14 text-6xl font-bold aspect-square text-white`}>
            1
          </div>
        </div>

        <div className={`h-2  w-48 ${step >= 2 ? "bg-white" : "bg-gray-400"}`} />

        <div className={`flex items-center justify-center border-[8px] p-4 aspect-square rounded-full ${step >= 2 ? "border-white" : "border-gray-400"}`} >
          <div className={`text-center h-14 text-6xl font-bold aspect-square ${step >= 2 ? "text-white" : "text-gray-400"}`}>
            2
          </div>
        </div>

        <div className={`h-2 w-48 ${step >= 3 ? "bg-white" : "bg-gray-400"}`} />

        <div className={`flex items-center justify-center border-[8px] p-4 aspect-square rounded-full ${step >= 3 ? "border-white" : "border-gray-400"}`} >
          <div className={`text-center h-14 text-6xl font-bold aspect-square ${step >= 3 ? "text-white" : "text-gray-400"}`}>
            3
          </div>
        </div>

        <div className={`h-2 w-48 ${step >= 4 ? "bg-white" : "bg-gray-400"}`} />

        <div className={`flex items-center justify-center border-[8px] p-4 aspect-square rounded-full ${step >= 4 ? "border-white" : "border-gray-400"}`} >
          <div className={`text-center h-14 text-6xl font-bold aspect-square ${step >= 4 ? "text-white" : "text-gray-400"}`}>
            4
          </div>
        </div>
      </div>

      <div className="w-[972px] flex flex-row items-center mt-10 justify-between">
        <span className={"w-40 text-white font-semibold text-left text-2xl"} >Letters</span>
        <span className={`w-40 font-semibold text-center text-2xl -translate-x-4 ${step >= 2 ? "text-white" : "text-gray-400"}`} >Words</span>
        <span className={`w-40 font-semibold text-right text-2xl  ${step >= 3 ? "text-white" : "text-gray-400"}`}>Sentences</span>
        <span className={`w-40 font-semibold text-right text-2xl translate-x-8 ${step >= 3 ? "text-white" : "text-gray-400"}`}>Test Yourself!</span>
      </div>

      <div className="w-[972px] flex flex-row items-center mt-10 justify-between">
        <Link href="/letters" passHref>
          <button className="border-4 border-white rounded-full  bg-transparent px-4 py-2 text-base font-medium text-white">Start</button>
        </Link>
        <Link href="/words" passHref>
          <button className="border-4 border-white rounded-full  bg-transparent px-4 py-2 text-base font-medium text-white disabled:text-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" disabled={step < 2}>Start</button>
        </Link>
        <Link href="/sentences" passHref>
          <button className="border-4 border-white rounded-full bg-transparent px-4 py-2 text-base font-medium text-white disabled:text-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" disabled={step < 3}>Start</button>
        </Link>
        <Link href="/test" passHref>
          <button className="border-4 border-white rounded-full bg-transparent px-4 py-2 text-base font-medium text-white disabled:text-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" disabled={step < 4}>Start</button>
        </Link>
      </div>
    </div>
  )
}

