import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, MapPinIcon, UsersIcon, SearchIcon, User, LogOut, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNavigate } from "react-router-dom"
import { set } from "date-fns"


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

export default function UserPage({ loginState, setLogin }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const navigate = useNavigate()
  const [selectedEvent, setSelectedEvent] = useState<Event>()
  const [showDeregisterDialog, setShowDeregisterDialog] = useState(false)
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedClubEvents, setSelectedClubEvents] = useState(approvedEvents)
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    password: ""
  })

  useEffect(() => {
    const savedIsLogin = localStorage.getItem("isLogin")
    const savedToken = localStorage.getItem("token")

    if (savedToken && savedIsLogin) {
      setLogin({
        isLogin: true,
        token: savedToken
      })

      fetchUserData()
      fetchRegisteredEvents()
    } else {
      navigate("/enduser/login")
    }
  }, [])

  const fetchUserData = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:8080/enduser/dashboard", {
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
      const newApprovedEvents = userInfo.approvedEvents.map((element: any) => ({
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
      }))

      setAllEvents(newApprovedEvents)
      setApprovedEvents(newApprovedEvents)
      setFilteredEvents(newApprovedEvents)

      setProfileDetails({
        name: userInfo.username,
        email: userInfo.email,
        password: ""
      })
      
      setSelectedClubEvents(newApprovedEvents)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    const filtered = approvedEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEvents(filtered)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveTab("events")
  }

  const formatDateTime = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`)
    return dateTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

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

        localStorage.removeItem("isLogin")
        localStorage.removeItem("token")

        console.log(loginState)
        navigate("/")

        console.log("Maine token delete ker diya")
        setLogin({ isLogin: false, token: "" })
      }
    } else {
      navigate("/")
    }

  }

  const fetchRegisteredEvents = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:8080/enduser/registeredevent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })

      if (!response.ok) {
        throw new Error("No registered events.")
      }

      const fetchedRegisteredEvent = await response.json()

      const newEvents = fetchedRegisteredEvent.map((element: any) => ({
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
        approval: element.approved,
      }));

      setRegisteredEvents(newEvents);

      console.log(fetchedRegisteredEvent)

    } catch (error) {
      alert(error)
    }
  }

  const handleRegisterEvent = async (id: string) => {
    const decide = confirm("Do you really want to register for the event")
    console.log(id)

    if (decide) {
      const token: string = localStorage.getItem("token") as string
      try {
        const response = await fetch("http://localhost:8080/enduser/registernewevent", {
          method: "POST",
          headers: {
            "Authorization": token,
            "Content-Type": "text/plain"
          },
          body: id
        })

        if (!response.ok) {
          throw new Error("We are not able to process your registration please try again.")
        }

        alert("Registration Successful.")
        fetchRegisteredEvents()
      } catch (error) {
        alert(error)
      }
    }
  }

  const isEventRegistered = (eventId: string) => {
    return registeredEvents.some((event) => event.id === eventId);
  }

  const EventCard = ({event}) => (
    <Card key={event.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>Organized by {event.organizer}</CardDescription>
          </div>
          <img src={event.poster} alt={`${event.title} poster`} width={80} height={80} className="rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <div className="flex items-center mb-2">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">
            {formatDateTime(event.startDate, event.startTime)} -
            {formatDateTime(event.endDate, event.endTime)}
          </span>
        </div>
        <div className="flex items-center mb-2">
          <MapPinIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">{event.venue}</span>
        </div>
        <div className="flex items-center">
          <UsersIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">{event.registration} / {event.capacity} attendees</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={async () => { await handleRegisterEvent(event.id)}} className="w-full" disabled={event.registration >= event.capacity || isEventRegistered(event.id)}>
        {
          isEventRegistered(event.id)
          ? "Already Registered"
          : event.registration >= event.capacity
          ? "Event Full"
          : "Register"
        }
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">CampusEvents</h1>
          <nav className="flex items-center justify-center flex-grow">
            <ul className="flex space-x-4">
              <li><Button variant="link" onClick={() => setActiveTab("home")}>Home</Button></li>
              <li><Button variant="link" onClick={() => setActiveTab("events")}>Events</Button></li>
              {/* <li><Button variant="link" onClick={() => setActiveTab("clubs")}>Clubs</Button></li> */}
            </ul>
          </nav>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-f8">
                  <AvatarImage src="/avatars/01.png" alt="@johndoe" />
                  <AvatarFallback>{profileDetails.name[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" forceMount>
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/01.png" alt="@johndoe" />
                    <AvatarFallback>{profileDetails.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{profileDetails.name}</p>
                    <p className="text-xs text-muted-foreground">{profileDetails.email}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {/* <Button variant="ghost" className="w-full justify-start" onClick={() => setShowProfileDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button> */}
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
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="home">
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Welcome, {profileDetails.name}!</h2>
              <p className="text-xl mb-8">Discover and join exciting events happening around your college</p>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0">
                <div className="relative w-full max-w-md">
                  <Input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 pr-4 py-2 w-full text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <Button type="submit" className="sm:ml-2">Search</Button>
              </form>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold mb-8">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEvents.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button onClick={() => setActiveTab("events")}>See All Events</Button>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="events">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">
                  All Events
                </h3>
                <div className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search events..."
                    className="max-w-xs mr-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button>
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Events</TabsTrigger>
                  <TabsTrigger onClick={fetchRegisteredEvents} value="registered">Registered Events</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="registered">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.length == 0 && <div className="text-red-700">No Registered Events.</div>}
                    {registeredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              {selectedClubEvents.length > 0 && (
                <div className="mt-8 text-center">
                  <Button onClick={() => {
                    setSelectedClubEvents([])
                    setSearchTerm("")
                    fetchUserData()
                  }}>
                    Back to All Events
                  </Button>
                </div>
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>

        
      {/* De-register Confirmation Dialog */}
      <Dialog open={showDeregisterDialog} onOpenChange={setShowDeregisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm De-registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to de-register from "{selectedEvent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeregisterDialog(false)}>Cancel</Button>
            <Button variant="destructive">Confirm De-registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}