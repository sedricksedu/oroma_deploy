import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminEventsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage community events like soccer matches, charity fundraisers, concerts, and cultural celebrations</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Soccer matches, fundraisers, concerts scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              Event Participants
            </CardTitle>
            <CardDescription>Track RSVPs and event attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Venue Management
            </CardTitle>
            <CardDescription>Manage venues for community events</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}