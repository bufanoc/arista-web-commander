
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Cable, 
  Shield, 
  Router, 
  Layers, 
  Globe,
  Settings,
  Plus,
  Trash2,
  Save
} from "lucide-react";
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

interface ConfigurationPanelProps {
  switches: Switch[];
}

export const ConfigurationPanel = ({ switches }: ConfigurationPanelProps) => {
  const [selectedSwitch, setSelectedSwitch] = useState<string>("");
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  // VLAN Configuration State
  const [vlans, setVlans] = useState([
    { id: 10, name: "Management", description: "Management VLAN" },
    { id: 20, name: "Production", description: "Production servers" },
    { id: 30, name: "Guest", description: "Guest access" }
  ]);

  // Interface Configuration State
  const [interfaceConfig, setInterfaceConfig] = useState({
    interface: "",
    description: "",
    vlan: "",
    mode: "access", // access, trunk
    state: "up"
  });

  // VXLAN Configuration State
  const [vxlanConfig, setVxlanConfig] = useState({
    vni: "",
    vlan: "",
    multicastGroup: "",
    sourceInterface: "Loopback1"
  });

  const handleApplyConfig = async (configType: string) => {
    if (!selectedSwitch) {
      toast({
        title: "No Switch Selected",
        description: "Please select a switch to apply configuration",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    
    // Simulate API call to apply configuration
    setTimeout(() => {
      setIsApplying(false);
      toast({
        title: "Configuration Applied",
        description: `${configType} configuration has been applied successfully`
      });
    }, 2000);
  };

  const addVlan = () => {
    const newId = Math.max(...vlans.map(v => v.id)) + 1;
    setVlans([...vlans, { id: newId, name: "", description: "" }]);
  };

  const removeVlan = (id: number) => {
    setVlans(vlans.filter(v => v.id !== id));
  };

  const updateVlan = (id: number, field: string, value: string) => {
    setVlans(vlans.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  return (
    <div className="space-y-6">
      {/* Switch Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Configuration Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Label htmlFor="switch-select" className="whitespace-nowrap">Target Switch:</Label>
            <Select value={selectedSwitch} onValueChange={setSelectedSwitch}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a switch to configure" />
              </SelectTrigger>
              <SelectContent>
                {switches.map((switch_) => (
                  <SelectItem key={switch_.id} value={switch_.id}>
                    {switch_.name} ({switch_.ip})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSwitch && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs defaultValue="interfaces" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="interfaces" className="flex items-center gap-1">
            <Cable className="h-4 w-4" />
            Interfaces
          </TabsTrigger>
          <TabsTrigger value="vlans" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            VLANs
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-1">
            <Router className="h-4 w-4" />
            Routing
          </TabsTrigger>
          <TabsTrigger value="vxlan" className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            VXLAN
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Interface Configuration */}
        <TabsContent value="interfaces">
          <Card>
            <CardHeader>
              <CardTitle>Interface Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="interface">Interface</Label>
                    <Select value={interfaceConfig.interface} onValueChange={(value) => 
                      setInterfaceConfig({...interfaceConfig, interface: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interface" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ethernet1">Ethernet1</SelectItem>
                        <SelectItem value="Ethernet2">Ethernet2</SelectItem>
                        <SelectItem value="Ethernet3">Ethernet3</SelectItem>
                        <SelectItem value="Ethernet48">Ethernet48</SelectItem>
                        <SelectItem value="Management1">Management1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Interface description"
                      value={interfaceConfig.description}
                      onChange={(e) => setInterfaceConfig({...interfaceConfig, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mode">Port Mode</Label>
                    <Select value={interfaceConfig.mode} onValueChange={(value) => 
                      setInterfaceConfig({...interfaceConfig, mode: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="access">Access</SelectItem>
                        <SelectItem value="trunk">Trunk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vlan">VLAN</Label>
                    <Select value={interfaceConfig.vlan} onValueChange={(value) => 
                      setInterfaceConfig({...interfaceConfig, vlan: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VLAN" />
                      </SelectTrigger>
                      <SelectContent>
                        {vlans.map((vlan) => (
                          <SelectItem key={vlan.id} value={vlan.id.toString()}>
                            VLAN {vlan.id} - {vlan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Interface Status</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={interfaceConfig.state === "up" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInterfaceConfig({...interfaceConfig, state: "up"})}
                      >
                        Up
                      </Button>
                      <Button
                        variant={interfaceConfig.state === "down" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInterfaceConfig({...interfaceConfig, state: "down"})}
                      >
                        Down
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-2">Generated Configuration:</h4>
                    <pre className="text-sm text-slate-600 overflow-x-auto">
{`interface ${interfaceConfig.interface}
   description ${interfaceConfig.description || 'Configured via EOS Manager'}
   switchport mode ${interfaceConfig.mode}
   ${interfaceConfig.mode === 'access' && interfaceConfig.vlan ? `switchport access vlan ${interfaceConfig.vlan}` : ''}
   ${interfaceConfig.state === 'up' ? 'no shutdown' : 'shutdown'}`}
                    </pre>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleApplyConfig("Interface")} 
                disabled={isApplying || !selectedSwitch}
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply Interface Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VLAN Configuration */}
        <TabsContent value="vlans">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>VLAN Configuration</CardTitle>
                <Button onClick={addVlan} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add VLAN
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {vlans.map((vlan) => (
                <div key={vlan.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-20">
                    <Label>VLAN ID</Label>
                    <Input
                      type="number"
                      value={vlan.id}
                      onChange={(e) => updateVlan(vlan.id, 'id', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Name</Label>
                    <Input
                      value={vlan.name}
                      onChange={(e) => updateVlan(vlan.id, 'name', e.target.value)}
                      placeholder="VLAN name"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Description</Label>
                    <Input
                      value={vlan.description}
                      onChange={(e) => updateVlan(vlan.id, 'description', e.target.value)}
                      placeholder="VLAN description"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVlan(vlan.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button 
                onClick={() => handleApplyConfig("VLAN")} 
                disabled={isApplying || !selectedSwitch}
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply VLAN Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routing Configuration */}
        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <CardTitle>Routing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Static Routes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Destination Network</Label>
                      <Input placeholder="0.0.0.0/0" />
                    </div>
                    <div>
                      <Label>Next Hop</Label>
                      <Input placeholder="192.168.1.1" />
                    </div>
                    <div>
                      <Label>Administrative Distance</Label>
                      <Input type="number" placeholder="1" />
                    </div>
                    <Button size="sm">Add Route</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">BGP Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>AS Number</Label>
                      <Input type="number" placeholder="65001" />
                    </div>
                    <div>
                      <Label>Router ID</Label>
                      <Input placeholder="1.1.1.1" />
                    </div>
                    <div>
                      <Label>Neighbor IP</Label>
                      <Input placeholder="192.168.1.2" />
                    </div>
                    <div>
                      <Label>Remote AS</Label>
                      <Input type="number" placeholder="65002" />
                    </div>
                    <Button size="sm">Configure BGP</Button>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={() => handleApplyConfig("Routing")} 
                disabled={isApplying || !selectedSwitch}
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply Routing Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VXLAN Configuration */}
        <TabsContent value="vxlan">
          <Card>
            <CardHeader>
              <CardTitle>VXLAN Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vni">VNI (VXLAN Network Identifier)</Label>
                    <Input
                      id="vni"
                      type="number"
                      placeholder="10010"
                      value={vxlanConfig.vni}
                      onChange={(e) => setVxlanConfig({...vxlanConfig, vni: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vxlan-vlan">Associated VLAN</Label>
                    <Select value={vxlanConfig.vlan} onValueChange={(value) => 
                      setVxlanConfig({...vxlanConfig, vlan: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VLAN" />
                      </SelectTrigger>
                      <SelectContent>
                        {vlans.map((vlan) => (
                          <SelectItem key={vlan.id} value={vlan.id.toString()}>
                            VLAN {vlan.id} - {vlan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="multicast">Multicast Group</Label>
                    <Input
                      id="multicast"
                      placeholder="239.1.1.1"
                      value={vxlanConfig.multicastGroup}
                      onChange={(e) => setVxlanConfig({...vxlanConfig, multicastGroup: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="source-interface">Source Interface</Label>
                    <Select value={vxlanConfig.sourceInterface} onValueChange={(value) => 
                      setVxlanConfig({...vxlanConfig, sourceInterface: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Loopback0">Loopback0</SelectItem>
                        <SelectItem value="Loopback1">Loopback1</SelectItem>
                        <SelectItem value="Vlan1">Vlan1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-2">Generated VXLAN Configuration:</h4>
                    <pre className="text-sm text-slate-600 overflow-x-auto whitespace-pre-wrap">
{`interface Vxlan1
   vxlan source-interface ${vxlanConfig.sourceInterface}
   ${vxlanConfig.vni && vxlanConfig.vlan ? `vxlan vlan ${vxlanConfig.vlan} vni ${vxlanConfig.vni}` : ''}
   ${vxlanConfig.multicastGroup ? `vxlan multicast-group ${vxlanConfig.multicastGroup}` : ''}

vlan ${vxlanConfig.vlan || 'X'}
   name VXLAN_${vxlanConfig.vni || 'X'}`}
                    </pre>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-800">VXLAN Overview:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• VXLAN enables Layer 2 overlay networks over Layer 3 infrastructure</li>
                      <li>• VNI identifies individual VXLAN segments</li>
                      <li>• Multicast groups handle BUM traffic flooding</li>
                      <li>• Source interface provides VTEP identity</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleApplyConfig("VXLAN")} 
                disabled={isApplying || !selectedSwitch}
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply VXLAN Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Configuration */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Access Control Lists</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>ACL Name</Label>
                      <Input placeholder="MANAGEMENT_ACL" />
                    </div>
                    <div>
                      <Label>Rule Action</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permit">Permit</SelectItem>
                          <SelectItem value="deny">Deny</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Source Network</Label>
                      <Input placeholder="192.168.1.0/24" />
                    </div>
                    <div>
                      <Label>Destination</Label>
                      <Input placeholder="any" />
                    </div>
                    <Button size="sm">Add ACL Rule</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>RADIUS Server</Label>
                      <Input placeholder="192.168.1.100" />
                    </div>
                    <div>
                      <Label>Shared Secret</Label>
                      <Input type="password" placeholder="radius-secret" />
                    </div>
                    <div>
                      <Label>Authentication Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="radius">RADIUS</SelectItem>
                          <SelectItem value="tacacs">TACACS+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm">Configure Auth</Button>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={() => handleApplyConfig("Security")} 
                disabled={isApplying || !selectedSwitch}
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply Security Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Hostname</Label>
                      <Input placeholder="arista-switch-01" />
                    </div>
                    <div>
                      <Label>Domain Name</Label>
                      <Input placeholder="company.local" />
                    </div>
                    <div>
                      <Label>DNS Server</Label>
                      <Input placeholder="8.8.8.8" />
                    </div>
                    <div>
                      <Label>NTP Server</Label>
                      <Input placeholder="pool.ntp.org" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SNMP Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Community String</Label>
                      <Input placeholder="public" />
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <Input placeholder="admin@company.com" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input placeholder="Data Center 1" />
                    </div>
                    <div>
                      <Label>SNMP Server</Label>
                      <Input placeholder="192.168.1.200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={() => handleApplyConfig("System")} 
                disabled={isApplying || !selectedSwitch}
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply System Configuration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
