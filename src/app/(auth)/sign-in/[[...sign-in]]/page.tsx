import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-surface border border-border",
          },
        }}
      />
    </div>
  );
}
