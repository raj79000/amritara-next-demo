import MainHeader from "../Common/MainHeader";
import SignInComponent from "../Common/SignInComponent";

export const metadata = {
  title: "Amritara Hotels - Sign In",
  description:
    "Sign in to your Amritara Hotels account to access exclusive member benefits and manage your bookings with ease.",
  alternates: { canonical: "/rewards" },
};

export default function SignInPage() {
  return (
    <>
      <MainHeader />
      <section className="rewards-page section-padding" style={{ backgroundColor: "#f3efec" }}>
        <div className="container-fluid">
          <SignInComponent />
        </div>
      </section>
    </>
  );
}
