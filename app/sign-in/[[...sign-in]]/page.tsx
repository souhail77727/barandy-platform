import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F8F5F1] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-primary font-bold text-3xl text-[#171519]">
            BARANDY
          </h1>

          <p className="text-[#171519]/60 mt-2">
            Sign in to continue your assessment
          </p>
        </div>

        <SignIn
          fallbackRedirectUrl="/assessment"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white shadow-sm border border-[#171519]/10 p-8",
              headerTitle: "font-primary text-[#171519] text-xl",
              headerSubtitle: "text-[#171519]/60",
              socialButtonsBlockButton:
                "border border-[#171519]/10 hover:bg-[#F8F5F1]",
              formFieldLabel: "text-[#171519] text-sm font-medium",
              formFieldInput:
                "border border-[#171519]/10 focus:border-[#171519]",
              formButtonPrimary:
                "bg-[#171519] hover:bg-opacity-90 text-[#F8F5F1]",
              footerActionLink: "text-[#171519] font-medium",
            },
          }}
        />
      </div>
    </div>
  );
}