import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, MapPinIcon, UsersIcon, SearchIcon, User, LogOut, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNavigate } from "react-router-dom"
// import img from "next/image"

const allEvents = [
  { id: 1, title: "Tech Hackathon", description: "A 24-hour coding challenge for tech enthusiasts", startDate: "2023-06-15", startTime: "09:00", endDate: "2023-06-16", endTime: "09:00", location: "Computer Science Building", attendees: 120, capacity: 150, clubId: 1, poster: "/placeholder.svg?height=150&width=150" },
  { id: 2, title: "Art Exhibition", description: "Showcase of student artworks from various mediums", startDate: "2023-06-18", startTime: "10:00", endDate: "2023-06-18", endTime: "18:00", location: "Student Center", attendees: 80, capacity: 100, clubId: 2, poster: "/placeholder.svg?height=150&width=150" },
  { id: 3, title: "Career Fair", description: "Connect with potential employers from various industries", startDate: "2023-06-20", startTime: "09:00", endDate: "2023-06-20", endTime: "17:00", location: "Main Hall", attendees: 200, capacity: 200, clubId: null, poster: "/placeholder.svg?height=150&width=150" },
  { id: 4, title: "Music Festival", description: "A day-long celebration of music featuring student bands", startDate: "2023-06-25", startTime: "12:00", endDate: "2023-06-25", endTime: "22:00", location: "Auditorium", attendees: 300, capacity: 350, clubId: null, poster: "/placeholder.svg?height=150&width=150" },
  { id: 5, title: "Science Symposium", description: "Presentations on cutting-edge research by students and faculty", startDate: "2023-06-30", startTime: "10:00", endDate: "2023-06-30", endTime: "16:00", location: "Science Complex", attendees: 150, capacity: 200, clubId: 3, poster: "/placeholder.svg?height=150&width=150" },
]

const registeredEvents = [
  { id: 1, title: "Tech Hackathon", description: "A 24-hour coding challenge for tech enthusiasts", startDate: "2023-06-15", startTime: "09:00", endDate: "2023-06-16", endTime: "09:00", location: "Computer Science Building", attendees: 120, capacity: 150, clubId: 1, poster: "/placeholder.svg?height=150&width=150" },
  { id: 3, title: "Career Fair", description: "Connect with potential employers from various industries", startDate: "2023-06-20", startTime: "09:00", endDate: "2023-06-20", endTime: "17:00", location: "Main Hall", attendees: 200, capacity: 200, clubId: null, poster: "/placeholder.svg?height=150&width=150" },
]

const clubs = [
  { id: 1, name: "Coding Club", description: "For tech enthusiasts and programmers", logo: "/placeholder.svg?height=80&width=80", email: "coding.club@campus.edu", type: "club" },
  { id: 2, name: "Art Society", description: "Express your creativity through various art forms", logo: "/placeholder.svg?height=80&width=80", email: "art.society@campus.edu", type: "club" },
  { id: 3, name: "Science Club", description: "Explore the wonders of science", logo: "/placeholder.svg?height=80&width=80", email: "science.club@campus.edu", type: "club" },
]

interface LoginState {
  isLogin: boolean;
  token: string;
}

interface Props {
  loginState: LoginState;
  setLogin: React.Dispatch<React.SetStateAction<LoginState>>;
}

export default function UserPage({ loginState, setLogin }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [filteredEvents, setFilteredEvents] = useState(allEvents)
  const [clubSearchTerm, setClubSearchTerm] = useState("")
  const [clubType, setClubType] = useState("all")
  const [filteredClubs, setFilteredClubs] = useState(clubs)
  const [selectedClubEvents, setSelectedClubEvents] = useState([])
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const navigate = useNavigate()
  const [showEventDetailsDialog, setShowEventDetailsDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showDeregisterDialog, setShowDeregisterDialog] = useState(false)

  const [profileDetails, setProfileDetails] = useState({
    name: "Divyanshu Bharadwaj",
    email: "Dibu@gmail.com",
    password: "********"
  })

  useEffect (() => {
    if (!loginState.isLogin) {
      navigate("/")
    }
  }, [showProfileDialog])

    // useEffect(() => {
    //   const fetchUserData = async () => {
    //     try {
    //       const response = await fetch("http://localhost:8080/enduser/dashboard", {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": loginState.token
    //         }
    //       });

    //       if (!response.ok) {
    //         throw new Error("Failed to fetch user data");
    //       }

    //       const userInfo = await response.json();
    //       setProfileDetails({
    //         name: userInfo.name,
    //         email: userInfo.email,
    //         password: userInfo.password
    //       });
    //     } catch (error) {
    //       console.error("Error fetching user data:", error);
    //     }
    //   }

    //   fetchUserData();
    // }, [showProfileDialog])

  useEffect(() => {
    const filtered = allEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEvents(filtered)
  }, [searchTerm])

  useEffect(() => {
    const filtered = clubs.filter(club =>
      (clubType === "all" || club.type === clubType) &&
      (club.name.toLowerCase().includes(clubSearchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(clubSearchTerm.toLowerCase()))
    )
    setFilteredClubs(filtered)
  }, [clubSearchTerm, clubType])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveTab("events")
  }

  const handleClubEvents = (clubId: number) => {
    const clubEvents = allEvents.filter(event => event.clubId === clubId)
    setSelectedClubEvents(clubEvents)
    setActiveTab("events")
  }

  const getClubName = (clubId: number | null) => {
    if (!clubId) return "College Administration"
    const club = clubs.find(c => c.id === clubId)
    return club ? club.name : "Unknown Club"
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setShowProfileDialog(false)
    // Here you would typically send the updated profile details to your backend
  }

  const handleViewEventDetails = (event) => {
    setSelectedEvent(event)
    setShowEventDetailsDialog(true)
  }

  const handleDeregister = (event) => {
    setSelectedEvent(event)
    setShowDeregisterDialog(true)
  }

  const confirmDeregister = () => {
    // Here you would typically send a request to your backend to deregister the user from the event
    setShowDeregisterDialog(false)
    // For this example, we'll just close the dialog
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
        console.log(loginState)
        navigate("/")

        console.log("Maine token delete ker diya")
        setLogin({ isLogin: false, token: "" })
      }
    } else {
      navigate("/")
    }

  }

  const getAbbr = () => {
    return profileDetails.name || "Data nahi aaya abhi tak"
  }

  const EventCard = ({ event, isRegistered = false }) => (
    <Card key={event.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>Organized by {getClubName(event.clubId)}</CardDescription>
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
          <span className="text-sm">{event.location}</span>
        </div>
        <div className="flex items-center">
          <UsersIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">{event.attendees} / {event.capacity} attendees</span>
        </div>
      </CardContent>
      <CardFooter>
        {isRegistered ? (
          <>
            <Button variant="outline" className="w-1/2 mr-2" onClick={() => handleViewEventDetails(event)}>View</Button>
            <Button variant="destructive" className="w-1/2" onClick={() => handleDeregister(event)}>De-register</Button>
          </>
        ) : (
          <Button className="w-full" disabled={event.attendees >= event.capacity}>
            {event.attendees >= event.capacity ? "Event Full" : "Register"}
          </Button>
        )}
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
              <li><Button variant="link" onClick={() => setActiveTab("clubs")}>Clubs</Button></li>
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
            <PopoverContent className="w-56" align="end" forceMount>
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
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setShowProfileDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
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
                    className="pl-10 pr-4 py-2 w-full"
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
                  {selectedClubEvents.length > 0 ? "Club Events" : "All Events"}
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
                  <TabsTrigger value="registered">Registered Events</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(selectedClubEvents.length > 0 ? selectedClubEvents : filteredEvents).map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="registered">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map((event) => (
                      <EventCard key={event.id} event={event} isRegistered={true} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              {selectedClubEvents.length > 0 && (
                <div className="mt-8 text-center">
                  <Button onClick={() => {
                    setSelectedClubEvents([])
                    setSearchTerm("")
                  }}>
                    Back to All Events
                  </Button>
                </div>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="clubs">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold mb-8">Campus Clubs</h3>
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Search clubs..."
                  className="max-w-md"
                  value={clubSearchTerm}
                  onChange={(e) => setClubSearchTerm(e.target.value)}
                />
                <Tabs value={clubType} onValueChange={setClubType} className="w-full sm:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="club">Clubs</TabsTrigger>
                    <TabsTrigger value="chapter">Chapters</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <Card key={club.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <img src={club.logo} alt={`${club.name} logo`} width={80} height={80} className="rounded-full" />
                        <CardTitle>{club.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{club.description}</CardDescription>
                      <p className="mt-2">Contact: {club.email}</p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button className="w-full" onClick={() => handleClubEvents(club.id)}>View Events</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
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
                  onChange={(e) => setProfileDetails({ ...profileDetails, name: e.target.value })}
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
                  onChange={(e) => setProfileDetails({ ...profileDetails, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={profileDetails.password}
                  onChange={(e) => setProfileDetails({ ...profileDetails, password: e.target.value })}
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

      {/* Event Details Dialog */}
      <Dialog open={showEventDetailsDialog} onOpenChange={setShowEventDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Event Details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Description:</Label>
              <span className="col-span-3">{selectedEvent?.description}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Start:</Label>
              <span className="col-span-3">{selectedEvent && formatDateTime(selectedEvent.startDate, selectedEvent.startTime)}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">End:</Label>
              <span className="col-span-3">{selectedEvent && formatDateTime(selectedEvent.endDate, selectedEvent.endTime)}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Location:</Label>
              <span className="col-span-3">{selectedEvent?.location}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Capacity:</Label>
              <span className="col-span-3">{selectedEvent?.capacity}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Registrations:</Label>
              <span className="col-span-3">{selectedEvent?.attendees}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Organizer:</Label>
              <span className="col-span-3">{getClubName(selectedEvent?.clubId)}</span>
            </div>
          </div> 
          <DialogFooter>
            <Button onClick={() => setShowEventDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="destructive" onClick={confirmDeregister}>Confirm De-registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}