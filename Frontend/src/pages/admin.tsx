'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Bell, Search, User, LogOut, AlertTriangle, Check, X, Eye, Calendar as CalendarIcon } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { useNavigate } from "react-router-dom"
import { error } from "console"
import { register } from "module"

// /<a href="https://ibb.co/MSMvj6H"><img src="https://i.ibb.co/YQpCKZS/Arduino-Instagram-post.png" alt="Arduino-Instagram-post" border="0"></a>
interface LoginState {
  isLogin: boolean;
  token: string;
}

interface Props {
  loginState: LoginState;
  setLogin: React.Dispatch<React.SetStateAction<LoginState>>;
}

interface Event {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  organizer: string;
  capacity: number;
  registration: number;
  description: string;
  poster: string;
}


export default function CollegeAdminDashboard({ loginState, setLogin }: Props) {
  const navigate = useNavigate()

  const [approvedEvents, setApprovedEvents] = useState<Event[]>([])

  const [pendingEvents, setPendingEvents] = useState<Event[]>([])

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New event request: 'Art Exhibition'", time: "2 hours ago" },
    { id: 2, message: "Event 'Tech Hackathon' is at full capacity", time: "5 hours ago" },
    { id: 3, message: "10 new registrations for 'Career Fair'", time: "1 day ago" },
  ])

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [cancelConfirmation, setCancelConfirmation] = useState("")
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    name: "DSW Vellore",
    email: "dsw@vit.ac.in",
  })
  const [approvedSearchTerm, setApprovedSearchTerm] = useState("")
  const [pendingSearchTerm, setPendingSearchTerm] = useState("")
  const [filteredApprovedEvents, setFilteredApprovedEvents] = useState(approvedEvents)
  const [filteredPendingEvents, setFilteredPendingEvents] = useState(pendingEvents)

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedIsLogin = localStorage.getItem("isLogin");

    console.log(savedToken + " " + savedIsLogin)

    if (savedToken && savedIsLogin === "true") {
      setLogin({
        isLogin: true,
        token: savedToken
      })

      fetchData(savedToken)
    } else {
      navigate("/admin/login")
    }

    console.log(loginState)
  }, [])

  useEffect(() => {
    fetchPendingEvents()
    fetchApprovedEvents()
  }, [])

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch("http://localhost:8080/dsw/pendingevent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        // const errorData = await response.json();
        throw new Error("Approved wala error")
      }

      const pending = await response.json()

      console.log(pending)

      const newPendingEvents = pending.map((element: any) => ({
        id: element.eventId,
        title: element.eventName,
        startDate: element.eventStartDate,
        startTime: element.eventStartTime,
        endDate: element.eventEndDate,
        endTime: element.eventEndTime,
        venue: element.venue,
        organizer: element.clubEmail.split("@")[0],
        capacity: element.capacity,
        register: element.registration,
        description: element.eventDescription,
        poster: element.posterUrl,
      }));
  
      setPendingEvents(newPendingEvents);
    } catch (error) {
      console.log("Error message pending: " + error)
    }
  }

  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch("http://localhost:8080/dsw/approvedevent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok || !(response.status !== 204)) {
        // const errorData = await response.json();
        throw new Error("Node Data")
      }

      const approved = await response.json()

      console.log(approved)

      const newApprovedEvents = approved.map((element: any) => ({
        id: element.eventId,
        title: element.eventName,
        startDate: element.eventStartDate,
        startTime: element.eventStartTime,
        endDate: element.eventEndDate,
        endTime: element.eventEndTime,
        venue: element.venue,
        organizer: element.clubEmail.split("@")[0],
        capacity: element.capacity,
        registration: element.registration,
        description: element.eventDescription,
        poster: element.posterUrl,
      }));
  
      console.log(newApprovedEvents)
      setApprovedEvents(newApprovedEvents)
      
    } catch (error) {
      console.log("Error message: " + error)
    }
  }

  const fetchData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/dsw/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userInfo = await response.json();
      console.log("Complete userInfo object:", userInfo);
      console.log(userInfo?.dswCollegeEmail)

      const newUser = {
        name: userInfo.data.dswCollegeEmail?.split("@")[0],
        email: userInfo.data.dswCollegeEmail
      }

      setProfileDetails(newUser);

      console.log(profileDetails)

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    const filtered = approvedEvents.filter(event =>
      event.title.toLowerCase().includes(approvedSearchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(approvedSearchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(approvedSearchTerm.toLowerCase())
    )
    setFilteredApprovedEvents(filtered)
  }, [approvedSearchTerm, approvedEvents])

  useEffect(() => {
    const filtered = pendingEvents.filter(event =>
      event.title.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(pendingSearchTerm.toLowerCase())
    )
    setFilteredPendingEvents(filtered)
  }, [pendingSearchTerm, pendingEvents])

  const handleLogOut = async () => {

    if (loginState.isLogin) {
      const sure = confirm("Do you really want to log out ?")
      if (sure) {
        console.log("Maine token delete ker diya")
        const response = await fetch("http://localhost:8080/enduser/signout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": loginState.token
          }
        })
        const data = await response.text()
        console.log(data)
        console.log(loginState)
        navigate("/")

        localStorage.removeItem("token");
        localStorage.removeItem("isLogin");

        console.log("Maine token delete ker diya")
        setLogin({ isLogin: false, token: "" })
      }
    } else {
      navigate("/")
    }

  }

  const handleCancelEvent = async (event: any) => {
    const wantDelete = confirm("Do you really want remove this event ?")
    
      if (wantDelete) {
        try {
          const response = await fetch("http://localhost:8080/dsw/pendingevent/deny", {
            method: "POST",
            body: event.id
          })

          if (!response.ok) {
            throw new Error()
          }

          fetchApprovedEvents()
          fetchPendingEvents()
        } catch (error) {
          alert("Something went wrong. Try deleting again.")
        }
        setSelectedEvent(event)
        setShowCancelDialog(true)
      } else {
        return
      }
    }

  const confirmCancelEvent = () => {
    if (cancelConfirmation.toLowerCase() === "cancel") {
      setApprovedEvents(approvedEvents.filter(e => e.id !== selectedEvent.id))
      setShowCancelDialog(false)
      setCancelConfirmation("")
      setSelectedEvent(null)
      setNotifications([
        { id: Date.now(), message: `Event '${selectedEvent.title}' has been cancelled`, time: "Just now" },
        ...notifications
      ])
    }
  }

  const handleApproveEvent = async (event: any) => {
    console.log(event.id)
    try {
      const response = await fetch("http://localhost:8080/dsw/pendingevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: event.id
      })

      if (!response.ok) {
        const errorObj = await response.text()
        throw new Error(errorObj)
      }

      fetchApprovedEvents()
      fetchPendingEvents()
      setPendingEvents(pendingEvents.filter(e => e.id !== event.id))

    } catch (err) {
      console.log("Error message: " + err)
    }
  }

  const handleDenyEvent = (event: any) => {
    setPendingEvents(pendingEvents.filter(e => e.id !== event.id))
    setNotifications([
      { id: Date.now(), message: `Event '${event.title}' has been denied`, time: "Just now" },
      ...notifications
    ])
  }

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const getEventsForDate = (date: Date) => {
    return approvedEvents.filter(event => isSameDay(new Date(event.startDate), date))
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile details to your backend
    setShowProfileDialog(false)
    // Show a notification or some feedback that the profile was updated
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">CollegeAdmin</h1>
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
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback>{profileDetails?.name ? profileDetails.name[0] : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end" forceMount>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatars/01.png" alt="@admin" />
                      <AvatarFallback>{profileDetails?.name ? profileDetails.name[0] : 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profileDetails.name}</p>
                      <p className="text-xs text-muted-foreground">{profileDetails.email}</p>
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
                  <Button onClick={handleLogOut} variant="ghost" className="w-full justify-start">
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
        <Tabs defaultValue="approved" className="space-y-4">
          <TabsList>
            <TabsTrigger onClick={fetchApprovedEvents} value="approved">Approved Events</TabsTrigger>
            <TabsTrigger onClick={fetchPendingEvents} value="pending">Pending Events</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="approved" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Approved Events</h2>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="w-64"
                  value={approvedSearchTerm}
                  onChange={(e) => setApprovedSearchTerm(e.target.value)}
                />
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
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
                      <TableHead>Organizer</TableHead>
                      <TableHead>Registrations/Capacity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovedEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{`${event.startDate} ${event.startTime}`}</TableCell>
                        <TableCell>{`${event.endDate} ${event.endTime}`}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>{event.organizer}</TableCell>
                        <TableCell>{`${event.registration}/${event.capacity}`}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewEvent(event)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleCancelEvent(event)}>Cancel</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pending Events</h2>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search pending events..."
                  className="w-64"
                  value={pendingSearchTerm}
                  onChange={(e) => setPendingSearchTerm(e.target.value)}
                />
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {filteredPendingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Organized by {event.organizer}</p>
                        <p><strong>Start:</strong> {`${event.startDate} ${event.startTime}`}</p>
                        <p><strong>End:</strong> {`${event.endDate} ${event.endTime}`}</p>
                        <p><strong>Venue:</strong> {event.venue}</p>
                        <p><strong>Capacity:</strong> {event.capacity}</p>
                        <p className="mt-2"><strong>Description:</strong></p>
                        <p className="text-sm">{event.description}</p>
                      </div>
                      <div className="flex-shrink-0 mx-6">
                        <img src={event.poster} alt={`${event.title} poster`} className="w-48 h-auto object-cover rounded-md" />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="default" onClick={() => handleApproveEvent(event)}>
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="destructive" onClick={() => handleCancelEvent(event)}>
                          <X className="mr-2 h-4 w-4" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4">
            <h2 className="text-2xl font-bold">Event Calendar</h2>
            <div className="flex space-x-4">
              <Card className="w-fit">
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              <Card className="flex-grow">
                <CardHeader>
                  <CardTitle>Events on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      {getEventsForDate(selectedDate).map(event => (
                        <Card key={event.id} className="mb-4 last:mb-0">
                          <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{event.organizer}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                            <p><strong>Venue:</strong> {event.venue}</p>
                            <p><strong>Registrations/Capacity:</strong> {event.registration}/{event.capacity}</p>
                          </CardContent>
                          <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => handleViewEvent(event)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </ScrollArea>
                  ) : (
                    <p>No events scheduled for this date.</p>
                  )}
                </CardContent>
              </Card>
            </div>
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

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Event Details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Start:</Label>
              <span>{selectedEvent?.startDate} {selectedEvent?.startTime}</span>
              <Label>End:</Label>
              <span>{selectedEvent?.endDate} {selectedEvent?.endTime}</span>
              <Label>Venue:</Label>
              <span>{selectedEvent?.venue}</span>
              <Label>Organizer:</Label>
              <span>{selectedEvent?.organizer}</span>
              <Label>Registrations/Capacity:</Label>
              <span>{selectedEvent?.registration}/{selectedEvent?.capacity}</span>
            </div>
            <div>
              <Label>Description:</Label>
              <p className="mt-2">{selectedEvent?.description}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEventDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>View and edit your profile information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={profileDetails.name}
                  onChange={(e) => setProfileDetails({...profileDetails, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileDetails.email}
                  onChange={(e) => setProfileDetails({...profileDetails, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="oldPassword" className="text-right">
                  Old Password
                </Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={profileDetails.oldPassword}
                  onChange={(e) => setProfileDetails({...profileDetails, oldPassword: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={profileDetails.newPassword}
                  onChange={(e) => setProfileDetails({...profileDetails, newPassword: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}