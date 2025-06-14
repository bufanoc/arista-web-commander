
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Wifi, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
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

interface SwitchDiscoveryProps {
  onSwitchAdded: (switch_: Switch) => void;
}

export const SwitchDiscovery = ({ onSwitchAdded }: SwitchDiscoveryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState<"manual" | "auto">("manual");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [formData, setFormData] = useState({
    ip: "",
    username: "admin",
    password: "",
    name: ""
  });
  const [discoveredSwitches, setDiscoveredSwitches] = useState<Switch[]>([]);
  const { toast } = useToast();

  const handleManualAdd = async () => {
    if (!formData.ip || !formData.username || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsDiscovering(true);
    
    // Simulate API call to connect to switch
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSwitch: Switch = {
        id: Date.now().toString(),
        name: formData.name || `Switch-${formData.ip}`,
        ip: formData.ip,
        model: "DCS-7050SX3-48YC8", // This would come from the API
        version: "4.28.3M",
        status: "online",
        uptime: "0d 0h 1m",
        interfaces: { total: 48, up: 46, down: 2 },
        lastSeen: new Date().toISOString()
      };

      onSwitchAdded(newSwitch);
      setIsOpen(false);
      setFormData({ ip: "", username: "admin", password: "", name: "" });
      
      toast({
        title: "Success",
        description: `Switch ${newSwitch.name} added successfully`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to the switch. Please check credentials and network connectivity.",
        variant: "destructive"
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAutoDiscovery = async () => {
    setIsDiscovering(true);
    setDiscoveredSwitches([]);
    
    // Simulate network discovery
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockDiscovered: Switch[] = [
        {
          id: "discovered1",
          name: "Unknown-192.168.1.50",
          ip: "192.168.1.50",
          model: "DCS-7280SR-48C6",
          version: "4.27.5M",
          status: "discovered",
          uptime: "unknown",
          interfaces: { total: 0, up: 0, down: 0 },
          lastSeen: new Date().toISOString()
        },
        {
          id: "discovered2", 
          name: "Unknown-192.168.1.60",
          ip: "192.168.1.60",
          model: "DCS-7320X-32C",
          version: "4.28.1M",
          status: "discovered",
          uptime: "unknown",
          interfaces: { total: 0, up: 0, down: 0 },
          lastSeen: new Date().toISOString()
        }
      ];
      
      setDiscoveredSwitches(mockDiscovered);
      
      toast({
        title: "Discovery Complete",
        description: `Found ${mockDiscovered.length} Arista switches on the network`
      });
    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Network discovery encountered an error",
        variant: "destructive"
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAddDiscovered = (discoveredSwitch: Switch) => {
    const newSwitch = {
      ...discoveredSwitch,
      status: "online",
      interfaces: { total: 48, up: 45, down: 3 } // Would be populated from API
    };
    onSwitchAdded(newSwitch);
    setDiscoveredSwitches(prev => prev.filter(s => s.id !== discoveredSwitch.id));
    
    toast({
      title: "Switch Added",
      description: `${discoveredSwitch.name} has been added to your network`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Switch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-500" />
            Discover Arista Switches
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Discovery Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={discoveryMode === "manual" ? "default" : "outline"}
              onClick={() => setDiscoveryMode("manual")}
              className="flex-1"
            >
              Manual Setup
            </Button>
            <Button
              variant={discoveryMode === "auto" ? "default" : "outline"}
              onClick={() => setDiscoveryMode("auto")}
              className="flex-1"
            >
              Auto Discovery
            </Button>
          </div>

          {/* Manual Discovery */}
          {discoveryMode === "manual" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual Switch Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ip">Switch IP Address *</Label>
                    <Input
                      id="ip"
                      placeholder="192.168.1.10"
                      value={formData.ip}
                      onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Switch Name</Label>
                    <Input
                      id="name"
                      placeholder="Core-Switch-01"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleManualAdd} 
                  disabled={isDiscovering}
                  className="w-full"
                >
                  {isDiscovering ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Add Switch
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Auto Discovery */}
          {discoveryMode === "auto" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Auto Discovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Scan your network for Arista switches with eAPI enabled. This will search common IP ranges and ports.
                </p>
                
                <Button 
                  onClick={handleAutoDiscovery} 
                  disabled={isDiscovering}
                  className="w-full"
                >
                  {isDiscovering ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning Network...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Discovery
                    </>
                  )}
                </Button>

                {/* Discovered Switches */}
                {discoveredSwitches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-800">Discovered Switches:</h4>
                    {discoveredSwitches.map((switch_) => (
                      <div key={switch_.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{switch_.ip}</h5>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {switch_.model}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">Version: {switch_.version}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleAddDiscovered(switch_)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
