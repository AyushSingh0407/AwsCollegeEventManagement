import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, UsersIcon, SearchIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"


const allEvents = [
    { id: 1, title: "Tech Hackathon", description: "A 24-hour coding challenge for tech enthusiasts", startDate: "2023-06-15", startTime: "09:00", endDate: "2023-06-16", endTime: "09:00", location: "Computer Science Building", attendees: 120, capacity: 150, clubId: 1, poster: "/placeholder.svg?height=150&width=150" },
    { id: 2, title: "Art Exhibition", description: "Showcase of student artworks from various mediums", startDate: "2023-06-18", startTime: "10:00", endDate: "2023-06-18", endTime: "18:00", location: "Student Center", attendees: 80, capacity: 100, clubId: 2, poster: "/placeholder.svg?height=150&width=150" },
    { id: 3, title: "Career Fair", description: "Connect with potential employers from various industries", startDate: "2023-06-20", startTime: "09:00", endDate: "2023-06-20", endTime: "17:00", location: "Main Hall", attendees: 200, capacity: 200, clubId: null, poster: "/placeholder.svg?height=150&width=150" },
    { id: 4, title: "Music Festival", description: "A day-long celebration of music featuring student bands", startDate: "2023-06-25", startTime: "12:00", endDate: "2023-06-25", endTime: "22:00", location: "Auditorium", attendees: 300, capacity: 350, clubId: null, poster: "/placeholder.svg?height=150&width=150" },
    { id: 5, title: "Science Symposium", description: "Presentations on cutting-edge research by students and faculty", startDate: "2023-06-30", startTime: "10:00", endDate: "2023-06-30", endTime: "16:00", location: "Science Complex", attendees: 150, capacity: 200, clubId: 3, poster: "/placeholder.svg?height=150&width=150" },
]

const clubs = [
  { id: 1, name: "Coding Club", description: "For tech enthusiasts and programmers. We organize coding competitions, workshops, and hackathons throughout the year.", logo: "/placeholder.svg?height=80&width=80", email: "coding.club@campus.edu", type: "club" },
  { id: 2, name: "Art Society", description: "Express your creativity through various art forms. Join us for exhibitions, workshops, and collaborative projects.", logo: "/placeholder.svg?height=80&width=80", email: "art.society@campus.edu", type: "club" },
  { id: 3, name: "Science Club", description: "Explore the wonders of science through experiments, discussions, and field trips.", logo: "/placeholder.svg?height=80&width=80", email: "science.club@campus.edu", type: "club" },
  { id: 4, name: "IEEE Student Chapter", description: "Advancing technology for humanity. Participate in technical projects and networking events.", logo: "/placeholder.svg?height=80&width=80", email: "ieee.chapter@campus.edu", type: "chapter" },
  { id: 5, name: "ACM Student Chapter", description: "Advancing computing as a science and profession. Join us for coding challenges and tech talks.", logo: "/placeholder.svg?height=80&width=80", email: "acm.chapter@campus.edu", type: "chapter" },
]


interface LoginState {
  isLogin: boolean;
  token: string;
}

interface Props {
  loginState: LoginState;
  setLogin: React.Dispatch<React.SetStateAction<LoginState>>;
}


export default function Homepage({ loginState, setLogin }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [filteredEvents, setFilteredEvents] = useState(allEvents)
  const [clubSearchTerm, setClubSearchTerm] = useState("")
  const [clubType, setClubType] = useState("all")
  const [filteredClubs, setFilteredClubs] = useState(clubs)
  const [selectedClubEvents, setSelectedClubEvents] = useState([])

  useEffect(() => {
    const filtered = allEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
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

  const truncateDescription = (description: string, maxLength: number = 100) => {
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description
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

  const handleSignOut = async () => {

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

        console.log("Maine token delete ker diya")
        setLogin({isLogin: false, token: ""})
      }
    }

  }

  const EventCard = ({event, isRegistered = false }) => (
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
          <Button onClick={handleSignOut}>
            <Link to={loginState.isLogin ? "/" : "/enduser/login"}>{loginState.isLogin ? "Sign out" : "sign in"}</Link>
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="home">
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Discover Campus Life</h2>
              <p className="text-xl mb-8">Find and join exciting events happening around your college</p>
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

          {/* Footer */}
          <footer className="bg-primary text-primary-foreground mt-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                <div className="w-full md:w-1/3">
                  <h4 className="text-xl font-bold mb-4">CampusEvents</h4>
                  <p>Connecting students with exciting opportunities on campus.</p>
                </div>
                <div className="w-full md:w-1/3 text-center">
                  <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
                  <p>Email: info@campusevents.com</p>
                  <p>Phone: (123) 456-7890</p>
                </div>
                <div className="w-full md:w-1/3 md:text-right">
                  <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
                  <ul className="space-y-2">
                    <li><Link to="#" className="hover:underline">Contact</Link></li>
                    <li><Link to="/club/login">Club Sign in</Link></li>
                    <li><Link to="/admin/login" className="hover:underline">Admin Sign in</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center">
                <p>&copy; 2023 CampusEvents. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </TabsContent>

        <TabsContent value="events">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold mb-8">
                {selectedClubEvents.length > 0 ? "Club Events" : "All Events"}
              </h3>
              <div className="mb-8">
                <Input 
                  type="text" 
                  placeholder="Search events..." 
                  className="max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedClubEvents.length > 0 ? selectedClubEvents : filteredEvents).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
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
                        <img src={club.logo} alt={`${club.name} logo`} className="rounded-full" width="80" height="80"/>
                        <CardTitle>{club.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{truncateDescription(club.description)}</CardDescription>
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
    </div>
  )
}
