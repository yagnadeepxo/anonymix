import Script from "next/script";
import Interface from "../components/interface";

export default function Home() {
  return (
    <div>
      <Script src="/snarkjs.js" />
      <Interface />
    </div>
  )
}
