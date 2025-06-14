
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Server, 
  Search, 
  Settings, 
  Activity, 
  Wifi, 
  WifiOff, 
  MoreVertical,
  Eye,
  Trash2,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Switch {
  id: string;
  name: string;
  ip: string;
  model: string;
  version: string;
  status: string;
  uptime: string;
  interfaces: { total: number; up: number; down: number };
  lastSeen: string;
}

interface SwitchListProps {
  switches: Switch[];
  onSwitchUpdate: (switches: Switch[]) => void;
}

export const SwitchList = ({ switches, onSwitchUpdate }: SwitchListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredSwitches = switches.filter(switch_ =>
    switch_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    switch_.ip.includes(searchTerm) ||
    switch_.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async (switchId: string) => {
    setIsRefreshing(switchId);
    
    // Simulate API call to refresh switch status
    setTimeout(() => {
      const updatedSwitches = switches.map(s => 
        s.id === switchId 
          ? { ...s, lastSeen: new Date().toISOString() }
          : s
      );
      onSwitchUpdate(updatedSwitches);
      setIsRefreshing(null);
      
      toast({
        title: "Status Updated",
        description: "Switch status has been refreshed"
      });
    }, 1500);
  };

  const handleDelete = (switchId: string) => {
    const switchToDelete = switches.find(s => s.id === switchId);
    const updatedSwitches = switches.filter(s => s.id !== switchId);
    onSwitchUpdate(updatedSwitches);
    
    toast({
      title: "Switch Removed",
      description: `${switchToDelete?.name} has been removed from management`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "warning":
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search switches by name, IP, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Switch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSwitches.map((switch_) => (
          <Card key={switch_.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(switch_.status)}
                  <div>
                    <CardTitle className="text-lg">{switch_.name}</CardTitle>
                    <p className="text-sm text-slate-600">{switch_.ip}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRefresh(switch_.id)}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing === switch_.id ? 'animate-spin' : ''}`} />
                      Refresh Status
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(switch_.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(switch_.status)}>
                  {switch_.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-500">
                  Last seen: {new Date(switch_.lastSeen).toLocaleTimeString()}
                </span>
              </div>

              {/* Switch Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-slate-700">Model</p>
                  <p className="text-slate-600">{switch_.model}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Version</p>
                  <p className="text-slate-600">{switch_.version}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Uptime</p>
                  <p className="text-slate-600">{switch_.uptime}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Interfaces</p>
                  <p className="text-slate-600">{switch_.interfaces.up}/{switch_.interfaces.total}</p>
                </div>
              </div>

              {/* Interface Status Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Interface Status</span>
                  <span>{Math.round((switch_.interfaces.up / switch_.interfaces.total) * 100)}% up</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(switch_.interfaces.up / switch_.interfaces.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Activity className="h-4 w-4 mr-1" />
                  Monitor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSwitches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No switches found</h3>
            <p className="text-gray-500">
              {searchTerm ? "No switches match your search criteria." : "Get started by adding your first Arista switch."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
