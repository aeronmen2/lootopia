import { createFileRoute, Link, useParams } from "@tanstack/react-router"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { CheckCircle2, Mail, ExternalLink, ArrowLeft } from "lucide-react"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/verify/$email")({
  component: RouteComponent,
})

function RouteComponent() {
  const { email } = useParams({ from: "/verify/$email" })

  const openEmailApp = (
    emailProvider: "gmail" | "outlook" | "yahoo" | "apple",
  ) => {
    const emailLinks = {
      gmail: "https://mail.google.com",
      outlook: "https://outlook.live.com",
      yahoo: "https://mail.yahoo.com",
      apple: "mailto:",
    }

    window.open(emailLinks[emailProvider], "_blank")
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-8">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-base mt-2">
            We have sent a verification link to your email address.
            {email}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              Please check your inbox and click on the verification link to
              verify your account.
            </p>
            <p>
              If you don't see the email, check your spam folder or request a
              new link.
            </p>
          </div>

          <div className="border-t border-b py-4">
            <h3 className="text-center font-medium mb-4 flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" /> Open your email
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => openEmailApp("gmail")}
              >
                Gmail <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => openEmailApp("outlook")}
              >
                Outlook <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => openEmailApp("yahoo")}
              >
                Yahoo <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => openEmailApp("apple")}
              >
                Mail App <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button variant="ghost" className="text-sm">
              Didn't receive an email? Resend
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col">
          <Link to="/login" className="">
            <InteractiveHoverButton className="w-full">
              Already verified? Login
            </InteractiveHoverButton>
          </Link>

          <Link to="/" className="w-full">
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
