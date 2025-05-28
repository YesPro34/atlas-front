import Link from "next/link";

export default  function Home() {
  return (
    <div className="">
      <h1>Hello l3alam</h1>
      <Link href="/login">
            Login
      </Link>
      <div>
      <Link href="/home">
             home
      </Link>
      </div>
      <div>
            <Link href="/dashboard">
             dashboard
      </Link>

      </div>
    </div>
  );
}
