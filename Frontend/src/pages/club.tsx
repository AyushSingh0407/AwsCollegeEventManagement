'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Calendar as CalendarIcon, ChevronDown, FileText, LogOut, Search, User, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

export default function ClubDashboard() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [allEvents, setAllEvents] = useState([
    { id: 1, title: "Tech Hackathon", startDate: "2023-06-15", startTime: "09:00", endDate: "2023-06-16", endTime: "09:00", venue: "CS Building", capacity: 100, registrations: 75, status: "Approved", banner: "/placeholder.svg", description: "Join us for an exciting 24-hour hackathon!" },
    { id: 2, title: "Art Exhibition", startDate: "2023-06-18", startTime: "14:00", endDate: "2023-06-18", endTime: "20:00", venue: "Student Center", capacity: 50, registrations: 30, status: "Pending", banner: "/placeholder.svg", description: "Showcase your artistic talents at our annual exhibition." },
    { id: 3, title: "Career Fair", startDate: "2023-06-20", startTime: "10:00", endDate: "2023-06-20", endTime: "16:00", venue: "Main Hall", capacity: 200, registrations: 150, status: "Approved", banner: "/placeholder.svg", description: "Connect with top employers and explore career opportunities." },
  ])
  const [events, setEvents] = useState(allEvents)

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your event 'Tech Hackathon' has been approved", time: "2 hours ago" },
    { id: 2, message: "New comment on 'Art Exhibition'", time: "5 hours ago" },
    { id: 3, message: "Reminder: 'Career Fair' starts tomorrow", time: "1 day ago" },
  ])

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [cancelConfirmation, setCancelConfirmation] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showRegistrationList, setShowRegistrationList] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  const handleViewEvent = (event:any) => {
    setSelectedEvent(event)
  }

  const handleCancelEvent = (event:any) => {
    setSelectedEvent(event)
    setShowCancelDialog(true)
  }

  const confirmCancelEvent = () => {
    if (cancelConfirmation.toLowerCase() === "cancel") {
      setAllEvents(allEvents.filter(e => e.id !== selectedEvent.id))
      setEvents(events.filter(e => e.id !== selectedEvent.id))
      setShowCancelDialog(false)
      setCancelConfirmation("")
      setSelectedEvent(null)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    if (query === "") {
      setEvents(allEvents)
    } else {
      const filteredEvents = allEvents.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      )
      setEvents(filteredEvents)
    }
  }

  const registeredStudents = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Alice Johnson", email: "alice@example.com" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8">CampusEvents</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="text-primary hover:text-primary/80">Dashboard</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">Notifications</h4>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{notification.message}</p>
                        <p className="text-sm text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end" forceMount>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">shadcn</p>
                      <p className="text-xs text-muted-foreground">m@example.com</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setShowProfileDialog(true)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="new-event">New Event Request</TabsTrigger>
          </TabsList>
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Approved Events</h2>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Start Date & Time</TableHead>
                      <TableHead>End Date & Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Registrations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{`${event.startDate} ${event.startTime}`}</TableCell>
                        <TableCell>{`${event.endDate} ${event.endTime}`}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>{event.capacity}</TableCell>
                        <TableCell>{event.registrations}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === "Approved" ? "default" : "secondary"}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleViewEvent(event)}>View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                                <DialogDescription>Event Details</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <img src={selectedEvent?.banner} alt={selectedEvent?.title} className="w-full h-48 object-cover rounded-md" />
                                  <div>
                                    <p><strong>Start Date and Time:</strong> {`${selectedEvent?.startDate} ${selectedEvent?.startTime}`}</p>
                                    <p><strong>End Date and Time:</strong> {`${selectedEvent?.endDate} ${selectedEvent?.endTime}`}</p>
                                    <p><strong>Venue:</strong> {selectedEvent?.venue}</p>
                                    <p><strong>Capacity:</strong> {selectedEvent?.capacity}</p>
                                    <p><strong>Registrations:</strong> {selectedEvent?.registrations}</p>
                                    <p><strong>Status:</strong> {selectedEvent?.status}</p>
                                  </div>
                                </div>
                                <div>
                                  <strong>Description:</strong>
                                  <p>{selectedEvent?.description}</p>
                                </div>
                                <Button onClick={() => setShowRegistrationList(true)}>View Registration List</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => handleCancelEvent(event)}>Cancel</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="new-event">
            <Card>
              <CardHeader>
                <CardTitle>Request New Event</CardTitle>
                <CardDescription>Fill out the form below to request a new event.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" placeholder="Enter event title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input id="startTime" type="time" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${!endDate && "text-m uted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input id="endTime" type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input id="venue" placeholder="Enter event venue" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" placeholder="Enter event capacity" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter event description" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments</Label>
                    <Input id="attachments" type="file" multiple />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button type="submit">Submit Event Request</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Cancelling this event will remove it from the system and notify all registered participants.
            </AlertDescription>
          </Alert>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cancel-confirmation" className="text-right">
                Type "cancel" to confirm:
              </Label>
              <Input
                id="cancel-confirmation"
                value={cancelConfirmation}
                onChange={(e) => setCancelConfirmation(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={confirmCancelEvent} disabled={cancelConfirmation.toLowerCase() !== "cancel"}>
              Cancel Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>View and edit your profile information</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
          </form>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registration List Dialog */}
      <Dialog open={showRegistrationList} onOpenChange={setShowRegistrationList}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration List</DialogTitle>
            <DialogDescription>Students registered for this event</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}