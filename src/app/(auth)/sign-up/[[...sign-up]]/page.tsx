import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignUp
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
