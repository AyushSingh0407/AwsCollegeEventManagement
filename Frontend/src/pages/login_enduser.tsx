import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom";

export default function StudentLogin() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Form submitted", { name, email, password })
      // Reset form after successful submission
      setName("")
      setEmail("")
      setPassword("")
      setErrors({})
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-2">
            <Link to="/" className="text-primary hover:text-primary/80">
              <ArrowLeft className="mr-2 h-4 w-4 inline" />
              Back to Home
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Student Login</CardTitle>
          <CardDescription>Enter your details to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={handleSubmit}>Login</Button>
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <Link to="/enduser/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}