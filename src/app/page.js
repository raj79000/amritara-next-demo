
// import HomePage from "./Components/Homepage/HomePage";

// export default function Home() {
//   return (
//     <>
//     <HomePage></HomePage>
//     </>
//   );
// }

import { Suspense } from "react";
import ClientWrapper from "./Common/ClientWrapper";
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}
